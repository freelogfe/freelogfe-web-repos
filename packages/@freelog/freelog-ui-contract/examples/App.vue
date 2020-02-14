<template>
  <div id="app">
    hello ui-contract demo!

    <el-row>
      <el-button type="primary" @click="openSingleContract">open single-contract</el-button>
      <el-button type="primary" @click="openMultiContract">open multi-contract</el-button>
    </el-row>

    <ContractSigningDialog
            :visible.sync="isShowDialog"
            @close-dialog="hideAuthDialog"
            :presentableList="scAuthPresentableList"
    ></ContractSigningDialog>
  </div>
</template>

<script>

 import {
   ContractSigningDialog
 } from '../src/index'
 import { Row, Button } from 'element-ui'

export default {
  name: 'app',
  data() {
    return {
      isShowDialog: false,
      scAuthPresentableList: [],
    }
  },
  components: {
    ContractSigningDialog,
    "el-row": Row,
    "el-button": Button
  },
  methods: {
    hideAuthDialog (){
      this.isShowDialog = false
    },
    beforeClose (){
      this.isShowDialog = false
    },
    openSingleContract() {
      this.$axios.get('/v1/presentables', { params: {
          nodeId: 10017
        }})
        .then(res => {
          if(res.status === 200 && res.data.data){
            const presentable = res.data.data.filter(item => item.resourceId === '425babee96a21278dbdd1e77b59c952bbb5757c0')[0]

            this.scAuthPresentableList = [presentable]
            this.isShowDialog = true
          }
        })
    },
    openMultiContract() {
      this.$axios.get('/v1/presentables', { params: {
          nodeId: 10017
        }})
        .then(res => {
          if(res.status === 200 && res.data.data){
            this.scAuthPresentableList = res.data.data
            this.isShowDialog = true
          }
        })


    },

  },
  computed: {
    scTitle (){
      return `资源签约&nbsp;&nbsp;&nbsp;&nbsp;${window.location.hostname}`
    },
    userId() {
      return window.__auth_info__.__auth_user_id__ || 10008
    }
  },
  mounted() {
    // this.openSingleContract()
    this.openMultiContract()
  }

}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
