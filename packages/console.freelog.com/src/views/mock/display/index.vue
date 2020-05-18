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
            <NodeData
                v-show="$route.query.activatedBucketName === '.UserNodeData'"
                :data="mockTableData"
            />

            <!-- 有 bucket 时显示 -->
            <!--            v-if="bucketsList && bucketsList.length > 0"-->
            <div
                class="mock-list__mocks_non-empty"
                v-if="!!activatedBucket"
            >
                <div class="mock-list__mocks_non-empty__header"
                     style="padding: 30px 0; display: flex; align-items: center;">
                    <span style="font-size: 14px; color: #222;">对象 {{mockTotalItem}}</span>
                    <div style="display: flex;">
                        <el-popover
                            placement="top"
                            width="(mockTableData && mockTableData.length === 0) ? 360 : 274"
                            v-model="deleteBucketPopoverShow"
                        >
                            <template v-if="mockTableData && mockTableData.length === 0">
                                <div style="height: 30px;"></div>
                                <p style="text-align: center; font-size: 14px; font-weight: 600; color: #333;">
                                    {{$t('mock.confirmDeletion')}}</p>
                                <div style="height: 25px;"></div>
                                <div style="display: flex; align-items: center; justify-content: center;">
                                    <el-button
                                        size="small"
                                        type="text"
                                        style="padding-left: 20px; padding-right: 20px; color: #999;"
                                        @click="controlDeleteBucketPopoverShow(false)"
                                    >{{$t('mock.cancel')}}
                                    </el-button>
                                    <el-button
                                        type="danger"
                                        size="small"
                                        @click="removeABucketByAPI"
                                    >{{$t('mock.confirm')}}
                                    </el-button>
                                </div>
                                <div style="height: 8px;"></div>
                            </template>
                            <template v-if="mockTableData && mockTableData.length > 0">
                                <div style="height: 30px;"></div>
                                <p style="text-align: center; font-size: 14px; font-weight: 600; color: #333;">
                                    {{$t('mock.doesNotRemove')}}</p>
                                <div style="height: 25px;"></div>
                                <div style="display: flex; align-items: center; justify-content: center;">
                                    <el-button
                                        size="small"
                                        type="primary"
                                        plain
                                        @click="controlDeleteBucketPopoverShow(false)"
                                    >{{$t('mock.confirm')}}
                                    </el-button>
                                </div>
                                <div style="height: 8px;"></div>
                            </template>

                            <a slot="reference"
                               style="width: 56px; height: 38px; border-radius: 4px; background-color: #FDEBEC; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                                <i style="color: #EE4040; font-size: 16px;" class="el-icon-delete"></i>
                            </a>
                        </el-popover>

                        <div style="width: 20px;"></div>
                        <router-link :to="'/mock/create/' + activatedBucket.bucketName"
                                     style="width: 56px; height: 38px; border-radius: 4px; background-color: #EDF6FF; display: flex; align-items: center; justify-content: center;">
                            <i style="color: #409EFF; font-size: 16px;" class="el-icon-delete"></i>
                        </router-link>
                    </div>
                </div>

                <div class="mock-list__mocks_non-empty__body">
                    <div
                        v-if="mockTableData && mockTableData.length === 0"
                        class="mock-list__mocks_non-empty__body_null"
                    >
                        <p>{{$t('mock.notCreatedAnyMock')}}</p>
                    </div>

                    <!--                    v-if="mockTableData && mockTableData.length > 0"-->
                    <div
                        class="mock-list__mocks_non-empty__body_table"
                        v-else
                    >
                        <el-table
                            :empty-text="mockTableData === null ? '加载中...' : ''"
                            :data="mockTableData"
                            style="width: 100%">
                            <el-table-column
                                prop="name"
                                :label="'资源名称'"
                                min-width="180">
                                <template slot-scope="scope">
                                    <div style="display: flex; align-items: center;">
                                        <div
                                            style="width: 40px; height: 36px;"
                                            class="resource-default-preview"
                                        >
                                            <img
                                                style="width: 100%; height: 100%;"
                                                v-if="scope.row.previewImages && scope.row.previewImages.length > 0"
                                                :src="scope.row.previewImages[0]"
                                                alt=""
                                            />
                                        </div>
                                        <span style="padding-left: 10px;">{{scope.row.name}}</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="type"
                                :label="$t('mock.table.type')"
                                min-width="180">
                                <template slot-scope="scope">
                                    {{scope.row.type | pageBuildFilter}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="size"
                                :label="$t('mock.table.size')"
                                min-width="180">
                            </el-table-column>
                            <el-table-column
                                prop="date"
                                :label="$t('mock.table.date')"
                                min-width="180">
                            </el-table-column>
                            <el-table-column
                                prop="action"
                                :label="$t('mock.table.action')"
                                width="70"
                            >
                                <template slot-scope="scope">
                                    <el-dropdown>

                                        <el-button
                                            icon="el-icon-more"
                                            type="small"
                                            circle
                                            style="background-color: #fafbfb;"
                                        />

                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item>
                                                <router-link
                                                    target="_blank"
                                                    :to="'/mock/update/' + scope.row.mockResourceId"
                                                >
                                                    <a
                                                        style="display: block; width: 100%; height: 100%; color: #333;"
                                                    >{{$t('mock.edit')}}</a>
                                                </router-link>
                                            </el-dropdown-item>
                                            <el-dropdown-item>
                                                <a
                                                    @click="downloadAMockByAPI(scope.row.mockResourceId)"
                                                    style="display: block; width: 100%; height: 100%; color: #333;"
                                                >{{$t('mock.downloadResourceFile')}}</a>
                                            </el-dropdown-item>
                                            <el-dropdown-item>
                                                <a
                                                    @click="buildFormalResourcesConfirm(scope.row)"
                                                    style="display: block; width: 100%; height: 100%; color: #333;"
                                                >{{$t('mock.generateFormalResources')}}</a>
                                            </el-dropdown-item>
                                            <el-dropdown-item>
                                                <a
                                                    @click="showDeleteMockDialog(scope.row.mockResourceId)"
                                                    style="color: #EE4040; display: block; width: 100%; height: 100%;"
                                                >{{$t('mock.delete')}}</a>
                                            </el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </template>

                            </el-table-column>
                        </el-table>
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
                :visible="!!deleteMockID"
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
                        @click="hideDeleteMockDialog"
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
