<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="Real Name">
        <el-input v-model="realName" placeholder="Real Name" />
      </el-form-item>
      <!-- <el-form-item label="Class">
        <el-input v-model="input1" placeholder="Class"></el-input>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Search</el-button>
        <el-button type="primary" @click="getExportScores">Export</el-button>
      </el-form-item>
    </el-form>

    <!-- table -->
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
      <el-table-column  align="center" type="selection" width="55" />
      <el-table-column fixed label="No." align="center" width="80">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column prop="title" label="Exam Name" align="center" />
      <el-table-column prop="realName" label="Real Name" align="center" />
      <el-table-column prop="userScore" label="User Score" align="center" />
      <el-table-column prop="count" label="Screen Switch Count" align="center" />
      <el-table-column prop="userTime" label="User Time" align="center" />
      <el-table-column prop="limitTime" label="Submission Time" align="center" />
      <!--
      <el-table-column fixed="right" label="Operation" align="center">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            size="small"
            style="font-size: 14px"
            @click="updateRow(row)"
            >View Details</el-button
          >
        </template>
      </el-table-column> -->
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
import {exportScores, scorePaging} from '@/api/score'
export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      gradeId: '',
      examId: '',
      realName: '',
      data: {},
      formInline: {
        user: '',
        region: ''
      },
      input: '',
      input1: '',

      form: {
        name: ''
      },
      cancel() {},
      updateRow(row) {
        this.dialogFormVisible = true
        this.form = row
      },
      diaTitle: '',
      dialogTableVisible: false,
      dialogFormVisible: false,

      formLabelWidth: '120px'
    }
  },
  computed: {
    filteredData() {
      const input = this.examTitle;
      const input1 = this.gradeId;
      if (input) {
        return this.data.records.filter((data) => {
          return Object.keys(data).some((key) => {
            return String(data[key]).toLowerCase().indexOf(input) > -1;
          });
        });
      }
      if (input1) {
        return this.data.records.filter((data) => {
          return Object.keys(data).some((key) => {
            return String(data[key]).toLowerCase().indexOf(input1) > -1;
          });
        });
      }
      return this.data.records;
    },
  },
  created() {
    this.examId = localStorage.getItem('examId')
    this.gradeId = localStorage.getItem('gradeId')
    this.getScorePage()
  },
  beforeDestroy() {
    localStorage.removeItem('examId')
    localStorage.removeItem('gradeId')
  },
  methods: {
    // Pagination query
    async getScorePage() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        examId: this.examId,
        gradeId: this.gradeId,
        realName: this.realName
      }
      const res = await scorePaging(params)
      this.data = res.data
    },
    getExportScores() {
      exportScores(this.examId, this.gradeId).then(res => {
        console.log(res) // Console output: Blob {size: 30208, type: 'application/x-msdownload'}
        var debug = res
        if (debug) {
          var elink = document.createElement('a')
          var filename = 'downloaded-file.xlsx'
          if (this.gradeName) {
            filename = this.gradeName + '-' + this.examTitle + '.xlsx'
          }
          elink.download = filename
          elink.style.display = 'none'
          var blob = new Blob([debug], { type: 'application/x-msdownload' })
          console.log(blob)
          // const filename = decodeURIComponent(res.headers['Content-Disposition'])
          // console.log(filename)
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          document.body.removeChild(elink)
        } else {
          this.$message.error('Export exception, please contact the administrator')
        }
      }).catch(err => {
        console.log(err)
      })
    },

    onSubmit() {
      this.getScorePage()
      // console.log("submit!");
    },
    handleSizeChange(val) {
      // Logic for setting the number of items per page
      this.pageSize = val
      this.getScorePage(this.pageNum, val)
    },
    handleCurrentChange(val) {
      // Logic for setting the current page
      this.pageNum = val
      this.getScorePage(val, this.pageSize)
    },

    handleClick(row) {
      // console.log(row);
    }
  }
}
</script>
<style></style>
