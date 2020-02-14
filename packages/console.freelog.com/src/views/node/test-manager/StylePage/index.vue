<template>
    <div class="style-page">
        <div style="height: 40px;"></div>

        <div class="style-page__header">

            <AddAndReplace
                @success="pushRuleSuccess"
                :matchTestResult="matchTestResult"
            />

            <el-input
                class="style-page__header__input"
                v-model="filterSearch"
            >
                <i slot="prefix" class="el-input__icon el-icon-search"/>
                <i
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
            <div>{{$t('node.haveNotSetTheme')}}</div>
        </div>

        <el-table
            v-else
            :data="tableData"
            :empty-text="tableData === null ? $t('node.loading') + '...' : ''"
            class="style-page__table"
        >
            <el-table-column
                prop="rules"
                :label="$t('node.rule')"
                min-width="12%"
            >
                <template slot-scope="scope">
                    <el-popover
                        v-if="scope.row.textRule"
                        placement="right"
                        width="670"
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
                :label="$t('node.testPresentable') + ' | ' +  $t('node.displayVersion')"
                min-width="25%"
            >
                <template slot-scope="scope">
                    <div
                        class="text-overflow-ellipsis style-page__table__name"
                    >
                        <label
                            class="style-page__table__name__mock"
                            v-if="scope.row.originInfo.type === 'mock'"
                        >mock</label>
                        <label
                            class="style-page__table__name__release"
                            v-if="scope.row.originInfo.type === 'release'"
                        >{{$t('node.table.publish')}}</label>
                        <label
                            style="width: 40px; display: inline-block;"
                            v-if="scope.row.originInfo.type === 'presentable'"
                        >
                            <div style="border-top: 1px solid #b5b5b5; width: 16px;"></div>
                        </label>
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
                    <a @click="goToOrigin(scope.row.originInfo)" class="style-page__table__entries">
                        <div
                            class="resource-default-preview style-page__table__entries__img"
                        >
                            <img
                                v-if="scope.row.previewImages.length > 0"
                                :src="scope.row.previewImages[0]"
                                class="resource-default-preview"
                                alt=""
                            />
                        </div>
                        <div class="style-page__table__entries__info">
                            <div class="text-overflow-ellipsis">{{scope.row.originInfo.name}}</div>
                            <div>{{scope.row.originInfo.version}}</div>
                        </div>
                    </a>
                </template>
            </el-table-column>

            <el-table-column
                prop="type"
                :label="$t('node.table.type')"
                min-width="12%"
            >
                <template slot-scope="scope">
                    <div class="style-page__table__type">
                        {{scope.row.resourceType | pageBuildFilter}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="status"
                min-width="12%"
            >
                <template slot="header" slot-scope="scope">
                    <!--                     trigger="click"-->
                    <el-dropdown
                        @command="onChangeState"
                        style="height: 32px; padding-left: 0;"
                    >
                        <div style="padding-left: 0; cursor: pointer;">
                            {{selectedState}} <i class="el-icon-caret-bottom"/>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                :command="item"
                                v-for="item in allState"
                            >
                                {{item}}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>

                <template slot-scope="scope">
                    <div class="style-page__table__status">
                        <span v-if="scope.row.testResourceId === activatedThemeId"
                              style="color: #000;">{{$t('node.activated')}}</span>
                        <span v-if="scope.row.testResourceId !== activatedThemeId"
                              style="color: #bfbfbf;">{{$t('node.inactive')}}</span>

                        <template v-if="scope.row.resolveReleaseSignStatus === 2">
                            <el-popover
                                placement="top"
                                width="100"
                                trigger="hover"
                            >
                                <div style="display: flex; align-items: center; justify-content: space-between;">
                                    <span>{{$t('node.notYetAuthorization')}}</span>
                                    <el-button @click="operationCommand($t('node.action.edit'), scope.row)" type="text">
                                        {{$t('node.detail')}}
                                    </el-button>
                                </div>
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
                :label="$t('node.table.operation')"
                min-width="5%"
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
                            <el-dropdown-item :command="'edit'">
                                {{$t('node.action.edit')}}
                            </el-dropdown-item>
                            <el-dropdown-item
                                :command="scope.row.testResourceId !== activatedThemeId ? 'isOnline' : ''"
                            >
                                <div
                                    v-if="scope.row.testResourceId !== activatedThemeId"
                                    style="color: #44a0ff;"
                                >{{$t('node.active')}}
                                </div>
                                <div
                                    v-if="scope.row.testResourceId === activatedThemeId"
                                    style="color: #bfbfbf;"
                                >{{$t('node.activated')}}
                                </div>
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
        <div
            class="style-page__pagination"
            v-if="totalQuantity > 10"
        >
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

<style lang="less">
    .style-page {
        .style-page__table {
            .el-input--mini {
                font-size: 16px;
            }
        }

    }

</style>
