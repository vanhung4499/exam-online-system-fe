<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="Exam Title">
        <el-input v-model="examTitle" placeholder="Exam Title" />
      </el-form-item>
      <el-form-item label="Grade">
        <ClassSelect v-model="gradeId" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Search</el-button>
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
      <el-table-column prop="examTitle" label="Exam Name" align="center" />
      <el-table-column prop="gradeName" label="Grade" align="center" />
      <el-table-column prop="maxScore" label="Max Score" align="center" />
      <el-table-column prop="minScore" label="Min Score" align="center" />
      <el-table-column prop="avgScore" label="Average Score" align="center" />
      <el-table-column prop="attendNum" label="Number of Participants" align="center" />
      <!-- <el-table-column prop="limitTime" label="Submission Time" align="center" /> -->

      <el-table-column fixed="right" label="Action" align="center">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            size="small"
            :disabled="row.maxScore == null"
            style="font-size: 14px"
            @click="updateRow(row)"
          >View Details</el-button>
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
import ClassSelect from '@/components/ClassSelect'
import { getExamScore } from '@/api/score'
export default {
  components: { ClassSelect },
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      gradeId: '',
      examTitle: '',
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
        localStorage.setItem('examId', row.examId)
        localStorage.setItem('gradeId', row.gradeId)
        this.$router.push({ name: 'score-detail' })
      },
      diaTitle: '',
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: '120px'
    }
  },
  computed: {
    tables() {
      // Define tables in your data table
      const input = this.input
      const input1 = this.input1
      if (input) {
        // console.log("Input Search Content: " + this.input)
        return this.tableData.filter((data) => {
          // console.log("object:" + Object.keys(data));
          return Object.keys(data).some((key) => {
            return String(data[key]).toLowerCase().indexOf(input) > -1
          })
        })
      }
      if (input1) {
        return this.tableData.filter((data) => {
          // console.log("object:" + Object.keys(data));
          return Object.keys(data).some((key) => {
            return String(data[key]).toLowerCase().indexOf(input1) > -1
          })
        })
      }

      return this.tableData
    }
  },
  created() {
    this.getScorePage()
  },
  methods: {
    // Pagination query
    async getScorePage() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        gradeId: this.gradeId,
        examTitle: this.examTitle
      }
      const res = await getExamScore(params)
      this.data = res.data
    },
    onSubmit() {
      this.getScorePage()
    },
    handleSizeChange(val) {
      // Set the logic for how many items per page
      this.pageSize = val
      this.getScorePage(this.pageNum, val)
    },
    handleCurrentChange(val) {
      // Set the logic for the current page
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
