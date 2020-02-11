<!--<i18n src="../../../i18n-locales/license.json"></i18n>-->
<template>
  <div class="license-event-wrap">
    <el-form label-position="left" class="small-el-form" :label-width="formLabelWidth" :model="contractDetail">
      <el-form-item :label="$('license.label')" class="no-margin-bottom">
        <div class="license-window">
          <pre class="license-format" v-for="(license, index) in licenses" :key="'license'+index">
            {{license}}
          </pre>
        </div>
      </el-form-item>
      <el-form-item>
        <el-checkbox class="accept-license" v-model="accepted">{{$('license.checkboxText')}}</el-checkbox>
      </el-form-item>

        <div class="center">
          <el-button @click="doneHandler">{{$('license.cancelBtnText')}}</el-button>
          <el-button type="primary" :disabled="!accepted" @click="signHandler">{{$('license.sureBtnText')}}</el-button>
        </div>
    </el-form>
  </div>
</template>
<style media="screen" scoped>
  .no-margin-bottom{
    margin-bottom: 0;
  }
  .license-window {
    height: 300px;
    overflow: auto;
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 10px;
  }
  .license-format {
    font-family: Helvetica, arial, nimbussansl, liberationsans, freesans, clean, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
    line-height: 1.6;
    white-space: pre-wrap;
  }
  .accept-license {
    margin-top: 20px;
  }
  .center {
    text-align: center;
  }
</style>
<script type="text/javascript">
import LicenseEvent from './index.js'

export default LicenseEvent
</script>
