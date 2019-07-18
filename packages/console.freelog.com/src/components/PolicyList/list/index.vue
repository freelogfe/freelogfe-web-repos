<template>
    <div class="policy-list">
        <div class="policy-list-wrapper">
            <div
                class="p-l-main-content clearfix"
                :class="{'no-overflow': formatedPolicyList.length < 4}"
            >
                <div
                    style="transition: all .3s; white-space: nowrap;"
                    :style="{ transform: `translateX(-${policyTranslateX}px)` }"
                >
                    <!--                    <Item-->
                    <!--                        v-for="(policy, index) in formatedPolicyList"-->
                    <!--                        :policy="policy"-->
                    <!--                        :handleCommand="handleCommand(index + '-' + $event)"-->
                    <!--                    ></Item>-->
                    <div
                        class="p-l-item"
                        v-for="(policy, index) in formatedPolicyList"
                    >
                        <div class="p-l-item-head">
                            <div class="p-l-status p-l-s-top" v-show="false">
                                <i class="el-icon-download"></i>
                                已置顶
                            </div>
                            <div class="p-l-status p-l-s-disabled" v-show="policy.status == 0">
                                <i class="el-icon-error"></i>
                                已停用
                            </div>
                            <div class="p-l-status p-l-s-active" v-show="policy.status == 1">
                                <i class="el-icon-success"></i>
                                已启用
                            </div>
                        </div>

                        <div class="p-l-card">
                            <h5>{{policy.policyName}}</h5>
                            <pre
                                v-if="policy.policyId"
                                class="policy-text"
                                v-html="policy.policyText"
                            ></pre>
                        </div>

                        <el-dropdown size="small" @command="handleCommand">

                            <span class="el-dropdown-link"><i class="el-icon-more"></i></span>

                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-if="policy.status == 0" :command="index + '-' + 1">启用
                                </el-dropdown-item>
                                <el-dropdown-item v-if="policy.status == 1" :command="index + '-' + 0">停用
                                </el-dropdown-item>
                                <!--<el-dropdown-item :command="index + '-' + 2">置顶</el-dropdown-item>-->
                            </el-dropdown-menu>
                        </el-dropdown>

                        <!-- 放大按钮 -->
                        <i
                            class="p-l-expand-btn el-icon-rank"
                            @click="expandPolicyHandler(index, $event)"
                        ></i>
                    </div>
                </div>
            </div>
            <template v-if="formatedPolicyList.length > 3">
                <i
                    class="p-l-left-btn el-icon-arrow-left"
                    :class="{ 'disabled': navActiveIndex === 0 }"
                    @click="tapPrevBtn"
                ></i>
                <i
                    class="p-l-right-btn el-icon-arrow-right"
                    :class="{ 'disabled': navActiveIndex === (navItems.length - 1) }"
                    @click="tapNextBtn"
                ></i>
            </template>

            <ul class="p-l-list-nav-bar" v-if="navItems.length > 1">
                <li
                    v-for="(item, index) in navItems"
                    :class="{'active': navActiveIndex === index}"
                    @click="exchangeNacActiveIndex(index)"
                ></li>
            </ul>
            <!--<div class="p-l-add-box" @click="addPolicy">-->
            <!--<span><i class="el-icon-circle-plus"></i>添加策略</span>-->
            <!--</div>-->
            <!--        <el-dialog-->
            <!--            :title="expandedPolicy.policyName"-->
            <!--            :visible.sync="isExpandPolicy"-->
            <!--            width="660px">-->
            <!--            <pre class="policy-text" v-if="expandedPolicy.policyId" v-html="expandedPolicy.policyText"></pre>-->
            <!--        </el-dialog>-->

        </div>

        <div v-if="isExpandPolicy"
             style="position: fixed; top: 0; right: 0; bottom: 0; left: 0; background-color: rgba(0,0,0,.5)"></div>
        <div
            v-if="isExpandPolicy"
            style="
            position: fixed;
            font-size: 14px;
            color: #333;
            background-color: #fff;
            transition: top 1s, width 1s , height 1s, left 1s;"
            :style="enlargedDisplayBox"
        >
            <!--            <PolicyCard-->
            <!--                :show="isExpandPolicy"-->
            <!--                :policy="formatedPolicyList[0]"-->
            <!--            ></PolicyCard>-->
            <div style="font-weight: 600; line-height: 35px; padding: 0 20px; display: flex; justify-content: space-between; align-items: center;">
                <span>{{formatedPolicyList[0].policyName}}</span>
                <i
                    class="el-icon-circle-close"
                    style="font-size: 16px;"
                    @click="isExpandPolicy = false"
                ></i>
            </div>
            <pre style="padding: 0 20px; white-space: pre-wrap;">{{formatedPolicyList[0].policyText}}</pre>
        </div>
    </div>

</template>

<script>
    import {beautifyPolicy} from '@freelog/freelog-policy-lang';
    import PolicyCard from './PolicyCard.vue';

    export default {
        name: 'policy-list',
        components: {
            PolicyCard,
        },
        props: {
            policyList: {
                type: Array,
                default() {
                    return []
                }
            }
        },
        data() {
            return {
                visibleCardCount: 3,
                cardActiveIndex: 0,
                navActiveIndex: 0,
                expandedPolicyIndex: 0,
                isExpandPolicy: false,

                enlargedDisplayBox: {
                    top: 0,
                    left: 0,
                    width: 0,
                    height: 0,
                },

            }
        },
        computed: {
            navItems() {
                var count = Math.ceil(this.formatedPolicyList.length / this.visibleCardCount)
                console.log(new Array(count).fill(1))
                return new Array(count).fill(1)
            },
            formatedPolicyList() {
                const policyList = this.policyList.filter(p => p.policyId).map(p => {
                    p.policyText = beautifyPolicy(p.policyText)
                    return p
                })
                return policyList
            },
            policyTranslateX() {
                // return this.cardActiveIndex < 3 ? 0 : (this.cardActiveIndex - 2) * 258
                return this.cardActiveIndex * 258
            },
            expandedPolicy() {
                return this.formatedPolicyList[this.expandedPolicyIndex]
            },
        },
        methods: {
            exchangeNacActiveIndex(index) {
                this.navActiveIndex = index
                this.cardActiveIndex = index * this.visibleCardCount
            },
            tapPrevBtn() {
                this.navActiveIndex = this.navActiveIndex - 1
                this.navActiveIndex = this.navActiveIndex < 0 ? 0 : this.navActiveIndex
                this.cardActiveIndex = this.navActiveIndex * this.visibleCardCount
            },
            tapNextBtn() {
                this.navActiveIndex = this.navActiveIndex + 1
                this.navActiveIndex = this.navActiveIndex === this.navItems.length ? this.navItems.length - 1 : this.navActiveIndex
                this.cardActiveIndex = this.navActiveIndex * this.visibleCardCount
            },
            addPolicy() {
                this.$emit('add-policy')
            },
            expandPolicyHandler(index, event) {
                // console.log(event.target.parentNode, 'eventeventevent');
                // console.log(event.target.parentNode.getBoundingClientRect(), 'eventeventevent');
                this.isExpandPolicy = true
                this.expandedPolicyIndex = index

                // console.log(event.target.parentNode.getBoundingClientRect(), 'event.target.parentNode.getBoundingClientRect()');
                const {top, width, height, left} = event.target.parentNode.getBoundingClientRect();
                this.enlargedDisplayBox = {
                    top: top + 'px',
                    width: width + 'px',
                    height: height + 'px',
                    left: left + 'px',
                };
                setTimeout(() => {
                    this.enlargedDisplayBox = {
                        top: (window.innerHeight / 2 - 300) + 'px',
                        left: (window.innerWidth / 2 - 200) + 'px',
                        width: 400 + 'px',
                        height: 600 + 'px',
                    };
                }, 30);
                // console.log(this.enlargedDisplayBox, 'enlargedDisplayBox');
            },
            handleCommand(command) {
                console.log(command, 'commandcommandcommand');
                let [policyIndex, status] = command.split('-')
                status = +status
                if (status === 0 || status === 1) {
                    this.updatePolicyStatus(this.policyList[policyIndex], status)
                }
            },
            // 更新策略的上下线状态，0：下线，1：上线
            updatePolicyStatus(policy, status) {
                this.$emit('update-policies', {
                    "policyName": policy.policyName,
                    "status": status,
                    "policyId": policy.policyId
                })
            },
        },
        created() {

        }
    }
</script>

<style
    lang="less"
    type="text/less"
>
    .policy-list {

        .policy-list-wrapper {
            position: relative;
        }

        .p-l-main-content {
            overflow: hidden;
            margin: 20px 80px;

            &.no-overflow {
                margin: 10px 0 20px 0;
            }
        }

        .p-l-add-box {
            margin-top: 15px;
            text-align: right;

            span {
                position: relative;
                cursor: pointer;
                margin-left: 30px;
                padding-left: 28px;
                padding-right: 12px;
                font-weight: bold;
                color: #333;
            }

            .el-icon-circle-plus {
                position: absolute;
                top: 50%;
                left: 0;
                z-index: 5;
                transform: translateY(-50%);
                font-size: 22px;
                font-weight: 600;
                color: #409EFF;
            }
        }

        .p-l-item {

            /*&:first-child {*/
            /*    background-color: gray;*/
            /*}*/

            overflow: hidden;
            position: relative;
            display: inline-block;
            margin-right: 20px;
            padding: 4px;

            .el-dropdown {
                position: absolute;
                top: 35px;
                right: 13px;
                z-index: 10;
                cursor: pointer;

                .el-icon-more {
                    padding: 4px;
                    border-radius: 50%;
                    font-size: 14px;
                    background-color: #F3F3F3;
                    color: #979797;
                }
            }

            .p-l-expand-btn {
                position: absolute;
                bottom: 10px;
                right: 13px;
                z-index: 10;
                cursor: pointer;
                padding: 4px;
                border-radius: 2px;
                font-size: 14px;
                background-color: #F3F3F3;
                color: #979797;
            }
        }

        .p-l-item-head {

            height: 26px;

            .p-l-status {
                display: inline-block;
                font-size: 14px;

                &.p-l-s-top {
                    color: #F5A623;
                }

                &.p-l-s-disabled {
                    color: #D8D8D8;
                }

                &.p-l-s-active {
                    color: #84CCA8;
                }
            }

            .el-icon-download {
                transform: rotate(180deg);
                font-size: 14px;
                font-weight: bold;
                color: #F5A623;
            }
        }

        .p-l-card {
            display: inline-block;
            box-sizing: border-box;
            width: 230px;
            height: 185px;
            padding: 9px;
            border-radius: 4px;
            box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);

            h5 {
                margin-bottom: 5px;
                font-size: 14px;
            }

            .policy-text {
                overflow: auto;
                white-space: pre-wrap;
                height: 143px;
                font-size: 14px;
            }
        }

        .p-l-left-btn, .p-l-right-btn {
            position: absolute;
            top: 100px;
            z-index: 10;
            font-size: 36px;
            cursor: pointer;

            &.disabled {
                cursor: not-allowed;
                color: #c3c3c3;
            }
        }

        .p-l-left-btn {
            left: 10px;
        }

        .p-l-right-btn {
            right: 10px;
        }

        .p-l-list-nav-bar {
            margin-top: 10px;
            text-align: center;
            cursor: pointer;

            li {
                display: inline-block;
                padding: 0;
                margin: 0 5px;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: #DBDBDB;

                &.active {
                    background-color: #409EFF;
                }
            }
        }
    }
</style>
