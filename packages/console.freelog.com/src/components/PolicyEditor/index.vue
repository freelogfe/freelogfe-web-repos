<template>
  <section>
    <div class="policy-input-item" :class="[{'disabled-policy': disabledPolicy, 'published-policy': !!policy.segmentId}, mode+'-mode']">
      <div class="policy-name-input-item clearfix">
        <div class="policy-name-input-placeholder">
          <!-- <pre class="policy-name-pre">{{policy.policyName}}</pre> -->
          <el-form :model="policyForm" ref="policyForm" class="policy-ruleForm">
            <el-form-item prop="policyName" :rules="policyNameRules">
              <el-input type="text" style="width: 300px;" placeholder="请输入授权策略名称" :disabled="disabledPolicy" v-model="policyForm.policyName" @input="changePolicyNameHandler" @blur="changePolicyNameHandler"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="policy-actions-btn">
          <el-button round class="off-line-btn" size="mini"
              v-if="disabledPolicy===false"
              @click="switchPolicyStatusHandler(true)">{{ $t('components.policyEditor.offline')}}
          </el-button>
          <el-button round class="on-line-btn" size="mini"
              v-if="disabledPolicy===true"
              @click="switchPolicyStatusHandler(false)">{{ $t('components.policyEditor.online')}}
          </el-button>
        </div>
        <div class="policy-toolbar">
          <ul class="tool-list">
            <li>
              <el-button type="text"
                        class="op-btn"
                        size="mini"
                        @click="showToolHandler('policy-template-selector')">
                <i class="el-icon-tickets"></i>{{ $t('components.policyEditor.template')}}
              </el-button>
              <!--<el-tooltip class="item" effect="light" content="使用已有策略模板" placement="bottom"></el-tooltip>-->
            </li>
            <li>
              <el-button type="text"
                        class="op-btn"
                        size="mini"
                        @click="showToolHandler('query-policy-license')">
                <i class="el-icon-search"></i>license
              </el-button>
              <!--<el-tooltip class="item" effect="light" content="查询license" placement="bottom"></el-tooltip>-->
            </li>
          </ul>
        </div>
      </div>
      <div class="policy-content-input-wrap policy-editing clearfix">
        <div class="policy-content-input-padding">
          <div v-if="policy.policyId" class="policy-text" v-html="policy.policyText"></div>
          <template v-else>
            <div class="policy-input-area">
              <div class="input-placeholder">{{policy.policyText}}</div>
              <textarea
                  class="policy-content-input"
                  spellcheck="false"
                  :placeholder="$t('components.policyEditor.policyPlaceholder')"
                  @change="changePolicyText(policy)"
                  v-model="policy.policyText"></textarea>
            </div>
          </template>
        </div>
        <div class="policy-content-input-ft" v-if="showFooterBtns && mode !== 'preview'">
          <el-button round size="mini" @click="cancelPolicyHandler">{{$t('common.cancel')}}</el-button>
          <el-button round size="mini" type="primary" @click="savePolicyHandler" :disabled="!isValidPolicyName || policy.policyText === ''" v-if="autoSave === false">{{$t('common.save')}}</el-button>
        </div>
      </div>
    </div>
    <el-dialog
            :title="$t('components.policyEditor.selectPolicyTitle')"
            :visible.sync="showCustomPolicyTplDialog"
            width="50%">
      <keep-alive>
        <component :is="currentTool" :callback="operationCallback"></component>
      </keep-alive>
    </el-dialog>
  </section>
</template>

<script>
  import PolicyEditor from './index'

  export default PolicyEditor
</script>

<style lang="less">
  .policy-input-item {
    .el-form-item.is-error {
      .el-form-item__content .el-form-item__error {
        top: 52px;
      }
    }
  }
  
</style>

<style lang="less" scoped>
  @import "index.less";
</style>
