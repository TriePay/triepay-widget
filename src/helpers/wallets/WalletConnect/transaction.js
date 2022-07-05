import { Transaction } from '../Transaction'
import {addHexPrefix, ethCall, toHex} from "../../Utils";
import BigNumber from "bignumber.js";

const sendTransaction = async ({ transaction, wallet })=> {
  transaction = new Transaction(transaction)
  await transaction.prepare({ wallet })
  if((await wallet.connectedTo(transaction.blockchain)) == false) {
    throw({ code: 'WRONG_NETWORK' })
  }
  await executeSubmit({ transaction, wallet }).then(async (tx)=>{
    if (tx) {
      transaction.id = tx
      if (transaction.sent) transaction.sent(transaction)
    } else {
      throw('Submitting transaction failed!')
    }
  })
  return transaction
}

const getTransaction = (chainId, tx) => {
  return ethCall(chainId, 'getTransactionReceipt', undefined, [tx])
      .then((result) => result)
      .catch(e => undefined);
}

const retrieveTransaction = async (chainId, tx)=>{
  let sentTransaction
  const maxRetries = 120
  let attempt = 1
  sentTransaction = await getTransaction(chainId, tx)
  while (attempt <= maxRetries && !sentTransaction) {
    sentTransaction = await getTransaction(chainId, tx)
    await (new Promise((resolve)=>setTimeout(resolve, 10000)))
    attempt++;
  }
  return sentTransaction
}

const estimate = async (chainId, transaction) => {
  const transactionConfig = {
    from: transaction.from,
    to: transaction.to,
    value: transaction.value ? transaction.value : '0x0',
    data: transaction.data,
    chainId: toHex(chainId)
  }
  return ethCall(chainId, 'estimateGas', undefined, [transactionConfig])
      .then((result) => {
        const hexStr = new BigNumber(result,10).multipliedBy(1.5).dp(0).toString(16);
        console.log('wallet estimate hexStr:', hexStr, result);
        return addHexPrefix(hexStr);
      })
      .catch(e => undefined);
}

const executeSubmit = async ({ transaction, wallet }) => {
  const sendTx = {
    from: transaction.from,
    to: transaction.to,
    value: transaction.value?.toString(),
    chainId: toHex(transaction.chainId)
  };
  if(transaction.method) {
    sendTx.data = await transaction.getData();
  }

  sendTx.gas = await estimate(transaction.chainId, sendTx)
  console.log('executeSubmit', sendTx);
  return wallet.connector.sendTransaction(sendTx);
}

export {
  sendTransaction
}
