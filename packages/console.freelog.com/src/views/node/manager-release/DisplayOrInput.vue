<template>
    <div v-if="!isEdit" style="display: flex; align-items: center; height: 40px;">
        <div style="font-size: 16px; color: #333; font-weight: 600; padding-right: 20px;line-height: 1;">
            {{value}}
        </div>
        <el-button
            type="text"
            icon="el-icon-edit"
            style="color: #333; font-size: 20px;"
            @click="switchEdit(true)"
        ></el-button>
    </div>
    <div v-else>
        <el-input
            v-model="inputValue"
            style="width: 400px;"
            placeholder="请输入内容"
        ></el-input>

        <el-button
            size="mini"
            type="primary"
            round
            style="margin-left: 10px;"
            @click="confirmChange"
        >保存
        </el-button>
        <el-button
            size="mini"
            round
            @click="switchEdit(false)"
        >取消
        </el-button>
    </div>
</template>

<script>
    export default {
        name: 'DisplayOrInput',
        model: {
            prop: 'value',
            event: 'onChange'
        },
        props: {
            value: {
                type: String,
                default: '',
            },
            // onChange: {
            //     type: Function,
            //     default: function (value) {
            //
            //     },
            // }
        },
        data() {
            return {
                isEdit: false,
                inputValue: this.value,
            };
        },
        methods: {
            /**
             * 切换编辑和非编辑模式
             * @param bool
             */
            switchEdit(bool) {
                this.isEdit = bool;
                if (bool) {
                    this.inputValue = this.value;
                }
            },
            /**
             * 点击确定按钮
             */
            confirmChange() {
                this.$emit('onChange', this.inputValue);
                this.isEdit = false;
            },
        },
    }
</script>

<style scoped>

</style>
