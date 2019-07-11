<template>
  <div class="resource-contract-detail-view">
    <account-layout ref="layout" :title="$t('resources.detail.title')" :showFooter="false" return-name="/user/contracts">

      <f-contract-signing-single
              style="width: 100%"
              v-if="isRenderContract"
              :presentable="presentable"
      ></f-contract-signing-single>
    </account-layout>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AccountLayout from '@/views/layout/account.vue'

export default {
  name: 'resource-contract-detail-view',

  data() {
    return {
      presentable: null,
      isRenderContract: false
    }
  },

  props: {
  },

  components: { AccountLayout },

  mounted() {
    const { presentableId } = this.$route.query
    this.$axios.get(`/v1/presentables/${presentableId}`).then(res => res.data)
      .then((res) => {
        if (res.errcode === 0 && res.data) {
          this.presentable = res.data
          this.isRenderContract = true
        }
      })
  },

  computed: {
    ...mapGetters({
      user: 'session'
    })
  },


  methods: {
    goBack() {
      this.$refs.layout.goBack()
    }

  },

  destroyed() {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="less" scoped type="text/less">

</style>
