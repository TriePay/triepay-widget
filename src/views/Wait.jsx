import React from "react";
import Loading from "./Loading";
import {byteLength, getByteIndex, getLastByteIndex, getStatus, sleep} from "../helpers/Utils";

export default class Wait extends React.Component {
    loadStatus = false;

    startLoad = async () => {
        const tokenInfo = this.props.params?.tokenInfo;
        const tx = this.props.params?.tx;
        const orderId = this.props.params?.orderId;
        const quantity = this.props.params?.quantity;
        const navigate = this.props.params?.navigate;
        const onComplete = this.props.params?.onComplete;
        if (!tokenInfo?.receiver || !orderId) {
            return;
        }
        do {
            console.log('Wait start getStatus');
            await sleep(3000);
            const result = await getStatus(tokenInfo.receiver, orderId);
            console.log('Wait getStatus', result);
            if (result != -1) {
                this.loadStatus = false;
                if (result == 1) {
                    onComplete?.({ order_id: orderId, receiver: tokenInfo.receiver, tx_hash: tx.id, chain_id: tokenInfo.chainId, quantity, blockchain: tokenInfo.blockchain });
                    // navigate?.('Complete', { orderId, transactionId: tx.id, blockChain: tokenInfo.blockchain, amount, symbol: tokenInfo.symbol });
                } else {
                    navigate?.('Failed', { transactionId: tx.id });
                }
                break;
            }
            await sleep(10000);
        } while (this.loadStatus);
    }

    constructor(props) {
        super(props);
        this.loadStatus = true;
        this.startLoad();
    }

    componentWillUnmount() {
        this.loadStatus = false;
    }

    render() {
        const tokenInfo = this.props.params?.tokenInfo;
        const orderId = this.props.params?.orderId;
        const amount = this.props.params?.amount;
        const title = this.props.params?.title;
        const tx = this.props.params?.tx;

        let renderOrderId = orderId;
        if (byteLength(orderId) > 16) {
            renderOrderId = orderId.substring(0, getByteIndex(orderId, 10)) + '...' + orderId.substring(getLastByteIndex(orderId, 3), orderId.length);
        }

        let renderTx = tx;
        if (byteLength(tx?.id) > 13) {
            renderTx = tx.id.substring(0, 6) + '...' + tx.id.substring(tx.id.length - 4, tx.id.length);
        }

        let renderSymbol = tokenInfo?.symbol;
        if (byteLength(renderSymbol) > 13) {
            renderSymbol = renderSymbol.substring(0, getByteIndex(renderSymbol, 10)) + '...' + renderSymbol.substring(getLastByteIndex(renderSymbol, 3), renderSymbol.length);
        }

        return <div className={'Complete'}>
            <div className={!!title ? 'BaseTopPadding MarginTop30' : 'BaseTopPadding MarginTop20'}/>
            <div className={'CompleteTitle FontBold'} >
                Processing
            </div>
            <div className={!!title ? 'BaseTopPadding MarginTop30' : 'BaseTopPadding MarginTop20'}/>
            <div className={'NormalCar'}>
                <div className={'WaitShadowCarBox'}>
                    <div className={'SpaceBetweenItem'}>
                        <div className={'ItemName'}>Order ID</div>
                        <div className={'Flex1'}/>
                        <div className={'ItemValue'}>{renderOrderId}</div>
                    </div>
                    <div className={'ItemDivider'}/>
                    <div className={'SpaceBetweenItem'}>
                        <div className={'ItemName'}>Transaction ID</div>
                        <div className={'Flex1'}/>
                        <div className={'ItemValue'}>{renderTx}</div>
                    </div>
                    <div className={'ItemDivider'}/>
                    <div className={'SpaceBetweenItem'}>
                        <div className={'ItemName'}>Blockchain</div>
                        <div className={'Flex1'}/>
                        <div className={'ItemValue'}>{tokenInfo?.blockchain}</div>
                    </div>
                    <div className={'ItemDivider'}/>
                    <div className={'SpaceBetweenItem'}>
                        <div className={'ItemName'}>Token Paid</div>
                        <div className={'Flex1'}/>
                        <div className={'ItemValue'}>{amount} {renderSymbol}</div>
                    </div>
                    <div className={'ItemDivider'} />
                    <div className={'MarginTop30'} />
                    <Loading />
                    <div className={'WaitConfirm FontBold'}>
                        {'Waiting for block confirmation. \nPlease do not close.'}
                    </div>
                </div>
            </div>
            <div className={!!title ? 'BottomPadding MarginTop75' : 'BottomPadding MarginTop37'}/>
        </div>
    }
}
