<template>
    <div
        style="background-color: #fafbfb; border: 1px solid #ccc; border-radius: 4px; overflow: hidden;"
    >
        <!--        :style="{opacity: disabled ? .5: 1}"-->
        <div style="padding: 0 15px; border-bottom: 1px solid #d8d8d8;">
            <div style="height: 14px;"></div>
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center;">
                    <span style="font-size: 16px; color: #333; font-weight: 600; padding-right: 20px;">{{name}}</span>
                    <span v-if="status === 2" style="color: #fbb726; padding: 0 9px; line-height: 18px; border: 1px solid #fbb726; border-radius: 10px; font-size: 14px;">待执行</span>
                    <span v-if="status === 4" style="color: #39c500; padding: 0 9px; line-height: 18px; border: 1px solid #39c500; border-radius: 10px; font-size: 14px;">生效中</span>
                    <span v-if="status === 6" style="color: #e35a5f; padding: 0 9px; line-height: 18px; border: 1px solid #e35a5f; border-radius: 10px; font-size: 14px;">合约终止</span>
                </div>
                <el-dropdown @command="$emit('command')">
                    <el-button size="mini" style="opacity: 1">
                        {{disabled ? '搁置' : '应用'}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>{{disabled ? '应用' : '搁置'}}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div style="height: 15px"></div>
            <div
                style="font-size: 12px; color: #999;">
                <span style="padding-right: 50px;">合约ID：{{contractId}}</span>
                <span>签约时间：{{data}}</span>
            </div>
            <div style="height: 14px;"></div>
        </div>
        <div style="margin: 0 30px;">
            <!--                                    @update-contract="updateContractAfterEvent"-->
            <div style="height: 20px;"></div>
            <ContractDetail
                class="contract-policy-content"
                :contract.sync="contract"
                :policyText="contract.contractClause.policyText"
            ></ContractDetail>
            <div style="height: 30px;"></div>
        </div>
    </div>
</template>

<script>
    import {ContractDetail} from '@freelog/freelog-ui-contract';

    export default {
        name: "SignedContract",
        props: {
            name: {
                type: String,
                default: '',
            },
            status: {
                type: Number,
                default: 4,
            },
            contractId: {
                type: String,
                default: '',
            },
            data: {
                type: String,
                default: '',
            },
            contract: {
                type: Object,
                default() {
                    return {};
                }
            },
            disabled: {
                type: Boolean,
                default: false,
            }
        },
        components: {
            ContractDetail,
        }
    }
</script>

<style scoped>

</style>
