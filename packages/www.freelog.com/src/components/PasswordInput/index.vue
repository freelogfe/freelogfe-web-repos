<template>
  <el-input size="small"
            :type="hide?'password':'text'"
            @change="changeHandler"
            v-model="password">
    <i class="pw-input-icon" :class="[hide?'hidden-icon':'visible-icon']"
       slot="suffix"
       @click="handlePasswordVisible">
    </i>
  </el-input>
</template>

<script>
export default {
  name: 'fl-password-input',

  data() {
    return {
      hide: true,
      password: this.value || ''
    }
  },

  props: {
    value: String
  },

  watch: {
    value() {
      this.password = this.value
    }
  },

  methods: {
    handlePasswordVisible() {
      this.hide = !this.hide
    },
    changeHandler() {
      this.$emit('input', this.password)
    }
  }
}
</script>


<style type="text/less" lang="less" scoped>
  .pw-input-icon {
    display: inline-block;
    width: 20px;
    height: 12px;
    background-size: 100%;
    background-repeat: no-repeat;
    margin-right: 5px;
    margin-top: 15px;
    cursor: pointer;
  }

  .visible-icon {
    background-image: url("../../assets/img/visible.png");
  }

  .hidden-icon {
    background-image: url("../../assets/img/hidden.png");
  }
</style>
