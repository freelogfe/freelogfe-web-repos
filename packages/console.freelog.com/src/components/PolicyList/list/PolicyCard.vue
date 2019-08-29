<i18n src="../policyList.json"></i18n>
<template>
    <!--        v-for="(policy, index) in formatedPolicyList"-->
    <div
        class="p-l-item"
    >
        <div class="p-l-item-head">
            <div
                class="p-l-status p-l-s-top"
                v-show="false"
            >
                <i class="el-icon-download"></i>
                {{$t('status[0]')}}
            </div>
            <div class="p-l-status p-l-s-disabled" v-show="policy.status == 0">
                <i class="el-icon-error"></i>
                {{$t('status[1]')}}
            </div>
            <div class="p-l-status p-l-s-active" v-show="policy.status == 1">
                <i class="el-icon-success"></i>
                {{$t('status[2]')}}
            </div>
        </div>

        <div
            class="p-l-card"
            style="transition: width 2s, height 2s;"
            :style="{width: (show ? 800: 230) + 'px', height: (show ? 185: 300) + px}"
        >
            <h5>{{policy.policyName}}</h5>
            <pre
                v-if="policy.policyId"
                class="policy-text"
                v-html="policy.policyText"
            ></pre>
        </div>

        <el-dropdown
            size="small"
            @command="handleCommand"
        >

            <span class="el-dropdown-link"><i class="el-icon-more"></i></span>

            <el-dropdown-menu
                slot="dropdown"
            >
                <el-dropdown-item
                    v-if="policy.status == 0"
                    :command="1"
                >{{$t('enableBtnText')}}
                </el-dropdown-item>
                <el-dropdown-item
                    v-if="policy.status == 1"
                    :command="0"
                >{{$t('disableBtnText')}}
                </el-dropdown-item>
                <!--<el-dropdown-item :command="index + '-' + 2">置顶</el-dropdown-item>-->
            </el-dropdown-menu>
        </el-dropdown>

        <!-- 放大按钮 -->
        <i
            class="p-l-expand-btn el-icon-rank"
            @click="expandPolicyHandler"
        ></i>
    </div>
</template>

<script>
    export default {
        name: 'Item',
        props: {
            show: {
                type: Boolean,
                default: false,
            },
            policy: {
                type: Object,
                status: 0,
                policyName: '',
                policyId: '',
                policyText: '',
            },
            handleCommand: {
                type: Function,
                default: function () {

                },
            },
            expandPolicyHandler: {
                type: Function,
                default: function () {

                },
            },
        },
    }
</script>

<style scoped>
    /*.policy-card {*/
    /*    transition: width 2s, height 2s;*/
    /*}*/
</style>
