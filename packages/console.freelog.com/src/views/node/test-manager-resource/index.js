import OverviewHeader from './OverviewHeader';
import ModuleBlock from './ModuleBlock';
import BlockItem from './BlockItem';
import ConfirmInput from './ConfirmInput';
import FreelogTags from '@/components/Tags/index.vue';

export default {
    name: 'index',
    components: {
        ConfirmInput,
        BlockItem,
        ModuleBlock,
        OverviewHeader,
        FreelogTags,
    },
    data() {
        return {
            nodeId: '',
            originInfo: null,
            isOnline: false,
            testResourceName: '',
            versions: [],
            versionValue: '',
            userDefinedTags: null,
        };
    },
    mounted() {
        this.handleData();
    },
    methods: {
        async handleData() {
            const {testResourceID} = this.$route.params;
            const res = await this.$axios.get(`/v1/testNodes/testResources/${testResourceID}`);
            // console.log(res, 'RRRRRRRRR');
            const data = res.data.data;

            this.nodeId = data.nodeId;

            this.originInfo = {
                name: data.originInfo.name,
                previewImage: data.previewImages[0],
                type: data.originInfo.type,
                version: data.originInfo.versions.reverse()[0],
                intro: data.intro,
                resourceType: data.resourceType,
            };

            this.isOnline = data.differenceInfo.onlineStatusInfo.isOnline === 1;
            this.versions = data.originInfo.versions;
            this.versionValue = data.originInfo.version;
            this.testResourceName = data.testResourceName;
            this.userDefinedTags = data.differenceInfo.userDefinedTagInfo.tags;
        },
        /**
         * 上下线
         */
        async onLineAndOffLine() {
            const nodeId = this.nodeId;
            const testResourceName = this.testResourceName;
            const isOnline = this.isOnline;
            const res = await this.$axios.get(`/v1/testNodes/${nodeId}`);
            const ruleText = res.data.data ? res.data.data.ruleText : '';
            if (isOnline) {
                // 需要下线
                if (ruleText.includes(`^ ${testResourceName}`)) {
                    const testRuleText = ruleText.replace(`^ ${testResourceName}`, `- ${testResourceName}`);
                    const response = await this.$axios.post(`/v1/testNodes`, {
                        nodeId,
                        testRuleText: Buffer.from(testRuleText).toString('base64'),
                    });
                } else {
                    const testRuleText = `- ${testResourceName}`;
                    const params = {
                        testRuleText: Buffer.from(testRuleText).toString('base64'),
                    };
                    const response = await this.$axios.put(`/v1/testNodes/${nodeId}/additionalTestRule`, params);
                }
                this.$message.success('下线成功');
            } else {
                // 需要上线
                if (ruleText.includes(`- ${testResourceName}`)) {
                    const testRuleText = ruleText.replace(`- ${testResourceName}`, `^ ${testResourceName}`);
                    const response = await this.$axios.post(`/v1/testNodes`, {
                        nodeId,
                        testRuleText: Buffer.from(testRuleText).toString('base64'),
                    });
                } else {
                    const testRuleText = `^ ${testResourceName}`;
                    const params = {
                        testRuleText: Buffer.from(testRuleText).toString('base64'),
                    };
                    const response = await this.$axios.put(`/v1/testNodes/${nodeId}/additionalTestRule`, params);
                }
                this.$message.success('上线成功');
            }
            this.handleData();
        },
        async confirmChange(value) {
            console.log(value, 'confirmChange');
            const res = await this.$axios.get(`/v1/testNodes/${this.nodeId}`);
            // console.log(res, 'resresresres');
            const ruleText = res.data.data ? res.data.data.ruleText : '';
            // return;
            const testRuleText = ruleText.replace(`+ ${this.testResourceName}`, `+ ${value}`);
            const response = await this.$axios.post(`/v1/testNodes`, {
                nodeId: this.nodeId,
                testRuleText: Buffer.from(testRuleText).toString('base64'),
            });
            this.$message.success('更新名称成功');
            this.handleData();
        },
        async setTags(val) {
            // console.log(val.join(','), '######');
            const testRuleText = `& ${this.testResourceName} tags=[${val.join(',')}]`;
            const params = {
                testRuleText: Buffer.from(testRuleText).toString('base64'),
            };
            const response = await this.$axios.put(`/v1/testNodes/${this.nodeId}/additionalTestRule`, params);
            this.$message.success('标签设置成功');
        },
        async setVersion(val) {
            const testRuleText = `& ${this.testResourceName} version=${val}`;
            const params = {
                testRuleText: Buffer.from(testRuleText).toString('base64'),
            };
            const response = await this.$axios.put(`/v1/testNodes/${this.nodeId}/additionalTestRule`, params);
        }
    },
    watch: {
        userDefinedTags(val, oldVal) {
            if (!oldVal || JSON.stringify(val) === JSON.stringify(oldVal)) {
                return;
            }
            // console.log(val);
            this.setTags(val);
        },
        versionValue(val, oldVal) {
            if (!oldVal) {
                return;
            }
            // console.log(val);
            this.setTags(val);
        },
    }
}
