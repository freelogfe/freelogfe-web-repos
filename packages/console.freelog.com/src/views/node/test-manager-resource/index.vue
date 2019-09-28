<template>
    <div style="width: 1190px; margin: 0 auto;">
        <div style="height: 30px;"></div>

        <OverviewHeader/>

        <ModuleBlock>
            <BlockItem label="状态">
                <div style="display: flex; align-items: center;">
                    <label style="font-size: 14px; color: #333; font-weight: 600; padding-right: 40px;">未上线</label>
                    <a style="display: inline-block; line-height: 28px; background-color: #409eff; color: #fff; width: 60px; text-align: center; border-radius: 14px; font-weight: 600; cursor: pointer;">上线</a>
                </div>
            </BlockItem>
            <BlockItem label="节点发行名称">
                <ConfirmInput
                    value="北极光"
                    @confirmChange="confirmChange"
                />
            </BlockItem>
            <BlockItem label="展示版本">
                <el-select
                    v-model="versionValue"
                    style="display: block; width: 700px; background-color: #fafbfb; font-weight: 600;"
                >
                    <el-option
                        v-for="item in versions"
                        :key="item"
                        :label="'v' + item"
                        :value="item">
                    </el-option>
                </el-select>
            </BlockItem>
            <BlockItem label="标签">
                <div style="height: 5px;"></div>
                <FreelogTags
                    actionText="新标签"
                    v-model="userDefinedTags"
                ></FreelogTags>
            </BlockItem>
        </ModuleBlock>

    </div>
</template>

<script>
    import OverviewHeader from './OverviewHeader';
    import ModuleBlock from './ModuleBlock';
    import BlockItem from './BlockItem';
    import ConfirmInput from './ConfirmInput';
    import FreelogTags from '@/components/Tags/index.vue';

    export default {
        name: 'index',
        components: {
            ConfirmInput,
            BlockItem,
            ModuleBlock,
            OverviewHeader,
            FreelogTags,
        },
        data() {
            return {
                versions: ['1.1.0', '1.0.2', '1.0.0'],
                versionValue: '1.1.0',
                userDefinedTags: [],
            };
        },
        methods: {
            confirmChange(value) {
                console.log(value, 'confirmChange');
            }
        }
    }
</script>

<style scoped>

</style>
