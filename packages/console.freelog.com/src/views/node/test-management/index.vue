<template>
    <div
        class="test-management"
        style="display: flex;"
        :style="styleObject"
    >

        <div style="width: 280px; background-color: #fafbfb; flex-shrink: 0;">
            <div style="padding: 25px 20px;">
                <div>
                    <div style="display: flex; align-items: center;">
                        <label
                            style="line-height: 20px; width: 20px; text-align: center; background-color: #e9e9e9; border-radius: 2px;"
                        >T</label>
                        <span style="color: #333; font-size: 20px; font-weight: 600; padding-left: 8px;">测试节点1</span>
                    </div>

                    <div style="height: 10px;"></div>

                    <div style="display: flex; align-items: center;">
                        <a
                            target="_blank"
                            href="test1.freelog.com"
                            style="font-size: 14px; color: #333; text-decoration: underline; margin-right: 5px;"
                        >test1.freelog.com</a>
                        <clipboard
                            :value="'test1.freelog.com'"
                            style="display: inline-block;"
                            @copyDone="$message.success($t('copySuccess'))"
                        >
                            <el-button style="padding: 3px 6px;" type="primary" plain size="mini">copy</el-button>
                        </clipboard>
                    </div>

                    <div style="height: 25px;"></div>

                    <a style="display: block; line-height: 30px; font-size: 12px; color: #999; text-align: center; background-color: #fafbfb; border-radius: 4px; border: 1px solid #d8d8d8;">进入正式节点</a>

                    <div style="height: 25px;"></div>

                </div>
            </div>

            <div style="border-top: 1px solid #ebebeb; cursor: pointer;">
                <a
                    :style="{
                        backgroundColor: !isPageStyle ? '#fff':'transparent',
                        borderRight: !isPageStyle ? '3px solid #409eff': 'none',
                        color: !isPageStyle ? '#409eff': '#333',
                    }"
                    style="line-height: 54px; display: block; padding-left: 60px; font-size: 14px; font-weight: 600; border-bottom: 1px solid #ebebeb;">节点发行列表</a>
                <a
                    :style="{
                        backgroundColor: isPageStyle ? '#fff':'transparent',
                        borderRight: isPageStyle ? '3px solid #409eff': 'none',
                        color: isPageStyle ? '#409eff': '#333',
                    }"
                    style="line-height: 54px; display: block; padding-left: 60px; font-size: 14px; font-weight: 600; border-bottom: 1px solid #ebebeb;">节点页面样式</a>

                <a
                    :style="{
                        backgroundColor: isPageStyle ? '#fff':'transparent',
                        borderRight: isPageStyle ? '3px solid #409eff': 'none',
                        color: isPageStyle ? '#409eff': '#333',
                    }"
                    style="line-height: 54px; display: block; padding-left: 60px; font-size: 14px; font-weight: 600; border-bottom: 1px solid #ebebeb;">映射规则管理</a>
            </div>


        </div>

        <div style="width: 100%; flex-shrink: 1; background-color: #fff; padding: 0 60px;">
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
    </div>
</template>

<script>
    import Index from './index';
    export default Index;
    // import clipboard from '@/components/clipboard/index.vue';
    //
    // export default {
    //     name: 'test-management',
    //     components: {
    //         clipboard,
    //     },
    //     data() {
    //         return {
    //             styleObject: {
    //                 minHeight: (window.innerHeight - 60) + 'px',
    //             },
    //             tableData: [
    //                 {
    //                     date: '2016-05-02',
    //                     name: '王小虎',
    //                     address: '上海市普陀区金沙江路 1518 弄'
    //                 },
    //                 {
    //                     date: '2016-05-04',
    //                     name: '王小虎',
    //                     address: '上海市普陀区金沙江路 1517 弄'
    //                 },
    //                 {
    //                     date: '2016-05-01',
    //                     name: '王小虎',
    //                     address: '上海市普陀区金沙江路 1519 弄'
    //                 },
    //                 {
    //                     date: '2016-05-03',
    //                     name: '王小虎',
    //                     address: '上海市普陀区金沙江路 1516 弄'
    //                 }
    //             ],
    //         };
    //     },
    // }
</script>

<style scoped>

</style>
