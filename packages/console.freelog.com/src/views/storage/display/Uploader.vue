<template>
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
</template>

<script>
    import CryptoJS from "crypto-js";

    export default {
        name: "Uploader",
        methods: {
            async onChange(file, fileList) {
                if (file.size > 524288) {
                    return console.log('不超过 512 KB');
                }

                const hash = await getSHA1Hash(file.raw);

                const {data: fileIsExist} = await this.$axios.get(`/v1/storages/fileIsExist`, {
                    params: {
                        sha1: hash,
                    }
                });
                // console.log(fileIsExist, 'fileIsExist');

                const {data: nameIsExist} = await this.$axios.get(`/v1/storages/buckets/.UserNodeData/objects/${file.name}`);
                // console.log(nameIsExist, 'nameIsExist');

                this.upload(file.raw, file.name.replace(/\.ncfg$/, ''))
            },

            async upload(raw, nodeDomain) {
                const form = new FormData();

                form.append('nodeDomain', nodeDomain);
                form.append('file', raw);

                const options = {
                    method: 'post',
                    url: '/v1/storages/buckets/.UserNodeData/objects',
                    data: form,
                    onUploadProgress(progressEvent) {
                        // Do whatever you want with the native progress event
                        console.log(progressEvent, 'AAAAAAAAAAA');
                    },
                };

                const {data} = await this.$axios(options);
                // console.log(data, 'DDDDDDD');
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
