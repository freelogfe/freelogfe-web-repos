// import { GROUP_TYPES } from '../../../config/group'
// import GroupMemberSelector from '../member-selector/index.vue'
//
// const validateMembers = (rule, value, callback) => {
//   if (value && value.length) {
//     callback()
//   } else {
//     callback(new Error('分组成员至少含有一个成员'))
//   }
// }
//
// const formRules = {
//   groupName: [{ required: true, message: '分组描述不能为空', trigger: 'blur' },
//     {
//       min: 4, max: 20, message: '分组描述长度应为4-20字符', trigger: 'blur'
//     }],
//   members: [{ validator: validateMembers, trigger: 'manual' }],
//   groupType: [{ required: true, message: '分组类型不能为空', trigger: 'blur' }]
// }
//
// export default {
//   name: 'group-creator',
//   data() {
//     return {
//       formRules,
//       options: GROUP_TYPES,
//       detail: {
//         groupName: '',
//         members: [],
//         groupType: ''
//       }
//     }
//   },
//
//   components: { GroupMemberSelector },
//   mounted() {
//   },
//   methods: {
//     goBackHandler() {
//       window.history.back()
//     },
//     changeGroupType() {
//       this.detail.members = []
//     },
//     submitForm(formName) {
//       const self = this
//       self.$refs[formName].validate((valid) => {
//         if (valid) {
//           self.$services.groups.post(self.detail)
//             .then((res) => {
//               if (res.data.errcode !== 0) {
//                 this.$message.error(res.data.msg)
//               } else {
//                 self.$message.success('分组创建成功')
//                 setTimeout(() => {
//                   self.$router.push({ path: '/group/list' })
//                 }, 1e3)
//               }
//             })
//             .catch(this.$error.showErrorMessage)
//         }
//       })
//     }
//   }
// }
