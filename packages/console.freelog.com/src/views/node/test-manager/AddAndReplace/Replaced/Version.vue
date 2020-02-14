<template>
    <el-popover
        placement="bottom-end"
        width="325"
        trigger="click"
        v-model="popoverShow"
    >
        <!--                            <el-button slot="reference">focus 激活</el-button>-->
        <a
            style="font-size: 12px; display: flex; align-items: center; cursor: pointer;"
            slot="reference"
        >
            <span>{{$t('node.versionRange')}}</span>
            <i class="el-icon-d-arrow-right" style="transform: rotate(90deg); font-size: 12px;"/>
        </a>

        <div style="width: 100%; overflow: hidden;">
            <div style="display: flex; align-items: center;">
                <Radio :selected="!custom" @click="custom = false"/>
                <span style="padding: 0 10px; font-size: 14px; color: #333;">{{$t('node.selectedVersion')}}</span>
                <el-select
                    v-model="selectedVersion"
                    :placeholder="$t('node.pleaseSelect')"
                    size="mini"
                    style="width: 100px;"
                    :disabled="custom"
                >
                    <el-option
                        :label="$t('node.allVersions')"
                        value="*"
                    />
                    <el-option
                        v-for="i in versions"
                        :label="i"
                        :value="i"
                    />
                </el-select>
            </div>

            <div style="height: 10px;"></div>
            <div>
                <div style="display: flex; align-items: center;">
                    <Radio :selected="custom" @click="custom = true"/>
                    <span style="padding: 0 10px; font-size: 14px; color: #333;">{{$t('node.customer')}}</span>
                </div>
                <div v-show="custom">
                    <div style="height: 5px;"></div>
                    <el-input
                        v-model="inputVersion"
                        :placeholder="$t('node.enterSemverVersionRange')"
                        style="display: block;"
                    />
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
                    @click="onchange"
                >{{$t('node.confirm')}}</el-button>
                <el-button
                    type="text"
                    size="mini"
                    style="font-size: 12px; padding: 0 20px; color: #999;"
                    @click="popoverShow = false"
                >{{$t('node.cancel')}}
                </el-button>
            </div>
        </div>
    </el-popover>
</template>

<script>

    import Radio from '../components/Radio.vue';

    export default {
        name: 'Version',
        components: {
            Radio,
        },
        props: {
            versions: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        data() {
            return {
                popoverShow: false,
                custom: false,
                selectedVersion: '*',
                inputVersion: '',
            }
        },
        methods: {
            onchange(){
                this.$emit('change', {
                    custom: this.custom,
                    selectedVersion: this.selectedVersion,
                    inputVersion: this.inputVersion,
                });
                this.popoverShow = false;
            }
        }
    }
</script>

<style scoped>

</style>
