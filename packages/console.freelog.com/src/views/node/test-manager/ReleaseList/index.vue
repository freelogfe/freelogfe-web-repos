<template>
    <div class="release-list">
        <div style="height: 40px;"></div>

        <div class="release-list__header">

            <AddAndReplace
                @success="pushRuleSuccess"
                :matchTestResult="matchTestResult"
            />

            <el-input
                class="release-list__header__input"
                v-model="filterSearch"
            >
                <i slot="prefix" class="el-input__icon el-icon-search"/>
                <i
                    style="cursor: pointer"
                    @click="filterSearch = ''"
                    v-show="filterSearch.length !== 0"
                    slot="suffix"
                    class="el-input__icon el-icon-circle-close"
                />
            </el-input>
        </div>

        <div style="height: 70px;"></div>

        <div
            v-if="tableData && tableData.length === 0"
            style="display: flex; height: 400px; justify-content: center; align-items: center; color: #999; font-size: 22px;">
            <div>{{$t('node.noAddedResources')}}</div>
        </div>

        <el-table
            v-else
            :empty-text="tableData === null ? $t('node.loading') + '...' : ''"
            :data="tableData"
            class="release-list__table"
        >
            <el-table-column
                prop="rules"
                :label="$t('node.rule')"
                min-width="12%"
            >
                <template slot-scope="scope">
                    <!--                     width="670"-->
                    <el-popover
                        v-if="scope.row.textRule"
                        placement="top-start"
                        trigger="hover"
                    >
                        <RulesBar slot="reference" :rules="scope.row.icons"/>
                        <rule-text :textRule="scope.row.textRule"/>
                    </el-popover>
                    <RulesBar v-else :rules="scope.row.icons"/>
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                :label="$t('node.source') + '|' + $t('node.testPresentable') + '|' + $t('node.displayVersion')"
                min-width="25%"
            >
                <template slot-scope="scope">
                    <div
                        class="text-overflow-ellipsis release-list__table__name"
                    >
                        <label
                            class="release-list__table__name--presentable"
                            v-if="!!scope.row.nodePresentableId"
                        >{{$t('node.node')}}</label>
                        <template v-else>
                            <label
                                class="release-list__table__name--mock"
                                v-if="scope.row.originInfo.type === 'mock'"
                            >mock</label>
                            <label
                                class="release-list__table__name--release"
                                v-if="scope.row.originInfo.type === 'release'"
                            >{{$t('node.table.publish')}}</label>
                        </template>
                        <span>{{scope.row.testResourceName}}</span>
                    </div>
                    <div v-if="scope.row.originInfo.type !== 'mock'" style="padding-left: 50px;">
                        <!--                        {{scope.row.originInfo.version}}-->
                        <el-select
                            :placeholder="$t('node.pleaseSelect')"
                            :value="scope.row.originInfo.version"
                            style="width: 110px; transform: scale(.714); transform-origin: 0;"
                            size="mini"
                            @change="$event => onVersionChange($event, scope.row)"
                        >
                            <el-option
                                v-for="i in [...scope.row.originInfo.versions].reverse()"
                                :key="i"
                                :label="i"
                                :value="i">
                            </el-option>
                        </el-select>
                    </div>

                </template>
            </el-table-column>
            <el-table-column
                prop="entries"
                :label="$t('node.testResources')"
                min-width="30%"
            >
                <template slot-scope="scope">
                    <a
                        @click="goToOrigin(scope.row.originInfo)"
                        class="release-list__table__entries"
                    >
                        <div
                            class="resource-default-preview release-list__table__entries__preview"
                        >
                            <img
                                v-if="scope.row.previewImages.length > 0"
                                :src="scope.row.previewImages[0]"
                                class="resource-default-preview"
                                alt=""
                            />
                        </div>
                        <div class="release-list__table__entries__info">
                            <div class="text-overflow-ellipsis">
                                {{scope.row.originInfo.name}}
                            </div>
                            <div>
                                {{scope.row.originInfo.versions[scope.row.originInfo.versions.length - 1]}}
                            </div>
                        </div>
                    </a>
                </template>
            </el-table-column>

            <el-table-column
                prop="type"
                min-width="12%"
            >
                <template slot="header" slot-scope="scope">
                    <!--                    trigger="click"-->
                    <el-dropdown
                        @command="onChangeType"
                        class="release-list__table__type__dropdown"
                    >
                        <div class="release-list__table__type__dropdown__text">
                            {{selectedType}} <i class="el-icon-caret-bottom"/>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                v-for="item in allTypes"
                                :command="item"
                            >
                                {{item}}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>

                </template>

                <template slot-scope="scope">
                    <div class="release-list__table__type__text">
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
                        @command="onChangeState"
                        style="height: 32px; padding-left: 0;"
                    >
                        <div style="padding-left: 0; cursor: pointer;">
                            {{selectedState}} <i class="el-icon-caret-bottom"/>
                        </div>
                        <el-dropdown-menu trigger="click" slot="dropdown">
                            <el-dropdown-item
                                v-for="item in allState"
                                :command="item"
                            >
                                {{item}}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>

                <template slot-scope="scope">
                    <div class="release-list__table__status">
                        <span
                            class="release-list__table__status--online"
                            v-if="scope.row.differenceInfo.onlineStatusInfo.isOnline === 1"
                        >{{$t('node.online')}}</span>
                        <span
                            class="release-list__table__status--downline"
                            v-if="scope.row.differenceInfo.onlineStatusInfo.isOnline === 0"
                        >{{$t('node.noOnline')}}</span>

                        <template v-if="scope.row.resolveReleaseSignStatus === 2">
                            <el-popover
                                placement="top"
                                width="150"
                                trigger="hover"
                            >
                                <div style="display: flex; align-items: center; justify-content: space-between;">
                                    <span>{{$t('node.notYetAuthorization')}}</span>
                                    <el-button @click="operationCommand($t('node.action.edit'), scope.row)" type="text">
                                        {{$t('node.detail')}}
                                    </el-button>
                                </div>
                                <!-- operationCommand('编辑', scope.row)   -->
                                <i
                                    slot="reference"
                                    class="el-icon-warning"
                                    style="font-size: 20px; color: #ffc210; margin-left: 8px;"
                                />
                            </el-popover>
                        </template>
                    </div>

                </template>
            </el-table-column>
            <el-table-column
                prop="operation"
                min-width="5%"
                :label="$t('node.table.operation')"
            >
                <template slot-scope="scope">
                    <el-dropdown @command="$event => operationCommand($event, scope.row)">

                        <el-button
                            icon="el-icon-more"
                            type="small"
                            circle
                            class="release-list__table__operation"
                        />

                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item :command="$t('node.action.edit')">
                                {{$t('node.action.edit')}}
                            </el-dropdown-item>
                            <el-dropdown-item :command="'isOnline'">
                                <span
                                    v-if="scope.row.differenceInfo.onlineStatusInfo.isOnline === 0"
                                    style="color: #44a0ff;">{{$t('node.action.online')}}</span>
                                <span
                                    v-if="scope.row.differenceInfo.onlineStatusInfo.isOnline === 1"
                                    style="color: #ee4040;">{{$t('node.action.downline')}}</span>
                                <!--                                </a>-->
                            </el-dropdown-item>
                            <el-dropdown-item
                                :command="'delete'"
                                v-if="matchTestResult.testRules.find(i => i.presentableName === scope.row.testResourceName)"
                            >
                                <span style="color: #ee4040;">{{$t('node.delete')}}</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
        <!--            v-if="totalQuantity > pageSize"-->
        <div
            class="release-list__table__pagination"
            v-if="totalQuantity > 10"
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
            />
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

<style lang="less">
    .release-list {
        .release-list__table {
            .el-input--mini {
                font-size: 16px;
            }
        }

    }

</style>
