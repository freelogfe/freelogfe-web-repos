<!--<i18n src="./policyList.json"></i18n>-->
<template>
  <div>
    <div class="policy-list-wrapper">
      <div
        class="p-l-main-content clearfix"
        :class="{'no-overflow': formatedPolicyList.length < 4}"
      >
        <div
          style="transition: all .3s; white-space: nowrap;"
          :style="{ transform: `translateX(-${policyTranslateX}px)` }"
        >
          <div
            class="p-l-item"
            :key="'p-item-'+ (index + 1)"
            v-for="(policy, index) in formatedPolicyList"
          >
            <div class="p-l-item-head">
              <div class="p-l-status p-l-s-top" v-show="false">
                <i class="el-icon-download"></i>
                {{$t('components.status[0]')}}
              </div>
              <div class="p-l-status p-l-s-disabled" v-show="policy.status == 0">
                <i class="el-icon-error"></i>
                {{$t('components.status[1]')}}
              </div>
              <div class="p-l-status p-l-s-active" v-show="policy.status == 1">
                <i class="el-icon-success"></i>
                {{$t('components.status[2]')}}
              </div>
            </div>

            <div class="p-l-card">
              <h5>
								<div class="p-l-status p-l-s-top" v-show="false"><i class="el-icon-download"></i></div>
								<div class="p-l-status p-l-s-disabled" v-show="policy.status == 0"><i class="el-icon-error"></i></div>
								<div class="p-l-status p-l-s-active" v-show="policy.status == 1"><i class="el-icon-success"></i></div>
								{{policy.policyName}}
							</h5>
              <pre v-if="policy.policyId" class="policy-text" v-html="policy.policyText"></pre>
            </div>

            <el-dropdown size="small" @command="handleCommand">
              <span class="el-dropdown-link">
                <i class="el-icon-more"></i>
              </span>

              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="policy.status == 0" :command="index + '-' + 1">{{$t('components.enableBtnText')}}</el-dropdown-item>
                <el-dropdown-item v-if="policy.status == 1" :command="index + '-' + 0" >{{$t('components.disableBtnText')}}</el-dropdown-item>
                <!--<el-dropdown-item :command="index + '-' + 2">置顶</el-dropdown-item>-->
              </el-dropdown-menu>
            </el-dropdown>

            <!-- 放大按钮 -->
            <i class="p-l-expand-btn el-icon-full-screen" @click="expandPolicyHandler(index, $event)"></i>
          </div>
        </div>
      </div>
      <template v-if="formatedPolicyList.length > 3">
        <i class="p-l-left-btn el-icon-arrow-left"
          :class="{ 'disabled': navActiveIndex === 0 }"
          @click="tapPrevBtn"></i>
        <i class="p-l-right-btn el-icon-arrow-right"
          :class="{ 'disabled': navActiveIndex === (navItems.length - 1) }"
          @click="tapNextBtn"></i>
      </template>

      <ul class="p-l-list-nav-bar" v-if="navItems.length > 1">
        <li
          v-for="(item, index) in navItems"
          :key="'nav-item-'+ (index + 1)"
          :class="{'active': navActiveIndex === index}"
          @click="exchangeNacActiveIndex(index)"
        ></li>
      </ul>
      <!--<div class="p-l-add-box" @click="addPolicy">-->
      <!--<span><i class="el-icon-circle-plus"></i>添加策略</span>-->
      <!--</div>-->
      <!--        <el-dialog-->
      <!--            :title="expandedPolicy.policyName"-->
      <!--            :visible.sync="isExpandPolicy"-->
      <!--            width="660px">-->
      <!--            <pre class="policy-text" v-if="expandedPolicy.policyId" v-html="expandedPolicy.policyText"></pre>-->
      <!--        </el-dialog>-->
    </div>

    <div v-if="isExpandPolicy" :style="enlargedDisplayBox" style="position: fixed; background-color: #fff; z-index: 100;"></div>
  </div>
</template>

<script>
import { beautifyPolicy } from "@freelog/freelog-policy-lang";

export default {
  name: "policy-list",
  components: {},
  props: {
    policyList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      visibleCardCount: 3,
      cardActiveIndex: 0,
      navActiveIndex: 0,
      expandedPolicyIndex: 0,
      isExpandPolicy: false,

      enlargedDisplayBox: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    };
  },
  computed: {
    navItems() {
      var count = Math.ceil(
        this.formatedPolicyList.length / this.visibleCardCount
      );
      console.log(new Array(count).fill(1));
      return new Array(count).fill(1);
    },
    formatedPolicyList() {
      const policyList = this.policyList
        .filter(p => p.policyId)
        .map(p => {
          p.policyText = beautifyPolicy(p.policyText);
          return p;
        });
      return policyList;
    },
    policyTranslateX() {
      // return this.cardActiveIndex < 3 ? 0 : (this.cardActiveIndex - 2) * 258
      return this.cardActiveIndex * 258;
    },
    expandedPolicy() {
      return this.formatedPolicyList[this.expandedPolicyIndex];
    }
  },
  methods: {
    exchangeNacActiveIndex(index) {
      this.navActiveIndex = index;
      this.cardActiveIndex = index * this.visibleCardCount;
    },
    tapPrevBtn() {
      this.navActiveIndex = this.navActiveIndex - 1;
      this.navActiveIndex = this.navActiveIndex < 0 ? 0 : this.navActiveIndex;
      this.cardActiveIndex = this.navActiveIndex * this.visibleCardCount;
    },
    tapNextBtn() {
      this.navActiveIndex = this.navActiveIndex + 1;
      this.navActiveIndex =
        this.navActiveIndex === this.navItems.length
          ? this.navItems.length - 1
          : this.navActiveIndex;
      this.cardActiveIndex = this.navActiveIndex * this.visibleCardCount;
    },
    addPolicy() {
      this.$emit("add-policy");
    },
    expandPolicyHandler(index, event) {
      // console.log(event.target.parentNode, 'eventeventevent');
      // console.log(event.target.parentNode.getBoundingClientRect(), 'eventeventevent');
      this.isExpandPolicy = true;
      this.expandedPolicyIndex = index;

      const {
        top,
        right,
        bottom,
        left
      } = event.target.parentNode.getBoundingClientRect();
      console.log(top, right, bottom, left, "top, right, bottom, left");
      this.enlargedDisplayBox = {
        top: top + "px",
        right: window.innerWidth - right + "px",
        bottom: window.innerHeight - bottom + "px",
        left: left + "px"
      };
      // console.log(this.enlargedDisplayBox, 'enlargedDisplayBox');
    },
    handleCommand(command) {
      let [policyIndex, status] = command.split("-");
      status = +status;
      if (status === 0 || status === 1) {
        this.updatePolicyStatus(this.policyList[policyIndex], status);
      }
    },
    // 更新策略的上下线状态，0：下线，1：上线
    updatePolicyStatus(policy, status) {
      this.$emit("update-policies", {
        policyName: policy.policyName,
        status: status,
        policyId: policy.policyId
      });
    }
  },
  created() {}
};
</script>

<style lang="less" type="text/less" scoped>
.policy-list-wrapper {
  position: relative;
}

.p-l-main-content {
  overflow: hidden;
  margin: 20px 80px;

  &.no-overflow {
    margin: 10px 0 20px 0;
  }
}

.p-l-add-box {
  margin-top: 15px;
  text-align: right;

  span {
    position: relative; cursor: pointer;
    margin-left: 30px; padding-left: 28px; padding-right: 12px;
    font-weight: bold; color: #333;
  }

  .el-icon-circle-plus {
    position: absolute; top: 50%; left: 0; z-index: 5;
    transform: translateY(-50%);
    font-size: 22px; font-weight: 600; color: #409eff;
  }
}

.p-l-item {
  &:first-child {
    background-color: gray;
  }

  display: inline-block; overflow: hidden;
  position: relative;
  margin-right: 20px; padding: 4px;

  .el-dropdown {
    position: absolute; top: 35px; right: 13px; z-index: 10;
    cursor: pointer;

    .el-icon-more {
      padding: 4px; border-radius: 50%;
      font-size: 14px; background-color: #f3f3f3; color: #979797;
    }
  }

  .p-l-expand-btn {
    position: absolute; bottom: 10px; right: 13px; z-index: 10;
    cursor: pointer;
    padding: 4px; border-radius: 2px;
    font-size: 14px; background-color: #f3f3f3; color: #979797;
  }
}

.p-l-item-head {
  height: 26px;

  .el-icon-download {
    transform: rotate(180deg);
    font-size: 14px; font-weight: bold; color: #f5a623;
  }
}

.p-l-card {
  display: inline-block; box-sizing: border-box;
  width: 300px; height: 185px; padding: 9px; border-radius: 4px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);

  .p-l-status {
    display: inline-block;
    font-size: 14px;

    &.p-l-s-top { color: #f5a623;}
    &.p-l-s-disabled { color: #d8d8d8;}
    &.p-l-s-active { color: #84cca8;}
  }

  h5 {
    margin-bottom: 5px;
    font-size: 14px;
  }

  .policy-text {
    overflow: auto;white-space: pre-wrap;
    height: 143px;
    font-size: 14px;
  }
}

.p-l-left-btn,
.p-l-right-btn {
  position: absolute; top: 100px; z-index: 10;
  font-size: 36px;
  cursor: pointer;

  &.disabled {
    cursor: not-allowed;
    color: #c3c3c3;
  }
}

.p-l-left-btn {
  left: 10px;
}

.p-l-right-btn {
  right: 10px;
}

.p-l-list-nav-bar {
  margin-top: 10px;
  text-align: center;
  cursor: pointer;

  li {
    display: inline-block;
    width: 10px; height: 10px; margin: 0 5px; padding: 0; border-radius: 50%;
    background-color: #dbdbdb;

    &.active {
      background-color: #409eff;
    }
  }
}
</style>
