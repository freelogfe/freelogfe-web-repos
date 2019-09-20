<template>
    <div>
        <div style="height: 40px;"></div>

        <div style="display: flex; align-items: center;justify-content: space-between;">

            <AddAndReplace/>

            <el-input
                style="width: 400px;"
            >
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                <i
                    style="cursor: pointer"
                    @click=""
                    v-show="true"
                    slot="suffix"
                    class="el-input__icon el-icon-circle-close"
                ></i>
            </el-input>
        </div>

        <div style="height: 70px;"></div>

        <el-table
            :data="tableData"
            style="width: 100%"
        >
            <el-table-column
                prop="rules"
                label="规则"
            >
                <template slot-scope="scope">
                    <!--                    <div style="color: #333; font-size: 16px;">-->
                    <!--                        <i class="el-icon-plus" style="font-weight: 600;"></i>-->
                    <!--                        <i class="el-icon-sort-up" style="font-weight: 600;"></i>-->
                    <!--                        <i class="el-icon-sort-down" style="font-weight: 600;"></i>-->
                    <!--                        <i class="el-icon-tickets" style="font-weight: 600;"></i>-->
                    <!--                        <i class="el-icon-refresh" style="font-weight: 600;"></i>-->
                    <!--                    </div>-->
                    <el-dropdown>
                        <div style="color: #333; font-size: 16px;">
                            <i class="el-icon-plus" style="font-weight: 600;"></i>
                            <i class="el-icon-sort-up" style="font-weight: 600;"></i>
                            <i class="el-icon-sort-down" style="font-weight: 600;"></i>
                            <i class="el-icon-tickets" style="font-weight: 600;"></i>
                            <i class="el-icon-refresh" style="font-weight: 600;"></i>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                                <i class="el-icon-sort-up" style="font-weight: 600;"></i>
                                <span>测试资源上线</span>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <i class="el-icon-tickets" style="font-weight: 600;"></i>
                                <span>添加标签【image】</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="来源 | 测试资源名称"
                width="180">
                <template slot-scope="scope">
                    <div class="text-overflow-ellipsis" style="color: #000; font-size: 14px;">
                        <!--                        {{scope.row.presentableName}}-->
                        <!--                       #f5a623 -->
                        <label
                            v-if="scope.row.originInfo.type === 'mock'"
                            style="line-height: 20px; width: 40px; text-align: center; border-radius: 2px;background-color: #72bb1f; color: #fff; display: inline-block; font-weight: 600; font-size: 12px;"
                        >mock</label>
                        <label
                            v-if="scope.row.originInfo.type === 'release'"
                            style="line-height: 20px; width: 40px; text-align: center; border-radius: 2px;background-color: #72BB1F; color: #fff; display: inline-block; font-weight: 600; font-size: 12px;"
                        >市场</label>
                        <span>{{scope.row.testResourceName}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="entries"
                label="相关条目 | 展示版本">
                <template slot-scope="scope">
                    <div style="display: flex; align-items: center; padding-left: 10px;">
                        <div
                            style="width: 40px; height: 30px; flex-shrink: 0;"
                            class="resource-default-preview"
                        >
                            <!--                            v-if="scope.row.releaseInfo.previewImages && scope.row.releaseInfo.previewImages.length > 0"
                                                            :src="scope.row.releaseInfo.previewImages[0]"-->
                            <img
                                style="width: 100%; height: 100%;"
                                class="resource-default-preview"
                            />
                        </div>
                        <div style="padding-left: 10px; overflow: hidden; flex-shrink: 1;">
                            <div class="text-overflow-ellipsis"
                                 style="color: #000; font-size: 14px; font-weight: 600; line-height: 20px; width: 100%;">
                                {{scope.row.originInfo.name}}
                            </div>
                            <div style="line-height: 17px; color: #999; font-size: 12px;">
                                {{scope.row.originInfo.version}}
                            </div>
                        </div>
                    </div>
                </template>
            </el-table-column>

            <el-table-column
                prop="type"
            >
                <template slot="header" slot-scope="scope">
                    <el-dropdown
                        style="height: 32px; padding-left: 0;"
                    >
                        <div style="padding-left: 0;">
                            全部类型 <i class="el-icon-caret-bottom"></i>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="item in allTypes">
                                <a
                                    style="display: block; width: 100%; height: 100%;"
                                >{{item}}</a>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>

                </template>

                <template slot-scope="scope">
                    <div style="color: #000; font-size: 14px;">
                        {{scope.row.resourceType}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="status"
            >
                <template slot="header" slot-scope="scope">
                    <el-dropdown
                        style="height: 32px; padding-left: 0;"
                    >
                        <div style="padding-left: 0;">
                            全部状态 <i class="el-icon-caret-bottom"></i>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="item in allTypes">
                                <a
                                    style="display: block; width: 100%; height: 100%;"
                                >{{item}}</a>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>

                <template slot-scope="scope">
                    <div style="font-size: 14px; display: flex; align-items: center;">
                        <!--                            <span v-if="scope.row.isOnline === 1" style="color: #000;">{{$t('online')}}</span>-->
                        <!--                            v-if="scope.row.isOnline === 0"-->
                        <span
                            style="color: #bfbfbf;">
<!--                                {{$t('noOnline')}}-->
                                未上线
                            </span>
                        <!--                            v-if="!scope.row.isAuth"-->
                        <template>
                            <!--                                :content="$t('exceptionExists')"-->
                            <el-popover
                                placement="top"
                                width="100"
                                trigger="hover"
                                content="此合约链上存在异常"
                            >
                                <i
                                    slot="reference"
                                    class="el-icon-warning"
                                    style="font-size: 20px; color: #ffc210; margin-left: 8px;"
                                ></i>
                            </el-popover>
                        </template>
                    </div>

                </template>
            </el-table-column>
            <el-table-column
                prop="operation"
                label="操作">
                <template slot-scope="scope">
                    <el-dropdown>

                        <el-button
                            icon="el-icon-more"
                            type="small"
                            circle
                            style="background-color: #fafbfb;"
                        ></el-button>

                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                                <a
                                    style="display: block; width: 100%; height: 100%; color: #333;"
                                >{{$t('action.edit')}}</a>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <a
                                    style="display: block; width: 100%; height: 100%; color: #333;"
                                >{{$t('action.top')}}</a>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <a @click="upgradePresentable(scope.row)">{{$t('action.upgrade')}}</a>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <a
                                    @click="onLineAndOffLine(scope.row)"
                                    style="display: block; width: 100%; height: 100%;"
                                >
                                    <span v-if="scope.row.isOnline === 0" style="color: #44a0ff;">{{$t('action.online')}}</span>
                                    <span v-if="scope.row.isOnline === 1" style="color: #ee4040;">{{$t('action.downline')}}</span>
                                </a>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import AddAndReplace from '../AddAndReplace/index.vue';

    export default {
        name: "index",
        components: {
            AddAndReplace,
        },
        data() {
            return {
                tableData: [],
                // 类型可选项
                allTypes: [
                    // this.$t('allType'),
                    '全部类型',
                    'json', 'widget', 'image', 'audio', 'markdown', 'reveal_slide', 'license', 'video', 'catalog'],
                // 已选类型
                selectedType: this.$t('allType'),
                // 状态可以选项
                allState: [
                    // this.$t('allState'),
                    '全部状态',
                    this.$t('online'), this.$t('noOnline'), this.$t('contractException')],
            };
        },
        mounted() {
            // console.log(this.$route.params.nodeId, 'this.$router');
            // const {nodeId} = this.$route.params;
            // const nodeId = this.$router
            // this.$axios(`/v1/testNodes/${nodeId}/testResources`);
            this.handleData();
        },
        methods: {
            async matchTestResources() {
                const {nodeId} = this.$route.params;
                await this.$axios.post(`/v1/testNodes/${nodeId}/matchTestResources`)
            },
            async handleData() {
                await this.matchTestResources();
                const {nodeId} = this.$route.params;
                const res = await this.$axios(`/v1/testNodes/${nodeId}/testResources`);
                if (res.data.errcode !== 0 || res.data.ret !== 0) {
                    return this.$message.error(res.data.msg);
                }
                const data = res.data.data;
                // console.log(data, 'datadatadatadatadata');
                this.tableData = data.dataList;
                console.log(data.dataList);
            },
        }
    }
</script>

<style scoped>

</style>
