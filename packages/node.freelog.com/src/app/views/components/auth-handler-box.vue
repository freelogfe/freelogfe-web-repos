<template>
  <div>
    <f-auth-pagebuild :pbAuthErrorData="pbAuthErrorData"></f-auth-pagebuild>
    <f-auth-dialog></f-auth-dialog>
  </div>
</template>

<script>

import FAuthPagebuild from  './auth-pagebuild.vue'
import FAuthDialog from  './auth-dialog.vue'

export default {
  name: 'auth-handler-box',
  components: {
    FAuthPagebuild, FAuthDialog
  },
  props: {
    pbAuthErrorData: Object
  },
  data() {
    return {}
  },
  methods: {},
}
</script>