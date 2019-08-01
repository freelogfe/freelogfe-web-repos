<template>
    <div style="background-color: #fff;">
        <div
            v-if="!isLock"
            style="padding-left: 20px; height: 60px; align-items: center; display: flex;"
        >
            <el-button
                size="small"
                icon="el-icon-plus"
                circle
                @click="dialogVisible = true"
            ></el-button>
            <span style="padding-left: 10px; font-size: 14px; color: #333;">添加依赖</span>
        </div>
        <div v-else style="height: 10px;"></div>

        <Item
            v-for="(i, j) in dataSource"
            :isLock="isLock"
            :name="i.name"
            :isOnline="i.isOnline"
            @onRemove="onRemove(j)"
        />
        <Item
            v-for="(i, j) in mockDataSource"
            :name="i.name"
            @onRemove="onRemoveMock(j)"
        />
        <!--        <Item :isLock="false" :name="'策略2'" :isOnline="true" @onRemove="onRemove(1)"/>-->
        <!--        <Item :isLock="false" :name="'策略3'" :isOnline="false" @onRemove="onRemove(2)"/>-->
        <DepDialog
            v-if="dialogVisible"
            :showMock="!!mockDataSource"
            :exists="exists"
            :existMocks="existMocks"
            @addARelease="addARelease"
            @addAMock="addAMock"
            @onClose="dialogVisible = false"
        />
    </div>
</template>

<script>
    export {default} from './index.js';
</script>

<style scoped>

</style>
