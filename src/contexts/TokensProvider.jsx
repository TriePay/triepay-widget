import TokensContext from "./TokensContext";
import React, {useContext, useEffect, useState} from "react";
import WalletContext from "./WalletContext";
import ConfigContext from "./ConfigContext";
import {
    ADDRESS_NATIVE_CURRENCY,
    getChainIdByName,
    getPayContract,
    Host,
    isNativeCurrency,
    tlc,
    toLowerCaseEquals,
    toTokenMinimalUnit
} from "../helpers/Utils";

export default (props) => {
    const [supportTokens, setSupportTokens] = useState({});
    const [isLoadSupportTokens, setLoadSupportTokens] = useState(false);

    const [balances, setBalances] = useState([]);
    const [loadBalancesAccount, setBalancesAccount] = useState(undefined);

    const [isLoadData, setLoadData] = useState(false);

    const [selectToken, setSelectToken] = useState(undefined);

    const [allowances, setAllowances] = useState([]);

    const { walletState, account, contractHelper, chainId } = useContext(WalletContext);
    const { payments, quantity } = useContext(ConfigContext);

    const loadSupportTokens = async () => {
        await fetch(`${Host}/v1/get_tokens`).then(res => res.json()).then(res => {
            if (res.message === 'OK' && res.status === "1") {
                setSupportTokens(res.result);
                setLoadSupportTokens(true);
            }
        }).catch(e => {
            console.log('load support tokens fail', e);
        })
    }

    const loadTokenBalances = async (accountAddress) => {
        if (!accountAddress || !payments?.length) {
            return;
        }
        // console.log('TokensContext account:', account, accept);
        const paymentArray = [];
        for (const item of payments) {
            if (!item?.blockchain) {
                continue;
            }
            const chainId = getChainIdByName(item.blockchain);
            const token = supportTokens?.[chainId]?.[tlc(item.token)];
            if (token) {
                const unitPrice = toTokenMinimalUnit(item.unitPrice, token.decimals)
                paymentArray.push({ chainId: chainId, unitPrice, merchantTokenAddress: item.token });
            }
        }
        if (paymentArray.length <= 0) {
            return;
        }
        const body = { user: accountAddress, payments: paymentArray };
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        };
        await fetch(`${Host}/v1/get_balances`, options).then(res => res.json()).then(res => {
            // console.log('load balances:', res);
            if (res.message === 'OK' && res.status === "1" && res.result?.payments) {
                setBalancesAccount(body.user);
                setBalances(res.result.payments);
            }
        }).catch(e => {
            console.log('load balances fail', e);
        })
    }

    const getAllowance = async (chainId, accountAddress, tokenAddress, reload = false) => {
        const allowance = allowances.find(allowance => allowance.chainId === chainId && allowance.account === accountAddress && allowance.token === tokenAddress);
        if (!reload) {
            if (allowance) {
                return allowance.allowance;
            }
        }
        const payContract = getPayContract(chainId);

        const loadAllowance = await contractHelper.allowance(tokenAddress, accountAddress, payContract);

        if (allowance) {
            allowance.allowance = loadAllowance;
        } else {
            allowances.push({ chainId, account: accountAddress, token: tokenAddress, allowance: loadAllowance });
        }
        setAllowances([...allowances]);
        return loadAllowance;
    }

    const startLoadData = async () => {
        if (isLoadData) {
            return;
        }
        let needLoad = false;
        if (!isLoadSupportTokens) {
            needLoad = true;
            setLoadData(true);
            await loadSupportTokens();
        }
        if (walletState === 'connected') {
            if (!toLowerCaseEquals(loadBalancesAccount, account)) {
                needLoad = true;
                setLoadData(true);
                await loadTokenBalances(account);
            }
        }
        if (needLoad) {
            setLoadData(false);
        }
    }

    if (!isLoadSupportTokens || !loadBalancesAccount) {
        startLoadData();
    }

    useEffect(() => {
        startLoadData();
    }, [account])


    useEffect(() => {
        console.log('TokensProvider useEffect ', walletState, selectToken?.chainId, chainId, account, loadBalancesAccount);
        if (walletState === 'connected' && toLowerCaseEquals(account, loadBalancesAccount) && chainId) {
            if (selectToken?.chainId === chainId) {
                return;
            }
            const balance = balances.find(balance => balance.chainId == chainId);
            if (balance?.tokens) {
                const index = balance.tokens.findIndex(token => isNativeCurrency(token));
                if (index >= 0) {
                    if (balance.amounts[index] > 0 && balance.balances[index] > balance.amounts[index] * quantity) {
                        console.log('auto select token ', ADDRESS_NATIVE_CURRENCY, chainId);
                        setSelectToken({ chainId, address: ADDRESS_NATIVE_CURRENCY });
                        return;
                    }
                }
                for (let index = 0; index < balance.tokens.length; index ++) {
                    const token = balance.tokens[index];
                    if (balance.amounts[index] > 0 && balance.balances[index] > balance.amounts[index] * quantity) {
                        console.log('auto select token ', token, chainId);
                        setSelectToken({ chainId, address: token });
                        return;
                    }
                }
            }
        }
    },[walletState, account, chainId, balances])

    return(
        <TokensContext.Provider value={
            {
                supportTokens,
                isLoadSupportTokens,
                balances,
                loadBalancesAccount,
                selectToken,
                setSelectToken,
                getAllowance,
                isLoadData,
                startLoadData
            }
        }>
            { props.children }
        </TokensContext.Provider>
    )
}
