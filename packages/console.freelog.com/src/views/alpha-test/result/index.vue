<template>
    <div style="padding-top: 180px;">
        <div style="margin: 0 auto; width: 600px; text-align: center;">
            <i class="freelog fl-icon-shenhe" style="font-size: 75px; color: #f39700;"/>
            <div style="font-weight: 600; font-size: 18px; color: #333;">内测申请审核中</div>
            <div style="font-weight: 600; font-size: 14px; color: #333;">
                我们会尽快审核您的申请，审核结果会通过您的注册邮箱或者<br/>
                手机号发送给你，敬请留意
            </div>
            <el-button
                type="primary"
                style="width: 100px; border-radius: 2px;"
                @click="submit"
            >知道了
            </el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index"
    }
</script>

<style scoped>

</style>
