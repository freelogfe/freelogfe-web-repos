<template>
  <div class="imme-key-item" v-if="zhCNItem != null">
    <p>
      <label>命名空间</label>
      {{itemKey}}
      <i class="el-icon-remove" @click="handleNamespaceDelete"></i>
    </p>
    <div class="imme-key-lang">
      <label>中文</label>
      <el-input v-model="zhCNItemValue" v-if="valueType === 'string'" @change="handleValueChange(itemKey, zhCNItemValue, 'zh-CN')"></el-input>
      <template v-else>
        <el-input 
          v-for="(val, i) in zhCNItemValue" 
          :key="'val-'+i" 
          v-model="zhCNItemValue[i]" 
          @change="handleValueChange(itemKey, zhCNItemValue, 'zh-CN')">
          <template slot="prepend">{{i}}</template>
        </el-input>
      </template>
    </div>
    <div class="imme-key-lang">
      <label>英文</label>
      <el-input v-model="enItemValue" v-if="valueType === 'string'" @change="handleValueChange(itemKey, enItemValue, 'en')"></el-input>
      <template v-else>
        <el-input 
          v-for="(val, i) in enItemValue" 
          :key="'val-'+i" 
          v-model="enItemValue[i]" 
          @change="handleValueChange(itemKey, enItemValue, 'en')">
          <template slot="prepend">{{i}}</template>
        </el-input>
      </template>
    </div>
  </div>
</template>

<script>
import namespaceItem from './namespace-item.vue'
import { codemirror, codeMirrorOptions } from '@/lib/codemirror'
import 'codemirror/mode/javascript/javascript'
import objectPath from 'object-path'
require('codemirror/theme/idea.css')
const throttle = require('lodash/throttle')

var lastBreadcrumbs = []
export default {
  name: 'name-space-item',
  components: { namespaceItem },
  props: {
    zhCNItem: Object,
    enItem: Object,
  },
  data() {
    return {
      zhCNItemValue: '',
      enItemValue: ''
    }
  },
  computed: {
    itemKey() {
      return this.zhCNItem.key
    },
    valueType() {
      return this.zhCNItem.valueType
    },
  },
  watch: {
    zhCNItem() {
      this.zhCNItemValue = this.getItemValue('zh-CN')
      this.enItemValue = this.getItemValue('en')
    },
  },
  methods: {
    getItemValue(lang) {
      const enItem = this.enItem
      const zhCNItem = this.zhCNItem

      const item = lang === 'zh-CN' ? zhCNItem : enItem
      if (item != null) {
        if (Object.prototype.toString.call(item.value) === '[object Array]') {
          return item.value.map(obj => typeof obj === 'object' ? JSON.stringify(obj) : obj) 
        }else {
          return item.value
        }
      } else {
        const comparedItem = lang === 'zh-CN' ? enItem : zhCNItem
        const valueType = comparedItem && comparedItem.valueType || 'string'
        if (valueType === 'string') {
          return ''
        } else {
          return []
        }
      }
    },
    handleValueChange(key, value, language) {
      this.$emit('value-update', { key, value, language, operation: 'update' })
    },
    handleNamespaceDelete() {
      this.$emit('name-space-delete', { key: this.itemKey, operation: 'delete' })
    },
  },
  async mounted() {
    this.zhCNItemValue = this.getItemValue('zh-CN')
    this.enItemValue = this.getItemValue('en')
  },
}
</script>

<style lang="less" scoped>
.imme-key-item {
  margin-bottom: 15px; padding: 10px 0; border: 1px solid #e6e6e6; border-radius: 4px;
  font-size: 14px; color: #000;
  label { 
    position: absolute; top: 0; left: 0;
    width: 65px; line-height: 40px;  text-align: right;
  }
  & > p { 
    display: flex; position: relative;
    margin-bottom: 10px; padding: 0 20px 0 80px; line-height: 40px;
    
    i { padding: 0 10px; line-height: 40px; cursor: pointer; }
    .el-icon-remove { position: absolute; right: 10px; color: #F56C6C; }
  }
  .imme-key-lang {
    position: relative;
    margin-bottom: 10px; padding: 0 20px 0 80px;
    .el-input-group { 
      &:not(last-children) {
        margin-bottom: 10px; 
      }
    }
  }
}
</style>

<style lang="less">

</style>
