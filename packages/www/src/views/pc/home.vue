<template>
  <div class="home-wrapper w-100p h-100p flex-column align-center">
    <!-- 内测奖金广告 -->
    <img
      class="activity-ad p-fixed cur-pointer z-5 transition"
      src="@/assets/image/activity.png"
      alt="参与内测领取现金奖励"
    />

    <!-- header -->
    <header class="header p-fixed lt-0 w-100p bg-white flex-row align-center space-between b-box z-10">
      <div class="flex-row align-center">
        <img class="header-logo" src="@/assets/image/logo.png" alt="freelog" />
        <button
          class="header-word-btn p-0 bg-white cur-pointer transition"
          v-for="item in assetsData.headerBtns"
          :key="item.label"
          @click="openPage(item.pageName)"
        >
          {{ item.label }}
        </button>
      </div>

      <div class="flex-row align-center">
        <div class="input-box p-relative">
          <i class="freelog fl-icon-content p-absolute" />
          <img
            class="clear-btn p-absolute cur-pointer z-1"
            src="@/assets/image/clear.png"
            v-show="searchKey"
            @click="searchKey = ''"
          />
          <input class="search-input p-absolute lt-0 fc-normal b-box transition" v-model="searchKey" />
        </div>
        <button class="login-btn b-box text-center cur-pointer" @click="openPage('login')">登录</button>
        <button class="register-btn fc-white fw-bold b-box text-center cur-pointer" @click="openPage('register')">
          注册
        </button>
      </div>
    </header>

    <!-- 活动栏 -->
    <h3 class="activity w-100p my-0 text-center fc-white shrink-0">
      <span>3000元现金奖励等你赢取！内测期间参与</span>
      <span class="cur-pointer">资源创作大赛</span>
      <span>，最低可领15元现金奖励，参与排名更有机会赢取3000元现金奖励！</span>
    </h3>

    <!-- 头部banner -->
    <div class="header-banner p-relative w-100p over-h flex-row justify-center shrink-0">
      <div class="header-banner-content w-100p">
        <img
          class="header-banner-bg p-absolute t-0 l-50p translateX--50p z--1"
          v-lazy="require('@/assets/image/header-banner.png')"
        />
        <h1 class="header-banner-slogan fc-normal mb-0">这里是Slogan</h1>
        <h2 class="header-banner-intro fw-bold fc-normal mb-0">免费专业的资源发行和运营平台</h2>
        <h3 class="header-banner-desc fc-63676c mb-0">
          支持漫画、小说、图片、游戏、视频、音乐、插件、主题等各类型资源
        </h3>
        <button class="start-btn fw-regular fc-white b-box text-center cur-pointer" @click="openPage('register')">
          免费使用
        </button>
      </div>
    </div>

    <!-- 应用场景 -->
    <div class="application-senarios w-100p">
      <h1 class="application-senarios-title fw-bold fc-normal mb-0">丰富的应用场景</h1>
      <h2 class="application-senarios-intro fc-63676c mb-0">
        Freelog，基于「智能合约」的虚拟资源交易平台，支持资源授权的自动化和定制化，为资源的发行、再创作和推广提供多样化解决方案，助力资源作者和运营者快速变现。
      </h2>
      <h3 class="application-senarios-desc fw-bold mb-0">一键创建资源商店 • 收益独享 • 多渠道变现</h3>

      <!-- tab部分 -->
      <div class="tab-box w-100p text-center">
        <div class="tab-nav">
          <nav
            class="nav-item w-100p bg-white text-center-column transition"
            :class="{ 'tab-active': activeTab === index }"
            v-for="(item, index) in assetsData.homeTabs"
            :key="item"
            @mouseover="selectTab(index)"
          >
            <h1 class="nav-title fc-normal my-0">{{ item }}</h1>
            <h1 class="nav-desc fc-7a869a mb-0">{{ assetsData.homeTabsContent[index].desc }}</h1>
            <div class="nav-btns flex-row">
              <button
                class="nav-btn fc-white b-box text-center cur-pointer fade-in"
                @click="openPage('novel')"
                v-for="btn in assetsData.homeTabsContent[activeTab]?.btns"
                :key="btn.label"
                v-show="activeTab === index"
              >
                {{ btn.label }}
              </button>
            </div>
          </nav>
        </div>

        <div class="tab-content p-relative flex-1">
          <transition :name="item.animation" v-for="item in assetsData.senariosImages" :key="item.className">
            <img class="p-absolute" :class="{ [item.className]: true }" v-lazy="item.url" v-show="activeTab !== null" />
          </transition>
          <transition name="slide-left-bottom">
            <img
              class="left-bottom-img p-absolute z-2"
              v-lazy="'https://image.freelog.com/preview-image/256130b6cc96c5be5681eec163b7ec6c7743c25c.jpg'"
              v-show="activeTab !== null"
            />
          </transition>
          <transition name="slide-right-top">
            <img
              class="right-top-img p-absolute z-1"
              v-lazy="'https://image.freelog.com/preview-image/4e7ba896ced835a1c5f6fb4aec0b6ea8240a187f.jpg'"
              v-show="activeTab !== null"
            />
          </transition>
        </div>
      </div>
    </div>

    <!-- 介绍部分 -->
    <div class="intro-box w-100p text-center-column bg-content">
      <div class="intro-content w-100p">
        <h1 class="intro-title fw-bold fc-normal text-center my-0">助力虚拟资源发行和运营</h1>
        <h2 class="intro-desc fc-63676c text-center">
          实现资源授权与交易自动化、定制化，开创资源再创作的变现新模式，节点商整合运营资源助力变现
        </h2>

        <div
          class="intro-item w-100p flex-row align-center"
          :class="{ 'justify-end': index === 1 }"
          v-for="(intro, index) in assetsData.homeIntroList"
          :key="intro.title"
        >
          <img class="intro-img" v-lazy="intro.img" :alt="intro.title" v-if="index !== 1" />
          <div class="intro-paragraph">
            <h2 class="paragraph-title fc-normal my-0">{{ intro.title }}</h2>
            <h3 class="paragraph-desc mb-0">{{ intro.desc }}</h3>
            <button class="paragraph-btn" @click="openPage(intro.pageName)">进一步了解</button>
          </div>
          <img class="intro-img" v-lazy="intro.img" :alt="intro.title" v-if="index === 1" />
        </div>
      </div>
    </div>

    <!-- 脚部banner -->
    <div class="footer-banner p-relative w-100p text-center-column over-h shrink-0">
      <img class="footer-banner-bg p-absolute z--1" v-lazy="require('@/assets/image/footer-banner.png')" />
      <h1 class="footer-banner-title fc-normal my-0">Freelog，专业免费的资源发行和运营平台</h1>
      <h2 class="footer-banner-desc fc-63676c mb-0">
        支持图片、小说、游戏、漫画、视频、音乐、主题、插件等各类型资源快速变现
      </h2>
      <button class="footer-banner-btn fw-regular" @click="openPage('register')">免费使用</button>
    </div>

    <!-- footer -->
    <div class="footer w-100p bg-content flex-row align-center space-between b-box shrink-0">
      <div class="flex-row align-center">
        <button
          class="footer-word-btn cur-pointer bg-white p-0"
          v-for="item in assetsData.footerBtns"
          :key="item.label"
          @click="openPage(item.pageName)"
        >
          {{ item.label }}
        </button>
        <button class="footer-word-btn cur-pointer bg-white p-0">
          简体中文 <i class="freelog fl-icon-xiangxia" />
        </button>
        <button class="footer-word-btn bg-white p-0 cur-pointer">
          <i class="only-icon-btn freelog fl-icon-weixin" />
        </button>
        <button class="footer-word-btn bg-white p-0 cur-pointer">
          <i class="only-icon-btn freelog fl-icon-weibo" />
        </button>
        <button class="footer-word-btn bg-white p-0 cur-pointer">
          <i class="only-icon-btn freelog fl-icon-linkedin" />
        </button>
      </div>

      <div class="flex-row align-center">
        <img class="security-img" v-lazy="require('@/assets/image/security.png')" />
        <span class="text fc-grey">粤ICP备17085716号-1</span>
        <span class="text fc-grey">Copyright© 2020 freelog.com</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs } from "@vue/reactivity";
import * as assetsData from "@/assets/data";

export default {
  setup() {
    const data = reactive({
      searchKey: "", // 搜索关键字
      activeTab: 0 as number | null, // 当前激活tab
    });

    const methods = {
      // 跳转页面
      openPage(pageName: assetsData.pageName) {
        window.open(assetsData.pageMappings[pageName]);
      },

      // 选择tab
      selectTab(index: number) {
        if (data.activeTab === index) return;

        data.activeTab = null;
        setTimeout(() => {
          data.activeTab = index;
        }, 400);
      },
    };

    return {
      ...toRefs(data),
      ...methods,
      assetsData,
    };
  },
};
</script>

<style lang="scss" scoped>
/* PC 相关页面与尺寸相关的样式请勿使用全局样式方式绘制，否则会导致 PC 页面的元素尺寸被 postcss-px-to-viewport 重新计算 */
.home-wrapper {
  padding-top: 70px;

  .activity-ad {
    right: 40px;
    bottom: 40px;
    width: 158px;
    height: 180px;
    border-radius: 14px;
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);
    &:hover {
      box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.25);
    }
  }

  .header {
    height: 70px;
    padding: 0 40px;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.05);

    .header-logo {
      width: 109px;
      height: 24px;
      margin-right: 10px;
    }

    .header-word-btn {
      font-size: 14px;
      margin-left: 30px;

      &:hover {
        color: #529dff;
      }

      &:active {
        color: #2376e5;
      }
    }

    .input-box {
      width: 200px;
      height: 32px;

      .fl-icon-content {
        top: 9px;
        left: 12px;
        font-size: 14px;
        color: #8e8e93;
      }

      .clear-btn {
        top: 11px;
        right: 12px;
        width: 10px;
        height: 10px;
      }
    }

    .search-input {
      width: 200px;
      height: 32px;
      font-size: 14px;
      line-height: 20px;
      border-radius: 16px;
      padding: 6px 31px;
      background-color: rgba(0, 0, 0, 0.03);
      border: 1px solid transparent;

      &:hover {
        border-color: #c4c4c4;
      }

      &:focus {
        border-color: #2784ff;
      }
    }

    .login-btn {
      height: 32px;
      padding: 0 15px;
      border-radius: 4px;
      font-size: 14px;
      margin-left: 30px;
      background-color: #f7f7f7;
      color: #666;

      &:hover {
        background-color: #ededed;
      }

      &:active {
        background-color: #e6e6e6;
      }
    }

    .register-btn {
      height: 32px;
      padding: 0 15px;
      border-radius: 4px;
      font-size: 14px;
      background-color: #2784ff;
      margin-left: 10px;

      &:hover {
        background-color: #529dff;
      }

      &:active {
        background-color: #2376e5;
      }
    }
  }

  .activity {
    height: 50px;
    font-size: 14px;
    background: linear-gradient(225deg, #9b4472 0%, #ffc456 100%);

    span:nth-child(2) {
      color: #970955;
      margin-left: 5px;
    }
  }

  .header-banner {
    height: 646px;

    .header-banner-content {
      max-width: 1060px;

      .header-banner-bg {
        height: 646px;
      }

      .header-banner-slogan {
        font-size: 70px;
        line-height: 76px;
        margin-top: 110px;
      }

      .header-banner-intro {
        font-size: 22px;
        line-height: 28px;
        margin-top: 40px;
      }

      .header-banner-desc {
        font-size: 16px;
        line-height: 22px;
        margin-top: 20px;
      }

      .start-btn {
        width: 188px;
        height: 60px;
        padding: 0 15px;
        border-radius: 4px;
        font-size: 22px;
        background-color: #2784ff;
        margin-top: 40px;

        &:hover {
          background-color: #529dff;
        }

        &:active {
          background-color: #2376e5;
        }
      }
    }
  }

  .application-senarios {
    max-width: 1060px;
    padding-top: 30px;
    padding-bottom: 150px;

    .application-senarios-title {
      font-size: 40px;
      line-height: 46px;
    }

    .application-senarios-intro {
      max-width: 608px;
      font-size: 16px;
      line-height: 26px;
      margin-top: 20px;
    }

    .application-senarios-desc {
      color: #5260bb;
      font-size: 16px;
      line-height: 20px;
      margin-top: 20px;
    }

    .tab-box {
      margin-top: 60px;

      .tab-nav {
        width: 260px;

        .nav-item {
          height: 160px;
          border-radius: 10px;

          .nav-title {
            font-size: 24px;
            line-height: 30px;
          }

          .nav-desc {
            font-size: 12px;
            line-height: 18px;
            margin-top: 15px;
          }

          .nav-btns {
            height: 32px;
            margin-top: 15px;

            .nav-btn {
              height: 32px;
              padding: 0 15px;
              border-radius: 4px;
              font-size: 14px;
              background-color: #2784ff;

              &:hover {
                background-color: #529dff;
              }

              &:active {
                background-color: #2376e5;
              }

              & + .nav-btn {
                margin-left: 10px;
              }
            }
          }

          & + .nav-item {
            margin-top: 10px;
          }

          &.tab-active {
            background-color: #fafafa !important;
          }
        }
      }

      .tab-content {
        height: 710px;
        margin-left: 60px;

        .left-bottom-img {
          top: 310px;
          left: 30px;
          width: 520px;
          height: 340px;
        }

        .right-top-img {
          top: 60px;
          right: 0;
          width: 520px;
          height: 340px;
        }

        .green-matrix {
          left: 0;
          top: 255px;
          width: 140px;
          height: 110px;
        }

        .blue-circle {
          left: 280px;
          bottom: 0;
          width: 120px;
          height: 120px;
        }

        .green-circle {
          right: -74px;
          top: 0;
          width: 140px;
          height: 140px;
        }

        .blue-matrix {
          right: -30px;
          top: 345px;
          width: 140px;
          height: 110px;
        }
      }
    }
  }

  .intro-box {
    padding: 150px 0;

    .intro-content {
      max-width: 1260px;

      .intro-title {
        font-size: 40px;
        line-height: 46px;
      }

      .intro-desc {
        font-size: 16px;
        line-height: 26px;
        margin-top: 20px;
        margin-bottom: 150px;
      }

      .intro-item {
        .intro-img {
          width: 640px;
          height: 520px;
          margin-left: 100px;
        }

        .intro-paragraph {
          .paragraph-title {
            font-size: 28px;
            line-height: 34px;
          }

          .paragraph-desc {
            font-size: 14px;
            line-height: 24px;
            margin-top: 30px;
          }

          .paragraph-btn {
            height: 42px;
            width: fit-content;
            padding: 0 20px;
            box-sizing: border-box;
            border-radius: 4px;
            color: #fff;
            font-size: 14px;
            font-weight: 600;
            background-color: #2784ff;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            margin-top: 30px;

            &:hover {
              background-color: #529dff;
            }

            &:active {
              background-color: #2376e5;
            }
          }
        }

        .intro-img + .intro-paragraph,
        .intro-paragraph + .intro-img {
          margin-left: 100px;
        }

        & + .intro-item {
          margin-top: 100px;
        }
      }
    }
  }

  .footer-banner {
    height: 514px;

    .footer-banner-bg {
      height: 514px;
    }

    .footer-banner-title {
      font-size: 44px;
      line-height: 50px;
    }

    .footer-banner-desc {
      font-size: 18px;
      line-height: 24px;
      margin-top: 40px;
    }

    .footer-banner-btn {
      width: 188px;
      height: 60px;
      padding: 0 20px;
      box-sizing: border-box;
      border-radius: 4px;
      color: #fff;
      font-size: 22px;
      font-weight: 600;
      background-color: #2784ff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin-top: 40px;

      &:hover {
        background-color: #529dff;
      }

      &:active {
        background-color: #2376e5;
      }
    }
  }

  .footer {
    height: 70px;
    padding: 0 40px;

    .footer-word-btn {
      line-height: 20px;
      color: #666;
      font-size: 14px;

      .freelog {
        margin-left: 5px;
        margin-right: 10px;
      }

      .only-icon-btn {
        width: 26px;
        height: 20px;
        font-size: 20px;
      }

      &:hover {
        color: #529dff;
      }

      &:active {
        color: #2376e5;
      }

      & + .footer-word-btn {
        margin-left: 30px;
      }
    }

    .security-img {
      width: 16px;
      height: 18px;
      margin-right: 6px;
    }

    .text {
      font-size: 12px;

      & + .text {
        margin-left: 30px;
      }
    }
  }
}
</style>
