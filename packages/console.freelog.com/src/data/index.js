import ContractLoader from './contract/loader'
import NodeLoader from './node/loader'
import ResourceLoader from './resource/loader'
import UserLoader from './user/loader'
import PresentableLoader from './presentable/loader'

import contractUtil from './contract/utils'
import nodeUtil from './node/utils'
import resourceUtil from './resource/utils'
import userUtil from './user/utils'
import {MockService} from "../services";


export const dataUtil = {
  contract: contractUtil,
  node: nodeUtil,
  resource: resourceUtil,
  user: userUtil
}

export default {
  contract: ContractLoader,
  node: NodeLoader,
  resource: ResourceLoader,
  mock: MockLoader,
  user: UserLoader,
  presentable: PresentableLoader
}
