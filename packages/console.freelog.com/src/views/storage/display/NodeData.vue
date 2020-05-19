<template>
    <div class="node-data">
        <div class="node-data__header"
             style="">
            <span style="font-size: 14px; color: #222;">对象 {{total}}</span>
            <el-button type="primary" style="height: 38px;">上传</el-button>
        </div>

        <el-table
            :empty-text="data === null ? '加载中...' : ''"
            :data="data"
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
                                <a
                                    @click="$emit('download', scope.row)"
                                    style="display: block; width: 100%; height: 100%; color: #333;"
                                >{{$t('mock.downloadResourceFile')}}</a>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <a
                                    @click="$emit('delete', scope.row)"
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
        name: "NodeData",

        props: {
            data: {
                type: Array || null,
                default: null,
            },
            total: {
                type: Number,
                default: 0,
            }
        },

        data() {
            return {
                tableData: null,
            }
        },

        mounted() {
            // setTimeout(() => {
            //     console.log(this.data, 'data');
            // }, 3000);

        },

        methods: {
            handleData() {

            },


        }
    }
</script>

<style scoped lang="less">
    .node-data {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;

        .node-data__header {
            margin: 0 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 30px 0;
        }
    }
</style>
