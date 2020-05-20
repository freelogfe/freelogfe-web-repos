<template>
    <div
        class="mock-list"
        :style="styleObject"
    >

        <Navs
            :buckets="bucketsList.filter(i => i.bucketType === 1)"
            :nodeData="bucketsList.filter(i => i.bucketType === 2)"
            @onChangeActive="onChangeBucketActiveIndex"
            @addBucket="dialogVisible=true"
            @showNodeData="onClickShowNodeData"
        />

        <!-- 右侧内容区 -->
        <div class="mock-list__mocks">


            <!-- 有 bucket 时显示 -->
            <!--            v-if="bucketsList && bucketsList.length > 0"-->
            <div
                class="mock-list__mocks_non-empty"
            >

                <div class="mock-list__mocks_non-empty__body">
                    <div
                        v-if="mockTableData && mockTableData.length === 0"
                        class="mock-list__mocks_non-empty__body_null"
                    >
                        <p>{{$t('mock.notCreatedAnyMock')}}</p>
                    </div>

                    <!--                    v-if="mockTableData && mockTableData.length > 0"-->
                    <div class="mock-list__mocks_non-empty__body_table">

                        <NodeData
                            v-if="$route.query.activatedBucketName === '.UserNodeData'"
                            :data="mockTableData"
                            @download="downloadObject"
                            @delete="showDeleteMockDialog"
                            :total="mockTotalItem"
                        />

                        <StorageObject
                            v-else
                            :data="mockTableData"
                            @download="downloadObject"
                            @delete="showDeleteMockDialog"
                            :total="mockTotalItem"
                        />

                        <div v-if="mockTotalItem > 10"
                             style="padding: 10px 0; display: flex; justify-content: flex-end;">
                            <el-pagination
                                :current-page="mockCurrentPage"
                                :page-sizes="[10, 20, 30, 40, 50]"
                                :page-size="mockPageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="mockTotalItem"
                                @current-change="onCurrentPageChange"
                                @size-change="onPageSizeChange"
                            >
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <CreateBucketDialog
            :visible="dialogVisible"
            @cancel="dialogVisible=false"
            @success="createBucketSuccess"
        />

        <div class="mock-list__noheader-dialog">
            <el-dialog
                :visible="!!deleteObject"
                width="30%"
                :show-close="false"
                :close-on-click-modal="false"
            >
                <div style="height: 10px;"></div>
                <div style="color: #333; font-size: 14px; text-align: center; word-break: normal;">
                    {{$t('mock.mockOnceDeleted')}}
                </div>
                <div style="height: 26px;"></div>
                <div style="text-align: center;">
                    <el-button
                        type="text"
                        style="padding: 0 20px; color: #999;"
                        @click="deleteObject = null"
                    >{{$t('mock.cancel')}}
                    </el-button>
                    <el-button
                        type="danger"
                        @click="deleteAMock"
                    >{{$t('mock.confirm')}}
                    </el-button>
                </div>
            </el-dialog>
        </div>
        <UploadTask/>
    </div>

</template>

<script>
    import MockDisplay from './index';

    export default MockDisplay;
</script>

<style lang="less" type="text/less" scoped>
    @import "index.less";

    .message-class {
        background-color: #fff;
    }
</style>

<style lang="less" type="text/less">

    .message-class {
        background-color: #fff;
        width: 246px;
        min-width: 246px;
        padding: 40px 0;

        .el-message__icon.el-icon-success {
            font-size: 40px;
        }
    }

    .mock-list {

        .mock-list__noheader-dialog {
            .el-dialog__header {
                display: none;
            }

            .el-dialog__body {
                padding-bottom: 20px;
            }
        }
    }

</style>
