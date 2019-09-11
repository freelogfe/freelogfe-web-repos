<template>
    <div>
        <div style="height: 40px;"></div>

        <div style="display: flex; align-items: center;justify-content: space-between;">
            <div>
                <a style="color: #333; font-size: 14px; padding: 10px; cursor: pointer;">
                    <i class="el-icon-plus" style="font-size: 16px; font-weight: 600;"></i>
                    <span style="vertical-align: center;">添加测试资源</span>
                </a>

                <a style="color: #333; font-size: 14px; padding: 10px; cursor: pointer;">
                    <i class="el-icon-refresh" style="font-size: 16px; font-weight: 600;"></i>
                    <span style="vertical-align: center;">资源替换</span>
                </a>
            </div>

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
                prop="date"
                label="日期"
                width="180">
            </el-table-column>
            <el-table-column
                prop="name"
                label="姓名"
                width="180">
            </el-table-column>
            <el-table-column
                prop="address"
                label="地址">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: "index",
        data() {
            return {
                tableData: [
                    {
                        date: '2016-05-02',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    },
                    {
                        date: '2016-05-04',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1517 弄'
                    },
                    {
                        date: '2016-05-01',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1519 弄'
                    },
                    {
                        date: '2016-05-03',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1516 弄'
                    }
                ],
            };
        }
    }
</script>

<style scoped>

</style>
