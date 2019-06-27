<template>
  <div class="account-withdraw-view">
    <account-layout :title="$t('accounts.withdraw.title')" :showFooter="false">
      待开发
    </account-layout>
  </div>
</template>


<script>
import AccountLayout from '@/views/layout/account.vue'

export default {
  name: 'account-withdraw-view',

  data() {
    return {}
  },

  props: {
  },

  components: { AccountLayout },

  mounted() {
  },

  computed: {
    renderData() {
      return this.$route.query
    }
  },

  methods: {
    cancelHandler() {
      this.goBack()
    },
    goBack() {
      this.$router.push('/user/accounts')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
