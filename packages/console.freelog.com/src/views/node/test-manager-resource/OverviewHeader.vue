<template>
    <div
        class="overview-header"
        style="padding: 20px; display: flex; box-sizing: border-box; box-shadow:0 3px 8px 0 rgba(0,0,0,0.2); border-radius:10px;">
        <img
            :src="previewSrc || undefined"
            class="resource-default-preview"
            style="width: 88px; height: 66px; flex-shrink: 0"
        />

        <div
            style="display: flex; flex-shrink: 1; width: 100%; flex-direction: column; justify-content: space-between; box-sizing: border-box; padding-left: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <a

                    target="_blank"
                    :href="type==='release' ? `/release/detail/${theID}?version=${version}`: `/mock/update/${theID}`"
                    style="align-items: center; display: flex;"
                >
                    <span style="font-size: 18px; color: #222; line-height: 1;">{{title}}</span>
                    <label
                        v-if="type==='release'"
                        style="background-color: #72bb1f; font-size: 12px; font-weight: 600; color: #fff; text-align: center; line-height: 18px; padding: 0 8px; margin-left: 5px; border-radius: 2px; display: inline-block;">发行</label>
                    <label
                        v-if="type==='mock'"
                        style="background-color: #f5a623; font-size: 12px; font-weight: 600; color: #fff; text-align: center; line-height: 18px; padding: 0 8px; margin-left: 5px; border-radius: 2px; display: inline-block;">mock</label>
                </a>
                <div style="font-size: 12px; color: #999;">
                    <span>类型 {{resourceType}}</span>
                    <span v-if="!!datetime"> | 签约时间 {{datetime}}</span>
                    <span v-if="!!version"> | 最新版本 {{version}}</span>
                </div>
            </div>
            <div style="font-size: 12px; color: #333;">
                {{content}}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'OverviewHeader',
        props: {
            theID: String,
            previewSrc: String,
            title: String,
            type: String,
            resourceType: String,
            datetime: String,
            version: {
                type: String,
                default: '',
            },
            content: String,
        },
    }
</script>

<style scoped lang="less">
    .overview-header {
        a:hover {
            text-decoration: underline;
        }
    }
</style>
