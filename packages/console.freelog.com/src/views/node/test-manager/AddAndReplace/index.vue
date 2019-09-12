<template>
    <div class="add-and-replace">
        <a
            style="color: #333; font-size: 14px; padding: 10px; cursor: pointer;"
            @click="dialogVisible = true"
        >
            <i class="el-icon-plus" style="font-size: 16px; font-weight: 600;"></i>
            <span style="vertical-align: center;">添加测试资源</span>
        </a>

        <a style="color: #333; font-size: 14px; padding: 10px; cursor: pointer;">
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
            :visible.sync="elDialogVisible"
            width="840px"
            :before-close="handleClose"
            custom-class="custom-class"
            :close-on-click-modal="false"
        >
            <div>
                <div style="text-align: right; padding-right: 10px; padding-top: 5px">
                    <i class="el-icon-close" style="font-size: 10px; color: #999;"></i>
                </div>

                <div style="padding: 0 20px;">
                    <Replacer/>
                </div>

                <div
                    style="height: 50px; align-items: center; display: flex; flex-direction: row-reverse; padding: 0 20px;"
                >
                    <el-button type="primary" size="mini" style="font-size: 14px;">替换</el-button>
                    <el-button type="text" size="mini" style="font-size: 14px; padding: 0 20px; color: #999;">取消
                    </el-button>
                </div>
            </div>

        </el-dialog>
    </div>
</template>

<script>
    import DepDialog from '@/components/DependentReleaseList/DepDialog/index.vue';
    import Replacer from './Replacer/index.vue';

    export default {
        name: "index",
        components: {
            DepDialog,
            Replacer,
        },
        data() {
            return {
                elDialogVisible: true,
                dialogVisible: false,
            };
        },
        methods: {
            addARelease() {

            },
            addAMock() {

            },
            removeARelease() {

            },
            removeAMock() {

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
