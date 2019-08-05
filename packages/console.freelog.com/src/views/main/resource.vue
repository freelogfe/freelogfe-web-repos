<template>
  <div class="main-resource-item-wrap" @click="gotoDetail">
    <div class="res-poster-wrap">
      <img :src="postImgUrl|padImage" :class="{'resource-default-preview':!postImgUrl}" alt="">
    </div>
    <div class="res-digest-info">
      <p class="res-name">{{resource.resourceName}}</p>
      <p class="res-author-name"><span>{{resource.resourceType}}</span>{{resource.userName}}
      </p>
    </div>
    <ul class="res-policies-list" v-if="schemes.length">
      <li class="res-p-item" :class="resSchemeStatusCls(scheme)"
          :key="scheme.authSchemeId"
          v-for="scheme in schemes">
        {{scheme.authSchemeName[0]}}
        <div class="res-scheme-info-wrap">
          <h4>{{scheme.authSchemeName}}</h4>
          <div class="res-scheme-item">
            <p>{{ $t('policy.authTarget')}}：</p>
            <ul class="res-scheme-item res-scheme-auth-targets">
              <li v-for="(user,index) in scheme.targets" :key="index">{{user}}</li>
            </ul>
          </div>
          <div class="res-scheme-item">
            <p>{{ $t('resource.throwUp')}}：</p>
            <div><i class="res-scheme-status-icon"></i>{{scheme.isBubbled? $t('common.yes'): $t('common.no')}}</div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import {onloadSchemesForResource} from '@/data/scheme/loader'
  import {RESOURCE_STATUS} from '@/config/resource'

  export default {
    name: 'main-list-resource-item',

    data() {
      return {
        schemes: []
      }
    },
    props: {
      resource: {
        type: Object,
        default() {
          return {}
        }
      },
      type: {
        type: String,
        default: 'list'
      }
    },

    computed: {
      postImgUrl() {
        let src

        if (this.resource.previewImages.length) {
          src = this.resource.previewImages[0]
        } else {
          src = ''
        }

        return src
      }
    },

    mounted() {
      this.format(this.resource)
    },

    methods: {
      resSchemeStatusCls(scheme) {
        return scheme.bubbleResources.length ? 'status-1' : 'status-0'
      },
      format(resource) {
        if (!this.resource.resourceId) {
          return
        }

        resource._statusInfo = RESOURCE_STATUS[resource.status]

        if (!resource.schemes) {
          onloadSchemesForResource(resource.resourceId).then((list) => {
            this.schemes = list.map(this.resolveScheme)
          })
        } else {
          this.schemes = resource.schemes.map(this.resolveScheme)
        }
      },
      resolveScheme(scheme) {
        const users = new Set()
        scheme.policy.forEach((p) => {
          p.authorizedObjects.forEach((objs) => {
            objs.users.forEach((u) => {
              users.add(u)
            })
          })
        })

        scheme.targets = Array.from(users)
        scheme.isBubbled = scheme.bubbleResources.length > 0
        return scheme
      },
      gotoDetail() {
        this.$router.push(`/resource/detail/${this.resource.resourceId}`)
      }
    }
  }
</script>


<style lang="less" type="text/less" scoped>
  @import "../../styles/mixin";

  @status0Color: #009AFF;
  @status1Color: #EDA02C;
  .main-resource-item-wrap {
    overflow: hidden;
    cursor: pointer;
    position: relative;
    padding-bottom: 6px;
    min-height: 200px;

    .res-scheme-info-wrap {
      position: absolute;
      bottom: 40px;
      top: 0;
      right: 0;
      left: 100%;
      padding: 20px 10px 0;
      background-color: white;
      color: #222222;
      font-size: 14px;
      transition: left .3s;
      text-align: left;
      width: 100%;

      h4 {
        font-size: 16px;
        margin-bottom: 25px;
      }

      .res-scheme-item {
        margin-bottom: 25px;
        p {
          margin-bottom: 10px;
        }

        i {
          border: 5px solid;
          border-radius: 50%;
          height: 0;
          width: 0;
          display: inline-block;
          margin-right: 5px;
        }
      }
      .res-scheme-auth-targets {
        display: flex;
        li {
          color: @status0Color;
          border: 1px solid @status0Color;
          border-radius: 11px;
          padding: 0 10px;
          margin-right: 10px;
        }
      }
    }

    .res-policies-list {
      display: flex;
      align-items: center;
      padding-left: 10px;
      overflow: auto;
      .res-p-item {
        margin-right: 6px;
        border: 1px solid;
        border-radius: 11px;
        text-align: center;
        width: 22px;
        min-width: 22px;
        /*无上抛*/
        &.status-0 {
          border-color: @status0Color;
          color: @status0Color;

          .res-scheme-status-icon {
            border-color: @status0Color;
          }
        }

        /*有上抛*/
        &.status-1 {
          border-color: @status1Color;
          color: @status1Color;
          .res-scheme-status-icon {
            border-color: @status1Color;
          }
        }

        &:hover {
          color: white;
          .res-scheme-info-wrap {
            left: 0
          }

          &.status-0 {
            background-color: @status0Color;
          }

          &.status-1 {
            background-color: @status1Color;
          }
        }
      }
    }

    img {
      width: 100%;
      height: 165px;
      display: block;
    }
    .res-digest-info {
      padding: 10px 10px 8px;
      p {
        padding-bottom: 10px;
        color: #333333;
        .text-ellipsis;
      }

      p:last-child {
        border-bottom: 1px solid #E6E6E6;
      }

      .res-author-name {
        span {
          float: right;
          margin-left: 50px;
        }
      }

      .res-name {
        color: #222222;
        font-weight: 500;
        font-size: 14px;
      }
    }

  }
</style>
