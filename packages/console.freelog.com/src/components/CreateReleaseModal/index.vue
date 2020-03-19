<template>
    <div class="create-release-modal">
        <div class="box">
            <div class="header">
                <div class="title">
                    <div></div>
                    <div>创建发行</div>
                    <a style="cursor: pointer;">
                        <i style="font-size: 12px; color: #333;" class="el-icon-close"></i>
                    </a>
                </div>

                <div style="height: 30px;"/>
                <div style="display: flex; justify-content: flex-end;">
                    <a class="create-new">创建新发行</a>
                </div>
                <div style="height: 20px;"/>
            </div>

            <div class="body">
<!--                :end="dataEnd"-->
<!--                :endText="(data && data.length === 0) ? $t('noConditions') : ''"-->
<!--                @toBottom="toBottom"-->
                <LazyLoadingBox
                    v-if="true"
                >
                    <div class="release">
                        <div>
                            <div style="color: #222; font-weight: 600; font-size: 14px;">我的发行1</div>
                            <div style="height: 5px;"/>
                            <div style="font-size: 12px; color: #999;">markdown | 2019-02-10</div>
                        </div>
                        <AddButton/>
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
