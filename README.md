# [TriePay](https://triepay.io) - Web3 Crypto Payment

- Many cryptocurrencys and blockchains are supported
- Easy integration(2 steps only)
- Merchant could config any acceptable cryptocurrency
- Customer could pay with any cryptocurrency held
- Open sourced [Contracts](https://github.com/TriePay/triepay-contracts#contract-addresses)
- Receive payment directly rather than to 'payment platform' first
- service fee is fixed to 0.5%, very very low

# Quick start

In order to receive cryptocurrency on any blockchain you need to have your own wallet(payment address) first:  
you could install [MetaMask](https://metamask.io/download/) and create one.

**2 steps ONLY** to integrate `TriePay` payment:
- import a simple configurable `triepay-widget` on your web/app
- track payment status with callback or polling via `triepay-api`

## `triepay-widget`

load the `triepay-widget` package via CDN:  

`<script src="https://unpkg.com/triepay-widget@1.0.4/dist/umd/index.bundle.js"></script>`

or install `triepay-widget` via the package manager to your app:  

`yarn add triepay-widget` and `import TriePay from 'triepay-widget'`

```
let destroy;
function onComplete(obj) {
  // payment success function callback
  // redirect webpage here
  console.log(obj.receiver, obj.order_id, obj.tx_hash, obj.chain_id, obj.quantity);
  destroy();
}
destroy = TriePay.CreateWidget({
  title: 'productA title',
  order_id: 'productA-1234543xxxx',
  callback: 'https://yourdomain.xxx/callback',
  receiver: '0xD33BD0b0d4AbC1C82d46595AA73BDb5e464F0c46',// change to your own payment address
  quantity: 1,
  payments: [
    {
      // 100 USDT on ethereum
      blockchain: 'ethereum',
      unit_price: 100,
      token: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    },
    {
      // 1 BNB on BSC
      blockchain: 'bsc',
      unit_price: 1,
      token: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    },
    {
      // 100 DAI on Polygon
      blockchain: 'polygon',
      unit_price: 100,
      token: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    },
    {
      // 100 USDC on Avalanche
      blockchain: 'avalanche',
      unit_price: 100,
      token: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
    },
    {
      // 100 FTM on fantom
      blockchain: 'fantom',
      unit_price: 100,
      token: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    },
  ],
  container: document.getElementById('payment'),
  onComplete
});
```

- `title`: product name or any desc on widget(**optional**)
- `order_id`: unique id on your own order-system, used to track payment status
- `callback`: will be called from TriePay Server when payment status changed(**optional**)
- `receiver`: the payment receive wallet address on all chains
- `quantity`: product quantity(**optional**)
- `container`: container element to contain this widget(**optional**)
- `onComplete`: function callback when payment complete, write payment success logic or redirect page here(**optional**)
- `payments`: accepted payments
  - `blockchain`: ethereum/bsc/polygon/avalanche/fantom
  - `unit_price`: amount for `token`
  - `token`: token address the token type you will receive. [SupportedTokens](https://api.triepay.io/v1/get_tokens) and `0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee` for eth on ethereum/bnb on bsc/matic on polygon/avax on avalanche/ftm on fantom.
- `destroy`: a function returned by `CreateWidget`, you should call `destroy()` when payment complete or no longer needed.

## triepay-api

### 1. track payment status
- URL: `https://api.triepay.io/v1/get_status/{receiver}/{order_id}`
- Method: GET
- Parameters:

  Parameter | Description
  ---|---
  receiver | the payment address `receiver` you configured on `TriePayWidget`
  order_id | the order id you configured on `TriePayWidget`
- Response:

  Parameter | Description
  ---|---
  status | "1": success, "0": fail
  message | "OK": success, "NOTOK": fail
  result | json object, details about this payment, string type desc when fail
  result.status   | 1: success, -1: payment pending, 0: fail
  result.receiver | receiver address
  result.order_id | order id
  result.chain_id | the blockchain id user paid on
  result.tx_hash  | transaction id
  result.quantity | quantity
  result.unit_price | unit price
  result.token | configured token on `TriePayWidget`
  result.receivable | received token amount after 0.5% fee
  
### 2. get supported tokens(used in our open sourced widget)
- URL: `https://api.triepay.io/v1/get_tokens`
- Method: GET
- Parameters: None

### 3. upload tx info(used in our open sourced widget)
- URL: `https://api.triepay.io/v1/upload_txinfo`
- Method: POST
- Parameters
