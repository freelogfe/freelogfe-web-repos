<template>
    <div class="release-list">
        <div style="height: 40px;"></div>

        <div class="release-list__header">

            <AddAndReplace @success="pushRuleSuccess"/>

            <el-input
                class="release-list__header__input"
                v-model="filterSearch"
            >
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                <i
                    style="cursor: pointer"
                    @click="filterSearch = ''"
                    v-show="filterSearch.length !== 0"
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
                min-width="12%"
            >
                <template slot-scope="scope">
                    <div class="release-list__table__rule">
                        <i
                            v-for="i in scope.row.rules"
                            :class="getIconClass(i.operation)"
                        ></i>
                        <div v-if="scope.row.rules.length === 0"></div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="来源 | 测试资源名称"
                min-width="25%"
            >
                <template slot-scope="scope">
                    <div class="text-overflow-ellipsis release-list__table__name">
                        <label
                            class="release-list__table__name--mock"
                            v-if="scope.row.originInfo.type === 'mock'"
                        >mock</label>
                        <label
                            class="release-list__table__name--release"
                            v-if="scope.row.originInfo.type === 'release'"
                        >市场</label>
                        <label
                            class="release-list__table__name--presentable"
                            v-if="scope.row.originInfo.type === 'presentable'"
                        >
                            <div></div>
                        </label>
                        <span>{{scope.row.testResourceName}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="entries"
                label="相关条目 | 展示版本"
                min-width="30%"
            >
                <template slot-scope="scope">
                    <div style="display: flex; align-items: center; padding-left: 10px;">
                        <div
                            style="width: 40px; height: 30px; flex-shrink: 0;"
                            class="resource-default-preview"
                        >
                            <!--                            v-if="scope.row.releaseInfo.previewImages && scope.row.releaseInfo.previewImages.length > 0"
                                                            :src="scope.row.releaseInfo.previewImages[0]"-->
                            <img
                                :src="scope.row.previewImages[0]"
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
                min-width="12%"
            >
                <template slot="header" slot-scope="scope">
                    <!--                    trigger="click"-->
                    <el-dropdown
                        style="height: 32px; padding-left: 0;"
                    >
                        <div style="padding-left: 0; cursor: pointer;">
                            {{selectedType}} <i class="el-icon-caret-bottom"></i>
                        </div>
                        <el-dropdown-menu slot="dropdown">
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
                        {{scope.row.resourceType}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="status"
                min-width="12%"
            >
                <template slot="header" slot-scope="scope">
                    <el-dropdown
                        style="height: 32px; padding-left: 0;"
                    >
                        <div style="padding-left: 0; cursor: pointer;">
                            {{selectedState}} <i class="el-icon-caret-bottom"></i>
                        </div>
                        <el-dropdown-menu trigger="click" slot="dropdown">
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
                        <span v-if="scope.row.differenceInfo.onlineStatusInfo.isOnline === 1"
                              style="color: #000;">已上线</span>
                        <span v-if="scope.row.differenceInfo.onlineStatusInfo.isOnline === 0" style="color: #bfbfbf;">未上线</span>
                        <!--                            v-if="!scope.row.isAuth"-->
                        <!--                        <template>-->
                        <!--                            &lt;!&ndash;                                :content="$t('exceptionExists')"&ndash;&gt;-->
                        <!--                            <el-popover-->
                        <!--                                placement="top"-->
                        <!--                                width="100"-->
                        <!--                                trigger="hover"-->
                        <!--                                content="此合约链上存在异常"-->
                        <!--                            >-->
                        <!--                                <i-->
                        <!--                                    slot="reference"-->
                        <!--                                    class="el-icon-warning"-->
                        <!--                                    style="font-size: 20px; color: #ffc210; margin-left: 8px;"-->
                        <!--                                ></i>-->
                        <!--                            </el-popover>-->
                        <!--                        </template>-->
                    </div>

                </template>
            </el-table-column>
            <el-table-column
                prop="operation"
                min-width="5%"
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
                                    target="_blank"
                                    :href="'/node/test-manager-resource/' + scope.row.testResourceId"
                                    style="display: block; width: 100%; height: 100%; color: #333;"
                                >编辑</a>
                            </el-dropdown-item>
                            <!--                            <el-dropdown-item>-->
                            <!--                                <a-->
                            <!--                                    style="display: block; width: 100%; height: 100%; color: #333;"-->
                            <!--                                >上线</a>-->
                            <!--                            </el-dropdown-item>-->
                            <!--                            <el-dropdown-item>-->
                            <!--                                <a @click="upgradePresentable(scope.row)">{{$t('action.upgrade')}}</a>-->
                            <!--                            </el-dropdown-item>-->
                            <el-dropdown-item>
                                <a
                                    @click="onLineAndOffLine(scope.row)"
                                    style="display: block; width: 100%; height: 100%;"
                                >
                                    <span
                                        v-if="scope.row.differenceInfo.onlineStatusInfo.isOnline === 0"
                                        style="color: #44a0ff;">上线</span>
                                    <span
                                        v-if="scope.row.differenceInfo.onlineStatusInfo.isOnline === 1"
                                        style="color: #ee4040;">下线</span>
                                </a>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
        <!--            v-if="totalQuantity > pageSize"-->
        <div
            style="padding: 10px 0; display: flex; justify-content: flex-end;"
            v-if="totalQuantity !== 0"
        >
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
</template>

<script>
    import Index from './index';

    export default Index;

</script>

<style scoped lang="less">
    @import "index";
</style>
