<template>
    <div class="mock-list__buckets" style="display: flex;flex-direction: column; justify-content: space-between;">
        <div>
            <div style="height: 80px;"></div>

            <!-- buckets 标题 -->
            <div class="mock-list__buckets__title">
                <div class="mock-list__buckets__title__content">
                    <div>
                        <span>Bucket{{$t('mock.list')}}</span>
                        <span style="padding-left: 10px;">{{(buckets || []).length}}/5</span>
                    </div>
                    <el-button
                        v-if="(buckets || []).length < 5"
                        icon="el-icon-plus"
                        circle
                        size="small"
                        @click="$emit('addBucket')"
                    />
                </div>
                <div style="height: 10px;"></div>
            </div>

            <!-- buckets 列表 -->
            <div class="mock-list__buckets__list">
                <a
                    href="javascript:"
                    v-for="(bucket, index) in (buckets || [])"
                    :key="bucket.bucketId"
                    class="mock-list__buckets__list__item"
                    :class="{'mock-list__buckets__list__item_active': $route.query.activatedBucketName === bucket.bucketName}"
                    @click="$emit('onChangeActive',bucket)"
                >{{bucket.bucketName}}</a>
            </div>

            <div style="height: 60px;"></div>

            <!-- 系统空间 标题 -->
            <div class="mock-list__buckets__title">
                <div class="mock-list__buckets__title__content">
                    <div>
                        <span>系统存储空间</span>
                    </div>
                </div>
                <div style="height: 10px;"></div>
            </div>

            <!-- buckets 列表 -->
            <div class="mock-list__buckets__list">
                <a
                    @click="$emit('showNodeData')"
                    href="javascript:"
                    class="mock-list__buckets__list__item"
                    :class="{'mock-list__buckets__list__item_active': !!$route.query.nodeData}"
                >.Nodedata</a>
            </div>
        </div>

        <div style="padding-left: 40px;">
            <el-progress
                :percentage="38"
                :show-text="false"
                style="width: 200px;"
            />
            <div style="height: 5px;"/>
            <span>{{Math.floor(12342343 / 1073741824 * 100) / 100}}GB/2GB</span>
            <div style="height: 50px;"/>
        </div>
    </div>

</template>

<script>
    export default {
        name: "Navs",

        props: {
            buckets: {
                type: Array,
                default: [],
            },
        },

    }
</script>

<style scoped lang="less">
    .mock-list__buckets {
        width: 280px;
        flex-shrink: 0;
        background-color: #fff;
        box-shadow:1px 0 0 0 rgba(229,229,229,1);
        border-right: 1px solid #E5E5E5;

        .mock-list__buckets__title {
            /*border-bottom: 1px solid #ebebeb;*/

            .mock-list__buckets__title__content {
                box-sizing: border-box;
                display: flex;
                width: 100%;
                padding: 0 30px 0 40px;
                align-items: center;
                justify-content: space-between;
                font-size: 14px;
                color: #666;
            }
        }

        .mock-list__buckets__list__item {
            line-height: 54px;
            padding-left: 40px;
            font-size: 14px;
            display: block;
            /*border-bottom: 1px solid #ebebeb;*/
            border-left: 3px solid transparent;
            cursor: pointer;
            color: #333333;

            &.mock-list__buckets__list__item_active {
                color: #409eff;
                border-left-color: #409eff;
                background-color: #fff;
            }
        }
    }
</style>
