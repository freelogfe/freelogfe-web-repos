import { USER_GROUP_TYPE, NODE_GROUP_TYPE } from '../../../config/group'

export default {
  name: 'group-member-selector',
  data() {
    return {
      groupMembers: [],
      asyncMembers: [],
      loading: false
    }
  },
  props: {
    value: {
      type: Array
    },
    groupType: {
      type: [Number, String]
    }
  },
  watch: {
    groupType() {
      this.groupMembers = []
    },
    value() {
      this.groupMembers = this.value
    }
  },
  mounted() {
  },
  methods: {
    queryUserInfo(query) {
      return this.$services.user.get(query).then((res) => {
        const userInfo = res.data.data
        if (userInfo) {
          this.asyncMembers = [{ label: userInfo.nickname || userInfo.userName, value: userInfo.userId }]
        }
        return userInfo
      })
    },
    queryNodeInfo(query) {
      return this.$services.nodes.get(query).then((res) => {
        const nodeInfo = res.getData()

        if (nodeInfo) {
          this.asyncMembers = [{ label: nodeInfo.nodeName, value: nodeInfo.nodeId }]
        }

        return nodeInfo
      })
    },
    queryMemberInfo(query) {
      const groupType = this.groupType
      if (groupType === NODE_GROUP_TYPE) {
        return this.queryNodeInfo(query)
      } else if (groupType === USER_GROUP_TYPE) {
        return this.queryUserInfo(query)
      }
      return this.queryUserInfo(query).then((ret) => {
        if (!ret) {
          return this.queryNodeInfo(query)
        }
        return Promise.resolve()
      })
    },
    asyncSearchMembers(query) {
      this.asyncMembers = []
      if (query.length >= 5) {
        this.loading = true
        this.queryMemberInfo(query)
          .then(() => {
            this.loading = false
          })
          .catch((err) => {
            this.$error.showErrorMessage(err)
            this.loading = false
          })
      }
    },
    changeHandler() {
      this.$emit('input', this.groupMembers)
    }
  }
}
