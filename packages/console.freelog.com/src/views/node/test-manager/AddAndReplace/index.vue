<template>
    <div>
        <a
            style="color: #333; font-size: 14px; padding: 10px; cursor: pointer;"
            @click="dialogVisible = true"
        >
            <i class="el-icon-plus" style="font-size: 16px; font-weight: 600;"></i>
            <span style="vertical-align: center;">添加测试资源</span>
        </a>

        <a style="color: #333; font-size: 14px; padding: 10px; cursor: pointer;">
            <i class="el-icon-refresh" style="font-size: 16px; font-weight: 600;"></i>
            <span style="vertical-align: center;">资源替换</span>
        </a>

        <DepDialog
            v-if="dialogVisible"
            :showMock="true"
            :exists="[]"
            :existMocks="[]"
            @addARelease="addARelease"
            @addAMock="addAMock"
            @removeARelease="removeARelease"
            @removeAMock="removeAMock"
            @onClose="dialogVisible = false"
            :currentID="''"
        />
    </div>
</template>

<script>
    import DepDialog from '@/components/DependentReleaseList/DepDialog/index.vue'

    export default {
        name: "index",
        components: {
            DepDialog,
        },
        data() {
            return {
                dialogVisible: false,
            };
        },
        methods: {
            addARelease() {

            },
            addAMock() {

            },
            removeARelease() {

            },
            removeAMock() {

            }
        }
    }
</script>

<style scoped>

</style>
