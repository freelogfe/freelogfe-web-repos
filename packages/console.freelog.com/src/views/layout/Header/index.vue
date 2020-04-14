<template>
    <header class="nav-header" style="background-color: transparent;">
        <div class="brand">
            <router-link to="/" class="">
                <i
                    class="freelog fl-icon-logo-freelog"
                />
            </router-link>
            <!--      <span class="page-title">{{pageTitle}}</span>-->
            <HeaderMenu
                v-if="userType === 1"
                style="margin-left: 45px;"
            />
        </div>
        
        <HeaderTools/>
    </header>
</template>

<script>
    import Header from './index'

    export default Header
</script>

<style scoped lang="less">
    @import "index.less";
</style>


<style lang="less">

</style>
