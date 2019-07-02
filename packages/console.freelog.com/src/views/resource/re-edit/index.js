import {onloadResourceDetail} from '@/data/resource/loader'
import inputEdit from '../input-edit/index.vue'

export default {
    name: 'resource-creator',
    components: {
        ResourceInput: inputEdit
    },
    data() {
        return {
            resourceDetail: {}
        }
    },
    mounted() {
        const params = this.$route.params
        if (params.resourceId) {
            onloadResourceDetail(params.resourceId)
                .then((data) => {
                    this.resourceDetail = data
                }).catch(this.$error.showErrorMessage)
        }
    },
    methods: {
        executeNext(callback) {
            if (this.isRequesting) return;
            // console.log(this.data, 'this.datathis.data');
            // return;
            this.isRequesting = true;
            if (this.$refs.inputArea.nextHandler) {
                this.$refs.inputArea
                    .nextHandler(this.data)
                    .then((detail) => {
                        if (detail && detail.resourceId) {
                            Object.assign(this.resourceDetail, detail)
                        }
                        this.isRequesting = false;
                        callback()
                    })
                    .catch((err) => {
                        this.isRequesting = false;
                        this.$nextTick(() => {
                            const $error = this.$el.querySelector('.el-form-item__error')
                            if ($error) {
                                $error.parentElement.scrollIntoView();
                                window.scrollBy(0, -80) // 填补fixed占位的高度
                            } else {
                                this.$error.showErrorMessage(err)
                            }
                        })
                    });
            } else {
                this.isRequesting = false;
                callback()
            }
        },
        create2QuitHandler() {
            this.executeNext(() => {
                const detail = this.resourceDetail
                if (this.$route.params.resourceId) {
                    this.$message.success(this.$t('resource.updateSuccess'))
                } else {
                    this.$message.success(this.$t('resource.createSuccess'))
                }
                setTimeout(() => {
                    this.$router.push(`/resource/detail/${detail.resourceId}`)
                }, 5e2)
            })
        },
        /**
         * 点击『创建完成』按钮
         */
        create2AddHandler() {
            const detail = this.resourceDetail;
            // 向服务端提交数据
            this.executeNext(() => {
                // if (detail.resourceId) {
                //     this.$router.push(`/resource/detail/${detail.resourceId}`)
                // }
                // 数据提交成功后返回列表展示页
                this.$router.back();
            })
        },
        /**
         * 点击『取消创建』mock 时
         */
        cancelHandler() {
            // 弹窗提示，是否取消发布
            // this.$confirm(this.$t('resource.cancelQuestion'))
            this.$confirm('确定取消创建 mock ？')
                .then(() => {
                    this.$router.push('/mock/display')
                })
                .catch(() => {
                });
        }
    }
}
