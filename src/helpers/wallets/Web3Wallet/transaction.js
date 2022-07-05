import { Transaction } from '../Transaction';
import BigNumber from "bignumber.js";
import {addHexPrefix, toHex} from "../../Utils";

const sendTransaction = async ({ transaction, wallet })=> {
  transaction = new Transaction(transaction)
  if((await wallet.connectedTo(transaction.blockchain)) == false) {
    await wallet.switchTo(transaction.blockchain)
  }
  await transaction.prepare({ wallet })
  await executeSubmit(transaction).then(async (tx)=>{
    if (tx) {
      transaction.id = tx
      if (transaction.sent) transaction.sent(transaction)
    } else {
      throw('Submitting transaction failed!')
    }
  })
  return transaction
}

const retrieveTransaction = async (tx)=>{
  let sentTransaction
  const maxRetries = 120
  let attempt = 1
  sentTransaction = await getTransaction(tx)
  while (attempt <= maxRetries && !sentTransaction) {
    sentTransaction = await getTransaction(tx)
    await (new Promise((resolve)=>setTimeout(resolve, 10000)))
    attempt++;
  }
  return sentTransaction
}

const getTransaction = (tx) => {
  return window.ethereum.request({
    method: 'eth_getTransactionReceipt',
    params: [tx]
  }).then(result => result).catch(e => undefined);
}

const estimate = async (chainId, transaction) => {
  const transactionConfig = {
    from: transaction.from,
    to: transaction.to,
    value: transaction.value ? transaction.value : '0x0',
    data: transaction.data,
    chainId: toHex(chainId)
  }
  const result = await window.ethereum.request({
    method: 'eth_estimateGas',
    params: [transactionConfig]
  });
  const hexStr = new BigNumber(result,16).multipliedBy(1.5).dp(0).toString(16);
  console.log('web3 estimate hexStr:', hexStr, result);
  return addHexPrefix(hexStr);
}

const executeSubmit = async (transaction) => {
  const sendTx = {
    from: transaction.from,
    to: transaction.to,
    value: transaction.value?.toString(),
    chainId: toHex(transaction.chainId)
  };

  if (transaction.method) {
    sendTx.data = await transaction.getData()
  }
  sendTx.gas = await estimate(transaction.chainId, sendTx);

  console.log('executeSubmit', sendTx);
  return window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [sendTx]
  });
}

export {
  sendTransaction
}
