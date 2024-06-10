<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline">
      <el-form-item label="Exam Name：">
        <el-input v-model="searchTitle" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchExamStu">Search</el-button>
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
      <el-table-column prop="examDuration" label="Exam Duration" align="center" />
      <el-table-column prop="grossScore" label="Total Score" align="center" width="100" />
      <el-table-column prop="passedScore" label="Passing Score" align="center"width="100"  />
      <el-table-column prop="radioCount" label="Single Choice Questions" align="center" width="100"  />
      <el-table-column prop="multiCount" label="Multiple Choice Questions" align="center" width="100" />
      <el-table-column prop="judgeCount" label="True/False Questions" align="center" width="100" />
      <el-table-column prop="saqCount" label="Short Answer Questions" align="center" width="100" />
      <el-table-column prop="startTime" label="Start Time" align="center" />
      <el-table-column prop="endTime" label="End Time" align="center" />
      <el-table-column prop="createTime" label="Create Time" align="center" />
      <el-table-column fixed="right" label="Action" align="center">
        <template slot-scope="{ row }">
          <el-button type="success" plain
                     size="small"
                     @click="screenInfo(row)"
          >Start Exam</el-button>
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
import { getGradeExamList } from '@/api/exam'
export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      data: {},
      searchTitle: '',
      formInline: {
        user: '',
        region: ''
      },
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px'
    }
  },
  created() {
    this.getExamGradePage()
  },
  methods: {
    // Pagination query
    async getExamGradePage(pageNum, pageSize, searchTitle = null) {
      const params = { pageNum: pageNum, pageSize: pageSize, title: searchTitle }
      const res = await getGradeExamList(params)
      this.data = res.data
    },

    screenInfo(row) {
      console.info('=====', row)
      localStorage.setItem('examInfo_examId', row.id)
      this.$router.push({ name: 'exam-info', query: { zhi: row }})
    },
    searchExamStu() {
      this.getExamGradePage(this.pageNum, this.pageSize, this.searchTitle)
    },
    handleSizeChange(val) {
      // Set logic for how many items per page
      this.pageSize = val
      this.getExamGradePage(this.pageNum, val)
    },
    handleCurrentChange(val) {
      // Set logic for the current page
      this.pageNum = val
      this.getExamGradePage(val, this.pageSize)
    },
    handleClick(row) {
      // console.log(row);
    }
  }
}
</script>

<style></style>
