import {storage} from '@/lib'
import {RESOURCE_TYPES, RESOURCE_STATUS_MAP} from '@/config/resource'
import RichEditor from '@/components/RichEditor/index.vue'
import ResourceMetaInfo from '../meta/index.vue'
import SearchResource from '../search/index.vue'
import ReleaseSearch from '@/views/release/search/index.vue'

const EDIT_MODES = {
    creator: 'creator',
    editor: 'editor'
};

export default {
    name: 'resource-input',
    components: {
        ResourceMetaInfo,
        RichEditor,
        SearchResource,
        ReleaseSearch
    },
    data() {
        const validateResourceType = (rule, value, callback) => {
            const NAME_REG = /^[a-z]{1}[0-9a-z_]{2,19}[0-9a-z]{1}$/;

            if (!NAME_REG.test(value)) {
                callback(new Error(this.$t('resourceEditView.resourceTypeRule', {rule: NAME_REG.toString()})));
            } else {
                callback();
            }
        };
        // 保持与web component中自定义标签名一致
        const validateWidgetName = (rule, value, callback) => {
            // 格式为freelog-xxx-yyyy，最少4个字符
            const NAME_REG = /^freelog-[a-z0-9._-]{3,15}-[a-z0-9._-]{2,14}[a-z0-9]$/;

            if (this.formData.resourceType === RESOURCE_TYPES.widget && !NAME_REG.test(value)) {
                callback(new Error(this.$t('resourceEditView.widgetNameRule')));
            } else {
                callback();
            }
        };

        const validateWidgetVersion = (rule, value, callback) => {
            // 格式为freelog-xxx-yyyy，最少4个字符
            const VERSION_REG = /^\d+\.\d+\.\d+$/

            if (this.formData.resourceType === RESOURCE_TYPES.widget && !VERSION_REG.test(value)) {
                callback(new Error(this.$t('resourceEditView.versionRule')))
            } else {
                callback()
            }
        };

        return {
            ResourceTypes: RESOURCE_TYPES,
            rules: {
                resourceName: [{required: true, message: this.$t('resourceEditView.inputNameTip'), trigger: 'blur'}],
                widgetName: [
                    {validator: validateWidgetName, trigger: 'change'}
                ],
                widgetVersion: [
                    {validator: validateWidgetVersion, trigger: 'change'}
                ],
                resourceType: [
                    {required: true, message: this.$t('resourceEditView.selectTypeTip'), trigger: 'blur'},
                    {validator: validateResourceType, trigger: 'blur'}
                ]
            },
            options: Object.keys(RESOURCE_TYPES).map(k => ({label: k, value: RESOURCE_TYPES[k]})),

            loading: false,
            deps: [],
            showSearchResourceDialog: false,
            formData: {
                resourceType: '', // storage.get('CREATE_RESOURCE_TYPE') || RESOURCE_TYPES.widget
                resourceName: '',
                widgetName: '',
                description: '',
                previewImage: '',
                widgetVersion: ''
            },
            // 上传到服务器的数据
            uploader: {
                headers: {
                    method: 'POST'
                }
            },
            valid: false,
            meta: '{}',
            editMode: EDIT_MODES.creator,
            editorConfig: {},
            percentage: 0,
            currentUploader: '',
            uploaderStates: {
                resource: {
                    percentage: 0,
                    isUploaded: false,
                    isUploading: false,
                    isExistResource: false,
                    name: ''
                },
                thumbnail: {
                    percentage: 0,
                    isUploaded: false,
                    isUploading: false,
                    name: ''
                }
            },

            // 是否高亮提示选择上传资源类型
            doHighlightSelectTip: false,
            doShowMeta: false,
        }
    },
    props: {
        data: {
            type: Object,
            default() {
                return {};
            }
        }
    },

    computed: {
        apiHostName() {
            const arr = window.location.hostname.split('.');
            arr.shift();
            arr.unshift('qi');
            return arr.join('.');
        },
        uploadPreviewImageAction() {
            return `//${this.apiHostName}/v1/resources/temporaryFiles/uploadPreviewImage`;
        },
        uploadResourceFileAction() {
            return `//${this.apiHostName}/v1/resources/temporaryFiles/uploadResourceFile`;
        },
        showCreatorInputItem() {
            return this.editMode === EDIT_MODES.creator;
        },
        shouldShowResourceUploader() {
            return !(this.uploaderStates.resource.isUploading || this.uploaderStates.resource.isUploaded);
        },
        shouldShowThumbnailInput() {
            return this.formData.resourceType === RESOURCE_TYPES.pageBuild;
        },
        canEditDependencies() {
            return !this.data.resourceId;
        },
        enabledEditResourceType() {
            return this.showCreatorInputItem && !this.uploaderStates.resource.isUploaded;
        },
    },

    watch: {
        data() {
            const resource = this.data;
            if (resource.resourceId) {
                this.editMode = EDIT_MODES.editor;
                Object.assign(this.formData, resource);
                this.formData.widgetName = resource.systemMeta.widgetName || '';
                this.formData.widgetVersion = resource.systemMeta.version || '';
                this.deps = resource.systemMeta.dependencies;
                if (resource.previewImages.length) {
                    this.formData.previewImage = resource.previewImages[0]
                }
                if (resource.meta) {
                    try {
                        this.meta = JSON.stringify(resource.meta)
                    } catch (e) {
                        this.meta = '{}'
                    }
                }
            }
        }
    },

    mounted() {
        // this.resourceTypeChange(this.formData.resourceType);
    },
    methods: {
        resourceTypeChange(type) {
            storage.set('CREATE_RESOURCE_TYPE', type);
        },
        checkMetaValid(valid) {
            this.valid = valid;
        },
        errorHandler(err) {
            this.loading = false;
            let errMsg;
            let error;

            if (err.errcode !== undefined) {
                error = {error: err.msg};
            } else {
                switch (err.status) {
                    case 400:
                        errMsg = this.$t('resourceEditView.noSupportTip');
                        break;
                    case 401:
                        errMsg = this.$t('resourceEditView.authFailTip');
                        break;
                    default:
                        errMsg = err.message;
                }
                error = {error: errMsg};
            }

            this.$emit('uploadEnd', error);
            this.$refs.resourceUploader.clearFiles(); // reset clearFiles
        },
        successHandler(res, file) {
            // console.log(res, file, 'res, fileres, fileres, file');
            this.loading = false;
            if (res.ret !== 0 || res.errcode !== 0) {
                // reset
                this.$refs.resourceUploader.clearFiles();
                this.uploaderStates.resource.isUploading = false;
                this.uploaderStates.resource.isExistResource = false;
                this.uploaderStates.resource.percentage = 0;
                this.$message.error(res.msg);
                this.$emit('uploadEnd', {error: res.msg});
            } else {
                this.uploaderStates.resource.sha1 = res.data.sha1;
                this.uploaderStates.resource.uploadFileId = res.data.uploadFileId;
                this.uploaderStates.resource.isUploaded = true;
                this.uploaderStates.resource.isExistResource = res.data.isExistResource;
                this.uploaderStates.resource.percentage = 100;
                this.autoSetFormData(file);
                this.$emit('uploadEnd', res.data);
            }
        },
        autoSetFormData(file) {
            let fileName = file.name.split('.');

            if (fileName.length > 1) {
                fileName.pop();
            }
            fileName = fileName.join('.');
            this.formData.filename = file.name;
            this.formData.filesize = file.size;
            if (!this.formData.widgetName && this.formData.resourceType === RESOURCE_TYPES.widget) {
                this.formData.widgetName = fileName;
            }

            if (!this.formData.resourceName) {
                this.formData.resourceName = fileName;
            }
        },
        humanizeSize(number) {
            const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'];

            if (!number) {
                return '';
            }

            if (number < 1) {
                return `${number} B`;
            }

            const algorithm = 1024;
            const exponent = Math.min(Math.floor(Math.log(number) / Math.log(algorithm)), UNITS.length - 1);
            number = Number((number / Math.pow(algorithm, exponent)).toPrecision(2));
            const unit = UNITS[exponent];

            return `${number} ${unit}`;
        },
        fileChangeHandler(file, fileList) {
            this.fileLimitValidator(file, fileList);
        },
        imageUploadSuccessHandler(res) {
            this.uploaderStates.thumbnail.isUploading = false;
            if (res.errcode === 0) {
                this.formData.previewImage = res.data;
                this.uploaderStates.thumbnail.isUploaded = true;
                this.uploaderStates.thumbnail.percentage = 100;
            } else {
                this.uploaderStates.thumbnail.percentage = 0;
                this.$error.showErrorMessage(res.msg);
            }
        },
        previewImageChangeHandler(file, fileList) {
            // console.log(fileList, '###@#$@#$#$');
            this.fileLimitValidator(file, fileList);
        },
        validateImageHandler(file) {
            if (!/\.(jpg|png|gif|jpeg)$/.test(file.name)) {
                this.$message.error(this.$t('resourceEditView.noSupportImageTip'));
                return false;
            }

            this.resetUploaderState(this.uploaderStates.thumbnail);
            return true;
        },
        clearUploaderHandler(uploader) {
            let $uploader;
            const uploaderState = this.uploaderStates[uploader];
            if (uploader === 'resource') {
                $uploader = this.$refs.resourceUploader;
            } else {
                $uploader = this.$refs.thumbnailUploader;
            }

            $uploader.clearFiles();
            $uploader.abort(uploaderState.file);
            Object.assign(uploaderState, {
                sha1: '',
                name: '',
                isUploading: false,
                isUploaded: false,
                percentage: 0,
            })
        },
        reuploadHandler(uploader) {
            this.clearUploaderHandler(uploader);
        },
        beforeUploadHandler(file) {
            this.resetUploaderState(this.uploaderStates.resource, file);
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
        imgUploadSuccessHandler(detail) {
            const data = detail.data;
            const editor = this.$refs.editor;
            if (data.errcode === 0) {
                editor.insertImg(data.data);
            } else {
                this.$message.error(data.msg);
            }
        },
        validate() {
            return new Promise((resolve, reject) => {
                const reourceUploader = this.uploaderStates.resource;
                this.$refs.createForm.validate((valid, err) => {
                    if (valid) {
                        let errMsg;
                        if (this.editMode === EDIT_MODES.creator) {
                            if (reourceUploader.isUploading && !reourceUploader.isUploaded) {
                                errMsg = this.$t('resourceEditView.uploadingTip');
                            } else if (!reourceUploader.sha1) {
                                errMsg = this.$t('resourceEditView.noFileTip');
                            }
                        }

                        if (errMsg) {
                            reject(errMsg);
                        } else {
                            try {
                                JSON.parse(this.meta);
                                resolve();
                            } catch (error) {
                                console.error(error);
                                reject(new Error(this.$t('resourceEditView.metaError', {error})));
                            }
                        }
                    } else {
                        const msg = Object.keys(err).map((key) => {
                            const item = err[key];
                            return item.message
                        });
                        reject(new Error(msg.join('，')));
                    }
                })
            })
        },
        // 是否超过上传限制
        fileLimitValidator(file, fileList) {
            if (fileList.length > 1) {
                fileList.shift();
                return false;
            }

            return true;
        },
        /**
         * 组织创建新 mock 的数据
         * @return {object}
         */
        packUploadData() {
            const reourceUploader = this.uploaderStates.resource;
            const uploadData = {};
            const formData = this.formData;
            let metaData;
            const INPUT_KEYS = ['resourceType'];
            const UPDATE_KEYS = ['resourceName'];
            let keys = UPDATE_KEYS;

            // 包装meta数据
            try {
                metaData = JSON.parse(this.meta);
            } catch (err) {
                metaData = {};
            }

            if (this.editMode === EDIT_MODES.creator) {
                keys = keys.concat(INPUT_KEYS);
                uploadData.sha1 = reourceUploader.sha1;

                // 资源名称,需要同一个bucket下唯一
                // uploadData.aliasName = formData.resourceName;
                uploadData.name = formData.resourceName;

                // 上传的资源返回来的uploadFileId值
                uploadData.uploadFileId = reourceUploader.uploadFileId;

                if (formData.resourceType === RESOURCE_TYPES.widget) {
                    uploadData.widgetInfo = {
                        widgetName: formData.widgetName,
                        version: `^${formData.widgetVersion}`
                    };
                }
            }

            if (formData.previewImage) {
                uploadData.previewImages = [formData.previewImage];
            }

            if (this.deps.length) {
                uploadData.dependencies = this.deps.map(r => {
                    // r.resourceId
                    return {releaseId: r.releaseId, versionRange: r.latestVersion.version}
                });
            }

            uploadData.meta = metaData;
            uploadData.description = this.$refs.editor.getHtml();

            keys.forEach((key) => {
                if (formData[key]) {
                    uploadData[key] = formData[key];
                }
            });
            uploadData.bucketName = this.$route.query.bucketName;
            // console.log(uploadData, 'uploadDatauploadDatauploadData');
            return uploadData;
        },
        isChanged() {
            // todo 待优化
            return true;
        },
        /**
         *
         * @return {Promise<any>}
         */
        nextHandler() {
            return new Promise((resolve, reject) => {
                this.validate()
                    .then(() => {
                        const data = this.packUploadData();
                        if (!this.data.resourceId) {
                            this.createResource(data)
                                .then(resolve)
                                .catch(reject);
                        } else if (this.isChanged()) {
                            this.updateResource(data)
                                .then((detail) => {
                                    if (detail && detail.resourceId) resolve(detail);
                                    else resolve(this.formData);
                                })
                                .catch(reject)
                        } else {
                            resolve();
                        }
                    })
                    .catch(reject);
            })
        },
        /**
         * 调用API，发布资源
         * @param data
         * @returns {Promise<any>}
         */
        createResource(data) {
            return new Promise((resolve, reject) => {
                const $uploader = this.$refs.resourceUploader;
                // console.log(data, 'datadata');
                // console.log(this.$router, '$router$router$router');
                // console.log(this.$route.query, '$route$route$route');
                if ($uploader.uploadFiles.length > 0) {
                    this.$services.MockService
                        .post({
                            ...data,
                        })
                        .then((res) => {
                            if (res.data.ret !== 0 || res.data.errcode !== 0) {
                                reject(new Error(res.data.msg));
                            } else {
                                resolve(res.data.data);
                            }
                        })
                        .catch(reject);
                } else {
                    reject(new Error(this.$t('resourceEditView.noFileTip')));
                }
            })
        },
        updateResource(data) {
            return this.$services.resource.put(this.data.resourceId, data).then((res) => {
                if (res.data.ret !== 0 || res.data.errcode !== 0) {
                    return Promise.reject(res);
                }
                return res.getData();
            })
        },
        uploadProgressHandler(event, file) {
            const uploaderStates = this.uploaderStates;
            let uploader;
            if (uploaderStates.resource.name === file.name) {
                uploader = uploaderStates.resource;
            } else if (uploaderStates.thumbnail.name === file.name) {
                uploader = uploaderStates.thumbnail;
            }

            if (uploader) {
                uploader.percentage = parseInt(file.percentage.toFixed(), 10);
            }
        },

        addDepReleaseHandler(release) {
            this.showSearchResourceDialog = false;

            const added = this.deps.some(res => res.releaseId === release.releaseId);
            if (added) {
                this.$message.error(this.$t('resourceEditView.donotRepeatUpload'));
            } else {
                this.deps.push(release);
            }
        },
        beforeCloseDialogHandler() {
            this.showSearchResourceDialog = false;
        },
        showSearchDialogHandler() {
            if (this.canEditDependencies) {
                this.showSearchResourceDialog = true;
            }
        },
        removeDepResourceHandler(resource, index) {
            this.deps.splice(index, 1);
        },


        // 点击上传资源按钮时，进行合法性检查
        onClickUploadResource(e) {
            // console.log(e, 'eefrdsaasdf');
            this.doHighlightSelectTip = false;

            if (!this.formData.resourceType) {
                setTimeout(() => this.doHighlightSelectTip = true, 30);
            }
        },

        // 点击显示 『添加 meta 信息』的按钮
        onClickButtonAddMetaInfo() {
            this.doShowMeta = true;
        },

        /**
         * 模拟点击『资源上传按钮』
         */
        onClickUpload() {
            // console.log( this.$refs.buttttttt.$el, 'this.$refs.resourceUploader');
            this.$refs.sourceUploadButton.$el.click();
        }
    }
}
