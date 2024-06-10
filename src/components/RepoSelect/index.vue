<template>

  <el-select
    v-model="currentValue"
    :multiple="multi"
    :remote-method="fetchData"
    filterable
    remote
    reserve-keyword
    clearable
    automatic-dropdown
    placeholder="Select or search for a question bank"
    class="filter-item"
    @change="handlerChange"
  >
    <el-option
      v-for="item in dataList"
      :key="item.id"
      :label="item.title"
      :value="item.id"
    />
  </el-select>

</template>

<script>

import { getListRepoPaging } from '@/api/repo'

export default {
  name: 'RepoSelect',
  props: {
    multi: {
      type: Boolean,
      default: false
    },
    value: String | Array,
    excludes: Array
  },
  data() {
    return {
      // Dropdown option values
      dataList: [],
      currentValue: []
    }
  },

  watch: {
    // Detect changes in value
    value: {
      handler() {
        this.currentValue = this.value
      }
    }
  },
  created() {
    this.currentValue = this.value
    this.fetchData()
  },
  methods: {

    fetchData(q) {
      // , title: q, excludes: this.excludes
      getListRepoPaging({ pageNum: 1, pageSize: 1000 }).then(res => {
        this.dataList = res.data
      })
    },
    handlerChange(e) {
      const obj = this.dataList.find((item) => {
        return item.id === e
      })

      this.$emit('change', obj)
      this.$emit('input', e)
    }
  }
}
</script>
