<template>
    <div>
        <div
            style="height: 40px; display: flex; align-items: center; padding-left: 25px;"
            v-for="(i, j) in data"
            :key="i.id"
        >
            <a
                style="height: 20px; width: 20px; align-items: center; justify-content: center; display: flex; cursor: pointer;"
                @click="removeDep(j)"
            >
                <i class="el-icon-remove" style="font-size: 18px; color: #f02323"></i>
            </a>
            <span style="padding-left: 15px; font-size: 14px; color: #333; font-weight: 500;">{{i.name}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DepList",
        props: {
            data: {
                type: Array,
                default: function () {
                    return [];
                },
            },
            onChange: {
                type: Function,
                default: function (deps) {

                }
            }
        },
        methods: {
            removeDep(index) {
                const list = this.data.filter((i, j) => index !== j);
                this.onChange(list);
            },
        },
    }
</script>

<style scoped>

</style>
