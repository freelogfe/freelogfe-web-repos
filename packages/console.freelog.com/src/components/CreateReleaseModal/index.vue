<template>
    <div class="create-release-modal">
        <div class="box">
            <div class="header">
                <div class="title">
                    <div/>
                    <div>创建发行</div>
                    <a style="cursor: pointer;" @click="$emit('close')">
                        <i style="font-size: 12px; color: #333;" class="el-icon-close"></i>
                    </a>
                </div>

                <template v-if="!noDate">
                    <div style="height: 30px;"/>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <el-input
                            v-model="input"
                            placeholder="请输入内容"
                            size="small"
                            style="width: 240px;"
                        >
                            <i
                                class="el-input__icon el-icon-search"
                                slot="prefix"
                            />
                        </el-input>
                        <a
                            class="create-new"
                            @click="$emit('createNew')"
                        >创建新发行</a>
                    </div>
                    <div style="height: 20px;"/>
                </template>
            </div>

            <div class="body">

                <div
                    v-if="noDate"
                    style="text-align: center;"
                >
                    <div style="height: 140px;"/>
                    <div style="font-size: 20px; color: #222;">第一次发行资源？</div>
                    <div style="height: 30px;"/>
                    <div style="color: #666; font-size: 14px;">资源可以作为一个全新发行的首个版本发行，也可以作为现有发行的更新版本发行。</div>
                    <div style="height: 40px;"/>
                    <a
                        class="create-first"
                        @click="$emit('createNew')"
                    >创建我的第一个发行</a>
                </div>

                <LazyLoadingBox
                    v-if="!noDate"
                    :end="isEnd"
                    @toBottom="loadingMore"
                    :endText="(dataList || []).length !== 0 ? '' : '无搜索结果'"
                >
                    <div v-for="data in dataList" class="release">
                        <div>
                            <div
                                style="color: #222; font-weight: 600; font-size: 14px; display: flex; align-items: center;">
                                <span>{{data.releaseName.replace(data.username + '/', '')}}</span>
                                <label
                                    style="background-color: #FFAB00; color: #fff; font-size: 12px; line-height: 20px; border-radius: 10px; padding: 0 8px; margin-left: 10px;"
                                    v-if="disabledReleaseIDs.includes(data.releaseId)"
                                >历史发行</label>
                            </div>
                            <div style="height: 5px;"/>
                            <div style="font-size: 12px; color: #999;">{{data.resourceType | pageBuildFilter}} |
                                {{data.updateDate.split('T')[0]}}
                            </div>
                        </div>
                        <AddButton
                            :disabled="disabledReleaseIDs.includes(data.releaseId)"
                            @click="$emit('addRelease', data)"
                        />
                    </div>
                </LazyLoadingBox>

                <!--                <div-->
                <!--                    style="line-height: 300px; font-size: 16px; color: #333; text-align: center;"-->
                <!--                    v-if="totalItem === 0"-->
                <!--                >您还没有对应的发行-->
                <!--                </div>-->
            </div>
        </div>
    </div>
</template>

<script>
    import AddButton from "./AddButton";
    import LazyLoadingBox from "@/components/LazyLoadingBox/index.vue";

    export default {
        name: "index",
        components: {
            AddButton,
            LazyLoadingBox,
        },
        props: {
            // filter 的资源类型
            showType: {
                type: String,
                default: 'json',
            },
            // 需要指定禁用的release
            disabledReleaseIDs: {
                type: Array,
                default() {
                    return [];
                }
            },
        },
        data() {
            return {
                input: '',
                page: 1,
                dataList: [],
                isEnd: false,
                noDate: false,
                totalItem: -1,
            };
        },
        mounted() {
            document.body.style.overflowY = 'hidden';
            this.loadData();
        },
        beforeDestroy() {
            document.body.style.overflowY = 'inherit';
        },
        methods: {
            async loadData() {
                const params = {
                    page: this.page,
                    pageSize: 10,
                    isSelf: 1,
                    resourceType: this.showType,
                    keywords: encodeURIComponent(this.input),
                };
                const {data} = await this.$axios.get('/v1/releases', {
                    params,
                });
                // console.log(data, 'responseresponse');
                if (data.ret !== 0 || data.errcode !== 0) {
                    return this.$message.error(data.msg);
                }

                this.dataList = [
                    ...this.dataList,
                    ...data.data.dataList,
                ];
                this.noDate = data.data.totalItem === 0 && this.input === '';
                this.isEnd = this.page * 10 >= data.data.totalItem;
            },
            loadingMore() {
                this.page += 1;
                this.loadData();
            },
        },
        watch: {
            input() {
                this.page = 1;
                this.dataList = [];
                this.loadData();
            }
        }
    }
</script>

<style scoped lang="less">
    .create-release-modal {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(0, 0, 0, .5);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;

        .box {
            width: 640px;
            height: 680px;
            background-color: #fff;
            box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.4);
            border-radius: 6px;
            padding: 20px 30px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .header {
                flex-shrink: 0;

                .title {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 16px;
                    color: #222;
                    font-weight: 600;
                }

                .create-new {
                    background-color: #2784ff;
                    line-height: 32px;
                    border-radius: 4px;
                    text-align: center;
                    width: 100px;
                    color: #fff;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;

                    &:hover {
                        background: #529DFF;
                    }
                }
            }


            .body {

                flex-shrink: 1;
                height: 100%;
                overflow: hidden;

                .create-first {
                    line-height: 50px;
                    padding: 0 30px;
                    background-color: #2784FF;
                    color: #fff;
                    display: inline-block;
                    border-radius: 4px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;

                    &:hover {
                        background-color: #529DFF;
                    }
                }

                .release {
                    padding: 12px 0;
                    align-items: center;
                    display: flex;
                    justify-content: space-between;
                    border-bottom: 1px solid #EBECF0;
                }
            }
        }
    }


</style>
