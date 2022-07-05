import React, { useState, useContext, useEffect } from 'react'
import { getWallet, wallets } from '../helpers/wallets'
import backIcon from '../assets/ic_btn_back.png';
import backIconPress from '../assets/ic_btn_back_press.png';
import backIconHover from '../assets/ic_btn_back_hover.png';
import metamaskImg from '../assets/img_metamask';
import walletconnectImg from '../assets/img_walletconnect';
import NavigateContext from '../contexts/NavigateContext';
import WalletContext from '../contexts/WalletContext';


export default (props)=>{
    const { navigate } = useContext(NavigateContext);
    const { callConnect } = useContext(WalletContext);
    const [ pending, setPending ] = useState();

    const connect = (wallet)=> {
        wallet.connect().then(async ()=>{
            let accounts = await wallet.accounts()
            const chainId = await wallet.chainId()
            if(accounts instanceof Array && accounts.length > 0) {
                callConnect({ wallet, account: accounts[0], accounts, chainId })
                navigate('Main')
            } else {
            }
        }).catch((error)=>{
            setPending(false)
            if(error?.code == 4001) {
                // User rejected the request.
                return
            } else if(error?.code == -32002) {
                // Request of type 'wallet_requestPermissions' already pending...
                setPending(true)
                return
            } else {
                if(props.reject) props.reject(error)
            }
        })
    }

    useEffect(() => {
        window?.localStorage?.removeItem('walletconnect');
    })

    const clickToConnect = (walletClass)=>{
        let wallet = new walletClass()
        connect(wallet);
    }

    return(
        <div className="Connect">
            <div className="Content">
                <div className="ConnectTopPadding"/>
                <div className="ConnectTitleWrap">
                    <img className="BackIcon" onClick={() => navigate('Main')}
                         style={{ '--back-normal-image': 'url(' + backIcon + ')', '--back-hover-image': 'url(' + backIconHover + ')', '--back-press-image': 'url(' + backIconPress + ')' }}/>
                    <span className="Title">Connect&nbsp;Wallet</span>
                </div>
                <div className="ConnectMiddlePadding"/>
                <div className="flex-col SelectImgWrap">
                    <div className="MetamaskImg"
                         style={{ '--metamask-normal-image': 'url(' + metamaskImg + ')' }}
                         onClick={() => {clickToConnect(wallets.MetaMask)}}>
                        <div className="CardHover" />
                    </div>

                    <div className="WalletconnectImg"
                         style={{ '--walletconnect-normal-image': 'url(' + walletconnectImg + ')' }}
                         onClick={() => {clickToConnect(wallets.WalletConnect)}}>
                        <div className="CardHover"  />
                    </div>
                </div>
                <div className="BottomPadding"/>
            </div>
        </div>
    )
}
