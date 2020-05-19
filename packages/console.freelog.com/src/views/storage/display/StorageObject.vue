<template>
    <div>
        <div class="mock-list__mocks_non-empty__header"
             style="padding: 30px 0; display: flex; align-items: center;">
            <span style="font-size: 14px; color: #222;">对象 0</span>
            <div style="display: flex;">
                <el-popover
                    placement="top"
                    :width="(data && data.length === 0) ? 360 : 274"
                    v-model="deleteBucketPopoverShow"
                >
                    <template v-if="data && data.length === 0">
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
                                @click="$emit('removeBucket')"
                            >{{$t('mock.confirm')}}
                            </el-button>
                        </div>
                        <div style="height: 8px;"></div>
                    </template>
                    <template v-if="data && data.length > 0">
                        <div style="height: 30px;"></div>
                        <p style="text-align: center; font-size: 14px; font-weight: 600; color: #333;">
                            {{$t('mock.doesNotRemove')}}</p>
                        <div style="height: 25px;"></div>
                        <div style="display: flex; align-items: center; justify-content: center;">
                            <el-button
                                size="small"
                                type="primary"
                                plain
                                @click="deleteBucketPopoverShow = false"
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
                <router-link :to="'/mock/create/' + (bucketInfo && bucketInfo.bucketName)"
                             style="width: 56px; height: 38px; border-radius: 4px; background-color: #EDF6FF; display: flex; align-items: center; justify-content: center;">
                    <i style="color: #409EFF; font-size: 16px;" class="el-icon-delete"></i>
                </router-link>
            </div>
        </div>

        <el-table
            :empty-text="data === null ? '加载中...' : ''"
            :data="data || []"
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
                        <span style="padding-left: 10px;">{{scope.row.objectName}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="type"
                :label="$t('mock.table.type')"
                min-width="180">
                <template slot-scope="scope">
                    {{scope.row.resourceType | pageBuildFilter}}
                </template>
            </el-table-column>
            <el-table-column
                prop="size"
                :label="$t('mock.table.size')"
                min-width="180">
                <template slot-scope="scope">
                    {{scope.row.systemMeta.fileSize | humanizeSize}}
                </template>
            </el-table-column>
            <el-table-column
                prop="date"
                :label="$t('mock.table.date')"
                min-width="180">
                <template slot-scope="scope">
                    {{scope.row.createDate | momentFormat}}
                </template>
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
                                    @click="$emit('download', scope.row)"
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
    </div>

</template>

<script>
    export default {
        name: "StorageObject",
        props: {
            data: {
                type: Array || null,
                default: null,
            },
            bucketInfo: {
                type: Object || null,
                default: null
            }
        },
        data() {
            return {
                // 删除Bucket的面板是否显示
                deleteBucketPopoverShow: false,
            };
        },
        mounted() {
            setTimeout(() => {
                console.log(this.data, '#####');
            }, 3000);
        },
        methods: {},
    }
</script>

<style scoped lang="less">
    .mock-list__mocks_non-empty__header {
        margin: 0 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .mock-list__mocks_non-empty__header__info {
            height: 80px;
            display: flex;
            flex-shrink: 0;
            flex-grow: 0;
            align-items: center;
            /*justify-content: space-between;*/
            font-size: 14px;
            color: #999;

            & > div {
                display: flex;
                align-items: center;
                padding-left: 20px;
                padding-right: 20px;

                & > span {
                    color: #000;
                    padding: 0 10px;
                }
            }
        }

    }
</style>
