import Cropper from 'cropperjs'

require('cropperjs/dist/cropper.css');

let cropper;

export default {
    name: 'upload-cover',
    props: {
        // 图像封面
        imageUrl: String,
        // 上传图片成功后回调，将图片 url 传出
        onUploaded: Function,
        width: {
            type: Number,
            default: 200,
        },
        height: {
            type: Number,
            default: 150,
        },
        textVisible: {
            type: Boolean,
            default: true
        },
        uploadText: {
            type: String,
            default: '上传封面', // 选择封面
        },
        reUploadText: {
            type: String,
            default: '重新上传', // 重新上传
        },
        multiple: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            // 是否显示提示框
            showDialog: false,
            count: 0,
            list: [],
            tmpImageUrl: '',
        };
    },
    methods: {

        initData() {
            this.count = 0;
            this.list = [];
        },
        /**
         * 图片上传完成
         */
        handleAvatarSuccess(res, file) {
            if (res.errcode !== 0) {
                return;
            }
            // console.log(res, 'resresresresresresres');
            if (!this.multiple) {
                // console.log('#######');
                setTimeout(() => this.tmpImageUrl = '');
                return this.onUploaded && this.onUploaded(res.data);
            }

            this.list.push(res.data);
            if (this.count === this.list.length) {
                this.onUploaded(this.list);
            }
        },
        /**
         * 在图片上传之前
         */
        beforeAvatarUpload(file) {
            // console.log('FFFFFFF');
            // const isJPG = file.type === 'image/jpeg';
            const isLt5M = file.size / 1024 / 1024 <= 5;
            // console.log(file, 'filefilefilefile');

            if (!isLt5M) {

                if (this.multiple) {
                    setTimeout(() => this.$message.error(`『 ${file.name} 』超过了5M，该图片已丢弃`));

                    return false;
                }
                // this.$message.error('上传头像图片大小不能超过 2MB!');
                this.showDialog = true;
                return false;
            }
            this.count++;
        },
        /**
         * 隐藏 dialog
         */
        hideUploadDialog() {
            this.showDialog = false;
        },
        /**
         * 触发上传封面事件
         */
        emitUpload() {
            this.hideUploadDialog();
            // console.log(this.$refs.uploadHandleRef, 'this.uploadHandleRefthis.uploadHandleRef');
            this.$refs.uploadHandleRef.click();
        },

        /**
         * 获取图片资源
         * @param file
         */
        changeImageHandler(file) {
            // console.log(file, 'filefile');
            if (this.multiple) {
                return;
            }
            this.tmpImageUrl = file.url || URL.createObjectURL(file.raw);
            // console.log(url, 'urlurlurl');
            setTimeout(() => this.initCropper());
        },
        /**
         * 初始化 cropper
         */
        initCropper() {
            if (!this.$refs.tmpImage) {
                return;
            }

            // if (cropper) {
            //     cropper.replace(this.tmpImageUrl)
            // } else {
                cropper = new Cropper(this.$refs.tmpImage, {
                    aspectRatio: this.width / this.height,
                    viewMode: 1,
                    center: true,
                    highlight: true,
                    cropBoxMovable: true,
                    cropBoxResizable: true,
                    ready() {
                    },
                    // preview: '.crop-img-preview'
                })
            // }
        },
        /**
         * 开始上传
         */
        saveCropImageHandler() {
            const canvas = cropper.getCroppedCanvas({
                width: this.width,
                height: this.height,
            });

            canvas.toBlob((blob) => {
                const file = new File([blob], 'tmp.png');
                const {uploader} = this.$refs;
                uploader.clearFiles();
                uploader.handleStart(file);
                uploader.submit();
            })
        }
    },
    computed: {
        /**
         * 获取接口 origin
         * @return {string}
         */
        apiHostName() {
            const arr = window.location.hostname.split('.');
            arr.shift();
            arr.unshift('qi');
            return arr.join('.');
        },
        /**
         * 组织好 上传图片 的 URL
         * @return {string}
         */
        uploadPreviewImageAction() {
            return `//${this.apiHostName}/v1/resources/temporaryFiles/uploadPreviewImage`;
        },
    }
}
