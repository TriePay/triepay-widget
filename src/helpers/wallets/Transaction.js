import { ethers } from 'ethers'

class Transaction {

  constructor({ blockchain, chainId, from, to, value, api, method, params, sent, confirmed, failed }) {

    // required
    this.blockchain = blockchain
    this.from = from
    this.to = to
    this.value = value

    // optional
    this.api = api
    this.method = method
    this.params = params
    this.sent = sent
    this.confirmed = confirmed
    this.failed = failed
    this.chainId = chainId

    // internal
    this._confirmed = false
    this._failed = false
  }

  async prepare({ wallet }) {
    this.from = await wallet.account()
  }

  getContractArguments() {
    let fragment = this.getContract().interface.fragments.find((fragment) => {
      return fragment.name == this.method
    })

    if(this.params instanceof Array) {
      return this.params
    } else if (this.params instanceof Object) {
      return fragment.inputs.map((input) => {
        return this.params[input.name]
      })
    } else {
      throw 'Contract params have wrong type!'
    }
  }

  getContract() {
    return new ethers.Contract(this.to, this.api)
  }

  async getData() {
    let populatedTransaction = await this.getContract().populateTransaction[this.method].apply(
      null, this.getContractArguments()
    )
    return populatedTransaction.data
  }

  confirmation() {
    if (this._confirmed) {
      return Promise.resolve(this)
    }
    return new Promise((resolve, reject) => {
      let originalConfirmed = this.confirmed
      this.confirmed = () => {
        if (originalConfirmed) originalConfirmed(this)
        resolve(this)
      }
    })
  }

  failure() {
    if (this._failed) {
      return Promise.resolve(this)
    }
    return new Promise((resolve, reject) => {
      let originalFailed = this.failed
      this.failed = () => {
        if (originalFailed) originalFailed(this)
        resolve(this)
      }
    })
  }
}

export {
  Transaction
}
