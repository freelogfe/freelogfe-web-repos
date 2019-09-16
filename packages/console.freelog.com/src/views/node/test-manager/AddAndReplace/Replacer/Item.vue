<template>
    <div style="padding: 5px 15px;">
        <div style="display: flex; align-items: center;">
            <Radio :selected="true"/>
            <span style="padding-left: 10px; font-size: 14px; color: #333;">我的发行</span>
        </div>
        <div
            style="padding-left: 25px; display: flex; align-items: center; justify-content: space-between;">
            <div style="font-size: 12px; color: #333;">markdown | v1.0.1 | 2019-07-07</div>

            <el-popover
                placement="bottom-end"
                width="325"
                trigger="click"
            >
                <!--                            <el-button slot="reference">focus 激活</el-button>-->
                <a
                    style="font-size: 12px; display: flex; align-items: center;"
                    slot="reference"
                >
                    <span>版本范围</span>
                    <i class="el-icon-d-arrow-right" style="transform: rotate(90deg); font-size: 12px;"></i>
                </a>

                <div style="width: 100%; overflow: hidden;">
                    <div style="display: flex; align-items: center;">
                        <Radio :selected="true"/>
                        <span style="padding: 0 10px; font-size: 14px; color: #333;">选定版本</span>
                        <el-select
                            placeholder="请选择"
                            size="mini"
                            style="width: 100px;"
                        >
                            <el-option
                                :label="'黄金糕'"
                                :value="'选项1'"
                            ></el-option>
                        </el-select>
                    </div>
                    <div style="height: 10px;"></div>
                    <div>
                        <div style="display: flex; align-items: center;">
                            <Radio :selected="true"/>
                            <span style="padding: 0 10px; font-size: 14px; color: #333;">自定义</span>
                        </div>
                        <div style="height: 5px;"></div>
                        <el-input
                            v-model="input"
                            placeholder="输入semver版本范围"
                            style="display: block;"
                        ></el-input>
                    </div>
                    <div style="height: 10px;"></div>
                    <div
                        style="align-items: center; display: flex; flex-direction: row-reverse; width: 100%;"
                    >
                        <el-button type="primary" size="mini" style="font-size: 12px;">确定</el-button>
                        <el-button type="text" size="mini" style="font-size: 12px; padding: 0 20px; color: #999;">取消
                        </el-button>
                    </div>
                </div>
            </el-popover>

        </div>
    </div>
</template>

<script>

    import Radio from '../components/Radio.vue';

    export default {
        name: "Item",
        components: {
            Radio,
        },
    }
</script>

<style scoped>

</style>
