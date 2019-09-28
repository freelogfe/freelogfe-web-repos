<template>
    <div
        style="padding: 20px; display: flex; box-sizing: border-box; box-shadow:0 3px 8px 0 rgba(0,0,0,0.2); border-radius:10px;">
        <img
            class="resource-default-preview"
            style="width: 88px; height: 66px; flex-shrink: 0"
        />

        <div
            style="display: flex; flex-shrink: 1; width: 100%; flex-direction: column; justify-content: space-between; box-sizing: border-box; padding-left: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="align-items: center; display: flex;">
                    <span style="font-size: 18px; color: #222; line-height: 1;">数据库应用</span>
                    <label
                        style="background-color: #72bb1f; font-size: 12px; font-weight: 600; color: #fff; text-align: center; line-height: 18px; padding: 0 8px; margin-left: 5px; border-radius: 2px; display: inline-block;">发行</label>
                </div>
                <div style="font-size: 12px; color: #999;">
                    <span>类型 markdown</span>
                    <span> | 签约时间 2018-10-10 12:00</span>
                    <span> | 最新版本 v1.0.1</span>
                </div>
            </div>
            <div style="font-size: 12px; color: #333;">这是一段发行介绍…这是一段发行介绍…这是一段发行介绍…这是一段发行介绍…这是一段发行介绍…这是一段发行介绍…这是一段发行介绍…这是一段发行介绍…这是一段发行介绍…这是一段发行介绍…
                这是一段发行介绍……这是一段发行介绍……这是一段发行介绍……</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "OverviewHeader"
    }
</script>

<style scoped>

</style>
