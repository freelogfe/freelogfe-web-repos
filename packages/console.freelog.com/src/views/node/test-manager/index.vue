<template>
    <div
        class="test-management"
        :style="styleObject"
    >

        <div class="test-management__aside">

            <NodeHeader
                :nodeName="nodeInfo.name"
                :nodeHref="nodeInfo.testOrigin"
                :isTestNode="true"
                :enterNode="`/node/manager/${$route.params.nodeId}`"
                btnText="进入正式节点"
            />

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
