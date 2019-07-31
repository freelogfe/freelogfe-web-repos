<template>
    <div class="node-manager" style="display: flex;">

        <div :style="styleObject" style="width: 280px; flex-shrink: 0; background-color: #fafbfb;">
            <div style="height: 30px;"></div>
            <div style="color: #333; font-size: 20px; font-weight: 600; padding: 0 20px;">{{nodeInfo.name}}</div>
            <div style="height: 10px;"></div>
            <div style="padding: 0 20px;">
                <a
                    style="font-size: 14px; color: #333; text-decoration: underline; margin-right: 5px;"
                    :href="'//' + nodeInfo.origin"
                >{{nodeInfo.origin}}</a>
                <clipboard
                    :value="nodeInfo.origin"
                    style="display: inline-block;"
                    @copyDone="$message.success('复制成功')"
                >
                    <el-button style="padding: 3px 6px;" type="primary" plain size="mini">copy</el-button>
                </clipboard>
            </div>

            <div style="height: 79px;"></div>

            <div style="border-top: 1px solid #ebebeb; cursor: pointer;">
                <a
                    @click="switchIsPageStyle(false)"
                    :style="{
                        backgroundColor: !isPageStyle ? '#fff':'transparent',
                        borderRight: !isPageStyle ? '3px solid #409eff': 'none',
                        color: !isPageStyle ? '#409eff': '#333',
                    }"
                    style="line-height: 54px; display: block; padding-left: 60px; font-size: 14px; font-weight: 600; border-bottom: 1px solid #ebebeb;">节点发行列表</a>
                <a
                    @click="switchIsPageStyle(true)"
                    :style="{
                        backgroundColor: isPageStyle ? '#fff':'transparent',
                        borderRight: isPageStyle ? '3px solid #409eff': 'none',
                        color: isPageStyle ? '#409eff': '#333',
                    }"
                    style="line-height: 54px; display: block; padding-left: 60px; font-size: 14px; font-weight: 600; border-bottom: 1px solid #ebebeb;">节点页面样式</a>
            </div>
        </div>


        <div style="width: 100%; flex-shrink: 1; background-color: #fff; padding: 0 60px;">
            <div style="height: 40px;"></div>
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <el-radio-group
                    v-model="filterTodo">
                    <el-radio-button label="全部">
                        <span style="display: inline-block; width: 84px; text-align: center;">全部</span>
                    </el-radio-button>
                    <el-radio-button label="待处理">
                        <span style="display: inline-block; width: 84px; text-align: center;">待处理</span>
                    </el-radio-button>
                </el-radio-group>

                <el-input
                    style="width: 400px;"
                    v-model="filterSearch"
                    debounce="1000"
                >
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <i slot="suffix" class="el-input__icon el-icon-circle-close"></i>
                </el-input>
            </div>

            <div style="height: 80px;"></div>

            <el-table
                :data="tableData"
                style="width: 100%"
            >
                <el-table-column
                    prop="publish"
                    label="发行"
                    width="180"
                >
                    <template slot-scope="scope">
                        <div style="display: flex; align-items: center;">
                            <div
                                style="width: 40px; height: 30px; flex-shrink: 0;"
                                class="resource-default-preview"
                            >
                                <img
                                    style="width: 100%; height: 100%;"
                                    v-if="scope.row.releaseInfo.previewImages && scope.row.releaseInfo.previewImages.length > 0"
                                    :src="scope.row.releaseInfo.previewImages[0]"
                                />
                            </div>
                            <div style="padding-left: 10px; overflow: hidden; flex-shrink: 1;">
                                <div class="text-overflow-ellipsis"
                                     style="color: #000; font-size: 14px; font-weight: 600; line-height: 20px; width: 100%;">
                                    {{scope.row.releaseInfo.releaseName}}
                                </div>
                                <div style="line-height: 17px; color: #999; font-size: 12px;">
                                    {{scope.row.releaseInfo.version}}
                                </div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="presentableName"
                    label="发行标题"
                    width="180"
                >
                    <template slot-scope="scope">
                        <div class="text-overflow-ellipsis" style="color: #000; font-size: 14px;">
                            {{scope.row.presentableName}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="type"
                    label="全部类型"
                >
                    <template slot="header" slot-scope="scope">
                        <el-dropdown
                            style="height: 32px"
                        >
                            <div>
                                {{selectedType}} <i v-if="!isPageStyle" class="el-icon-caret-bottom"></i>
                            </div>
                            <el-dropdown-menu slot="dropdown" v-if="!isPageStyle">
                                <el-dropdown-item v-for="item in allTypes">
                                    <a
                                        @click="onChangeType(item)"
                                        style="display: block; width: 100%; height: 100%;"
                                    >{{item}}</a>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                    <template slot-scope="scope">
                        <div style="color: #000; font-size: 14px;">
                            {{scope.row.releaseInfo.resourceType}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="policies"
                    label="策略"
                >
                    <template slot-scope="scope">
                        <el-popover
                            placement="bottom-start"
                            width="400"
                            trigger="hover"
                            :disabled="scope.row.policies.length === 0"
                        >
                            <!--                            <el-tabs>-->
                            <!--                                <el-tab-pane-->
                            <!--                                    v-for="item in scope.row.policies"-->
                            <!--                                    :label="item.policyName"-->
                            <!--                                >-->
                            <!--                                    <div-->
                            <!--                                        style="height: 200px; overflow-y: auto;"-->
                            <!--                                        v-html="spaceReplaceNbsp(item.policyText)"-->
                            <!--                                    ></div>-->
                            <!--                                </el-tab-pane>-->
                            <!--                            </el-tabs>-->
                            <PolicyTabs :policies="scope.row.policies"/>
                            <!--                            1234-->
                            <div
                                style="display: flex; align-items: center;"
                                class="table-policies"
                                slot="reference"
                            >
                                <div
                                    style="padding-right: 10px; text-align: left;"
                                >
                                    <div v-if="scope.row.policies.length > 0" style="color: #409eff; font-size: 14px;">
                                        {{scope.row.policies[0].policyName}}
                                    </div>
                                    <div v-if="scope.row.policies.length === 0" style="color: #999; font-size: 14px;">
                                        暂无策略
                                    </div>
                                    <div v-if="scope.row.policies.length > 1" style="font-size: 12px;">
                                        等{{scope.row.policies.length}}个策略…
                                    </div>
                                </div>
                                <a
                                    @click="goToAddPolicyPage(scope.row.presentableId)"
                                    style="width: 26px; height: 20px; border-radius: 10px; background-color: #409eff; align-items: center; justify-content: center; cursor: pointer;"
                                >
                                    <i style="color: #fff; font-size: 12px; font-weight: 600;" class="el-icon-plus"></i>
                                </a>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="updateTime"
                    label="更新时间"
                >
                    <template slot-scope="scope">
                        <div>
                            <div style="font-size: 14px; color: #000;">{{dateStringToFormat(scope.row.updateDate)}}
                            </div>
                            <div style="color: #bfbfbf; font-size: 12px;">加入时间
                                {{dateStringToFormat(scope.row.createDate)}}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="state"
                    label="全部状态"
                >
                    <template slot="header" slot-scope="scope">
                        <el-dropdown style="height: 32px">
                            <div>
                                {{selectedState}} <i class="el-icon-caret-bottom"></i>
                            </div>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="item in allState">
                                    <a
                                        @click="onChangeState(item)"
                                        style="display: block; width: 100%; height: 100%;"
                                    >{{item}}</a>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>

                    <template slot-scope="scope">
                        <div style="font-size: 14px; display: flex; align-items: center;">
                            <span v-if="scope.row.isOnline === 1" style="color: #000;">已上线</span>
                            <span v-if="scope.row.isOnline === 0" style="color: #bfbfbf;">未上线</span>
                            <el-popover
                                placement="top"
                                width="200"
                                trigger="hover"
                                content="此合约链上存在异常"
                            >
                                <i
                                    v-if="!scope.row.isAuth"
                                    slot="reference"
                                    class="el-icon-warning"
                                    style="font-size: 20px; color: #ffc210; margin-left: 8px;"
                                ></i>
                            </el-popover>
                        </div>

                    </template>
                </el-table-column>
                <el-table-column
                    prop="operation"
                    label="操作"
                >

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
                                        @click="goToEditPage(scope.row.presentableId)"
                                        style="display: block; width: 100%; height: 100%; color: #333;"
                                    >编辑</a>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <a
                                        style="display: block; width: 100%; height: 100%; color: #333;"
                                    >置顶</a>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <a
                                        @click="onLineAndOffLine(scope.row)"
                                        style="display: block; width: 100%; height: 100%;"
                                    >
                                        <span v-if="scope.row.isOnline === 0" style="color: #44a0ff;">上线</span>
                                        <span v-if="scope.row.isOnline === 1" style="color: #ee4040;">下线</span>
                                    </a>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>

            <div style="padding: 10px 0; display: flex; justify-content: flex-end;">
                <!--                @current-change="onCurrentPageChange"-->
                <!--                @size-change="onPageSizeChange"-->
                <el-pagination
                    :current-page="currentPage"
                    :page-size="pageSize"
                    @current-change="onChangeCurrentPage"
                    @size-change="onChangePageSize"
                    :page-sizes="[10, 20, 30, 40, 50]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalQuantity"
                >
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import manager from './index.js';

    export default manager;
</script>

<style lang="less">
    .node-manager {

        .text-overflow-ellipsis {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }


        .el-table--border td:first-child .cell, .el-table--border th:first-child .cell, .el-table .cell, .el-table th div {
            padding-left: 0;
        }

        .cell {
            color: #666;
        }

        .table-policies {
            & > a {
                display: none;
            }

            &:hover {
                & > a {
                    display: flex;
                }
            }

        }
    }

</style>
