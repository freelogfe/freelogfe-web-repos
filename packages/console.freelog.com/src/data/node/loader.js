import { NodesService } from '@/services'
import { promisifyLoader } from '@/lib/utils'
import { loadLoginUserInfo } from '../user/loader'

const userInfo = loadLoginUserInfo()

function loadDetail(nodeId) {
  return NodesService.get(nodeId).then(res => res.getData())
}

// const onloadNodeDetail = createCacheLoaders(loadDetail)
const onloadNodeDetail = loadDetail

const onloadNodeList = promisifyLoader((callback) => {
  if (!userInfo.userId) {
    callback({})
  } else {
    const params = {
      ownerUserId: userInfo.userId,
      pageSize: 1e2
    }
    NodesService.get({
      params
    }).then((res) => {
      callback(res.getData())
    })
  }
})


export {
  loadDetail,
  onloadNodeDetail,
  onloadNodeList
}

export default {
  loadDetail,
  onloadNodeDetail,
  onloadNodeList
}
