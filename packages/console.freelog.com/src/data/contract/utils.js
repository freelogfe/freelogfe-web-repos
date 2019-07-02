import {CONTRACT_STATUS_COLORS} from '@/config/contract'
import { Vue } from '@freelog/freelog-common-lib'
import {onloadUserInfo} from '../user/loader'
import {onloadNodeDetail} from '../node/loader'
import {onloadResourceDetail} from '../resource/loader'
import {createLoader} from "../../lib/utils";

var cachedLoaders = {}

function format(contract) {
  if (!contract) return null

  if (contract.contractClause && contract.contractClause.authorizedObjects) {
    contract.forUsers = contract.contractClause.authorizedObjects.map(user => ({
      users: user.users.join('、'),
      type: user.userType
    }))
  }

  contract.statusInfo = CONTRACT_STATUS_COLORS[contract.status]

  if (contract.partyOneUserId) {
    let loader = cachedLoaders[contract.partyOneUserId]

    if (!loader) {
      loader = createLoader((callback) => {
        onloadUserInfo(contract.partyOneUserId).then((userInfo) => {
          callback(userInfo)
        })
      })
      cachedLoaders[contract.partyOneUserId] = loader
    }
    loader((userInfo) => {
      Vue.set(contract, 'partyOneInfo', userInfo)
    })
  }

  //确保partyTwo是节点，partyTwo有可能是授权点ID
  if (contract.partyTwo && contract.partyTwo.length <= 10){
    let loader = cachedLoaders[contract.partyTwo]
    if (!loader) {
      loader = createLoader((callback) => {
        onloadNodeDetail(contract.partyTwo).then((nodeInfo) => {
          callback(nodeInfo)
        })
      });
      cachedLoaders[contract.partyTwo] = loader
    }

    loader((nodeInfo) => {
      Vue.set(contract, 'partyTwoInfo', nodeInfo)
    })
  }
  return contract
}


export default {
  format
}
