<!--<template>-->
<!--  <div class="nav-menu-list">-->
<!--    <el-menu ref="navMenu" background-color="#324157" class="nav-menu-wrap" router>-->
<!--      <template v-for="(navItem) in navList">-->
<!--        <el-submenu :index="navItem.path"-->
<!--                    v-if="navItem.children && navItem.children.length > 0"-->
<!--                    :key="navItem.path"-->
<!--                    :class="{'is-active': navItem.isActive}">-->
<!--          <template slot="title">-->
<!--            <span v-show="shouldShowTitle" class="nav-menu-title">{{navItem.meta.title}}</span>-->
<!--          </template>-->
<!--          <el-menu-item :index="item.path" :key="item.path" v-for="item in navItem.children">-->
<!--            {{item.meta.title}}-->
<!--          </el-menu-item>-->
<!--        </el-submenu>-->
<!--        <el-menu-item :index="navItem.path"-->
<!--                      :key="navItem.path"-->
<!--                      v-else-if="!navItem.hidden"-->
<!--                      :class="{'is-active': navItem.isActive}">-->
<!--          <span v-show="shouldShowTitle">{{navItem.meta.title}}</span>-->
<!--        </el-menu-item>-->
<!--      </template>-->
<!--    </el-menu>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import NavMenu from './index'-->

<!--export default NavMenu-->
<!--</script>-->

<!--<style scoped lang="less">-->
<!--  .el-menu-item,-->
<!--  .nav-menu-title {-->
<!--    color: #fff-->
<!--  }-->

<!--  .el-menu-item.is-active {-->
<!--    color: #409EFF !important;-->
<!--  }-->

<!--  .router-link {-->
<!--    color: white;-->
<!--  }-->
<!--</style>-->
