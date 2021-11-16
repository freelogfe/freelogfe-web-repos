<template>
  <div class="home-mobile-wrapper w-100p h-100p pt-60">
    <header class="header p-fixed lt-0 w-100p h-60 bg-white flex-row align-center space-between px-20 b-box z-10">
      <img class="w-109 h-24" src="@/assets/image/logo.png" alt="freelog" />
      <button class="bg-white p-0">
        <i class="freelog fl-icon-zuhemoshi w-24 h-18 text-center fs-24" @click="drawerShow = true"></i>
      </button>
    </header>

    <div class="p-relative w-100p h-344 o-hidden flex-column align-center">
      <img
        class="p-absolute h-344 t-0 l-50p translateX--50p z--1"
        v-lazy="require('@/assets/image/mobile-header-banner.png')"
      />
      <h1 class="fs-24 lh-30 fc-normal mt-25 mb-0">这里是Slogan</h1>
      <h2 class="fs-14 lh-20 fc-normal fw-bold mt-20 mb-0">免费专业的资源发行和运营平台</h2>
      <h3 class="fs-12 lh-17 fc-less px-67 b-box mt-10 mb-0 text-align-center">
        支持漫画、小说、图片、游戏、视频、音乐、插件、主题等各类型资源
      </h3>
    </div>

    <div class="w-100p py-40 px-20 b-box flex-column align-center">
      <h1 class="fs-18 lh-24 my-0 fw-bold fc-normal">丰富的应用场景</h1>
      <h2 class="fs-14 lh-20 fc-7a869a mt-10 mb-0">一键创建资源商店 • 收益独享 • 多渠道变现</h2>

      <div class="w-100p mt-20">
        <div class="p-relative w-100p px-10 b-box flex-row space-between">
          <nav
            :ref="activeTab === index ? 'tab' : ''"
            class="h-30 text-center fs-14 lh-20 fc-normal"
            @click="selectTab(index)"
            v-for="(item, index) in assetsData.mobileHomeTabs"
            :key="item"
          >
            {{ item }}
          </nav>

          <div
            class="car p-absolute b--2 h-2 bg-main"
            :style="{ left: offsetLeft + 'px', width: carWidth + 'px' }"
          ></div>
        </div>

        <div class="w-100p pt-10 pr-10 pb-20 pl-20 b-box mt-12 brs-8 b-1">
          <div class="p-relative w-100p h-275">
            <transition :name="item.animation" v-for="item in assetsData.senariosImages" :key="item.className">
              <img :class="{ [item.className]: true }" v-lazy="item.url" v-show="tabContentShow" />
            </transition>
            <transition name="slide-left-bottom">
              <img
                class="p-absolute t-120 l-12 w-201 h-132 z-2"
                v-lazy="'https://image.freelog.com/preview-image/256130b6cc96c5be5681eec163b7ec6c7743c25c.jpg'"
                v-show="tabContentShow"
              />
            </transition>
            <transition name="slide-right-top">
              <img
                class="p-absolute t-23 r-29 w-201 h-132 z-1"
                v-lazy="'https://image.freelog.com/preview-image/4e7ba896ced835a1c5f6fb4aec0b6ea8240a187f.jpg'"
                v-show="tabContentShow"
              />
            </transition>
          </div>

          <h3 class="h-20 fs-14 lh-20 fc-7a869a mt-25 mb-0 text-align-center">
            {{ assetsData.homeTabsContent[activeTab]?.desc }}
          </h3>
          <div class="h-38 flex-row justify-center mt-15">
            <button
              class="main-btn ml-self-20 fade-in"
              @click="openPage(btn.pageName)"
              v-for="btn in assetsData.homeTabsContent[activeTab]?.btns"
              :key="btn.label"
            >
              {{ btn.label }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="px-20 b-box flex-column align-center">
      <h1 class="fs-18 lh-24 my-0 fw-bold fc-normal">助力虚拟资源发行和运营</h1>
      <h2 class="fs-14 lh-20 fc-7a869a mt-10 mb-25">实现资源授权的交易自动、定制化，开创变现新模式</h2>

      <div
        class="intro-item py-20 px-10 b-box text-center-column brs-10 mt-self-15"
        v-for="intro in assetsData.homeIntroList"
        :key="intro.title"
      >
        <h1 class="fs-16 lh-22 my-0 fc-normal fw-bold">{{ intro.title }}</h1>
        <h2 class="fs-14 lh-20 fc-normal mt-15 mb-0 text-align-center">{{ intro.desc }}</h2>
        <button class="view-btn p-0 fs-14 fw-bold lh-20 mt-20" @click="openPage(intro.pageName)">进一步了解</button>
      </div>
    </div>

    <div class="p-relative w-100p h-168 text-center-column">
      <img class="bg-image p-absolute l-42 t-73 w-70 h-55 z--1" v-lazy="require('@/assets/image/green-matrix.png')" />
      <img class="bg-image p-absolute t-40 r-42 w-70 h-55 z--1" v-lazy="require('@/assets/image/blue-matrix.png')" />
      <h1 class="fs-18 lh-24 my-0 fw-bold fc-normal">免费专业的资源发行和运营平台</h1>
      <h2 class="fs-12 lh-17 fc-less mw-65p mt-10 mb-0 text-align-center">
        支持漫画、小说、图片、游戏、视频、音乐、主题等各类型资源
      </h2>
    </div>

    <div class="w-100p text-center-column py-25 b-box bg-content">
      <img class="w-109 h-24" v-lazy="require('@/assets/image/logo.png')" alt="freelog" />

      <div class="word-btns flex-row text-center mt-25">
        <button
          class="w-60 h-12 fs-12 fc-normal text-center bg-white p-0"
          v-for="item in assetsData.footerBtns"
          :key="item.label"
          @click="openPage(item.pageName)"
        >
          {{ item.label }}
        </button>
        <button class="w-60 h-12 fs-12 fc-normal text-center bg-white p-0">English</button>
      </div>

      <div class="fs-10 lh-16 fc-grey mt-20">Copyright© 2020 freelog.com</div>

      <div class="text-center mt-10">
        <img class="w-16 h-18 mr-5" v-lazy="require('@/assets/image/security.png')" />
        <span class="fs-10 fc-grey">粤ICP备17085716号-1</span>
      </div>

      <div class="flex-row mt-26">
        <button class="fc-normal bg-white p-0"><i class="freelog fl-icon-weixin w-26 h-20 text-center" /></button>
        <button class="fc-normal bg-white p-0">
          <i class="freelog fl-icon-weibo w-26 h-20 text-center ml-40" />
        </button>
        <button class="fc-normal bg-white p-0">
          <i class="freelog fl-icon-linkedin w-26 h-20 text-center ml-40" />
        </button>
      </div>
    </div>

    <div class="entrance w-100p h-60 bg-white text-center">
      <button class="main-btn w-200 brs-38" @click="openPage('register')">免费使用</button>
    </div>

    <transition name="fade">
      <div
        class="modal p-fixed lt-0 rb-0 z-11"
        @click="drawerShow = false"
        @touchmove.prevent
        v-show="drawerShow"
      ></div>
    </transition>
    <transition name="slide-left">
      <div class="p-fixed rt-0 b-0 w-220 bg-white flex-column align-center z-12" @touchmove.prevent v-show="drawerShow">
        <div class="drawer-header w-100p h-60 flex-row align-center space-between px-20 b-box">
          <header class="fs-16 lh-22 fc-normal fw-bold">导航</header>
          <button class="bg-white p-0">
            <i class="freelog fl-icon-guanbi fs-12" @click="drawerShow = false"></i>
          </button>
        </div>

        <div
          class="nav-btn-box w-100p h-50 px-20 b-box flex-row align-center"
          v-for="item in assetsData.headerBtns"
          :key="item.label"
        >
          <button class="w-100p fs-14 lh-20 fc-normal bg-white p-0 text-align-left" @click="openPage(item.pageName)">
            {{ item.label }}
          </button>
        </div>

        <button class="main-btn brs-38 w-140 mt-30" @click="openPage('login')">登录</button>
        <button class="assist-btn brs-38 w-140 mt-20" @click="openPage('register')">注册</button>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs } from "@vue/reactivity";
import * as assetsData from "@/assets/data";

export default {
  setup() {
    const data = reactive({
      searchKey: "", // 搜索关键字
      activeTab: null as number | null, // 当前激活tab
      tabContentShow: false, // tab内容显示
      tab: {} as HTMLElement, // 选中tab元素
      offsetLeft: 0, // 选中tab元素左偏移量
      carWidth: 0, // 选中tab元素宽度
      drawerShow: false, // 抽屉显示
    });

    const methods = {
      // 跳转页面
      openPage(pageName: assetsData.pageName) {
        window.open(assetsData.pageMappings[pageName]);
      },

      // 选择tab
      selectTab(index: number) {
        if (data.activeTab === index) return;

        data.activeTab = index;
        data.tabContentShow = false;
        setTimeout(() => {
          data.offsetLeft = data.tab.offsetLeft;
          data.carWidth = data.tab.clientWidth;
        }, 0);
        setTimeout(() => {
          data.tabContentShow = true;
        }, 400);
      },
    };

    methods.selectTab(0);

    return {
      ...toRefs(data),
      ...methods,
      assetsData,
    };
  },
};
</script>

<style lang="scss" scoped>
.home-mobile-wrapper {
  .header {
    box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.1);
  }

  .car {
    transition: all 0.3s ease-in-out;
  }

  .green-matrix {
    position: absolute;
    top: 99px;
    left: 0;
    width: 54px;
    height: 43px;
  }

  .blue-circle {
    position: absolute;
    bottom: 0;
    left: 108px;
    width: 46px;
    height: 46px;
  }

  .green-circle {
    position: absolute;
    top: 0;
    right: 0;
    width: 54px;
    height: 54px;
  }

  .blue-matrix {
    position: absolute;
    top: 134px;
    right: 17px;
    width: 54px;
    height: 43px;
  }

  .intro-item {
    .view-btn {
      background-color: transparent;
      color: #2784ff;
    }

    &:nth-child(3) {
      background-color: rgba(39, 132, 255, 0.05);
    }

    &:nth-child(4) {
      background-color: rgba(233, 169, 35, 0.05);
    }

    &:nth-child(5) {
      background-color: rgba(66, 194, 140, 0.05);
    }
  }

  .bg-image {
    opacity: 0.3;
  }

  .word-btns {
    button + button {
      border-left: 1px solid #979797 !important;
    }
  }

  .entrance {
    box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.1);
  }

  .modal {
    background-color: rgba(0, 0, 0, 0.3);
  }

  .drawer-header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .nav-btn-box {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
}
</style>
