<template>
    <div class="add-and-replace">
        <a
            style="color: #333; font-size: 14px; padding: 10px; cursor: pointer;"
            @click="dialogVisible = true"
        >
            <i class="el-icon-plus" style="font-size: 16px; font-weight: 600;"></i>
            <span style="vertical-align: center;">添加测试资源</span>
        </a>

        <a
            @click="elDialogVisible = true"
            style="color: #333; font-size: 14px; padding: 10px; cursor: pointer;"
        >
            <i class="el-icon-refresh" style="font-size: 16px; font-weight: 600;"></i>
            <span style="vertical-align: center;">资源替换</span>
        </a>

        <DepDialog
            v-if="dialogVisible"
            :showMock="true"
            :exists="[]"
            :existMocks="[]"
            @addARelease="addARelease"
            @addAMock="addAMock"
            @removeARelease="removeARelease"
            @removeAMock="removeAMock"
            @onClose="dialogVisible = false"
            :currentID="''"
        />

        <el-dialog
            :visible="elDialogVisible"
            width="840px"
            :before-close="handleClose"
            custom-class="custom-class"
            :close-on-click-modal="false"
        >
            <div>
                <div style="text-align: right; padding-right: 10px; padding-top: 5px">
                    <i
                        @click="elDialogVisible = false"
                        class="el-icon-close"
                        style="font-size: 10px; color: #999; cursor: pointer;"
                    ></i>
                </div>

                <div style="padding: 0 20px; display: flex; justify-content: space-between; align-items: center;">
                    <Replacer @onChange="replacerChange"/>
                    <i class="el-icon-back" style="transform: rotate(180deg)"></i>
                    <Replaced @onChange="replacedChange"/>
                </div>

                <div
                    style="height: 50px; align-items: center; display: flex; flex-direction: row-reverse; padding: 0 20px;"
                >
                    <el-button
                        type="primary"
                        size="mini"
                        style="font-size: 14px;"
                        @click="confirmReplace"
                    >替换
                    </el-button>
                    <el-button
                        type="text"
                        size="mini"
                        style="font-size: 14px; padding: 0 20px; color: #999;"
                        @click="elDialogVisible = false"
                    >取消
                    </el-button>
                </div>
            </div>

        </el-dialog>
    </div>
</template>

<script>
    import DepDialog from '@/components/DependentReleaseList/DepDialog/index.vue';
    import Replacer from './Replacer/index.vue';
    import Replaced from './Replaced/index.vue';

    export default {
        name: "index",
        components: {
            DepDialog,
            Replacer,
            Replaced,
        },
        data() {
            return {
                elDialogVisible: false,
                dialogVisible: false,
                replacer: null,
                replaced: null,
            };
        },
        methods: {
            async addARelease(data) {
                // console.log(data);
                // console.log(Buffer.from('事件').toString('base64'), '######');
                const {nodeId} = this.$route.params;
                // const testRuleText = `+ ${data.name} => #:${data.name}`;
                const testRuleText = `+ ${data.name.replace(/^(.*)\//, '')} => $:${data.name}`;
                // const testRuleText = '+ yanghongtianFreelogText => $:yanghongtian/FreelogText';
                // console.log(testRuleText, 'testRuleTexttestRuleText');
                const res = await this.$axios.put(`/v1/testNodes/${nodeId}/additionalTestRule`, {
                    testRuleText: Buffer.from(testRuleText).toString('base64'),
                });
                if (res.data.errcode !== 0 || res.data.ret !== 0) {
                    return this.$message.error(JSON.stringify(res.data.data.errors));
                }
                // this.$message.success('添加规则成功');
                // this.$emit('success');
                this.pushRuleSuccess();
            },
            async addAMock(data) {
                const {nodeId} = this.$route.params;
                // const testRuleText = `+ ${data.name} => #:${data.name}`;
                const testRuleText = `+ ${data.name.replace(/^(.*)\//, '')} => #:${data.name}`;
                // console.log(testRuleText, 'testRuleTexttestRuleText');
                const res = await this.$axios.put(`/v1/testNodes/${nodeId}/additionalTestRule`, {
                    testRuleText: Buffer.from(testRuleText).toString('base64'),
                });
                // console.log(res, 'resresresresres');
                if (res.data.errcode !== 0 || res.data.ret !== 0) {
                    return this.$message.error(JSON.stringify(res.data.data.errors));
                }
                // this.$message.success('添加规则成功');
                // this.$emit('success');
                this.pushRuleSuccess();

            },
            removeARelease() {

            },
            removeAMock() {

            },
            replacerChange(data) {
                // console.log(data, 'data');
                this.replacer = data;
            },
            replacedChange(data) {
                // console.log(data, 'DDDDDDDDDDD');
                this.replaced = data;
            },
            async confirmReplace() {
                const {nodeId} = this.$route.params;
                const replacedText = (this.replaced.version ? '$:' : '#:') + this.replaced.name;
                const replacerText = (this.replacer.customer !== undefined ? '$:' : '#:') + this.replacer.name;
                const testRuleText = `* ${replacedText} => ${replacerText} scope=${JSON.stringify(this.replaced.scope).replace(/"/g, '')}`;
                await this.$axios.put(`/v1/testNodes/${nodeId}/additionalTestRule`, {
                    testRuleText: Buffer.from(testRuleText).toString('base64'),
                });
                this.pushRuleSuccess();
            },
            pushRuleSuccess() {
                this.$message.success('添加规则成功');
                this.$emit('success');
                this.elDialogVisible = false;
                this.dialogVisible = false;
                this.replacer = null;
                this.replaced = null;
            }
        }
    }
</script>

<style lang="less">
    .add-and-replace {
        .custom-class {
            .el-dialog__header {
                display: none;
            }

            .el-dialog__body {
                padding: 0;
            }
        }
    }

</style>
