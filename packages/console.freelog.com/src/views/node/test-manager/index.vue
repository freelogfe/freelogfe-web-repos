<template>
    <div
        class="test-management"
        :style="styleObject"
    >

        <div class="test-management__aside">
            <div class="test-management__aside__url">
                <div>
                    <div class="test-management__aside__url__name">
                        <label>T</label>
                        <span>{{nodeInfo.name}}</span>
                    </div>

                    <div style="height: 10px;"></div>

                    <div class="test-management__aside__url__link">
                        <a
                            target="_blank"
                            :href="'//' + nodeInfo.testOrigin"
                            class="test-management__aside__url__link__a"
                            style="font-size: 14px; color: #333; text-decoration: underline; margin-right: 5px;"
                        >{{nodeInfo.testOrigin}}</a>
                        <clipboard
                            :value="nodeInfo.testOrigin"
                            style="display: inline-block;"
                            @copyDone="$message.success($t('复制成功'))"
                        >
                            <el-button
                                type="primary"
                                plain
                                size="mini"
                                class="test-management__aside__url__link__button"
                            >copy
                            </el-button>
                        </clipboard>
                    </div>

                    <div style="height: 25px;"></div>

                    <a
                        target="_blank"
                        :href="'//' + nodeInfo.origin"
                        class="test-management__aside__url__origin-link"
                    >进入正式节点</a>

                    <div style="height: 25px;"></div>

                </div>
            </div>

            <div class="test-management__aside__nav">
                <a
                    :class="{'test-management__aside__nav--active': selectedTab === 'ReleaseList' }"
                    @click="selectedTab = 'ReleaseList'"
                >节点发行列表</a>
                <a
                    :class="{'test-management__aside__nav--active': selectedTab === 'StylePage' }"
                    @click="selectedTab = 'StylePage'"
                >节点页面样式</a>

                <a
                    :class="{'test-management__aside__nav--active': selectedTab === 'MappingRules' }"
                    @click="selectedTab = 'MappingRules'"
                >映射规则管理</a>
            </div>

        </div>

        <div class="test-management__main">
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

<style scoped lang="less">
    @import "index";
</style>
