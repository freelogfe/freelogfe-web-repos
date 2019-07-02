import {onloadResourceDetail} from '@/data/resource/loader'
import ResourceInput from '../input/index.vue'
import ReleaseSearch from '@/views/release/search/index.vue'

export default {
    name: 'resource-creator',
    components: {
        ResourceInput,
        ReleaseSearch,
    },
    data() {
        return {
            resourceDetail: {},
            detailData: {},
            // 是否是资源编辑模式，而非创建模式
            isResourceIdEditMode: !!this.$route.query.resourceId,

            isShowReleaseSearchDialog: false,
            releasesList: [],                   // 所有发行集合
        }
    },
    mounted() {
        // this.$axios.get('')
        const params = this.$route.params;
        if (params.resourceId) {
            onloadResourceDetail(params.resourceId)
                .then((data) => {
                    this.resourceDetail = data;
                })
                .catch(this.$error.showErrorMessage);
        }
    },
    methods: {
        executeNext(callback) {
            if (this.isRequesting) return;

            this.isRequesting = true;
            if (this.$refs.inputArea.nextHandler) {
                this.$refs.inputArea.nextHandler(this.data).then(
                    (detail) => {
                        console.log(detail, 'detaildetaildetaildetaildetail');
                        this.detailData = detail;
                        this.resourceId = detail.resourceId;

                        if (detail && detail.resourceId) {
                            Object.assign(this.resourceDetail, detail);
                        }
                        this.isRequesting = false;
                        callback();
                    },
                    () => {
                        console.log('!@#$!@#@#$@#$');
                        this.isRequesting = false;
                        callback(true);
                    }
                )
                    .catch((err) => {
                        console.log('1234123423');
                        this.isRequesting = false;
                        callback(true);
                        this.$nextTick(() => {
                            const $error = this.$el.querySelector('.el-form-item__error')
                            if ($error) {
                                $error.parentElement.scrollIntoView()
                                window.scrollBy(0, -80) // 填补fixed占位的高度
                            } else {
                                this.$error.showErrorMessage(err)
                            }
                        });
                    });
            } else {
                this.isRequesting = false
                callback()
            }
        },
        create2QuitHandler() {
            this.executeNext((bool) => {
                const detail = this.resourceDetail
                if (this.$route.params.resourceId) {
                    this.$message.success(this.$t('resource.updateSuccess'))
                } else {
                    this.$message.success(this.$t('resource.createSuccess'))
                }
                setTimeout(() => {
                    this.$router.push(`/resource/detail/${detail.resourceId}`)
                }, 5e2)
            })
        },
        create2AddHandler(bool) {

            return new Promise((resolve, reject) => {
                const detail = this.resourceDetail;
                this.executeNext((boo) => {
                    if (boo) {
                        reject();
                        return;
                    }

                    resolve();

                    if (detail.resourceId) {
                        if (!bool) {
                            this.$router.push(`/resource/detail/${detail.resourceId}`);
                        }
                        // else {
                        //     this.$router.push(`/release/create?resourceId=${this.resourceId}`)
                        // }

                        this.$message.success(this.$t('resource.createSuccess'))
                    }
                })
            });

        },
        cancelHandler() {
            this.$confirm(this.$t('resource.cancelQuestion'))
                .then(() => {
                    this.$router.push('/resource/list')
                }).catch(() => {
            })
        },

        // 获取"所属发行列表"
        fetchReleaseList() {
            this.$services.ResourceService.get(`${this.resourceId}/releases`)
                .then(res => res.data)
                .then(res => {
                    if (res.errcode === 0) {
                        this.releasesList = res.data
                    }
                })
        },
        // 添加依赖
        tapAddDependencyBtn() {
            // 若该资源已发行，则不能修改依赖
            if (this.releasesList.length > 0) return
            this.isShowReleaseSearchDialog = true
            this.releaseSearchType = 'dependency'
        },
        updateResourceDetail() {
            const params = {
                aliasName: this.resourceDetail.resourceInfo.aliasName,
                description: this.resourceDetail.resourceInfo.description,
            }
            if (this.releasesList.length === 0) {
                params.dependencies = this.dependencies.map(dep => {
                    return {releaseId: dep.releaseId, versionRange: dep.latestVersion.version}
                })
            }
            if (this.resPreviewImage !== '') {
                params.previewImages = [this.resPreviewImage]
            }
            var promise = null
            try {
                params.meta = JSON.parse(this.meta)
                promise = this.$services.ResourceService.put(this.resourceId, params).then(res => res.data)
            } catch (e) {
                promise = Promise.reject(`JSON格式有误:${e}`)
            }
            return promise.catch(this.$error.showErrorMessage)
        },

        releaseSearchHandler(release) {
            // switch (this.releaseSearchType) {
            //     case 'release': {
            // console.log(resourceDetail, 'resourceDetailresourceDetailresourceDetail');
            setTimeout(() => {
                if (release.resourceType === this.detailData.resourceType) {
                    // 跳转 发行编辑页
                    this.$router.push(`/release/add?releaseId=${release.releaseId}&resourceId=${this.resourceId}`)
                } else {
                    this.$message({
                        type: 'warning',
                        message: `所选发行的资源类型必须为${this.resourceDetail.resourceInfo.resourceType}`
                    })
                }
            });

                //     break
                // }
                // case 'dependency': {
                //     this.addDependency(release)
                //     break
                // }
            // }
        },
        // addDependency(release) {
        //     let isExisted = false
        //     const leng = this.dependencies.length
        //     for(let i = 0; i < leng; i++) {
        //         if(this.dependencies[i].releaseId === release.releaseId) {
        //             isExisted = true
        //             break
        //         }
        //     }
        //     if(isExisted) {
        //         this.$message({ type: 'warning', message: `依赖中已存在发行"${release.releaseName}"!` })
        //     }else {
        //         this.dependencies.push(release)
        //     }
        //
        // },
        // 创建一个全新的发行
        createNewRelease() {
            // 跳转 发行中间页
            this.$router.push(`/release/create?resourceId=${this.resourceId}`)
        },
        /**
         * 点击『创建并发行』
         * @return {Promise<void>}
         */
        async handleRelease() {
            try {
                await this.create2AddHandler(true);
                this.addToRelease();
            } catch (e) {

            }

            // .then(data => {

            // })
        },
        /**
         * 添加发布
         */
        addToRelease() {
            this.isShowReleaseSearchDialog = true;
            this.releaseSearchType = 'release';
        },
    }
}
