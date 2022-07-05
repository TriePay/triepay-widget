import MetaMask from './MetaMask'
import Web3Wallet from './Web3Wallet'
import { WalletConnect, getConnectedInstance as getConnectedWalletConnectInstance } from './WalletConnect'

const wallets = {
  MetaMask,
  Web3Wallet,
  WalletConnect
}

const instances = {}

const getWalletClass = function(){
  if(getConnectedWalletConnectInstance()) {
    return wallets.WalletConnect
  } else if (typeof window.ethereum === 'object' && window.ethereum.isMetaMask) {
    return wallets.MetaMask
  } else if (typeof window.ethereum !== 'undefined') {
    return wallets.Web3Wallet
  }
}

const getWallet = function () {
  const walletClass = getWalletClass()
  const existingInstance = instances[walletClass]

  if(getConnectedWalletConnectInstance()) {
    return getConnectedWalletConnectInstance()
  } else if(existingInstance) {
    return existingInstance
  } else if(walletClass) {
    instances[walletClass] = new walletClass()
    return instances[walletClass]
  }
}

const supported = [
  wallets.MetaMask,
  wallets.WalletConnect
]

export {
  getWallet,
  supported,
  wallets
}
