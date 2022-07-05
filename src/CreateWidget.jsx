import React from "react";
import PaymentStack from "./views/PaymentView";
import NavigateProvider from "./contexts/NavigateProvider";
import {getStyle} from "./helpers/StyleRenderer";
import ConfigProvider from "./contexts/ConfigProvider";
import WalletProvider from "./contexts/WalletProvider";
import TokensProvider from "./contexts/TokensProvider";
import {createContainer, ensureDocument} from "./helpers/DocumentUtils";
import * as ReactDOMClient from "react-dom/client";
import {getChainIdByName} from "./helpers/Utils";

const preflight = (props) => {
    props.orderId = props.order_id;
    if (typeof props.orderId === 'undefined') {
        throw('You need to set a orderId!');
    }
    if (typeof props.receiver === 'undefined') {
        throw('You need to set the receiver address that you want to receive the payment!');
    }
    if (!props.payments?.length) {
        throw('You need add a payment!');
    }
    props.payments.forEach(payment => {
        if (typeof payment.blockchain === 'undefined') {
            throw('You need to set the blockchain your want to receive the payment on!');
        }
        if (!getChainIdByName(payment.blockchain)) {
            throw('You need to set a supported blockchain!')
        }
        payment.unitPrice = payment.unit_price;
        if (typeof payment.unitPrice === 'undefined') {
            throw('You need to set the unitPrice!');
        }
        if (typeof payment.token === 'undefined') {
            throw('You need to set the token!');
        }
    });
}

const CreateWidget = (props) => {
    preflight(props);
    const document = ensureDocument(props.document)
    const element = props.container || document.body;
    const style = getStyle(props.style);

    const container = createContainer(element, document, style);

    const connectAccount = (account) => {
        console.log('account = ', account);
    }

    const content = (
        <ConfigProvider config={props}>
            <WalletProvider connected={connectAccount} >
                <NavigateProvider initView={'Main'}>
                    <TokensProvider>
                        <PaymentStack />
                    </TokensProvider>
                </NavigateProvider>
            </WalletProvider>
        </ConfigProvider>
    );
    const root = ReactDOMClient.createRoot(container);
    root.render(content);

    const unmount = () => {
        root.unmount();
    };

    return unmount;
}

export default CreateWidget;
