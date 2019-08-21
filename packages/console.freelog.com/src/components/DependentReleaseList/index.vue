<template>
    <div style="background-color: #fff;">
        <div
            v-if="!isLock"
            style="padding: 15px 20px;"
        >
            <div style="align-items: center; display: flex;">
                <el-button
                    size="small"
                    icon="el-icon-plus"
                    circle
                    @click="dialogVisible = true"
                ></el-button>
                <span style="padding-left: 10px; font-size: 14px; color: #333;">{{$t('addDependencies')}}</span>
            </div>

            <div v-if="dataSource.length > 0" style="height: 10px;"></div>
            <Item
                v-for="(i, j) in dataSource"
                :isLock="isLock"
                :name="i.name"
                :isOnline="i.isOnline"
                @onRemove="onRemove(j)"
            />
            <div v-show="mockDataSource && mockDataSource.length > 0 && dataSource && dataSource.length > 0"
                 style="height: 10px;"></div>
            <div
                v-show="mockDataSource && mockDataSource.length > 0"
                style="font-size: 13px; color: #888; padding-left: 25px;"
            >{{$t('mockDependency')}}
            </div>
            <Item
                v-for="(i, j) in mockDataSource"
                :name="i.name"
                @onRemove="onRemoveMock(j)"
            />
        </div>


        <!--        <Item :isLock="false" :name="'策略2'" :isOnline="true" @onRemove="onRemove(1)"/>-->
        <!--        <Item :isLock="false" :name="'策略3'" :isOnline="false" @onRemove="onRemove(2)"/>-->
        <DepDialog
            v-if="dialogVisible"
            :showMock="!!mockDataSource"
            :exists="exists"
            :existMocks="existMocks"
            @addARelease="addARelease"
            @addAMock="addAMock"
            @removeARelease="removeARelease"
            @removeAMock="removeAMock"
            @onClose="dialogVisible = false"
            :currentID="currentID"
        />
    </div>
</template>

<script>
    export {default} from './index.js';
</script>

<style scoped>

</style>
