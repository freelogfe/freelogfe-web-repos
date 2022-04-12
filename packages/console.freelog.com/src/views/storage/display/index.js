import {axios} from "@/lib";
import querystring from 'querystring';
import CreateBucketDialog from '@/components/CreateBucketDialog/index.vue';
// import i18n from './i18n';
import {mapGetters} from "vuex";

import Navs from './Navs.vue';
import NodeData from './NodeData.vue';
import StorageObject from './StorageObject.vue';
// import Uploader from './Uploader.vue';
// import UploadTask from './UploadTask/index.vue';

export default {
    // i18n,
    components: {
        // NavTitle,
        Navs,
        NodeData,
        StorageObject,
        CreateBucketDialog,
        // Uploader,
        // UploadTask,
    },
    // name: "index",
    data() {
        return {
            // 根 div 样式对象
            styleObject: {
                // height: '100%',
                minHeight: (window.innerHeight - 60) + 'px',
            },

            // 『新建 bucket 弹窗』 是否显示
            dialogVisible: false,

            // 『mock 表格』数据
            mockTableData: null,
            // 『mock 表格』当前页码
            mockCurrentPage: 1,
            // 『mock 表格』当前分页
            mockPageSize: 10,
            // 『mock 表格』总条数
            mockTotalItem: 0,


            // 要删除的对象
            deleteObject: null,

            // 临时储存需要生成的资源信息
            tmpNeedBuildResource: null,

            spaceStatistics: null,
        };
    },
    computed: {
        // 当前已激活的 bucket
        activatedBucket: function () {
            return this.bucketsList
                && this.bucketsList.find(i => i.bucketName === this.$route.query.activatedBucketName);
        },
        ...mapGetters({
            bucketsList: 'buckets',
        }),
    },
    mounted() {

        this.freshData();
    },
    methods: {

        freshData() {
            // console.log('#########');
            this.handleMockData();
            this.handleSpaceStatisticsDate();
        },

        async createBucketSuccess(bucket) {
            // console.log('######');
            this.$message.success(this.$t('successfullyCreated'));
            this.dialogVisible = false;
            // window.location.reload();
            this.$store.dispatch('loadBuckets');
            // this.initBucketsByAPI(true);
            this.onChangeBucketActiveIndex(bucket);
        },
        /**
         * 改变 bucket 列表中激活的索引
         * @param bucket
         */
        onChangeBucketActiveIndex(bucket) {
            this.$router.push({
                path: '/storage/display',
                query: {
                    activatedBucketName: (bucket && bucket.bucketName) || '',
                }
            });
        },
        /**
         * 显示 Nodedata
         */
        onClickShowNodeData() {
            this.$router.push({
                path: '/storage/display',
                query: {
                    nodeData: true,
                }
            });
        },
        /**
         * 隐藏『新建 bucket』弹窗
         */
        hideNewBucketDialog() {
            this.dialogVisible = false;
        },
        /**
         * 向 API 发起请求，删除当前激活的 bucket
         * @returns {Promise<void>}
         */
        async removeABucketByAPI() {
            const bucketName = this.activatedBucket.bucketName;
            // console.log(bucketName, 'bucketNamebucketNamebucketName');
            const {data} = await axios.delete(`/v1/resources/mocks/buckets/${bucketName}`);
            // console.log(data, 'datadatadata');
            if (data.errcode !== 0) {
                return this.errorMessage(data.msg);
            }
            this.$message.success(this.$t('successfullyDeleted'));
            await this.$store.dispatch('loadBuckets');
            // this.controlDeleteBucketPopoverShow(false);

            this.onChangeBucketActiveIndex(this.bucketsList[0] || null);
        },
        async handleSpaceStatisticsDate() {
            const {data} = await this.$axios.get(`/v1/storages/buckets/spaceStatistics`);
            // console.log(data, 'DDDDDDD');
            this.spaceStatistics = data.data;
        },
        /**
         * 处理展示 mock table
         * @returns {Promise<void>}
         */
        async handleMockData() {
            if (!this.activatedBucket) {
                return;
            }
            const params = {
                page: this.mockCurrentPage,
                pageSize: this.mockPageSize,
            };
            const str = querystring.stringify(params);
            const {data} = await axios.get(`/v1/storages/buckets/${this.activatedBucket.bucketName}/objects`);
            this.mockTableData = data.data.dataList;
            this.mockTotalItem = data.data.totalItem;
        },
        /**
         * 下载一个 fileObject 资源
         * @param fileObject
         */
        downloadObject(fileObject) {
            window.location.href = `${window.location.origin.replace('console', 'qi')}/v1/storages/buckets/${fileObject.bucketName}/objects/${fileObject.objectName}/file`;
        },

        /**
         * 生成正式资源
         */
        async buildFormalResourcesConfirm(row) {
            // console.log(row, 'RRRRRWWWWWWW');

            if (row.systemMeta.dependencyInfo && row.systemMeta.dependencyInfo.mocks && row.systemMeta.dependencyInfo.mocks.length > 0) {
                return this.$message.error(this.$t('invalidRelease'));
            }

            const res = await this.$axios.get(`/v1/resources/${row.sha1}`);
            if (res.data.data) {
                return this.$message.error(this.$t('resourceAlreadyExists'));
            }

            this.tmpNeedBuildResource = row;

            this.$confirm(this.$t('formalResource'), this.$t('prompt'), {
                confirmButtonText: this.$t('confirm'),
                cancelButtonText: this.$t('cancel'),
                type: 'warning'
            })
                .then(async () => {
                    const params = {
                        resourceAliasName: row.name,
                    };
                    const res1 = await this.$axios.post(`/v1/resources/mocks/${row.mockResourceId}/convert`, params);

                    if (res1.data.errcode !== 0) {
                        this.$message({
                            type: 'error',
                            message: res1.data.msg,
                        });
                        return;
                    }
                    this.$message({
                        type: 'success',
                        message: this.$t('generateSuccess')
                    });
                    this.$router.push(`/resource/editor/${res1.data.data.resourceId}`);
                    // console.log(res1, 'res1res1res1res1res1');

                })
                .catch(() => {
                    // this.$message({
                    //     type: 'info',
                    //     message: '已取消删除'
                    // });
                });
        },

        /**
         * 向 API 发起请求，根据 mockID 删除一个 mock
         * @param deleteObject
         */
        async removeAMockByAPI() {
            const {data} = await axios.delete(`/v1/storages/buckets/${this.deleteObject.bucketName}/objects/${this.deleteObject.objectName}`);

            this.mockCurrentPage = Math.min(this.mockCurrentPage, Math.ceil((this.mockTotalItem - 1) / this.mockPageSize) || 1);
            // this.handleMockData();
            this.freshData();
        },

        /**
         * 当前页面发生变化时
         * @param currentPage
         */
        onCurrentPageChange(currentPage) {
            this.mockCurrentPage = currentPage;
        },
        /**
         * 页面数量发生改变时
         * @param pageSize
         */
        onPageSizeChange(pageSize) {
            this.mockPageSize = pageSize;
            this.mockCurrentPage = 1;
        },

        /**
         * 错误提示框
         * @param text
         */
        errorMessage(text) {
            this.$message.error(text);
        },

        /**
         * 控制 『删除 bucket 的面板是否显示』
         * @param {boolean} bool
         */
        // controlDeleteBucketPopoverShow(bool) {
        //     this.deleteBucketPopoverShow = bool;
        // },
        /**
         * 显示删除 mock 提示框
         */
        showDeleteMockDialog(deleteObject) {
            this.deleteObject = deleteObject;
        },
        /**
         * 正式删除一个 mock
         */
        async deleteAMock() {
            await this.removeAMockByAPI();
            this.deleteObject = null;
            this.$message({
                customClass: 'message-class',
                duration: 1500,
                // duration: 0,
                center: true,
                type: 'success',
                dangerouslyUseHTMLString: true,
                message: '<div style="font-size: 14px; color: #333;">删除成功</div>'
            });
            this.hideDeleteMockDialog();
        },
        /**
         * 隐藏删除 mock 提示框
         */
        hideDeleteMockDialog() {
            this.deleteMockID = '';
        },
    },
    watch: {
        activatedBucket() {
            this.handleMockData();
        },
        mockCurrentPage() {
            this.handleMockData();
        },
        mockPageSize() {
            this.handleMockData();
        }
    }
}



