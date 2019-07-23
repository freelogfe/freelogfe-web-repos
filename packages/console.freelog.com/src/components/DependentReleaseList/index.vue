<template>
    <div>
        <div
            v-if="!isLock"
            style="padding-left: 20px; height: 60px; align-items: center; display: flex;"
        >
            <el-button
                size="small"
                icon="el-icon-plus"
                circle
                @click="showDepDialog"
            ></el-button>
            <span style="padding-left: 10px; font-size: 14px; color: #333;">添加依赖</span>
        </div>
        <div v-else style="height: 10px;"></div>

        <Item
            :isLock="isLock"
            :name="'策略1'"
            :isOnline="true"
            @onRemove="onRemove()"
        />
        <!--        <Item :isLock="false" :name="'策略2'" :isOnline="true" @onRemove="onRemove(1)"/>-->
        <!--        <Item :isLock="false" :name="'策略3'" :isOnline="false" @onRemove="onRemove(2)"/>-->


        <DepDialog/>
    </div>
</template>

<script>
    export {default} from './index.js';
</script>

<style scoped>

</style>
