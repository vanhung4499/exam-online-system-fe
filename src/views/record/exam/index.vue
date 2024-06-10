<template>
  <div class="app-container">
    <el-table
      :data="data.records"
      border
      fit
      highlight-current-row
      :header-cell-style="{
        background: '#f2f3f4',
        color: '#555',
        'font-weight': 'bold',
        'line-height': '32px',
      }"
    >
      <el-table-column align="center" type="selection" width="55"/>
      <el-table-column label="Number" align="center" width="80">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column prop="title" align="center" label="Exam Name"/>
      <el-table-column prop="passedScore" align="center" label="Passing Score"/>
      <el-table-column prop="userScore" align="center" label="User Score"/>
      <el-table-column prop="examDuration" align="center" label="Exam Duration"/>
      <el-table-column prop="userTime" align="center" label="User Time">
        <template slot-scope="scope">
          <div>{{ (scope.row.userTime / 60).toFixed(2) }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Action">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            size="small"
            style="font-size: 14px"
            @click="screenInfo(row)"
          >View
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        :current-page="data.current"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="data.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="data.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import {recordExamPaging} from '@/api/record'

export default {
  namespaced: true,
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      data: {},
      input: '',
      formInline: {
        user: '',
        region: ''
      },
      dialogVisible: false,
      form: {
        name: ''
      },
      cancle() {
      },
      updateRow(row) {
        this.dialogFormVisible = true
        this.form = row
      },
      diaTitle: 'Add',
      dialogTableVisible: false,
      dialogFormVisible: false
    }
  },
  computed: {
    tables() {
      // Define 'tables' in your data table.
      const input = this.input
      if (input) {
        return this.tableData.filter((data) => {
          return Object.keys(data).some((key) => {
            return String(data[key]).toLowerCase().indexOf(input) > -1
          })
        })
      }
      return this.tableData
    }
  },
  created() {
    this.getExamRecordPaging()
  },
  methods: {

    // 分页查询
    async getExamRecordPaging(pageNum, pageSize) {
      const params = {pageNum: pageNum, pageSize: pageSize}
      const res = await recordExamPaging(params)
      this.data = res.data
    },
    screenInfo(row) {
      console.info('=====', row)
      localStorage.setItem('record_exam_examId', row.id)
      this.$router.push({name: 'exam-record-detail', query: {zhi: row}})
    },

    handleSizeChange(val) {
      // Logic for setting the number of items per page
      this.pageSize = val
      this.getExamRecordPaging(this.pageNum, val)
    },
    handleCurrentChange(val) {
      // Logic for setting the current page
      this.pageNum = val
      this.getExamRecordPaging(val, this.pageSize)
    },

    handleClose(done) {
      this.$confirm('Confirm to close?')
        .then((_) => {
          done()
        })
        .catch((_) => {
        })
    }
  }
}
</script>
<style scoped></style>
