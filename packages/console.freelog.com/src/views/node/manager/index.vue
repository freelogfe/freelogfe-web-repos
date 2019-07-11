<template>
    <div class="node-manager" style="display: flex;">

        <div :style="styleObject" style="width: 280px; flex-shrink: 0; background-color: #fafbfb;">
            <div style="height: 30px;"></div>
            <div style="color: #333; font-size: 20px; font-weight: 600; padding: 0 20px;">照片节点1</div>
            <div style="height: 10px;"></div>
            <div style="padding: 0 20px;">
                <a
                    style="font-size: 14px; color: #333; text-decoration: underline; margin-right: 5px;"
                    href="//photos.freelog.com"
                >photos.freelog.com</a>
                <el-button style="padding: 3px 6px;" type="primary" plain size="mini">copy</el-button>
            </div>

            <div style="height: 79px;"></div>

            <div style="border-top: 1px solid #ebebeb;">
                <a style="line-height: 54px; color: #409eff; background-color: #fff; border-right: 3px solid #409eff; display: block; padding-left: 60px; font-size: 14px; font-weight: 600; border-bottom: 1px solid #ebebeb;">节点发行列表</a>
                <a style="line-height: 54px; color: #333; background-color: transparent; border-right: none; display: block; padding-left: 60px; font-size: 14px; font-weight: 600; border-bottom: 1px solid #ebebeb;">节点页面样式</a>
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
                    placeholder="请选择日期"
                    v-model="filterSearch"
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
                    <!--                    <template slot="header" slot-scope="scope">-->
                    <!--                        <span style="line-height: 40px;">发行</span>-->
                    <!--                    </template>-->
                    <template slot-scope="scope">
                        <div style="display: flex; align-items: center;">
                            <img
                                style="width: 40px; height: 30px;"
                                src="//static.testfreelog.com/console/public/img/resource.jpg"
                            />
                            <div style="padding-left: 10px;">
                                <div style="color: #000; font-size: 14px; font-weight: 600; line-height: 20px;">数据库应用
                                </div>
                                <div style="line-height: 17px; color: #999; font-size: 12px;">v1.0.1</div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="title"
                    label="发行标题"
                    width="180"
                >
                    <!--                    <template slot="header" slot-scope="scope">-->
                    <!--                        <span style="line-height: 40px;">发行标题</span>-->
                    <!--                    </template>-->
                    <template slot-scope="scope">
                        <div style="color: #000; font-size: 14px;">
                            发行标题xxx
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="type"
                    label="全部类型"
                >
                    <template slot="header" slot-scope="scope">
                        <el-dropdown style="height: 32px">
                            <div>
                                全部类型 <i class="el-icon-caret-bottom"></i>
                            </div>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>黄金糕</el-dropdown-item>
                                <el-dropdown-item>狮子头</el-dropdown-item>
                                <el-dropdown-item>螺蛳粉</el-dropdown-item>
                                <el-dropdown-item disabled>双皮奶</el-dropdown-item>
                                <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                    <template slot-scope="scope">
                        <div style="color: #000; font-size: 14px;">
                            image
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="policy"
                    label="策略"
                >
                    <!--                    <template slot="header" slot-scope="scope">-->
                    <!--                        <span style="line-height: 40px;">策略</span>-->
                    <!--                    </template>-->
                    <template slot-scope="scope">
                        <div>
                            <div style="color: #409eff; font-size: 14px;">收费策略1</div>
                            <div style="font-size: 12px;">等3个策略…</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="updateTime"
                    label="更新时间"
                >
                    <!--                    <template slot="header" slot-scope="scope">-->
                    <!--                        <div style="line-height: 40px;">更新时间</div>-->
                    <!--                    </template>-->
                    <template slot-scope="scope">
                        <div>
                            <div style="font-size: 14px; color: #000;">2019.04.14</div>
                            <div style="color: #bfbfbf; font-size: 12px;">加入时间 2019.04.14</div>
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
                                全部类型 <i class="el-icon-caret-bottom"></i>
                            </div>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>黄金糕</el-dropdown-item>
                                <el-dropdown-item>狮子头</el-dropdown-item>
                                <el-dropdown-item>螺蛳粉</el-dropdown-item>
                                <el-dropdown-item disabled>双皮奶</el-dropdown-item>
                                <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>

                    <template slot-scope="scope">
                        <div style="font-size: 14px; color: #000;">
                            已上线
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="operation"
                    label="操作"
                >
                    <!--                    <template slot="header" slot-scope="scope">-->
                    <!--                        <div style="line-height: 40px;">操作</div>-->
                    <!--                    </template>-->

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
                                    >编辑</a>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <a
                                        style="display: block; width: 100%; height: 100%; color: #333;"
                                    >置顶</a>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <a
                                        style="display: block; width: 100%; height: 100%; color: #44a0ff;"
                                    >上线</a>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <a
                                        style="color: #EE4040; display: block; width: 100%; height: 100%;"
                                    >下线</a>
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
                    :current-page="1"
                    :page-sizes="[10, 20, 30, 40, 50]"
                    :page-size="20"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="1000"
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
        /*.noborder-select {*/
        /*    .el-input__inner {*/
        /*        border: none;*/
        /*    }*/

        /*}*/

        .el-table--border td:first-child .cell, .el-table--border th:first-child .cell, .el-table .cell, .el-table th div {
            padding-left: 0;
        }

        .cell {
            color: #666;
        }
    }

</style>
