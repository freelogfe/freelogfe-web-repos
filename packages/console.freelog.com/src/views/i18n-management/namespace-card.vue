<template >
  <el-card class="i-m-nem-edit-item">
      <div slot="header" class="clearfix">
        <span>{{title}}</span>
      </div>
      <div>
        <el-input 
          v-if="selectedNamespace.valueType === 'string'" 
          type="textarea" rows="4"
          v-model="value"
          @input="handleNamespaceInput"
          @change="handleNamespaceChange" ></el-input>
        <template v-else>
          <el-input 
            v-for="(val, i) in value" 
            type="textarea" rows="3" 
            style="margin-bottom: 10px;"
            :key="'val-'+i" 
            v-model="value[i]" 
            @input="handleNamespaceInput"
            @change="handleNamespaceChange">
            <template slot="prepend">{{i}}</template>
          </el-input>
        </template>
      </div>
    </el-card>
</template>

<script>
export default {
  name: 'i18n-namespace-card',
  props: {
    language: String,
    title: String,
    selectedNamespace: Object,
  },
  data() {
    return {
      value: '',
    }
  },
  watch: {
    selectedNamespace() {
      this.value = this.selectedNamespace[this.language]
    },
  },
  methods: {
    handleNamespaceInput(str) {
      this.selectedNamespace[this.language] = str
    },
    handleNamespaceChange() {
      const data = Object.assign({ operation: 'update' }, this.selectedNamespace)
      this.$emit('value-update', data)
    },
  },
  mounted() {
    this.value = this.selectedNamespace[this.language]
  },
}
</script>

<style lang="less" scoped>
  .i-m-nem-edit-item { 
    float: left; width: 48%;
    &:not(:last-child) {
      margin-right: 3%; 
    }
  }
</style>