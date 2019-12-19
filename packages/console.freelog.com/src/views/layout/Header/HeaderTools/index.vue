<template>
    <div class="header-tools">
        <div class="header-tools__col">
            <a>
                <div class="header-tool__create">
                    <i class="freelog fl-icon-add"/>
                </div>
                <div class="header-tools__dropdown">
                    <div class="header-tools__menu">
                        <router-link
                            to="/resource/editor"
                            class="header-tools__menu__item"
                        >创建资源
                        </router-link>
                        <a class="header-tools__menu__item">创建发行</a>
                        <!--                        <router-link to="/" class="header-tools__menu__item">-->
                        <!--                            创建mock-->
                        <!--                        </router-link>-->
                        <router-link
                            to="/node/create"
                            class="header-tools__menu__item"
                        >创建节点
                        </router-link>
                    </div>

                </div>
            </a>
        </div>

        <div class="header-tools__col">
            <ToolSearch @onConfirm="onSearch"/>
        </div>

        <div class="header-tools__col">
            <a class="header-tool__avatar">
                <img src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"/>

                <div
                    class="header-tools__dropdown"
                    style="width: 240px; left: unset; right: -10px; cursor: auto;"
                >
                    <div
                        style="display: flex; flex-direction: column; align-items: center; padding: 20px 0; font-size: 14px;font-weight: 600; color: #999;">
                        <img
                            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                            style="height: 60px; width: 60px; border-radius: 50%;"
                        />
                        <div style="height: 10px;"/>
                        <div style="color: #999; font-size: 16px; font-weight: 600;">YANGHONGTIAN</div>
                        <div style="height: 8px;"/>
                        <div style="">13145959706</div>
                    </div>
                    <a>个人中心</a>
                    <router-link
                        :to="'/login'"
                    >登出
                    </router-link>
                </div>
            </a>
        </div>

        <div class="header-tools__col" style="padding-right: 0">
            <a class="header-tool__language">
                <span>{{$i18n.locale === 'zh-CN'? '中文' : 'English'}} <i class="el-icon-arrow-down"/></span>

                <div class="header-tools__dropdown" style="right: -10px; left: unset;">
                    <div class="header-tools__menu">
                        <a
                            @click="handleCommand('zh-CN')"
                            class="header-tools__menu__item"
                            :class="{'header-tools__menu__item--active':$i18n.locale === 'zh-CN'}"
                        >中文</a>
                        <a
                            @click="handleCommand('en')"
                            class="header-tools__menu__item"
                            :class="{'header-tools__menu__item--active':$i18n.locale === 'en'}"
                        >English</a>
                    </div>

                </div>
            </a>
        </div>
    </div>
</template>

<script>
    import ToolSearch from './ToolSearch';

    export default {
        name: "index",
        components: {
            ToolSearch
        },
        methods: {
            onSearch(value) {
                // console.log(value, 'VVVVVVV');
                this.$router.push({path: '/', query: {q: value}})
            },
            handleCommand(lang) {
                if (lang === this.$i18n.locale) return;
                const langMap = {
                    'en': 'English',
                    'zh-CN': '中文'
                };
                this.$confirm(this.$t('header.langSwitchQuestion', {lang: langMap[lang]}))
                    .then(() => {
                        window.localStorage.setItem('locale', lang);
                        this.$i18n.locale = lang;
                        window.location.reload();
                    }).catch(() => {
                })
            }
        }
    }
</script>

<style scoped lang="less">
    .header-tools {
        display: flex;
        height: 100%;
        /*color: #fff;*/

        .header-tools__col {
            display: flex;
            padding: 0 15px;
            height: 100%;
            align-items: center;
            justify-content: center;

            a {
                position: relative;
                display: flex;
                cursor: pointer;
                height: 100%;
                align-items: center;

                .header-tools__dropdown {
                    position: absolute;
                    display: none;
                    top: 100%;
                    left: -10px;
                    font-size: 14px;
                    color: #999;
                    background-color: #333;
                    width: 180px;
                    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.2);

                    .header-tools__menu {
                        padding: 10px 0;

                        .header-tools__menu__item {
                            /*display: block;*/
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            padding: 0 20px;
                            box-sizing: border-box;
                            line-height: 40px;
                            color: #999;

                            /*& > a {*/
                            /*    background-color: #444;*/
                            /*    color: #999;*/
                            /*    font-size: 12px;*/
                            /*    line-height: 20px;*/
                            /*    padding: 0 6px;*/
                            /*    font-weight: 600;*/
                            /*}*/

                            &:hover {
                                background-color: #444;
                                color: #ddd;
                                font-weight: 600;

                                /*& > a {*/
                                /*    background-color: #555;*/
                                /*    color: #ddd;*/
                                /*}*/
                            }

                            &.header-tools__menu__item--active {
                                color: #fff;
                                font-weight: 600;
                            }
                        }
                    }
                }

                &:hover {
                    .header-tools__dropdown {
                        display: inline-block;
                    }

                    .header-tool__create {
                        background-color: #61afff;
                    }

                    & > span {
                        color: #ddd;
                        font-weight: 600;
                    }
                }
            }
        }
    }

    .header-tool__create {
        width: 40px;
        height: 26px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #409eff;
        border-radius: 13px;

        &:hover {
            background-color: #61afff;
        }

        & > i {
            font-size: 14px;
            color: #fff;
        }
    }

    .header-tool__avatar {
        width: 32px;
        display: block;

        & > img {
            background: rgba(142, 142, 147, 0.4);
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: block;
            border: none;
        }

        a {
            padding: 0 20px;
            line-height: 60px;
            display: block;
            border-top: 1px solid #444;
            color: #999;

            &:hover {
                background-color: #444;
                color: #ddd;
            }
        }
    }

    .header-tool__language {
        & > span {
            color: #999;
            font-size: 14px;
            display: flex;
            align-items: center;

            & > i {
                margin-left: 3px;
                transition: all 400ms;
            }
        }

        &:hover {
            & > span {

                & > i {
                    transform: rotate(-180deg);
                }
            }
        }
    }


</style>
