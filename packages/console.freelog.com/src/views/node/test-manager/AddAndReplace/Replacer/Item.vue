<template>
    <div style="padding: 5px 15px;">
        <div style="display: flex; align-items: center;">
            <Radio :selected="active" @click="onDataChange"/>
            <span
                style="padding-left: 10px; font-size: 14px; color: #333;"
                class="overflow">{{title}}</span>
        </div>
        <div
            style="padding-left: 25px; display: flex; align-items: center; justify-content: space-between;">
            <div style="font-size: 12px; color: #333;">{{type}} {{version ? '| v' + version: ''}} | {{date}}</div>

            <el-popover
                placement="bottom-end"
                width="325"
                trigger="click"
                v-model="popoverShow"
                v-if="active"
            >
                <!--                            <el-button slot="reference">focus 激活</el-button>-->
                <a
                    style="font-size: 12px; display: flex; align-items: center; cursor: pointer;"
                    slot="reference"
                >
                    <span>版本范围</span>
                    <i class="el-icon-d-arrow-right" style="transform: rotate(90deg); font-size: 12px;"></i>
                </a>

                <div style="width: 100%; overflow: hidden;">
                    <div style="display: flex; align-items: center;">
                        <Radio :selected="!customer" @click="customer=false"/>
                        <span style="padding: 0 10px; font-size: 14px; color: #333;">选定版本</span>
                        <el-select
                            @change="onDataChange"
                            placeholder="请选择"
                            size="mini"
                            style="width: 100px;"
                            v-model="selectedVersion"
                            :disabled="customer"
                        >
                            <el-option
                                v-for="v in versions"
                                :label="v"
                                :value="v"
                            ></el-option>
                        </el-select>
                    </div>
                    <div style="height: 10px;"></div>
                    <div>
                        <div style="display: flex; align-items: center;">
                            <Radio :selected="customer" @click="customer=true"/>
                            <span style="padding: 0 10px; font-size: 14px; color: #333;">自定义</span>
                        </div>
                        <div v-show="customer">
                            <div style="height: 5px;"></div>
                            <el-input
                                v-model="input"
                                placeholder="输入semver版本范围"
                                style="display: block;"
                            ></el-input>
                        </div>
                    </div>
                    <div style="height: 10px;"></div>
                    <div
                        style="align-items: center; display: flex; flex-direction: row-reverse; width: 100%;"
                    >
                        <el-button type="primary" size="mini" style="font-size: 12px;">确定</el-button>
                        <el-button
                            type="text"
                            size="mini"
                            style="font-size: 12px; padding: 0 20px; color: #999;"
                            @click="popoverShow = false"
                        >取消
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
        name: 'Item',
        components: {
            Radio,
        },
        props: {
            active: {
                type: Boolean,
                default: false,
            },
            title: String,
            type: String,
            version: String,
            date: String,
            versions: {
                type: Array,
                default() {
                    return []
                }
            }
        },
        data() {
            return {
                popoverShow: false,
                customer: false,
                selectedVersion: this.versions[0],
            };
        },
        mounted() {
        },
        methods: {
            onDataChange() {
                this.$emit('onDataChange', {name: this.title, selectedVersion: this.selectedVersion});
            }
        }
    }
</script>

<style scoped lang="less">
    .overflow {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

</style>
