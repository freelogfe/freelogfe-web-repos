<template>
    <div class="header-menu">
        <a class="header-menu__nav">
            <span>发现</span>
            <div class="header-menu__dropdown">
                <div class="header-menu__menu">
                    <a class="header-menu__menu__item">
                        发行市场
                    </a>
                    <a class="header-menu__menu__item">
                        示例节点
                    </a>
                </div>

            </div>
        </a>
        <a class="header-menu__nav header-menu__nav--active">
            <span>储存空间</span>
            <div class="header-menu__dropdown" style="width: 240px;">
                <div class="header-menu__menu">
                    <a class="header-menu__menu__item">
                        bucket1
                    </a>
                    <a class="header-menu__menu__item">
                        bucket2
                    </a>
                </div>
                <div class="header-menu__footer">
                    <i class="el-icon-plus"/>
                </div>
            </div>
        </a>
        <a class="header-menu__nav">
            <span>发行管理</span>
            <div class="header-menu__dropdown">
                <div class="header-menu__menu">
                    <a class="header-menu__menu__item">
                        我的资源
                    </a>
                    <a class="header-menu__menu__item">
                        我的发行
                    </a>
                    <a class="header-menu__menu__item">
                        我的收藏
                    </a>
                </div>

            </div>
        </a>
        <a class="header-menu__nav">
            <span>节点管理</span>
            <div class="header-menu__dropdown" style="width: 280px;">
                <div class="header-menu__menu">
                    <a class="header-menu__menu__item">
                        我的节点1
                    </a>
                    <a class="header-menu__menu__item">
                        我的节点1
                    </a>
                </div>
                <div class="header-menu__footer">
                    <i class="el-icon-plus"/>
                </div>
            </div>
        </a>
    </div>
</template>

<script>
    export default {
        name: "index"
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
            left: 0;
            font-size: 14px;
            color: #999;
            background-color: #333;
            width: 180px;

            .header-menu__menu {
                padding: 10px 0;

                .header-menu__menu__item {
                    display: block;

                    padding: 0 20px;
                    box-sizing: border-box;
                    line-height: 40px;

                    &:hover {
                        background-color: #444;
                        color: #ddd;
                        font-weight: 600;
                    }
                }
            }


            .header-menu__footer {
                line-height: 40px;
                border-top: 1px solid #444;
                text-align: center;
                display: block;

                &:hover {
                    background-color: #444;
                    color: #ddd;
                    font-weight: 600;
                }
            }

        }

    }
</style>
