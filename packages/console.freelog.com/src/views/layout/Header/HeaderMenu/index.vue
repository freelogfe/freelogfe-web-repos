<template>
    <div class="header-menu">
        <a
            class="header-menu__nav"
            :class="{'header-menu__nav--active': ['/'].includes($route.path)}"
        >
            <span>发现</span>
            <div class="header-menu__dropdown">
                <div class="header-menu__menu">
                    <router-link
                        to="/"
                        class="header-menu__menu__item"
                        :class="{'header-menu__menu__item--active': $route.path === '/'}"
                    >发行市场
                    </router-link>
                    <router-link
                        to="/"
                        class="header-menu__menu__item"
                    >示例节点
                    </router-link>
                </div>
            </div>
        </a>
        <a
            class="header-menu__nav"
            :class="{'header-menu__nav--active': ['/mock/display'].includes($route.path)}"
        >
            <span>储存空间</span>
            <div class="header-menu__dropdown" style="width: 240px;">
                <div class="header-menu__menu">
                    <router-link
                        v-for="(bucket, index) in (bucketsList || [])"
                        :to="{
                            path: '/mock/display',
                        }"
                        class="header-menu__menu__item"
                        :class="{'header-menu__menu__item--active': $route.path === '/mock/display' && index === 0}"
                    >{{bucket.bucketName}}
                    </router-link>
                    <!--                    <router-link to="/mock/display" class="header-menu__menu__item">-->
                    <!--                        bucket2-->
                    <!--                    </router-link>-->
                </div>
                <a class="header-menu__footer">
                    <i style="font-size: 14px;" class="freelog fl-icon-add"/>
                </a>
            </div>
        </a>
        <a
            class="header-menu__nav"
            :class="{'header-menu__nav--active': ['/resource/list', '/release/list', '/release/collections'].includes($route.path)}"
        >
            <span>发行管理</span>
            <div class="header-menu__dropdown">
                <div class="header-menu__menu">
                    <router-link
                        to="/resource/list"
                        class="header-menu__menu__item"
                        :class="{'header-menu__menu__item--active': $route.path === '/resource/list'}"
                    >我的资源
                    </router-link>
                    <router-link
                        to="/release/list"
                        class="header-menu__menu__item"
                        :class="{'header-menu__menu__item--active': $route.path === '/release/list'}"
                    >我的发行
                    </router-link>
                    <router-link
                        to="/release/collections"
                        class="header-menu__menu__item"
                        :class="{'header-menu__menu__item--active': $route.path === '/release/collections'}"
                    >我的收藏
                    </router-link>
                </div>

            </div>
        </a>
        <a
            class="header-menu__nav"
            :class="{'header-menu__nav--active': $route.path.startsWith('/node/manager/') || $route.path.startsWith('/node/test-manager/')}"
        >
            <span>节点管理</span>
            <div class="header-menu__dropdown" style="width: 280px;">
                <div class="header-menu__menu">
                    <router-link
                        v-for="node in (nodesList || [])"
                        class="header-menu__menu__item"
                        :class="{'header-menu__menu__item--active': $route.path === `/node/manager/${node.nodeId}` || $route.path === `/node/test-manager/${node.nodeId}`}"
                        :to="`/node/manager/${node.nodeId}`"
                    >
                        <span>{{node.nodeName}}</span>
                        <router-link
                            :to="`/node/test-manager/${node.nodeId}`"
                        >测试节点
                        </router-link>
                    </router-link>
                </div>
                <router-link
                    to="/node/create"
                    class="header-menu__footer"
                >
                    <i style="font-size: 14px;" class="freelog fl-icon-add"/>
                </router-link>
            </div>
        </a>
    </div>
</template>

<script>
    export default {
        name: "index",
        data() {
            return {
                bucketsList: null,
                nodesList: null,
            };
        },
        mounted() {
            // console.log(this.$route, '$$$$$$$$');
            this.initBucket();
            this.initNode();
        },
        methods: {
            async initBucket() {
                const {data} = await this.$axios.get('/v1/resources/mocks/buckets');
                // console.log(data, 'datadatadatadatadatadatadatadatadatadatadatadatadatadatadatadata');
                this.bucketsList = data.data;
                // console.log(this.bucketsList, 'this.bucketsList');
            },
            async initNode() {
                const {data} = await this.$axios.get('/v1//nodes?pageSize=100');
                this.nodesList = data.data.dataList;
                // console.log(this.nodesList, 'data');
            },
        },
    }
</script>

<style scoped lang="less">

    .header-menu {
        display: inline-block;
        cursor: pointer;

        .header-menu__nav {
            display: inline-block;
            line-height: 60px;
            padding: 0 15px;
            color: #999;
            font-size: 14px;
            cursor: pointer;
            position: relative;

            &:hover {
                & > span {
                    color: #ddd;
                    font-weight: 600;
                }

                .header-menu__dropdown {
                    display: inline-block;
                }
            }

            &.header-menu__nav--active {
                & > span {
                    color: #fff;
                    font-weight: 600;
                }
            }
        }

        .header-menu__dropdown {
            position: absolute;
            display: none;
            top: 100%;
            left: 5px;
            font-size: 14px;
            color: #999;
            background-color: #333;
            width: 180px;
            box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.2);

            .header-menu__menu {
                padding: 10px 0;

                .header-menu__menu__item {
                    /*display: block;*/
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 20px;
                    box-sizing: border-box;
                    line-height: 40px;
                    color: #999;

                    & > a {
                        background-color: #444;
                        color: #999;
                        font-size: 12px;
                        line-height: 20px;
                        padding: 0 6px;
                        font-weight: 600;
                    }

                    &:hover {
                        background-color: #444;
                        color: #ddd;
                        font-weight: 600;

                        & > a {
                            background-color: #555;
                            color: #ddd;
                        }
                    }

                    &.header-menu__menu__item--active {
                        color: #fff;
                        font-weight: 600;

                        & > a {
                            background-color: #555;
                            color: #fff;
                        }
                    }
                }
            }


            .header-menu__footer {
                line-height: 40px;
                border-top: 1px solid #444;
                text-align: center;
                display: block;
                font-size: 14px;
                color: #999;
                /*font-weight: 600;*/

                &:hover {
                    background-color: #444;
                    color: #ddd;
                }
            }

        }

    }
</style>
