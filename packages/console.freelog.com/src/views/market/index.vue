<template>
    <div style="display: flex; justify-content: center;">
        <div style="width: 1200px; display: flex; justify-content: center;">
            <div style="display: flex; flex-wrap: wrap; justify-content: center;">
                <Card/>
                <Card/>
                <Card/>
                <Card/>
                <Card/>
                <Card/>
                <Card/>
                <Card/>
                <Card/>
            </div>
        </div>
    </div>
</template>

<script>
    import Card from './Card.vue';

    export default {
        name: "index",
        components: {
            Card,
        }
    }
</script>

<style scoped>

</style>
