import BlockBody from '@/components/ResourceComponents/BlockBody.vue';
import SmallTitle from '@/components/ResourceComponents/SmallTitle.vue';
// import DepList from '@/components/ResourceComponents/DepList.vue';
// import HeaderAlert from '@/components/ResourceComponents/HeaderAlert.vue';
import UploadFile from '@/components/ResourceComponents/UploadFile/index.vue';
// import UploadCover from '@/components/ResourceComponents/UploadCover/index.vue';
import ReleaseSearch from '@/views/release/search/index.vue';
import RichEditor from '@/components/RichEditor/index.vue';
import MetaInfoInput from '@/components/MetaInfoInput/index.vue';
import DependentReleaseList from '@/components/DependentReleaseList/index.vue';

export default {
    name: 'editor',

    components: {
        SmallTitle,
        UploadFile,
        // UploadCover,
        ReleaseSearch,
        DependentReleaseList,
        BlockBody,
        RichEditor,
        MetaInfoInput,
        // HeaderAlert,
    },

    data() {
        return {
            isUpdateResource: !!this.$route.params.resourceId,
            // 资源类型选项
            resourceTypes: ['json', 'widget', 'image', 'audio', 'markdown', 'page_build', 'revealSlide', 'license', 'video', 'catalog'],
            // 资源类型值
            resourceType: '',
            // 资源类型，是否提醒
            resourceTypeTip: false,

            // 上传文件的信息
            uploadFileInfo: {
                fileID: '',
                sha1: '',
                name: '',
                size: 0,
            },

            // 资源名称
            resourceName: '',

            // 封面图链接
            // coverURL: '',

            // 添加依赖弹出框是否显示
            visibleDepDialog: false,
            // 依赖列表
            depList: [],

            // 资源描述
            description: '',

            // meta 信息
            metaInfo: '{}',
            // 是否显示 meta 输入框
            visibleMetaInput: false,
            // meta 错误信息提示
            metaValidError: '',

            // 是否显示发布
            isShowReleaseSearchDialog: false,
            // 临时存放的 新建的资源 ID
            tmpRreatedResourceID: '',
        };
    },
    mounted() {
        // console.log(this.$route, 'this.$routethis.$routethis.$route');
        this.initDataByResourceId();
    },

    methods: {
        /**
         * 当为更新 mock 资源时，初始化数据
         * @return {Promise<void>}
         */
        async initDataByResourceId() {
            const {resourceId} = this.$route.params;
            if (!resourceId) {
                return;
            }
            const res = await this.$axios.get(`/v1/resources/${resourceId}`);
            return;
            // console.log(res.data.data, 'res.data.datares.data.data');
            const result = res.data.data;
            this.resourceType = result.resourceType;
            this.uploadFileInfo = {
                fileID: '',
                sha1: '',
                name: result.systemMeta.filename,
                size: result.systemMeta.fileSize,
            };
            this.resourceName = result.name;
            // this.coverURL = result.previewImages[0] || '';
            this.depList = [
                ...result.systemMeta.dependencyInfo.releases.map(i => ({
                    id: i.releaseId,
                    name: i.releaseName,
                    version: i.versionRange,
                })),
                ...result.systemMeta.dependencyInfo.mocks.map(i => ({
                    id: i.mockResourceId,
                    name: i.mockResourceName,
                })),
            ];
            this.description = result.description;
            this.metaInfo = JSON.stringify(result.meta);
        },

        /**
         * 资源类型改变时
         */
        onChangeResourceType() {
            this.resourceTypeTip = false;
        },

        /**
         * 上传文件信息发生变化
         */
        onFileInfoChange(fileInfo) {
            // console.log(fileInfo, 'fileInfofileInfo');
            this.uploadFileInfo = {...fileInfo};
            if (!this.resourceName) {
                const arr = fileInfo.name.split('.');
                arr.pop();
                this.resourceName = arr.join('.');
            }
        },
        /**
         * 当上传时，没有选择文件类型时
         * @param e
         */
        onUploadNoType(e) {
            this.resourceTypeTip = false;

            setTimeout(() => this.resourceTypeTip = true, 30);
        },
        /**
         * 封面上传成功后
         * @param imageUrl
         */
        // coverUploaded(imageUrl) {
        //     this.coverURL = imageUrl;
        // },

        /**
         * 显示依赖弹出框
         */
        showDepDialog() {
            this.visibleDepDialog = true;
        },
        /**
         * 添加依赖
         */
        // addDep(dep) {
        //     // console.log(dep, 'debpdebpdebpdebpdebpdebp');
        //     this.visibleDepDialog = false;
        //     this.depList.push({
        //         id: dep.releaseId,
        //         name: dep.releaseName,
        //         // 有版本号为正式资源，否则为 mock 资源
        //         version: dep.latestVersion ? dep.latestVersion.version : undefined,
        //     });
        // },
        /**
         * 依赖列表变化时
         */
        onChangeDeps(deps) {
            // console.log(deps, 'depsdepsdepsdeps');
            this.depList = deps;
        },

        /**
         * 描述的 富文本框 上传图片成功
         */
        // descriptionImgUploadSuccess(detail) {
        //     console.log(detail, 'detaildetaildetail');
        //     const data = detail.data;
        //     const editor = this.$refs.editor;
        //     if (data.errcode === 0) {
        //         editor.insertImg(data.data);
        //     } else {
        //         this.$message.error(data.msg);
        //     }
        // },

        /**
         * 显示 meta 输入框
         */
        showMetaInput() {
            this.visibleMetaInput = true;
        },
        /**
         * 检查 meta 是否合法
         */
        checkMetaValid(valid) {
            console.log(valid, 'validvalidvalid');
            this.metaValidError = valid;
        },

        /**
         * 提交数据
         */
        async submit() {
            if (!this.resourceType) {
                this.$message.error('请选择资源类型');
                throw new Error('请选择资源类型');
            }

            if (!this.uploadFileInfo.name) {
                this.$message.error('请上传文件');
                throw new Error('请上传文件');
            }

            this.resourceName = this.resourceName.trim();
            if (!this.resourceName) {
                this.$message.error('请输入资源名称');
                throw new Error('请输入资源名称');
            }

            if (!/^(?!.*(\\|\/|:|\*|\?|"|<|>|\||\s)).{1,60}$/.test(this.resourceName)) {
                this.$message.error(`资源的名称不能包含空格和以下字符：\\ / : * ? " < > |`);
                throw new Error(`资源的名称不能包含空格和以下字符：\\ / : * ? " < > |`);
            }

            if (this.metaValidError) {
                this.$message.error('meta JSON格式有误');
                throw new Error('meta JSON格式有误');
            }

            // const {bucketName, mockResourceId} = this.$route.params;
            const params = {
                uploadFileId: this.uploadFileInfo.fileID || undefined,
                aliasName: this.resourceName,
                // previewImages: this.coverURL ? [this.coverURL] : undefined,
                dependencies: this.depList.filter(i => i.version).map(i => ({
                    releaseId: i.id,
                    versionRange: `^${i.version}`
                })),
                description: this.description,
                meta: JSON.parse(this.metaInfo),
            };

            // if (bucketName) {
            const res = await this.$axios.post('/v1/resources', params);
            if (res.data.errcode !== 0) {
                return this.$message.error('创建失败');
            }
            this.$message.success('创建成功');
            return res.data.data.resourceId;
            // }

            // if (mockResourceId) {
            //     const res = await this.$axios.put(`/v1/resources/mocks/${mockResourceId}`, params);
            //     if (res.data.errcode !== 0) {
            //         return this.$message.error('保存失败');
            //     }
            //     this.$message.success('保存成功');
            // }

        },
        /**
         * 当两个创建按钮点击时
         * @param bool 是否一起发布
         */
        async onSubmitButtonClick(bool) {
            if (bool && this.depList.some( i => !i.isOnline)){
                return this.$message.error('依赖中有未上线的发行');
            }
            const resourceId = await this.submit();
            if (!bool) {
                return this.$router.replace(`/resource/list`);
            }
            this.tmpRreatedResourceID = resourceId;
            this.isShowReleaseSearchDialog = true;
        },
        /**
         * 创建发行
         */
        createRelease(releaseInfo) {
            // 如果是 创建新发行
            if (!releaseInfo) {
                // console.log(this.tmpRreatedResourceID, 'this.tmpRreatedResourceIDthis.tmpRreatedResourceID');
                return this.$router.replace(`/release/create?resourceId=${this.tmpRreatedResourceID}`);
            }

            if (releaseInfo.resourceType === this.resourceType) {
                // 跳转 发行编辑页
                this.$router.replace(`/release/add?releaseId=${releaseInfo.releaseId}&resourceId=${this.tmpRreatedResourceID}`)
            } else {
                this.$message({
                    type: 'warning',
                    message: `所选发行的资源类型必须为${this.resourceType}`
                })
            }
            // console.log(releaseInfo, 'releaseInforeleaseInforeleaseInforeleaseInfo');
        },
        /**
         * 返回 mock 首页
         */
        goBack() {
            this.$router.back();
        },
    }

}
