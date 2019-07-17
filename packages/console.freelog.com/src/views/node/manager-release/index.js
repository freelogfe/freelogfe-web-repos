import ContentBlock from './ContentBlock.vue';
import DisplayOrInput from './DisplayOrInput.vue';
import FreelogTags from '@/components/Tags/index.vue';
import PolicyEditor from '@/components/PolicyEditor/index.vue'
import PolicyList from '@/components/PolicyList/list/index.vue'

export default {
    name: 'manager-release',
    components: {
        ContentBlock,
        DisplayOrInput,
        FreelogTags,
        PolicyEditor,
        PolicyList,
    },
    data() {
        return {

            initState: true,
            releaseInfo: {
                previewImages: '',
                releaseName: '',
                resourceType: '',
                version: '',
                createDate: '',
            },

            presentableName: null,
            userDefinedTags: null,

            isShowEditPolicy: false,
            // 策略列表
            policies: [],
            // 新建的策略
            newPolicie: {policyName: '未命名策略', policyText: ''},
        };
    },
    mounted() {
        this.handleInitInfo();
    },
    methods: {
        /**
         * 根据 presentableId 初始化信息
         * @return {Promise<void>}
         */
        async handleInitInfo() {
            // console.log(this.$route.params.presentableId, 'paramsparamsparamsparams');
            const res = await this.$axios.get(`/v1/presentables/${this.$route.params.presentableId}`);
            const result = res.data.data;
            setTimeout(() => this.initState = false);

            const time = new Date(result.createDate);
            // console.log(time, 'tTWERFTTTTTTT');
            // console.log(time.getFullYear(), time.getMonth(), time.getDate(), time.getHours(), time.getMinutes(), '@AFDSASDF@#RASEZCX');
            this.releaseInfo = {
                previewImages: result.releaseInfo.previewImages[0] ? result.releaseInfo.previewImages[0] : undefined,
                releaseName: result.releaseInfo.releaseName,
                resourceType: result.releaseInfo.resourceType,
                version: result.releaseInfo.version,
                createDate: [
                    [time.getFullYear(), (time.getMonth() + 1 < 10 ? '0' : '') + (time.getMonth() + 1), (time.getDate() < 10 ? '0' : '') + time.getDate()].join('-'),
                    [(time.getHours() < 10 ? '0' : '') + time.getHours(), (time.getMinutes() < 10 ? '0' : '') + time.getMinutes()].join(':')
                ].join(' '),
            };
            this.presentableName = result.presentableName;
            this.userDefinedTags = result.userDefinedTags;
            this.policies = result.policies;

        },
        /**
         * 更新 presentable 数据
         */
        async updatePresentable(params) {
            return await this.$axios.put(`/v1/presentables/${this.$route.params.presentableId}`, params);
        },
        /**
         * 显示添加策略的编辑框
         */
        switchShowEditPolicy(bool) {
            this.isShowEditPolicy = bool;
            this.newPolicie = {policyName: '未命名策略', policyText: ''};
        },
        /**
         * 保存一个新策略
         */
        async saveANewPolicy() {
            // console.log(this.btoa, 'newPolicienewPolicie');
            const res = await this.updatePresentable({
                policyInfo: {
                    addPolicies: [
                        {
                            policyName: this.newPolicie.policyName,
                            policyText: window.btoa(this.newPolicie.policyText),
                        },
                    ],
                },
            });
            // console.log(res.data.data, 'handleInitInfo');
            // this.handleInitInfo(res.data.data);
            if (res.data.errcode !== 0) {
                return this.$message.error(res.data.msg);
            }
            this.isShowEditPolicy = false;
            this.policies = res.data.data.policies;
            this.$message.success('添加策略成功');
        },

        /**
         * 添加一个新策略
         */
        // addPolicyHandler() {
        //
        // },
        /**
         * 更新一个策略的状态
         * @param policie
         */
        async updatePolicies(policie) {
            // console.log(policie, 'policiespoliciespoliciespolicies');
            const res = await this.updatePresentable({
                policyInfo: {
                    updatePolicies: [
                        {
                            policyId: policie.policyId,
                            policyName: policie.policyName,
                            status: policie.status,
                        },
                    ],
                },
            });
            // console.log(res.data.data, 'handleInitInfo');
            // this.handleInitInfo(res.data.data);
            if (res.data.errcode !== 0) {
                return this.$message.error(res.data.msg);
            }
            this.isShowEditPolicy = false;
            this.policies = res.data.data.policies;
            this.$message.success('更新策略成功');
        },
    },
    watch: {
        presentableName(val, oldVal) {
            if (this.initState) {
                return;
            }
            // 更新 presentableName
            // console.log(this.presentableName, val, oldVal, 'presentableNamepresentableNamepresentableName');
            this.updatePresentable({
                presentableName: val,
            });
            this.$message.success('节点发行标题更新成功');
        },
        userDefinedTags(val) {
            if (this.initState) {
                return;
            }
            // console.log(this.userDefinedTags, 'userDefinedTagsuserDefinedTagsuserDefinedTags');
            this.updatePresentable({
                userDefinedTags: val,
            });
            this.$message.success('用户标签更新成功');
        },
        // policies() {
        //     if (this.initState) {
        //         return;
        //     }
        //     console.log(this.policies, 'releasePoliciereleasePoliciereleasePoliciereleasePolicie');
        // }
    }
}

function f() {

}
