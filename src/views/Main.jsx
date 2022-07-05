import React, {useCallback, useContext, useEffect, useState} from "react";
import NavigateContext from "../contexts/NavigateContext";
import ConfigContext from "../contexts/ConfigContext";

import decreaseDisable from '../assets/ic_cut_none.png'
import decreaseEnable from '../assets/ic_cut.png'

import increaseDisable from '../assets/ic_add_none.png'
import increaseEnable from '../assets/ic_add.png'
import img_default from '../assets/img_default02.png';
import WalletContext from "../contexts/WalletContext";
import TokensContext from "../contexts/TokensContext";
import powered from "../assets/img_logo_font.png";
import imgBackground from "../assets/img_bg.js";
import {
    asciiToHex,
    getNativeCurrencyBalance,
    getPayContract,
    getSelectTokenInfo,
    isCancelError,
    isNativeCurrency,
    padRight,
    sleep,
    toFixed,
    toTokenMinimalUnit,
    uploadTxInfo
} from "../helpers/Utils";
import abiPay from '../helpers/ABI_TRIEPAY.json';
import abiERC20 from 'human-standard-token-abi';
import BigNumber from "bignumber.js";
import Loading from "./Loading";

export default (props) => {
    const { navigate } = useContext(NavigateContext);
    const { title, setQuantity, quantity, orderId, callback, payments, receiver, isConfigQuantity, onComplete } = useContext(ConfigContext);
    const { supportTokens, balances, selectToken, getAllowance, isLoadData } = useContext(TokensContext);
    const { walletState, account, wallet, chainId, contractHelper } = useContext(WalletContext);

    const [needApprove, setNeedApprove] = useState(true);
    const [onSend, setOnSend] = useState(false);

    const tokenInfo = getSelectTokenInfo(selectToken, balances, supportTokens, payments);
    if (tokenInfo) {
        tokenInfo.receiver = receiver;
    }
    let insufficientBalance = true;
    let amount = undefined;
    let amountWei = undefined;
    let unitAmount = undefined;
    let dollar = undefined;
    let bnAmount = undefined;
    if (tokenInfo) {
        if (tokenInfo?.useAmount) {
            unitAmount = toTokenMinimalUnit(tokenInfo.unitPrice, tokenInfo.acceptDecimals);
            amountWei = new BigNumber(tokenInfo.useAmount, 10).multipliedBy(quantity);
            bnAmount = amountWei.div(Math.pow(10, tokenInfo.decimals));
            if (bnAmount.lt(0.00000001)) {
                amount = '< 0.00000001';
            } else {
                amount = bnAmount.dp(8).toString();
            }
        } else if (tokenInfo?.unitPrice) {
            unitAmount = toTokenMinimalUnit(tokenInfo.unitPrice, tokenInfo.decimals);
            bnAmount = new BigNumber(tokenInfo.unitPrice, 10).multipliedBy(quantity);
            amountWei = toTokenMinimalUnit(bnAmount, tokenInfo.decimals);
            if (bnAmount.lt(0.00000001)) {
                amount = '< 0.00000001';
            } else {
                amount = bnAmount.dp(8).toString();
            }
        }
        dollar = tokenInfo.usd ? toFixed(bnAmount, tokenInfo.usd) : undefined;

        // console.log('insufficientBalance:', walletState, tokenInfo.balance, amountWei.toString());
        if (walletState === 'connected' && tokenInfo.balance && amountWei) {
            insufficientBalance = amountWei.gt(new BigNumber(tokenInfo.balance, 10));
        }
    }

    const startPay = async () => {
        if (tokenInfo.chainId !== chainId) {
            await changeBlockchain();
            return;
        }
        if (onSend) {
            return;
        }
        setOnSend(true);
        try {
            const tx = await todoPay();
            navigate('Wait', { orderId, quantity, amount, tokenInfo, tx, navigate, onComplete, title });
        } catch (e) {
            console.log('startPay', e);
            if (!isCancelError(e)) {
                alert('Send transaction failed, ' + JSON.stringify(e));
            }
        } finally {
            setOnSend(false);
        }
    }

    const todoPay = () => {
        return new Promise(async (resolve, reject) => {
            const payContract = getPayContract(tokenInfo.chainId);
            if (!payContract) {
                console.log('todoPay not find payContract in chainId ', tokenInfo.chainId);
                reject(new Error('No payment contracts available'));
                return;
            }
            const formatOrderId = padRight(asciiToHex(orderId), 64);
            let transaction;
            if (isNativeCurrency(tokenInfo.selectAddress)) {
                let ncAmountWei = amountWei;
                const nowAmount = await getNativeCurrencyBalance(account, tokenInfo.chainId, unitAmount, quantity, tokenInfo.token);
                console.log('todoPay nowAmount:', nowAmount, ' oldAmount:', amountWei.toString(10));
                if (nowAmount) {
                    ncAmountWei = new BigNumber(nowAmount, 10);
                }
                transaction = {
                    blockchain: tokenInfo.blockchain,
                    chainId: tokenInfo.chainId,
                    from: account,
                    to: payContract,
                    api: abiPay,
                    method: 'payWithEth',
                    value: '0x' + ncAmountWei.multipliedBy(1.02).dp(0, BigNumber.ROUND_HALF_EVEN).toString(16),
                    params: [[tokenInfo.receiver, formatOrderId, quantity, unitAmount, tokenInfo.token]]
                }
            } else {
                transaction = {
                    blockchain: tokenInfo.blockchain,
                    chainId: tokenInfo.chainId,
                    from: account,
                    to: payContract,
                    api: abiPay,
                    method: 'payWithToken',
                    params: [tokenInfo.selectAddress, [tokenInfo.receiver, formatOrderId, quantity, unitAmount, tokenInfo.token]]
                }
            }
            transaction.sent = async (tx) => {
                console.log('todoPay send tx:', tx);
                await uploadTxInfo(tokenInfo.chainId, tx.id, callback, tokenInfo.receiver, orderId, title);
                resolve(tx);
            }
            console.log('todoPay transaction:', transaction);
            wallet.sendTransaction(transaction).catch(e => reject(e));
        });
    }

    const switchBlockchain = async () => {
        await sleep(1000);
        return Promise.race([
            wallet.switchTo(tokenInfo.blockchain),
            new Promise(async (reject) => {
                await sleep(5000);
                reject(new Error('switch blockchain timeout'));
            })
        ]);
    }

    const closeSwitch = () => {
        if (needApprove && onSend) {
            setOnSend(false);
        }
    }

    const checkBlockchain = () => {
        console.log('checkBlockchain tokenChainId:', selectToken?.chainId, chainId);
        if (walletState === 'connected' && selectToken?.address && selectToken?.chainId !== chainId) {
            if (!onSend) {
                setOnSend(true);
            }
            switchBlockchain()
                .catch((e) => { console.log('auto switch blockchain e', e); })
                .finally(() => {
                    setOnSend(false);
                })
        }
    }

    const checkAllowance = async (force = false) => {
        if (walletState === 'connected' && selectToken?.address && selectToken?.chainId) {
            console.log('getAllowance tokenChainId:', selectToken.chainId, chainId);
            if (selectToken.chainId !== chainId) {
                if (isNativeCurrency(selectToken.address)) {
                    if (needApprove) {
                        setNeedApprove(false);
                    }
                } else {
                    if (!needApprove) {
                        setNeedApprove(true);
                    }
                }
                return;
            }
            if (isNativeCurrency(selectToken.address)) {
                if (needApprove) {
                    setNeedApprove(false);
                }
            } else {
                closeSwitch();
                const allowance = await getAllowance(selectToken.chainId, account, selectToken.address, force);
                const isAllowance = allowance ? allowance.lt(amountWei) : true;
                console.log('getAllowance:', allowance?.toString(10), amountWei.toString(10), isAllowance, needApprove);
                if (isAllowance !== needApprove) {
                    setNeedApprove(isAllowance);
                }
            }
        }
    }

    useEffect(() => {
        checkBlockchain();
        checkAllowance();
    }, [account, selectToken?.chainId, selectToken?.address]);

    useEffect(() => {
        checkAllowance();
    }, [chainId]);

    const todoSelectToken = () => {
        if (onSend) {
            return;
        }
        navigate('Tokens', { selectToken: {chainId: tokenInfo?.chainId, address: tokenInfo?.selectAddress }});
    };

    const onDecreaseQuantity = () => {
        if (onSend || quantity <= 1) {
            return;
        }
        setQuantity(quantity - 1)
    }

    const onIncreaseQuantity = () => {
        if (onSend) {
            return;
        }
        setQuantity(quantity + 1)
    }

    const changeBlockchain = async () => {
        if (onSend) {
            return;
        }
        setOnSend(true);
        try {
            if (tokenInfo.chainId !== chainId) {
                await switchBlockchain();
            }
        } catch (e) {
            alert('Network not supported, please switch manually to ' + tokenInfo.blockchain + '.');
        } finally {
            setOnSend(false);
        }
    }

    const startApprove = async () => {
        if (tokenInfo.chainId !== chainId) {
            await changeBlockchain();
            return;
        }
        if (onSend) {
            return;
        }
        setOnSend(true);

        let showError;
        try {
            await todoApprove();
            await sleep(2000);
            await checkAllowance(true);
        } catch (e) {
            console.log('startApprove', e);
            if (!isCancelError(e)) {
                showError = JSON.stringify(e);
            }
        } finally {
            setOnSend(false);
        }
        if (showError) {
            alert('Approve failed, ' + showError );
        }
    }

    const todoApprove = async () => {
        return new Promise((resolve, reject) => {
            const payContract = getPayContract(tokenInfo.chainId);
            if (!payContract) {
                console.log('todoApprove not find payContract in chainId ', tokenInfo.chainId);
                reject(new Error('No payment contracts available'));
            } else {
                const transaction = {
                    blockchain: tokenInfo.blockchain,
                    chainId: tokenInfo.chainId,
                    from: account,
                    to: tokenInfo.selectAddress,
                    api: abiERC20,
                    method: 'approve',
                    params: [payContract, '115792089237316195423570985008687907853269984665640564039457584007913129639935']
                }

                transaction.sent = async (tx) => {
                    console.log('todoApprove end tx:', tx);
                    while (true) {
                        await sleep(8000);
                        const result = await contractHelper.checkTx(tx.chainId, tx.id);
                        console.log('todoApprove checkTx result:', result);
                        if (result) {
                            break;
                        }
                    }
                    resolve(tx);
                }
                wallet.sendTransaction(transaction).catch(e => reject(e));
            }
        });

    }

    const buttonView = () => {
        if (isLoadData) {
            return (
                <div className={'ActionWrapper LoadingDiv'}>
                    <Loading />
                </div>
            );
        } else if (walletState !== 'connected') {
            return (
                <div className={'ActionWrapper'}>
                    <button className={'ButtonNormal FontBold'} onClick={() => {
                        navigate('Connect');
                    }}>
                        Connect Wallet
                    </button>
                    <button className={'ButtonNormal FontBold ButtonMarinTop'} disabled>
                        Pay
                    </button>
                </div>
            );
        } else if (insufficientBalance) {
            return (
                <div className={'ActionWrapper'}>
                    <div className={'Flex1'}/>
                    <div className={'InsufficientBalance'}>Insufficient balance, please</div>
                    <button className={'ButtonNormal FontBold ButtonMarinTop'} onClick={todoSelectToken}>
                        Select another token
                    </button>
                </div>
            );
        } else if (needApprove) {
            return (
                <div className={'ActionWrapper'}>
                    <button className={'ButtonNormal FontBold'} onClick={startApprove}>
                        {onSend ? <Loading width={34} height={34} /> : 'Approve ' + tokenInfo?.symbol + ' as Payment'}
                    </button>
                    <button className={'ButtonNormal FontBold ButtonMarinTop'} disabled>
                        Pay
                    </button>
                </div>
            );
        } else {
            return (
                <div className={'ActionWrapper'}>
                    <div className={'Flex1'}/>
                    <button className={'ButtonNormal FontBold ButtonMarinTop'} onClick={startPay}>
                        {onSend ? <Loading width={34} height={34} /> : 'Pay'}
                    </button>
                </div>
            );
        }
    }

    const openPoweredBy = () => {
        open('https://triepay.io/');
    }

    return (
        <div className={'Main'}>
            <img className={"ImgBackground"} src={imgBackground} />
            <div className={'MainContainer'}>
                <div className={'BaseTopPadding MarginTop30'}/>
                {!!title && <div className={"MainTitle FontBold"}>{title}</div>}
                {!!title && <div className={'BaseTopPadding MarginTop20'}/>}
                <div className={'ShadowCar'}>
                    <div className={'ShadowCarBox'}>
                        <div className={'FlexRow'}>
                            <img className={'TokenIcon'} src={tokenInfo?.image || img_default} />
                            <div className={'TokenText'}>
                                {tokenInfo?.symbol}
                            </div>
                            <div className={'Flex1'}/>
                            {walletState === 'connected' && <button className={'SelectToken'} onClick={todoSelectToken}>Select Token</button>}
                        </div>
                        <div className={'Amount FontSemiBold'}>{amount || ' '}</div>
                        <div className={'Money'}>{dollar ? '≈ $' + dollar : ' '}</div>
                        {isConfigQuantity &&
                        <div className={'FlexRow'}>
                            <div className={'InputCountWrapper'}>
                                <div className={'DecreaseWrapper'} onClick={onDecreaseQuantity}>
                                    <img className={"DecreaseImg"} src={!onSend && quantity > 1 ? decreaseEnable : decreaseDisable} />
                                </div>
                                <div className={'CountText FontSemiBold'}>
                                    {quantity}
                                </div>
                                <div className={'IncreaseWrapper'} onClick={onIncreaseQuantity}>
                                    <img className={"DecreaseImg"} src={onSend ? increaseDisable : increaseEnable} />
                                </div>
                            </div>
                        </div>
                        }
                    </div>
                </div>
                <div className={'PoweredByWrapper'}>
                    <div className={'PoweredBy'}>Powered by</div>
                    <img className={'PoweredByIcon'} src={powered} onClick={openPoweredBy}/>
                </div>
                {!isConfigQuantity && <div className={'fillInputCount'} />}
                <div className={'BottomPadding MarginTop27'}/>
                {buttonView()}
            </div>
        </div>
    )
}
