// import { manageMembers } from '@/services/groups'
// import GroupMemberSelector from '../member-selector/index.vue'
//
// export default {
//   name: 'group-detail',
//   data() {
//     return {
//       detail: {},
//       groupMembers: [],
//       asyncMembers: [],
//       loading: false
//     }
//   },
//   components: { GroupMemberSelector },
//   mounted() {
//     const groupId = this.$route.params.groupId
//     if (groupId) {
//       this.load(groupId)
//         .then((detail) => {
//           const originalMemberIds = []
//           this.groupMembers = detail.members.map((member) => {
//             originalMemberIds.push(member.memberId)
//             return member.memberName || member.memberId
//           })
//
//           this.originalMemberIds = originalMemberIds
//           this.detail = detail
//         })
//     } else {
//       this.$message.error('缺少参数groupId')
//     }
//   },
//   methods: {
//     load(param) {
//       return this.$services.groups.get(param || {})
//         .then(res => res.getData()).catch(this.$error.showErrorMessage)
//     },
//     getRemoveMembers() {
//       const removed = []
//       this.detail.members.forEach((member) => {
//         if (this.groupMembers.indexOf(member.memberName || member.memberId) === -1) {
//           removed.push(member.memberId)
//         }
//       })
//
//       return removed
//     },
//     getAddMembers() {
//       const addList = []
//       const names = this.detail.members.map(m => m.memberName)
//       const ids = this.detail.members.map(m => m.memberId)
//       this.groupMembers.forEach((member) => {
//         if (names.indexOf(member) === -1 && ids.indexOf(member) === -1) {
//           addList.push(member)
//         }
//       })
//
//       return addList
//     },
//     updateDetail() {
//       const self = this
//       const addMembers = this.getAddMembers()
//       const removeMembers = this.getRemoveMembers()
//
//
//       manageMembers(this.$route.params.groupId, {
//         addMembers,
//         removeMembers
//       }).then((res) => {
//         if (res.data.data) {
//           self.$message.success('分组修改成功')
//         } else {
//           self.$message.error(res.data.msg)
//         }
//       }).catch((err) => {
//         self.$message.error(err.response.errorMsg || err)
//       })
//     }
//   }
// }
