<template>
  <div class="tree-node" :class="[]">
    <div class="node-content" :class="[data.contractType]">
      <div class="node-key" :class="{'active': data.key === activeKey}" @click="tapNodeKey(data)">
        <i class="el-icon-tickets">
          <i class="el-icon-setting"/>
        </i>
      </div>
      <div class="node-label" @click="tapNodeContent(data)">{{data.label}}</div>
    </div>
    <transition name="fade">
      <div class="children-box" v-if="data.children && data.isShowChildren">
        <contract-tree
                v-for="child in data.children"
                :data="child"
                :activeKey.sync="childActiveKey"
                @activate="showContract"
                @inactivate="hideContract"
        />
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'contract-tree',
    props: {
      data: Object,
      activeKey: String,
    },
    data() {
      return {
        childActiveKey: ''
      }
    },
    watch: {
      activeKey() {
        this.childActiveKey = this.activeKey
      },
      childActiveKey() {
        this.$emit('update:activeKey', this.childActiveKey)
      }
    },
    methods: {
      tapNodeKey(data) {
        if(this.activeKey !== data.key) {
          this.$emit('activate', data)
          this.$emit('update:activeKey', data.key)
        }else {
          this.$emit('inactivate', data)
          this.$emit('update:activeKey', '')
        }
      },
      showContract(data) {
        this.$emit('activate', data)
      },
      hideContract(data) {
        this.$emit('inactivate', data)
      },
      tapNodeContent() {}
    },
  }
</script>

<style lang="less" type="text/less" scoped>

  .fade-enter-active {
    transition: all .5s ease;
  }
  .fade-leave-active {
    transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .fade-enter, .fade-leave-to {
    transform: translateX(-20px);
    opacity: 0;
  }

  .tree-node {
    display: -webkit-box;
    box-sizing: border-box; position: relative;
    text-align: left;

    &.first-level {
      padding-bottom: 0;
      &:first-child:before {
        width: 24px;
      }
    }

    &:not(:last-child):after {
      content: '';
      position: absolute; left: -30px; top: 30px; bottom: -37px; z-index: 0;
      width: 30px; border: 1px solid #BABABA; border-top-width: 0; border-right-width: 0;
      border-bottom-left-radius: 6px;
    }
    &:first-child:before {
      content: '';
      position: absolute; top: 35px; right: 100%; z-index: 0;
      width: 45px; height: 1px;
      background-color: #BABABA;
    }

    .node-content {
      overflow: hidden;
      padding: 5px 0 20px 5px;
      font-size: 20px; z-index: 5;

      &.success {
        .node-key { border-color: #50C190; box-shadow: 0 0 8px #50C190B3; }
        .el-icon-setting { color: #50C190; }
      }
      &.error {
        .node-key { border-color: #E35A5F; box-shadow: 0 0 8px #E35A5FB3; }
        .el-icon-setting { color: #E35A5F; }
      }
      &.warning {
        .node-key { border-color: #E6A232; box-shadow: 0 0 8px #E6A232B3; }
        .el-icon-setting { color: #E6A232; animation: turnAround 3s linear infinite; }

      }

      .node-key {
        box-sizing: border-box;
        position: relative; float: left; cursor: pointer;
        width: 62px; height: 62px; border: 1px solid #ccc; border-radius: 50%;
        line-height: 60px; font-size: 12px; text-align: center; background-color: #fff;
        &.active { border-width: 2px; }
        .el-icon-tickets { position: relative; margin-top: 12px; font-size: 36px; }
        .el-icon-setting {
          position: absolute; bottom: 0; left: 0; z-index: 1;
          transform: translate(-6%, 12%);
          border-radius: 50%;
          font-size: 22px; font-weight: bold; background-color: #fff;
        }

      }
      .node-key:after {
        content: '';
        position: absolute; left: 60px; top: 50%; z-index: 0; transform: translateY(-50%);
        width: 41px; height: 1px;
        background-color: #BABABA;
      }
      .node-label {
        float: left; box-sizing: border-box;
        display: flex; justify-content: center; align-items: center;
        width: 160px; height: 60px; padding: 2px 6px; margin-left: 40px; border: 1px solid #ccc; border-radius: 6px;
        font-size: 14px; text-align: center; background-color: #fff; cursor: pointer;
      }
    }

    .children-box {
      position: relative; padding-left: 45px;
      /*padding-top: 48px; transform: translate(100%, -48px);*/
    }
  }

  @keyframes turnAround {
    from { transform: rotate(0); }
    to { transform: rotate(360deg); }
  }
</style>
