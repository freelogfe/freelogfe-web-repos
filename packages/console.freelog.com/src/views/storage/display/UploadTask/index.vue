<template>
    <div style="display: inline-block;">
        <el-upload
            :action="''"
            :auto-upload="false"
            :multiple="false"
            :show-file-list="false"
            :on-change="onChange"
            :accept="'.ncfg'"
        >
            <slot></slot>
        </el-upload>
        <div v-if="tasks.length > 0" style="width: 600px; background-color: #fff; position: fixed; bottom: 24px; right: 24px; box-shadow:0 5px 10px 0 rgba(0,0,0,0.2); border-radius:4px 4px 0 0; z-index: 1000;">
            <div
                style="height: 50px; display: flex; justify-content: space-between; align-items: center;padding: 0 20px;">
                <span style="font-size: 14px; color: #222;">任务列表</span>
                <div style="width: 40px; display: flex; align-items: center; justify-content: space-between;">
                    <a @click="minimize = !minimize"><i class="el-icon-minus" style="font-size: 14px; color: #979797;"/></a>
                    <a><i class="el-icon-close" style="font-size: 14px; color: #979797;"/></a>
                </div>
            </div>

            <div v-if="!minimize" style="padding: 0 30px; border-top: 1px solid #E5E5E5;">
                <div v-for="task in tasks"
                     style="height: 63px; border-bottom: 1px solid #E5E5E5; align-items: center; display: flex; justify-content: space-between;">
                    <div style="width: 310px; flex-shrink: 0; flex-grow: 0">
                        <div style="font-size: 14px; color: #222;">{{task.name}}</div>
                        <div style="font-size: 12px; color: #222;">{{task.size | humanizeSize}}</div>
                    </div>
                    <div
                        style="width: 200px; flex-shrink: 0; flex-grow: 0; display: flex; align-items: center;">
                        <span
                            v-if="task.status === 'success'"
                            style="font-size: 14px; color: #222;"
                        >已完成</span>
                        <template
                            v-if="task.status === 'ready'"
                        >
                            <span style="font-size: 14px; color: #222; padding-right: 10px;">{{task.percentage}}%</span>
                            <el-progress
                                style="width: 100px;"
                                :percentage="task.percentage"
                                :show-text="false"
                            />
                        </template>
                        <span
                            v-if="task.status === 'fail'"
                            style="color: #EE4040; font-size: 14px;"
                        >上传失败</span>
                    </div>
                    <div style="width: 20px; flex-shrink: 0; flex-grow: 0">
                        <a
                            v-if="task.status === 'ready'"
                            @click="cancelTask(task.cancel)"
                        >
                            <i
                                class="el-icon-close"
                                style="font-size: 16px; color: #333;"
                            />
                        </a>
                        <a
                            v-if="task.status === 'fail'"
                            @click="upload({...task, status: 'ready'})"
                        >
                            <i
                                class="el-icon-refresh-right"
                                style="font-size: 16px; color: #333;"
                            />
                        </a>
                        <i
                            style="color: #44C28C;"
                            v-if="task.status === 'success'"
                            class="freelog fl-icon-shenqingchenggong"
                        />
                    </div>
                </div>

                <div style="padding: 15px 0 0; display: flex; flex-direction: row-reverse; align-items: center;">
                    <div style="font-size: 14px; color: #222;">
                        <a style="line-height: 20px; width: 20px; text-align: center; display: inline-block;">1</a>
                        <a style="line-height: 20px; width: 20px; text-align: center; display: inline-block;">2</a>
                    </div>
                    <span style="color: #222222; font-size: 14px; padding-bottom: 2px; padding-right: 10px;">共7条</span>
                </div>
                <div style="height: 15px;"/>
            </div>


        </div>
    </div>

</template>

<script>

    import CryptoJS from "crypto-js";
    import {axios} from '@/lib/axios.js';

    export default {
        name: 'UploadTask',
        data() {
            return {
                tasks: [],
                minimize: false,
            };
        },
        methods: {
            async onChange(file, fileList) {
                console.log(file, 'file');
                if (file.size > 52428800) {
                    return console.log('不超过5M');
                }

                const hash = await getSHA1Hash(file.raw);

                const {data: fileIsExist} = await this.$axios.get(`/v1/storages/fileIsExist`, {
                    params: {
                        sha1: hash,
                    }
                });

                if (fileIsExist.data) {
                    return this.relate(file, hash)
                }

                const {data: nameIsExist} = await this.$axios.get(`/v1/storages/buckets/.UserNodeData/objects/${file.name}`);
                console.log(nameIsExist, 'nameIsExist');

                const task = {
                    ...file,
                    progressEvent: null,
                };

                if (!nameIsExist.data) {
                    this.updateTasks(task);
                    this.upload(task);
                    return;
                }

                this.$confirm('存在同名文件, 是否继续?', '提示', {
                    confirmButtonText: '替换',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.updateTasks(task);
                    this.upload(task);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消替换'
                    });
                });
            },

            async relate(file, sha1) {
                const form = new FormData();

                form.append('nodeDomain', file.name.replace(/\.ncfg$/, ''));
                form.append('sha1', sha1);

                const {data} = await this.$axios.post('/v1/storages/buckets/.UserNodeData/objects', form);
                console.log(data, 'DDDDD');
                this.$message.success('关联成功');
            },

            async upload(task) {
                const form = new FormData();

                form.append('nodeDomain', task.name.replace(/\.ncfg$/, ''));
                form.append('file', task.raw);

                const CancelToken = axios.CancelToken;
                // console.log(CancelToken, 'CancelTokenCancelToken');
                const source = CancelToken.source();

                const options = {
                    method: 'post',
                    url: '/v1/storages/buckets/.UserNodeData/objects',
                    data: form,
                    onUploadProgress: (progressEvent) => {
                        // Do whatever you want with the native progress event
                        // console.log(progressEvent, 'AAAAAAAAAAA');
                        this.updateTasks({
                            ...task,
                            progressEvent,
                            cancel: source.cancel,
                        });
                    },
                    cancelToken: source.token
                };

                try {
                    const {data} = await this.$axios(options);
                    if (data.ret !== 0 || data.errcode !== 0) {
                        return this.updateTasks({
                            ...task,
                            status: 'fail',
                        });
                    }

                    this.updateTasks({
                        ...task,
                        status: 'success',
                    });
                } catch (e) {
                    // return console.error(e);
                    this.updateTasks({
                        ...task,
                        status: 'fail',
                    });
                }

            },

            updateTasks(task) {
                const t = this.tasks.find(i => i.uid === task.uid);

                if (!t) {
                    return this.tasks.push(task);
                }

                const {loaded, total} = task.progressEvent;
                t.percentage = Math.floor(loaded / total * 100);
                t.progressEvent = task.progressEvent;
                t.status = task.status;
                t.cancel = task.cancel;
                // console.log(t, 'TTTTTT');
            },

            cancelTask(cancel) {
                cancel && cancel('Operation canceled by the user.');
            }
        }
    }

    /**
     * 根据 File 获取 SHA1 Hash 字符串
     * @param file
     * @return {Promise<string>}
     */
    function getSHA1Hash(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function (evt) {
                const wordArray = CryptoJS.lib.WordArray.create(reader.result);
                const hash = CryptoJS.SHA1(wordArray).toString();
                resolve(hash);
            };
            reader.readAsArrayBuffer(file);
        });
    }
</script>

<style scoped>

</style>
