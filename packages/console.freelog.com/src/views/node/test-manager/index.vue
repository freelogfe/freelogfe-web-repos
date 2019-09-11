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
                        backgroundColor: selectedTab === 'ReleaseList' ? '#fff':'transparent',
                        borderRight: selectedTab === 'ReleaseList' ? '3px solid #409eff': 'none',
                        color: selectedTab === 'ReleaseList' ? '#409eff': '#333',
                    }"
                    @click="selectedTab = 'ReleaseList'"
                    style="line-height: 54px; display: block; padding-left: 60px; font-size: 14px; font-weight: 600; border-bottom: 1px solid #ebebeb;">节点发行列表</a>
                <a
                    :style="{
                        backgroundColor: selectedTab === 'StylePage' ? '#fff':'transparent',
                        borderRight: selectedTab === 'StylePage' ? '3px solid #409eff': 'none',
                        color: selectedTab === 'StylePage' ? '#409eff': '#333',
                    }"
                    @click="selectedTab = 'StylePage'"
                    style="line-height: 54px; display: block; padding-left: 60px; font-size: 14px; font-weight: 600; border-bottom: 1px solid #ebebeb;">节点页面样式</a>

                <a
                    :style="{
                        backgroundColor: selectedTab === 'MappingRules' ? '#fff':'transparent',
                        borderRight: selectedTab === 'MappingRules' ? '3px solid #409eff': 'none',
                        color: selectedTab === 'MappingRules' ? '#409eff': '#333',
                    }"
                    @click="selectedTab = 'MappingRules'"
                    style="line-height: 54px; display: block; padding-left: 60px; font-size: 14px; font-weight: 600; border-bottom: 1px solid #ebebeb;">映射规则管理</a>
            </div>

        </div>

        <div style="width: 100%; flex-shrink: 1; background-color: #fff; padding: 0 60px;">
            <ReleaseList v-if="selectedTab === 'ReleaseList'"/>
            <StylePage v-if="selectedTab === 'StylePage'"/>
            <MappingRules v-if="selectedTab === 'MappingRules'"/>
        </div>
    </div>
</template>

<script>
    import Index from './index';

    export default Index;
</script>

<style scoped>

</style>
