<template>
  <div class="app-container">
    <div class="filter-container">
      <slot name="filter-content" />

      <el-row>
        <el-col>
          <el-button
            v-if="options.addRoute"
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd"
          >Add</el-button>
        </el-col>
      </el-row>
    </div>

    <div v-show="multiShow && options.multiActions" class="filter-container">
      <el-select
        v-model="multiNow"
        :placeholder="selectedLabel"
        class="filter-item"
        style="width: 130px"
        @change="handleOption"
      >
        <el-option
          v-for="item in options.multiActions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>

    <el-table
      v-loading="listLoading"
      :data="dataList.records"
      :header-cell-style="{
        background: '#f2f3f4',
        color: '#555',
        'font-weight': 'bold',
        'line-height': '32px',
      }"
      border
      fit
      highlight-current-row
      @selection-change="handleSelection"
    >
      <el-table-column v-if="options.multi" align="center" type="selection" width="55" />

      <slot name="data-columns" />
    </el-table>

    <pagination
      v-show="dataList.total > 0"
      :total="dataList.total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { fetchList, deleteData, changeState } from '@/api/common'
import Pagination from '@/components/Pagination'
export default {
  name: 'PagingTable',
  components: { Pagination },
  // Component input parameters
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          // Batch operations
          multiActions: [],
          // List request URL
          listUrl: '/exam/api',
          // Delete request URL
          deleteUrl: '',
          // Enable/disable URL
          stateUrl: '',
          // Allow batch operations
          multi: false
        }
      }
    },

    // List query parameters
    listQuery: {
      type: Object,
      default: () => {
        return {
          current: 1,
          size: 10,
          params: {},
          t: 0
        }
      }
    }
  },
  data() {
    return {
      // Interface data return
      dataList: {
        total: 0
      },
      // Data loading flag
      listLoading: true,
      // Selected and batch operations
      selectedIds: [],
      selectedObjs: [],
      // Show how many items are selected
      selectedLabel: '',
      // Show batch operations
      multiShow: false,
      // Batch operation flag
      multiNow: ''
    }
  },
  watch: {
    // Detect query changes
    listQuery: {
      handler() {
        this.getList()
      },
      deep: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /**
     * Add data redirection
     */
    handleAdd() {
      if (this.options.addRoute) {
        this.$router.push({ name: this.options.addRoute, params: {}})
        return
      }
    },

    /**
     * Query data list
     */
    getList() {
      this.listLoading = true
      this.listQuery.t = new Date().getTime()
      fetchList(this.options.listUrl, this.listQuery).then((response) => {
        this.dataList = response.data
        this.listLoading = false
      })
    },

    /**
     * Search
     */
    handleFilter() {
      // Re-search
      this.getList()
    },

    /**
     * Batch operation callback
     */
    handleOption(v) {
      this.multiNow = ''

      // Operations consumed internally
      if (v === 'delete') {
        this.handleDelete()
        return
      }

      if (v === 'enable') {
        this.handleState(0)
        return
      }

      if (v === 'disable') {
        this.handleState(1)
        return
      }

      // Operations to be passed externally
      this.$emit('multi-actions', { opt: v, ids: this.selectedIds })
    },

    /**
     * Change state, enable/disable
     */
    handleState(state) {
      // Change state
      changeState(this.options.stateUrl, this.selectedIds, state).then((response) => {
        if (response.code === 0) {
          this.$message({
            type: 'success',
            message: 'State changed successfully!'
          })

          // Re-search
          this.getList()
        }
      })
    },

    /**
     * Delete data
     */
    handleDelete() {
      if (this.selectedIds.length === 0) {
        this.$message({
          message: 'Please select at least one item!',
          type: 'warning'
        })
        return
      }

      // Delete
      this.$confirm('Are you sure you want to delete?', 'Prompt', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        deleteData(this.options.deleteUrl, this.selectedIds).then(() => {
          this.$message({
            type: 'success',
            message: 'Deleted successfully!'
          })
          this.getList()
        })
      })
    },

    /**
     * List multi-selection operation
     * @param val
     */
    handleSelection(val) {
      const ids = []
      val.forEach((row) => {
        ids.push(row.id)
      })

      this.selectedObjs = val
      this.selectedIds = ids
      this.multiShow = ids.length > 0
      this.selectedLabel = 'Selected ' + ids.length + ' items'

      this.$emit('select-changed', { ids: this.selectedIds, objs: this.selectedObjs })
    }
  }
}
</script>

<style>
.filter-container .filter-item {
  margin-left: 5px;
}

.filter-container .filter-item:first-child {
  margin-left: 0px;
}
</style>
