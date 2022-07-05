import ethereum from './ethereum'
import bsc from './bsc'
import polygon from './polygon'
import unknown from './unknown'
import fantom from "./fantom";
import avalanche from "./avalanche";

let all = [
  ethereum,
  bsc,
  polygon,
  fantom,
  avalanche,
  unknown
]

let Blockchain = {
  all,

  findById: function (id) {
    let fixedId = id
    if (fixedId.match('0x0')) {
      // remove leading 0
      fixedId = fixedId.replace(/0x0+/, '0x')
    }
    let found = all.find((blockchain) => {
      return blockchain.id == fixedId
    })
    if(found == undefined) {
      found = all.find((blockchain) => {
        return blockchain.id == 'unknown'
      })
    }
    return found
  },

  findByNetworkId: function (networkId) {
    networkId = networkId.toString()
    let found = all.find((blockchain) => {
      return blockchain.networkId == networkId
    })
    return found
  },

  findByName: function (name) {
    return all.find((blockchain) => {
      return blockchain.name == name
    })
  },
}

export { Blockchain }
