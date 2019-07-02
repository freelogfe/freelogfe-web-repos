<template>
    <section class="create-resource-wrapper">
        <div class="bd">
            <resource-input
                :data="resourceDetail"
                ref="inputArea"
            >
                <div style="height: 60px;"></div>
                <div
                    class="btm-wrap clearfix"
                    style="position: fixed; bottom: 0; left: 0; right: 0; height: 60px; margin: 0; display: flex; justify-content: center; background-color: #fff; box-shadow: 0 -2px 5px 0 rgba(0,0,0,0.1); z-index: 100;"
                >
                    <div
                        class="rt-side"
                        style="width: 1190px; height: 100%; display: flex; align-items: center; justify-content: flex-end;"
                    >
                        <el-button
                            class="ft-btn"
                            style="color: #999999;"
                            @click="cancelHandler"
                            type="text"
                        >{{
                            $t('common.cancelCreateText') }}
                        </el-button>
                        <el-button
                            class="ft-btn"
                            round
                            @click="create2AddHandler"
                        >
                            <!--                            {{$t('resource.createDoneText')}}-->
                            {{isResourceIdEditMode ? '保存': '完成创建'}}
                        </el-button>
                        <el-button
                            class="ft-btn"
                            style="margin-left: 30px;"
                            type="primary"
                            round
                            @click="handleRelease"
                        >
                            <!--                            {{$t('resource.createDoneText')}}-->
                            {{isResourceIdEditMode ? '保存': '创建'}}并发行
                        </el-button>
                    </div>
                </div>
            </resource-input>
        </div>

        <el-dialog
            width="750px"
            top="10vh"
            center
            :visible.sync="isShowReleaseSearchDialog"
        >
            <release-search
                :tabLayout="['my-release']"
                :historicalReleases="releasesList"
                @add="releaseSearchHandler"
            ></release-search>
            <div slot="footer">
                <el-button
                    round
                    type="primary"
                    class="create-release-btn"
                    @click="createNewRelease">创建新发行
                </el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import Creator from './index';

    export default Creator;
</script>

<style lang="less" scoped>
    @import "index.less";
    @import "../../../styles/footer.less";
</style>

<style lang="less">
    .create-resource-wrapper {
        .el-tabs__content {
            max-height: 370px;
            overflow: auto;
        }
    }
</style>
