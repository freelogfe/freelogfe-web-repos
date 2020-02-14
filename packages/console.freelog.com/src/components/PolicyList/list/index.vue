<!--<i18n src="../policyList.json"></i18n>-->
<template>
  <div class="policy-list">
    <div class="policy-list-wrapper">
      <div class="p-l-main-content clearfix" :class="{'no-overflow': formatedPolicyList.length < 4}">
        <div :style="{ transform: `translateX(-${policyTranslateX}px)` }" style="position: relative; display: inline-block; transition: all .3s; white-space: nowrap;">
          <div class="p-l-item" v-for="(policy, index) in formatedPolicyList" :key="policy.policyId">
            <div class="p-l-item-head"></div>
            <div class="p-l-card" :class="{'disabled': policy.status == 0}">
              <h5>
								<div class="p-l-status p-l-s-top" v-show="false"><i class="el-icon-download"></i></div>
								<div class="p-l-status p-l-s-disabled" v-show="policy.status == 0"><i class="el-icon-error"></i></div>
								<div class="p-l-status p-l-s-active" v-show="policy.status == 1"><i class="el-icon-success"></i></div>
								{{policy.policyName}}
							</h5>
              <pre v-if="policy.policyId" class="policy-text" v-html="policy.policyText"></pre>
            </div>

            <el-dropdown size="small" @command="handleCommand">
              <span class="el-dropdown-link"><i class="el-icon-more"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="policy.status == 0" :command="`${index}-1`">{{$t('components.enableBtnText')}}</el-dropdown-item>
                <el-dropdown-item v-if="policy.status == 1" :command="`${index}-0`">{{$t('components.disableBtnText')}}</el-dropdown-item>
                <!--<el-dropdown-item :command="index + '-' + 2">置顶</el-dropdown-item>-->
              </el-dropdown-menu>
            </el-dropdown>

            <!-- 放大按钮 -->
            <i class="p-l-expand-btn el-icon-full-screen" @click="expandPolicyHandler(index, $event)"></i>
          </div>
					<div class="policy-item-add-tbn pia-btn1" v-if="formatedPolicyList.length <= visibleCardCount" @click="addPolicy">
						<i class="el-icon-circle-plus"></i>
					</div>
        </div>
      </div>

      <ul class="p-l-list-nav-bar" v-if="navItems.length > 1">
				<span class="pll-nav-btn" v-show="navActiveIndex !== 0" @click="tapPrevBtn">上一页</span>
        <li
          v-for="(item, index) in navItems" :key="index"
          :class="{'active': navActiveIndex === index}"
          @click="exchangeNacActiveIndex(index)"
        ></li>
				<span class="pll-nav-btn" v-show="navActiveIndex !== (navItems.length - 1)" @click="tapNextBtn">下一页</span>
				<span>（共{{formatedPolicyList.length}}条策略）</span>
				<!-- <template v-if="formatedPolicyList.length > 3">
					<span>（共{{formatedPolicyList.length}}条策略）</span>
				</template> -->
      </ul>
			<div class="policy-item-add-tbn pia-btn2" v-if="formatedPolicyList.length > visibleCardCount" @click="addPolicy">
				<i class="el-icon-circle-plus"></i>
			</div>
    </div>

    <div
      v-if="isExpandPolicy"
      style="position: fixed; top: 0; right: 0; bottom: 0; left: 0; background-color: rgba(0,0,0,.5); z-index: 99;"
    ></div>
    <div
      v-if="isExpandPolicy"
      style="
            position: fixed;
            font-size: 14px;
            color: #333;
            background-color: #fff;
            transition: top 1s, width 1s , height 1s, left 1s; z-index: 100;"
      :style="enlargedDisplayBox"
    >
      <div
        style="font-weight: 600; line-height: 35px; padding: 0 20px; display: flex; justify-content: space-between; align-items: center;"
      >
        <span>{{formatedPolicyList[expandedPolicyIndex].policyName}}</span>
        <i class="el-icon-circle-close" style="font-size: 16px;" @click="isExpandPolicy = false"></i>
      </div>
      <pre style="padding: 0 20px; white-space: pre-wrap;">{{formatedPolicyList[expandedPolicyIndex].policyText}}</pre>
    </div>
  </div>
</template>

<script>
import { beautifyPolicy } from "@freelog/freelog-policy-lang";
import PolicyCard from "./PolicyCard.vue";

export default {
  name: "policy-list",
  components: {
    PolicyCard
  },
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
        left: 0,
        width: 0,
        height: 0
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
      return this.cardActiveIndex * 301;
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

      // console.log(event.target.parentNode.getBoundingClientRect(), 'event.target.parentNode.getBoundingClientRect()');
      const {
        top,
        width,
        height,
        left
      } = event.target.parentNode.getBoundingClientRect();
      this.enlargedDisplayBox = {
        top: top + "px",
        width: width + "px",
        height: height + "px",
        left: left + "px"
      };
      setTimeout(() => {
        this.enlargedDisplayBox = {
          top: window.innerHeight / 2 - 300 + "px",
          left: window.innerWidth / 2 - 200 + "px",
          width: 400 + "px",
          height: 600 + "px"
        };
      }, 30);
      // console.log(this.enlargedDisplayBox, 'enlargedDisplayBox');
    },
    handleCommand(command) {
      console.log(command, "commandcommandcommand");
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
  created() {},
  watch: {
    isExpandPolicy(val) {
      if (val) {
        window.document.body.style.overflowY = "hidden";
      } else {
        window.document.body.style.overflowY = "auto";
      }
    }
  }
};
</script>

<style lang="less" type="text/less">
.policy-list {
  .policy-list-wrapper {
		position: relative;
		.policy-item-add-tbn {
			position: absolute; right: -40px; top: 46%; transform: translateY(-50%);
			font-size: 32px; color: #666; cursor: pointer;
			&:hover { color: #409eff; }
			&.pia-btn1 { right: -40px; }
			&.pia-btn2 { right: 25px; }
		}
  }

  .p-l-main-content {
    overflow: hidden;
    margin: 20px 100px 15px 0;

    &.no-overflow {
      margin: 10px 0 20px 0;
    }
  }

  .p-l-add-box {
    margin-top: 15px;
    text-align: right;

    span {
      position: relative;
      cursor: pointer;
      margin-left: 30px; padding-left: 28px; padding-right: 12px;
      font-weight: bold; color: #333;
    }

    .el-icon-circle-plus {
      position: absolute; top: 50%; left: 0; z-index: 5; transform: translateY(-50%);
      font-size: 22px; font-weight: 600; color: #409eff;
    }
  }

  .p-l-item {
    overflow: hidden; display: inline-block;
    position: relative;
    margin-right: 20px; padding: 3px;

    .el-dropdown {
      position: absolute; top: 12px; right: 13px; z-index: 10;
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
    // height: 26px;

    .el-icon-download {
      transform: rotate(180deg);
      font-size: 14px; font-weight: bold; color: #f5a623;
    }
  }

  .p-l-card {
    display: inline-block; box-sizing: border-box;
    width: 275px; height: 210px; padding: 9px; border-radius: 4px;
		box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);

		&.disabled { color: #CACACA; }
		.p-l-status {
      display: inline-block;
      font-size: 14px;

      &.p-l-s-top { color: #f5a623;}
      &.p-l-s-disabled { color: #F35265;}
      &.p-l-s-active { color: #00C075;}
    }
    h5 {
      margin-bottom: 5px;
      font-size: 14px;
    }

    .policy-text {
      overflow: auto; white-space: pre-wrap;
      height: 145px; padding-bottom: 25px;
      font-size: 14px;
    }
  }

  .el-icon-arrow-left,
  .el-icon-arrow-right {
		display: none;
    position: absolute; top: 100px; z-index: 10;
    font-size: 36px;
    cursor: pointer;

    &.disabled {
      cursor: not-allowed;
      color: #c3c3c3;
    }
  }

  .el-icon-arrow-left { left: 10px; }
  .el-icon-arrow-right { right: 10px; }

  .p-l-list-nav-bar {
    padding-right: 100px;
    text-align: right; cursor: pointer;

		.pll-nav-btn {
			color: #666;
			&:hover { color: #000; }
		}
    li {
      display: inline-block;
      width: 6px; height: 6px; padding: 0; margin: 0 5px; border-radius: 50%;
      background-color: #dbdbdb;

      &.active { background-color: #409eff; }
		}
		span { color: #BEBEBE; }
  }
}
</style>
