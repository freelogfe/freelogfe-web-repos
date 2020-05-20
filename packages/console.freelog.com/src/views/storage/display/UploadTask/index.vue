<template>
    <div
        style="width: 600px; background-color: #fff; position: fixed; bottom: 24px; right: 24px; box-shadow:0 5px 10px 0 rgba(0,0,0,0.2); border-radius:4px 4px 0 0;">
        <div style="height: 50px; display: flex; justify-content: space-between; align-items: center;padding: 0 20px;">
            <span style="font-size: 14px; color: #222;">任务列表</span>
            <div style="width: 40px; display: flex; align-items: center; justify-content: space-between;">
                <a><i class="el-icon-minus" style="font-size: 14px; color: #979797;"/></a>
                <a><i class="el-icon-close" style="font-size: 14px; color: #979797;"/></a>
            </div>
        </div>

        <div style="padding: 0 30px; border-top: 1px solid #E5E5E5;">
            <div
                style="height: 63px; border-bottom: 1px solid #E5E5E5; align-items: center; display: flex; justify-content: space-between;">
                <div style="width: 310px; flex-shrink: 0; flex-grow: 0">
                    <div style="font-size: 14px; color: #222;">这里是文件名称</div>
                    <div style="font-size: 12px; color: #222;">5 M</div>
                </div>
                <div
                    style="width: 200px; flex-shrink: 0; flex-grow: 0; display: flex; align-items: center;">
                    <!--                    <span style="font-size: 14px; color: #222;">已完成</span>-->
<!--                    <template>-->
<!--                        <span style="font-size: 14px; color: #222; padding-right: 10px;">45%</span>-->
<!--                        <el-progress-->
<!--                            style="width: 100px;"-->
<!--                            :percentage="50"-->
<!--                            :show-text="false"-->
<!--                        />-->
<!--                    </template>-->
                    <span style="color: #EE4040; font-size: 14px;">上传失败</span>
                </div>
                <div style="width: 20px; flex-shrink: 0; flex-grow: 0">
                    <a><i class="el-icon-close" style="font-size: 16px; color: #333;"/></a>
                </div>
            </div>

            <div style="padding: 15px 0 0; display: flex; flex-direction: row-reverse; align-items: center;">
                <div style="font-size: 14px; color: #222;">
                    <a style="line-height: 20px; width: 20px; text-align: center; display: inline-block;">1</a>
                    <a style="line-height: 20px; width: 20px; text-align: center; display: inline-block;">2</a>
                </div>
                <span style="color: #222222; font-size: 14px; padding-bottom: 2px; padding-right: 10px;">共7条</span>
            </div>
            <div style="height: 15px;"/>
        </div>


    </div>
</template>

<script>
    export default {
        name: "UploadTask"
    }
</script>

<style scoped>

</style>
