<template>
    <div
        style="background-color: #fafbfb; border: 1px solid #ccc; border-radius: 4px; overflow: hidden;"
    >
        <div style="padding: 0 15px; border-bottom: 1px solid #d8d8d8;">
            <div style="height: 14px;"></div>
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center;">
                    <span style="font-size: 16px; color: #333; font-weight: 600; padding-right: 20px;">{{name}}</span>
                    <span
                        style="color: #39c500; padding: 0 9px; line-height: 18px; border: 1px solid #39c500; border-radius: 10px; font-size: 14px;"><span
                        v-if="status === 2">执行中</span><span v-if="status === 4">激活态</span></span>
                </div>
                <el-dropdown>
                    <el-button size="mini" style="opacity: 1">
                        启用<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>启用</el-dropdown-item>
                        <el-dropdown-item>禁用</el-dropdown-item>
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
            }
        },
        components: {
            ContractDetail,
        }
    }
</script>

<style scoped>

</style>
