import abiERC20 from 'human-standard-token-abi';
import { BigNumber as BN } from 'bignumber.js';
import { ethers, Contract } from 'ethers'
import {ethCall} from "./Utils";

class ContractHelper {
    constructor(provider) {
        this.wallet = provider;
        this.provider = new ethers.providers.Web3Provider(provider, 'any');
    }

    async allowance(contractAddress, account, allowanceAddress) {
        if (this.wallet.isWalletConnet) {
            const chainId = Number(this.wallet.connectedChainId).toString(10);
            return ethCall(chainId,'allowance', contractAddress, [account, allowanceAddress])
                .then((result) => new BN(result.toString(), 10))
                .catch(e => new BN(0));
        } else {
            const contract = new Contract(contractAddress, abiERC20, this.provider);
            return contract.allowance(account, allowanceAddress)
                .then((result) => new BN(result.toString(), 10))
                .catch(e => new BN(0));
        }
    }

    async getTransactionByHash(chainId, txHash) {
        if (this.wallet.isWalletConnet) {
            return await ethCall(chainId, 'getTransaction', null, [txHash])
                .then((result) => result)
                .catch(e => undefined);
        } else {
            return await this.provider.getTransaction(txHash);
        }
    }

    async checkTx(chainId, txHash) {
        const txObj = await this.getTransactionByHash(chainId, txHash);
        console.log('checkTx txObj:', txObj);
        return !!txObj?.blockNumber;
    }

}

export {
    ContractHelper
};
