<template>
  <el-button size="small"
             @click="publishHandler(btnOpt.isOnline)"
             :type="btnOpt.type"
             :plain="btnOpt.plain"
             :disabled="btnOpt.disabled"
             v-if="btnOpt.text">{{btnOpt.text}}
  </el-button>
</template>

<script>
  import {RESOURCE_STATUS_MAP} from '@/config/resource'

  export default {
    name: 'fl-resource-button',

    data() {
      return {}
    },

    props: {
      resource: Object
    },

    computed: {
      btnOpt() {
        var opt = {
          plain: true,
          disabled: false,
          text: '',
          type: 'danger'
        }
        switch (this.resource.status) {
          case RESOURCE_STATUS_MAP.unknown:
            Object.assign(opt, {
              disabled: true,
              text: this.$t('components.resourceButton.exception'),
              type: 'warning'
            })
            break
          case RESOURCE_STATUS_MAP.unpublished:
            Object.assign(opt, {
              text: this.$t('components.resourceButton.publish'),
              type: 'primary',
              plain: false,
              isOnline: 1
            })
            break
          case RESOURCE_STATUS_MAP.published:
            Object.assign(opt, {
              text: this.$t('components.resourceButton.offline'),
              isOnline: 0
            })
            break
          case RESOURCE_STATUS_MAP.freeze:
            Object.assign(opt, {
              text: this.$t('components.resourceButton.freeze'),
              disabled: true
            })
            break
          default:
            break;
        }

        return opt
      },
    },

    methods: {
      publishHandler(isOnline) {
        if (!Number.isInteger(isOnline)) return
        var tip = isOnline? this.$t('components.resourceButton.publish'):this.$t('components.resourceButton.offline')
        this.$confirm(this.$t('components.resourceButton.publishTip', {tip}), {
          center: true
        }).then(() => {
          this.$services.resource.put(this.resource.resourceId, {
            isOnline: isOnline
          }).then(res => {
            const {errcode, ret, msg} = res.data
            if (errcode === 0 && ret === 0) {
              this.resource.status = (isOnline === 0) ? RESOURCE_STATUS_MAP.unpublished : RESOURCE_STATUS_MAP.published
              this.$message.success(`${tip}${this.$t('components.resourceButton.success')}`)
            } else {
              this.$message.error(msg || `${tip}${this.$t('components.resourceButton.fail')}`)
            }
          })
        }).catch(() => {

        })
      },
    }
  }
</script>