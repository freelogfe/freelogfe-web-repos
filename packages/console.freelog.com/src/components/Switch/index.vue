<template>
  <div class="fl-switch-wrap" :class="{'is-disabled': disabled}">
    <div class="switch-container"
         :class="[checked? 'active-switch': 'inactive-switch']"
         @click="switchHandler">
      <i class="switch-mesh"></i>
      <span class="switch-label">
        <template v-if="checked">
          <template v-if="activeText">
            {{activeText}}
          </template>
          <slot name="active"></slot>
        </template>
        <template v-else>
          <template v-if="inactiveText">
            {{inactiveText}}
          </template>
          <slot name="inactive"></slot>
        </template>
        <!--{{checked? activeText: inactiveText}}-->
      </span>
    </div>
  </div>
</template>

<script>
  import SwitchWidget from './index'

  export default SwitchWidget
</script>

<style lang="less" scoped>
  @import "index.less";
</style>
