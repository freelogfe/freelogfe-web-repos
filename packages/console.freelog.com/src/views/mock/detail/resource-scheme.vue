<template>
  <div class="res-scheme-content-wrap" ref="wrap">
    <el-tabs v-model="activeSchemeName">
      <el-tab-pane :label="tab.label" :name="tab.name" v-for="tab in tabs">
        <div class="bubble-res-wrap" v-if="tab.scheme.bubbleResources.length">
          <h5>{{$t('resource.throwUpResource')}}</h5>
          <ul>
            <li v-for="res in tab.scheme.bubbleResources" @click="viewResourceSchemesHandler(res)">
              <i></i>
              {{res.resourceName||res.resourceId}}
            </li>
          </ul>
        </div>

        <div class="policy-list-wrap">
          <el-collapse v-model="tab.activePolicy">
            <el-collapse-item v-for="policy in tab.scheme.policy" :name="policy._index">
              <template slot="title">
                {{policy.policyName}}
              </template>
              <div class="scheme-policy-content">
                <pre>{{policy._fmtPolicyText}}</pre>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import {onloadSchemesForResource} from '@/data/scheme/loader'
  import {loadResources} from '@/data/resource/loader'
  import {beautifyPolicy} from '@freelog/freelog-policy-lang'
  import {SCHEME_PUBLISH_STATUS} from '@/config/scheme'

  export default {
    name: 'resource-detail-schemes',

    data() {
      return {
        tabs: [],
        schemes: [],
        currentScheme: {},
        activeSchemeName: '',
        cachedResourcesSchemes: {}
      }
    },

    props: {
      resource: Object
    },

    watch: {
      'resource.resourceId'() {
        this.initView()
        this.$el.classList.add('show-in-animation')
        setTimeout(() => {
          this.$el.classList.remove('show-in-animation')
        }, 500)
      }
    },

    mounted() {
      this.initView()
    },

    methods: {
      initView() {
        var resourceId = this.resource.resourceId
        if (!resourceId) {
          return
        }

        var schemes = this.cachedResourcesSchemes[resourceId]
        if (schemes) {
          this.schemes = schemes
          this.showSchemes(this.schemes)
          return
        }

        onloadSchemesForResource(resourceId, {
          authSchemeStatus: 1
        })
          .then((data) => {
            if (data.length) {
              this.schemes = this.formatSchemes(data)

              this.showSchemes(this.schemes)
              this.cachedResourcesSchemes[resourceId] = this.schemes
            }
          }).catch(this.$error.showErrorMessage)
      },
      showSchemes(schemes) {
        this.tabs = schemes.map((scheme, index) => {
          return {
            label: scheme.authSchemeName,
            name: scheme.authSchemeId,
            scheme,
            activePolicy: `${scheme.authSchemeId}_0`
          }
        })

        if (schemes.length) {
          this.activeSchemeName = schemes[0].authSchemeId
        }
      },
      formatSchemes(schemes) {
        schemes = schemes.filter((scheme, i) => {
          if (!this.resource.isOwner && SCHEME_PUBLISH_STATUS.deleted === scheme.status) {
            return false
          }

          scheme.policy.forEach((p, index) => {
            try {
              p._fmtPolicyText = beautifyPolicy(p.policyText)
            } catch (e) {
              p._fmtPolicyText = p.policyText
            }

            p._index = `${scheme.authSchemeId}_${index}`
          })
          return scheme
        })
        return schemes
      },
      viewResourceSchemesHandler(resource) {
        this.$emit('switch', resource)
      }
    }
  }
</script>

<style lang="less" scoped>
  @keyframes showIn {
    from {
      opacity: 0;
      transform: translate(100%, 0);
    }

    to {
      opacity: 1;
      transform: translate(0, 0);
    }
  }

  .res-scheme-content-wrap {
    &.show-in-animation {
      animation: showIn .5s ease-in-out;
    }
    .bubble-res-wrap {
      color: #333333;
      font-size: 14px;
      margin-bottom: 30px;
      h5 {
        margin-bottom: 10px;
      }
      ul {
        background-color: #F8F8F8;
        padding: 15px 20px 5px;
        border-radius: 4px;
        li {
          margin-bottom: 10px;
          cursor: pointer;
        }
        i {
          display: inline-block;
          width: 12px;
          height: 12px;
          background-color: #E24B4B;
          border-radius: 50%;
          margin-right: 10px;
        }
      }
    }

    .policy-list-wrap {
      h5 {
        margin-bottom: 10px;
        font-size: 14px;
      }
      .scheme-policy-content {
        background-color: #F8F8F8;
        padding: 10px 20px;
        border-radius: 4px;
      }
    }
  }
</style>
