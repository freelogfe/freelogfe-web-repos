<template>
    <div style="height: 40px; width: 700px;">
        <a
            v-show="!isEdit"
            @click="clickEdit"
            :style="{cursor: disabled? 'not-allowed': 'pointer'}"
            style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: space-between; background-color: #fafbfb; border-radius: 2px; padding: 0 15px; box-sizing: border-box; border: 1px solid #fafbfb;"
        >
            <span style="font-weight: 600; font-size: 14px; color: #333;">{{value}}</span>
            <i class="el-icon-edit" style="color: #888; font-size: 16px;"></i>
        </a>
        <div
            v-show="isEdit"
            style="width: 100%; height: 100%; display: flex; border: 1px solid #c7c7c7; border-radius: 2px; box-sizing: border-box;"
        >
            <input
                ref="input"
                v-model="inputValue"
                @keyup.enter="confirmChange"
                style="padding: 0 15px; color: #333; line-height: 20px; font-size: 14px; display: block; width: 100%; border: none; outline: none; flex-shrink: 1; font-weight: 600;"
            />
            <div style="display: flex; align-items: center; padding: 0 10px;">
                <a
                    @click="isEdit = false"
                    style="font-size: 12px; color: #999; line-height: 24px; width: 50px; text-align: center; cursor: pointer;"
                >取消</a>
                <a
                    @click="confirmChange"
                    style="display: inline-block; line-height: 24px; background-color: #409eff; color: #fff; width: 50px; text-align: center; border-radius: 12px; font-weight: 600; cursor: pointer;"
                >保存</a>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ConfirmInput',
        props: {
            value: {
                type: String,
                default: '',
            },
            disabled: {
                type: Boolean,
                default: false,
            }
        },
        data() {
            return {
                isEdit: false,
                inputValue: this.value,
            };
        },
        methods: {
            clickEdit() {
                if (this.disabled) {
                    return;
                }
                this.isEdit = true;
                this.inputValue = this.value;
                setTimeout(() => {
                    this.$refs.input.focus();
                }, 10);
            },
            confirmChange() {
                this.isEdit = false;
                // console.log(this.inputValue, 'inputValue');
                this.$emit('confirmChange', this.inputValue);
            }
        }
    }
</script>

<style scoped>

</style>
