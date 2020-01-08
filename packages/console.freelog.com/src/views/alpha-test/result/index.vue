<template>
    <div :style="style"
         style="display: flex; align-items: center; justify-content: center;"
    >
        <div
            style="width: 600px; text-align: center;"
            v-if="status === 0"
        >
            <i class="freelog fl-icon-shenhe" style="font-size: 75px; color: #f39700; line-height: 1;"/>
            <div style="height: 30px;"/>
            <div style="font-weight: 600; font-size: 18px; color: #333;">内测申请审核中</div>
            <div style="height: 30px;"/>
            <div style="font-weight: 600; font-size: 14px; color: #333;">
                我们会尽快审核您的申请，审核结果会通过您的注册邮箱或者<br/>
                手机号发送给你，敬请留意
            </div>
            <div style="height: 40px;"/>
<!--            <el-button-->
<!--                type="primary"-->
<!--                style="width: 100px; border-radius: 2px;"-->
<!--                @click="submit"-->
<!--            >知道了-->
<!--            </el-button>-->
<!--            <div style="height: 20px;"/>-->
            <router-link
                to="/alpha-test/input"
                style="color: #dca32d; font-size: 12px;"
            >我有验证码
            </router-link>
        </div>

        <div
            style="margin: 0 auto; width: 600px; text-align: center;"
            v-if="status === 2"
        >
            <i class="freelog fl-icon-shenqingshibai" style="font-size: 75px; color: #e74c50; line-height: 1;"/>
            <div style="height: 30px;"/>
            <div style="font-weight: 600; font-size: 18px; color: #333;">内测申请失败</div>
            <div style="height: 30px;"/>
            <div v-if="false" style="font-weight: 600; font-size: 14px; color: #333;">
                经审核，您需要重新提交您常用的创作平台或社区的个人主页网址。<br/>
                “[链接]”无法打开。
            </div>
            <div v-if="false" style="font-weight: 600; font-size: 14px; color: #333;">
                经审核，您需要重新提交您的微信公众号ID。<br/>
                “[公众号ID]”不存在。
            </div>
            <div v-if="true" style="font-weight: 600; font-size: 14px; color: #333;">
                经审核，您需要重新提交申请信息。
            </div>
            <div style="height: 20px;"/>
            <div style="font-size: 14px; color: #666;">这里是违规问题描述这里是违规问题描述这里是违规问题描述这里是违规问题描述这里是违规问题描述这里是违规问题描述这里是</div>
            <div style="height: 30px;"/>
            <el-button
                type="primary"
                style="width: 100px; border-radius: 2px;"
                @click="submit"
            >重新提交
            </el-button>
            <div style="height: 20px;"/>
            <router-link
                to="/alpha-test/input"
                style="color: #dca32d; font-size: 12px;"
            >我有验证码
            </router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'index',
        data() {
            return {
                style: {
                    height: (window.innerHeight - 160) + 'px',
                },
                status: -1,
            }
        },
        mounted() {
            this.getApplyRecords();
        },
        methods: {
            async getApplyRecords() {
                const authInfoText = document.cookie.split('; ').find(i => i.startsWith('authInfo='));
                // console.log(authInfoText, 'authInfoText');
                if (!authInfoText) {
                    return;
                }
                const authInfo = JSON.parse(Buffer.from(authInfoText.replace('authInfo=').split('.')[1], 'base64').toString());
                // console.log(authInfo, 'authInfoauthInfo');
                const {data} = await this.$axios.get('/v1/testQualifications/beta/applyRecords', {
                    params: {page: 1, pageSize: 1, userId: authInfo.userId},
                });

                if (data.ret !== 0 || data.errcode) {
                    return this.$message.error(data.msg);
                }

                const dataList = data.data.dataList;
                if (dataList.length === 0) {
                    return this.$router.replace('/alpha-test/input');
                }

                this.status = dataList[0].status;
            }
        },
    }
</script>

<style scoped>

</style>
