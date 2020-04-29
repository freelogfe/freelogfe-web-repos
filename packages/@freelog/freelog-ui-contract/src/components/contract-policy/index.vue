<template>
  <pre class="segment-text" >{{policyText}}</pre>
</template>

<script>
import { beautifyPolicy } from '@freelog/freelog-policy-lang'
export default {
  name: 'contract-policy-text',
  props: {
    policy: Object
  },
  computed: {
    policyText() {
      return beautifyPolicy(this.policy.policyText)
    }
  },
}
</script>