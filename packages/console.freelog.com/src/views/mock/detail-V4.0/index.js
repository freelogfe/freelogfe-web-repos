/*
policy更新后，后续签订的policy按新的来，已签约过的按更新前的
 */

import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'

import {mapGetters} from 'vuex'
import RichEditor from '@/components/RichEditor/index.vue'
import ResourceMetaInfo from '../meta/index.vue'
import ReleaseSearch from '@/views/release/search/index.vue'


import {loadDetail} from '@/data/resource/loader'
import {onloadNodeList} from '@/data/node/loader'
import {cssSupports} from '@/lib/utils'

export default {
  name: 'resource-detail',
  components: {
    RichEditor,
    ResourceMetaInfo,
    ReleaseSearch,
  },
  data() {
    return {
      resourceId: this.$route.params.resourceId,
      activeTab: 'resIntro',
      resourceDetail: {
        resourceInfo: {
          status: 2
        },
      },
      dependencies: [],                   // 依赖集合
      releasesList: [],                   // 所有发行集合
      formData: {
        resourceType: '', //storage.get('CREATE_RESOURCE_TYPE') || RESOURCE_TYPES.widget
        resourceName: '',
        widgetName: '',
        description: '',
        previewImage: '',
        widgetVersion: ''
      },
      resPreviewImage: '',
      // 上传到服务器的数据
      uploader: {
        headers: {
          method: 'POST'
        }
      },
      uploaderStates: {
        resource: {
          percentage: 0,
          isUploaded: false,
          isUploading: false,
          name: ''
        },
        thumbnail: {
          percentage: 0,
          isUploaded: false,
          isUploading: false,
          name: ''
        }
      },
      editorConfig: {},
      isDescEditing: false,
      isMetaEditing: false,
      isAliasnameEditing: false,
      metaValid: false,
      isShowReleaseSearchDialog: false,
      releaseSearchType: 'release',
      meta: "{}"
    }
  },

  computed: Object.assign({
    apiHostName() {
      const arr = window.location.hostname.split('.')
      arr.shift()
      arr.unshift('qi')
      return arr.join('.')
    },
    uploadPreviewImageAction() {
      return `//${this.apiHostName}/v1/resources/temporaryFiles/uploadPreviewImage`
    },
    tabs(){
      return [{
        name: 'resIntro',
        title: this.$t('resourceDetailView.tabs[0]')
      }, {
        name: 'resSchemes',
        title: this.$t('resourceDetailView.tabs[1]')
      }, {
        name: 'resDesc',
        title: this.$t('resourceDetailView.tabs[2]')
      }, {
        name: 'resMeta',
        title: this.$t('resourceDetailView.tabs[3]')
      }]
    },
    isOwnerResource() {
      return this.resourceDetail.resourceInfo.isOwner && process.env.NODE_ENV === 'development'
    },
    avatarUrl() {
      const userId = this.resourceDetail.resourceInfo.userId
      return userId ? `https://image.freelog.com/headImage/${userId}?x-oss-process=style/head-image` : ''
    },
    tempMeta() {
      return this.formatMeta(this.resourceDetail.resourceInfo.meta || {})
    },
  }, mapGetters({
    session: 'session'
  })),
  mounted() {
    this.init()
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollFn)
  },
  methods: {
    init() {
      loadDetail(this.resourceId).then((res) => {
        if (this.session && this.session.user) {
          res.isOwner = (res.userId === this.session.user.userId)
        } else {
          res.isOwner = false
        }

        this.resourceDetail.resourceInfo = res
        this.getResourcePreviesImage()
        this.meta = JSON.stringify(this.resourceDetail.resourceInfo.meta || {}, null, 4)
        this.fetchDepReleases()
      }).catch((err) => {
        this.$router.push('/')
        console.error(err)
      })
      this.fetchReleaseList()
      this.initScrollEvent()
    },
    getResourcePreviesImage() {
      var src = ''
      const pImages = this.resourceDetail.resourceInfo.previewImages
      if(pImages && pImages.length > 0) {
        src = pImages[0]
      }
      this.resPreviewImage = src
    },
    initScrollEvent() {
      const $header = document.querySelector('.nav-header')
      const $tabs = this.$refs.tabs
      const $upBtn = this.$refs.upBtn
      const $body = this.$refs.detailBody
      const marginTop = $header.getBoundingClientRect().height
      const originLeft = $tabs.getBoundingClientRect().left
      const tabLeft = getComputedStyle($tabs).left
      let prevTop
      let st = +new Date()
      let fixed = false

      this.scrollFn = () => {
        // throttle
        const et = +new Date()
        if (et - st < 20) return
        st = et

        const rect = $body.getBoundingClientRect()
        if (rect.top <= marginTop && !fixed) {
          fixed = true
          $tabs.style.left = `${originLeft}px`
          $tabs.classList.add('sticky-tabs')
        } else if (rect.top >= marginTop && fixed) {
          fixed = false
          $tabs.style.left = tabLeft || `-130px`
          $tabs.classList.remove('sticky-tabs')
        }
        $upBtn.classList[(rect.top <= prevTop) ? 'add' : 'remove']('show')
        prevTop = rect.top
      }
      window.addEventListener('scroll', this.scrollFn)
    },
    // 批量获取"依赖发行详情"
    fetchDepReleases() {
      const rInfo = this.resourceDetail.resourceInfo
      if(rInfo.systemMeta.dependencies && rInfo.systemMeta.dependencies.length > 0) {
        const releaseIds = rInfo.systemMeta.dependencies.map(dep => dep.releaseId).join(',')
        this.$services.ReleaseService.get(`list?releaseIds=${releaseIds}`)
          .then(res => res.data)
          .then(res => {
            if(res.errcode === 0 ) {
              this.dependencies = res.data || []
            }
          })
      }
    },
    // 获取"所属发行列表"
    fetchReleaseList() {
      this.$services.ResourceService.get(`${this.resourceId}/releases`)
        .then(res => res.data)
        .then(res => {
          if(res.errcode === 0) {
            this.releasesList = res.data
          }
        })
    },
    previewHandler() {
      this.$message.warning('todo')
    },
    scrollInto(target) {
      const $el = this.$refs[target]

      if (!$el) {
        return console.error(`not found target ${target}`)
      }

      this.activeTab = target
      if (typeof $el.scrollIntoView === 'function') {
        $el.scrollIntoView(true)
        window.scrollBy(0, -120) // 填补fixed占位的高度
      } else {
        window.scrollTo(0, $el.offsetTop - 60)
      }
    },
    updatResourceDetail(params) {
      return this.$services.ResourceService.put(this.resourceId, params)
        .then(res => res.data)
        .catch(e => this.$message({ type: 'error', message: e.toString() }))
    },
    previewImageChangeHandler(file, fileList) {
      this.fileLimitValidator(file, fileList)
    },
    // 是否超过上传限制
    fileLimitValidator(file, fileList) {
      if (fileList.length > 1) {
        fileList.shift()
        return false
      }

      return true
    },
    imageUploadSuccessHandler(res) {
      this.uploaderStates.thumbnail.isUploading = false
      if (res.errcode === 0) {
        this.uploaderStates.thumbnail.isUploaded = true
        this.uploaderStates.thumbnail.percentage = 100
        const imgSrc = res.data
        this.updatResourceDetail({ previewImages: [imgSrc] })
          .then(res => {
            if(res.errcode === 0){
              this.$message({ type: 'success', message: '预览图更新成功！' })
              this.resPreviewImage = imgSrc
            }
          })
      } else {
        this.uploaderStates.thumbnail.percentage = 0
        this.$error.showErrorMessage(res.msg)
      }
    },
    validateImageHandler(file) {
      if (!/\.(jpg|png|gif|jpeg)$/.test(file.name)) {
        this.$message.error(this.$t('resourceEditView.noSupportImageTip'))
        return false
      }

      this.resetUploaderState(this.uploaderStates.resource, file)
      return true
    },
    resetUploaderState(uploader, file) {
      Object.assign(uploader, {
        file,
        name: (file && file.name) || '',
        isUploading: true,
        isUploaded: false,
        percentage: 0
      });
    },
    uploadProgressHandler(event, file) {
      const uploaderStates = this.uploaderStates
      let uploader
      if (uploaderStates.resource.name === file.name) {
        uploader = uploaderStates.resource
      } else if (uploaderStates.thumbnail.name === file.name) {
        uploader = uploaderStates.thumbnail
      }

      if (uploader) {
        uploader.percentage = parseInt(file.percentage.toFixed(), 10)
      }
    },
    clearUploaderHandler(uploader) {
      let $uploader
      const uploaderState = this.uploaderStates[uploader]
      if (uploader === 'resource') {
        $uploader = this.$refs.resourceUploader
      } else {
        $uploader = this.$refs.thumbnailUploader
      }

      $uploader.clearFiles()
      $uploader.abort(uploaderState.file)
      Object.assign(uploaderState, {
        sha1: '',
        name: '',
        isUploading: false,
        isUploaded: false,
        percentage: 0
      })
    },
    errorHandler(err) {
      this.loading = false
      let errMsg
      let error

      if (err.errcode !== undefined) {
        error = {error: err.msg}
      } else {
        switch (err.status) {
          case 400:
            errMsg = this.$t('resourceEditView.noSupportTip')
            break
          case 401:
            errMsg = this.$t('resourceEditView.authFailTip')
            break
          default:
            errMsg = err.message
        }
        error = {error: errMsg}
      }

      this.$emit('uploadEnd', error)
      this.$refs.resourceUploader.clearFiles() // reset clearFiles
    },
    // 富文本编辑事件
    imgUploadSuccessHandler(detail) {
      const data = detail.data
      const editor = this.$refs.editor
      if (data.errcode === 0) {
        editor.insertImg(data.data)
      } else {
        this.$message.error(data.msg)
      }
    },
    saveResourceAliasName() {
      this.updatResourceDetail({ aliasName: this.resourceDetail.resourceInfo.aliasName })
        .then(res => {
          if(res.errcode === 0) {
            this.$message({ type: 'success', message: '资源别名保存成功！' })
            this.isAliasnameEditing = false
          }else {
            this.$message({ type: 'error', message: '资源别名保存失败！' })
          }
        })
    },
    editDesc() {
      this.isDescEditing = true
    },
    saveDesc() {
      this.updatResourceDetail({ description: this.resourceDetail.resourceInfo.description })
        .then(res => {
          if(res.errcode === 0) {
            this.$message({ type: 'success', message: '资源描述保存成功！' })
            this.isDescEditing = false
          }else {
            this.$message({ type: 'error', message: '资源描述保存失败！' })
          }
        })
    },
    checkMetaValid(valid) {
      console.log('arguments ---', valid)
      this.metaValid = valid
    },
    editMeta() {
      this.isMetaEditing = true
      this.meta = JSON.stringify(this.resourceDetail.resourceInfo.meta || {}, null, 4)
    },
    formatMeta(meta){
      return meta !== "{}" ? JSON.stringify(meta, null, 4) : this.$t('resourceDetailView.noMetaTip')
    },
    saveMeta() {
      var meta = this.meta
      try {
        meta = JSON.parse(meta)
        this.updatResourceDetail({ meta })
          .then(res => {
            if(res.errcode === 0) {
              this.$message({ type: 'success', message: 'meta信息保存成功！' })
              this.isMetaEditing = false
              this.resourceDetail.resourceInfo.meta = meta
            }else {
              this.$message({ type: 'error', message: 'meta信息保存失败！' })
            }
          })
      }catch (e) {
        this.$message({ type: 'error', message: `JSON格式有误${e}` })
      }
    },
    tapAddToReleaseBtn() {
      this.isShowReleaseSearchDialog = true
      this.releaseSearchType = 'release'
    },
    // 创建一个全新的发行
    createNewRelease() {
      // 跳转 发行中间页
      this.$router.push(`/release/create?resourceId=${this.resourceId}`)
    },
    // 添加依赖
    tapAddDependencyBtn() {
      // 若该资源已发行，则不能修改依赖
      if(this.releasesList.length > 0) return
      this.isShowReleaseSearchDialog = true
      this.releaseSearchType = 'dependency'
    },
    releaseSearchHandler(release) {
      switch(this.releaseSearchType) {
        case 'release': {
          if(release.resourceType === this.resourceDetail.resourceInfo.resourceType) {
            // 跳转 发行编辑页
            this.$router.push(`/release/add?releaseId=${release.releaseId}&resourceId=${this.resourceId}`)
          }else {
            this.$message({ type: 'warning', message:`所选发行的资源类型必须为${this.resourceDetail.resourceInfo.resourceType}`})
          }
          break
        }
        case 'dependency': {
          this.addDependency(release)
          break
        }
      }
    },
    addDependency(release) {
      let isExisted = false
      const dependencies = this.dependencies.map(dep => {
        if(dep.releaseId === release.releaseId) {
          isExisted = true
        }
        return { releaseId: dep.releaseId, versionRange: dep.latestVersion.version }
      })
      if(isExisted) {
        this.$message({ type: 'warning', message: `依赖中已存在发行"${release.releaseName}"!` })
      }else {
        dependencies.push({ releaseId: release.releaseId, versionRange: `^${release.latestVersion.version}` })
        this.updatResourceDetail({ dependencies })
          .then(res => {
            if(res.errcode === 0 && res.data) {
              this.$message({ type: 'success', message: '依赖添加成功！' })
              this.dependencies.push(release)
              this.isShowReleaseSearchDialog = false
            }else {
              this.$message({ type: 'error', message: '依赖添加失败：' + res.msg })
            }
          })
      }

    },
    deleteDependency(index) {
      const dependencies = this.dependencies.filter((i, _index) => _index !== index).map(dep => {
        return { releaseId: dep.releaseId, versionRange: dep.latestVersion.version }
      })
      this.updatResourceDetail({ dependencies })
        .then(res => {
          if(res.errcode === 0) {
            this.$message({ type: 'success', message: '依赖删除成功！' })
            this.dependencies.splice(index, 1)
          }else {
            this.$message({ type: 'error', message: '依赖删除失败：' + res.msg })
          }
        })
    }
  }
}
