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

                <div style="height: 30px;"/>
                <div style="display: flex; justify-content: flex-end;">
                    <a
                        class="create-new"
                        @click="$emit('createNew')"
                    >创建新发行</a>
                </div>
                <div style="height: 20px;"/>
            </div>

            <div class="body">

                <LazyLoadingBox
                    v-if="totalItem !== 0"
                    :end="isEnd"
                    @toBottom="loadingMore"
                >
                    <div v-for="data in dataList" class="release">
                        <div>
                            <div style="color: #222; font-weight: 600; font-size: 14px;">
                                {{data.releaseName.replace(data.username + '/', '')}}
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

                <div
                    style="line-height: 300px; font-size: 16px; color: #333; text-align: center;"
                    v-if="totalItem === 0"
                >您还没有对应的发行
                </div>
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
                page: 1,
                dataList: [],
                isEnd: false,
                totalItem: -1,
            };
        },
        mounted() {
            document.body.style.overflowY = 'hidden';
            this.loadData();
        },
        methods: {
            async loadData() {
                const params = {
                    page: this.page,
                    pageSize: 10,
                    isSelf: 1,
                    resourceType: this.showType
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
                this.totalItem = data.data.totalItem;
                this.isEnd = this.page * 10 >= data.data.totalItem;
            },
            loadingMore() {
                this.page += 1;
                this.loadData();
            },
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
