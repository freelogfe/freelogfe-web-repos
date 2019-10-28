<template>
    <div class="aside__url">
        <div>
            <div class="aside__url__name">
                <label v-if="isTestNode">T</label>
                <span>{{nodeName}}</span>
            </div>

            <div style="height: 10px;"></div>

            <div class="aside__url__link">
                <a
                    target="_blank"
                    :href="'//' + nodeHref"
                    class="aside__url__link__a"
                    style="font-size: 14px; color: #333; text-decoration: underline; margin-right: 5px;"
                >{{nodeHref}}</a>
                <clipboard
                    :value="nodeHref"
                    style="display: inline-block;"
                    @copyDone="$message.success($t('复制成功'))"
                >
                    <el-button
                        type="primary"
                        plain
                        size="mini"
                        class="aside__url__link__button"
                    >copy
                    </el-button>
                </clipboard>
            </div>

            <div style="height: 25px;"></div>

            <a
                target="_blank"
                :href="enterNode"
                class="aside__url__origin-link"
            >{{btnText}}</a>

            <div style="height: 25px;"></div>

        </div>
    </div>
</template>

<script>
    import clipboard from '@/components/clipboard/index.vue';

    export default {
        name: "NodeHeader",
        components: {
            clipboard,
        },
        props: {
            nodeName: String,
            nodeHref: String,
            isTestNode: {
                type: Boolean,
                default: false,
            },
            enterNode: String,
            btnText: String,
        }
    }
</script>

<style scoped lang="less">
    .aside__url {
        padding: 25px 20px;

        .aside__url__name {
            display: flex;
            align-items: center;

            label {
                line-height: 20px;
                width: 20px;
                text-align: center;
                background-color: #e9e9e9;
                border-radius: 2px;
            }

            span {
                color: #333;
                font-size: 20px;
                font-weight: 600;
                padding-left: 8px;
            }
        }

        .aside__url__link {
            display: flex;
            align-items: center;

            .aside__url__link__a {
                font-size: 14px;
                color: #333;
                text-decoration: underline;
                margin-right: 5px;
            }

            .aside__url__link__button {
                padding: 3px 6px;
            }
        }

        .aside__url__origin-link {
            display: block;
            line-height: 30px;
            font-size: 12px;
            color: #999;
            text-align: center;
            background-color: #fafbfb;
            border-radius: 4px;
            border: 1px solid #d8d8d8;

            &:hover {
                background-color: #409eff;
                border: 1px solid #409eff;
                color: #fff;
            }

            &:active {
                background-color: #378fea;
                border: 1px solid #378fea;
                color: #fff;
            }
        }
    }
</style>
