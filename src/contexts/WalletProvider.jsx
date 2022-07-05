import React, {useState, useEffect, useCallback} from 'react'
import WalletContext from './WalletContext'
import {ContractHelper} from "../helpers/ContractHelper";
import {getWallet} from "../helpers/wallets";

export default (props)=>{

  const [wallet, setWallet] = useState()
  const [account, setAccount] = useState()
  const [walletState, setWalletState] = useState()
  const [chainId, setChainId] = useState()
  const [contractHelper, setContractHelper] = useState()

  const onStateChanged = useCallback( (event, state) => {
    console.log('onStateChanged', event, state);
    if (event === 'disconnect') {
      setWalletState(undefined);
    } else if (event === 'connect') {
      setWalletState('connected');
    } else if (event === 'network') {
      if (state) {
        const curChainId = Number(state).toString(10);
        setChainId(curChainId);
      }
    } else if (event === 'account') {
      setAccount(state);
      if (!state) {
        setWalletState(undefined);
      }
    }
  }, [setChainId, setAccount, setWallet, walletState]);


  const callConnect = ({ account, wallet, chainId })=> {
    setAccount(account)
    setChainId(Number(chainId).toString(10))
    setWallet(wallet)
    wallet.onStateChanged(onStateChanged);
    setContractHelper(new ContractHelper(wallet));
    setWalletState('connected')
    if(props.connected) { props.connected(account) }
  }

  useEffect( ()=>{
    async function fetchWallet() {
      let accounts = await wallet.accounts()
      const chainId = await wallet.chainId()
      if(chainId && accounts instanceof Array && accounts.length > 0) {
        wallet.registerCallback?.();
          callConnect({ wallet, account: accounts[0], accounts, chainId })
      }
    }
    let wallet = getWallet()
    if(wallet) {
      fetchWallet()
    }
  }, [])

  return(
      <WalletContext.Provider value={{
        account,
        chainId,
        wallet,
        walletState,
        setWalletState,
        contractHelper,
        callConnect
      }}>
        { props.children }
      </WalletContext.Provider>
  )
}
