<template>
    <div class="create-release-modal">

        <div
            class="box"
            :style="{height: noDate ? '380px' : '680px'}"
            style="max-height: 90%;"
        >
            <div class="header">
                <div class="title">
                    <div/>
                    <div>{{$t('create_release')}}</div>
                    <a style="cursor: pointer;" @click="$emit('close')">
                        <i style="font-size: 12px; color: #333;" class="el-icon-close"/>
                    </a>
                </div>

                <template v-if="!noDate">
                    <div style="height: 30px;"/>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <el-input
                            v-model="input"
                            :placeholder="$t('search_release')"
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
                        >{{$t('create_new_release')}}</a>
                    </div>
                    <div style="height: 20px;"/>
                </template>
            </div>

            <div class="body">

                <div
                    v-if="noDate"
                    style="text-align: center;"
                >

                    <div style="height: 80px;"/>
                    <div style="color: #666; font-size: 14px; padding: 0 60px;">{{$t('create_release_popup_empty')}}
                    </div>
                    <div style="height: 40px;"/>
                    <a
                        class="create-first"
                        @click="$emit('createNew')"
                    >{{$t('create_my_first_release')}}</a>
                </div>

                <LazyLoadingBox
                    v-if="!noDate"
                    :end="isEnd"
                    @toBottom="loadingMore"
                >
                    <div style="padding: 0 40px;">
                        <div v-for="data in (dataList || [])" class="release">
                            <div>
                                <div
                                    style="color: #222; font-weight: 600; font-size: 14px; display: flex; align-items: center;">
                                    <span>{{data.releaseName.replace(data.username + '/', '')}}</span>
                                    <label
                                        style="background-color: #FFAB00; color: #fff; font-size: 12px; line-height: 20px; border-radius: 10px; padding: 0 8px; margin-left: 10px;"
                                        v-if="disabledReleaseIDs.includes(data.releaseId)"
                                    >{{$t('components.CreateReleaseModal.history')}}</label>
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
                    </div>
                </LazyLoadingBox>

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
                dataList: null,
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
                    ...(this.dataList || []),
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
            height: 380px;
            background-color: #fff;
            box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.4);
            border-radius: 6px;
            padding: 20px 0;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .header {
                flex-shrink: 0;
                padding: 0 40px;

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
                    /*min-width: 100px;*/
                    color: #fff;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    padding: 0 15px;

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
                    padding: 0 40px;
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
