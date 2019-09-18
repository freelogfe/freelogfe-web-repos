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

            <!--            :value="popoverShow"-->
            <!--            @show="popoverShow = true"-->
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
                                v-model="inputVersion"
                                placeholder="输入semver版本范围"
                                style="display: block;"
                            ></el-input>
                        </div>
                    </div>
                    <div style="height: 10px;"></div>
                    <div
                        style="align-items: center; display: flex; flex-direction: row-reverse; width: 100%;"
                    >
                        <el-button
                            type="primary"
                            size="mini"
                            style="font-size: 12px;"
                            @click="onDataChange"
                        >确定
                        </el-button>
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
            },
            state: {
                type: Object,
                default() {
                    return {
                        customer: false,
                        selectedVersion: this.versions[0],
                        inputVersion: '',
                    };
                }
            }
        },
        data() {
            return {
                popoverShow: false,
                customer: this.state ? this.state.customer : false,
                selectedVersion: this.state ? this.state.selectedVersion : this.versions[0],
                inputVersion: this.state ? this.state.inputVersion : '',
            };
        },
        mounted() {
        },
        methods: {
            onDataChange() {
                this.popoverShow = false;
                this.$emit('onDataChange', {
                    name: this.title,
                    customer: this.customer,
                    selectedVersion: this.selectedVersion,
                    inputVersion: this.inputVersion,
                });
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
