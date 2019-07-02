export const name = [
  {
    min: 2, max: 40, message: '长度在 2 到 40 个字符', trigger: 'blur'
  },
  { required: true, message: '模板描述必填', trigger: 'blur' }
]


export const template = [
  { required: true, message: '策略模板内容必填', trigger: 'blur' }
]

export default {
  name,
  template
}
