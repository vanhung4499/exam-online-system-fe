<template>
  <div style="margin-top: 30px">
    <div style="padding-left: 53px">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="User Name" style="margin-left: 28px">
          <el-input v-model="input" placeholder="Enter name" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            style="margin-left: 40px"
            @click="onSubmit"
          >Search</el-button>
        </el-form-item>
      </el-form>
      <!-- table -->
      <div style="margin: auto; width: 90%" align="center">
        <el-table :data="data.records" border fit highlight-current-row
                  :header-cell-style="{
            background: '#f2f3f4',
            color: '#555',
            'font-weight': 'bold',
            'line-height': '32px',
          }">
          <el-table-column align="center" type="selection" width="55" />
          <el-table-column fixed label="Number" align="center" width="80">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column prop="userName" label="User Name" align="center" />
          <el-table-column prop="limitTime" label="Submission Time" align="center" />

          <el-table-column fixed="right" label="Operation" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                style="font-size: 14px"
                @click="screenInfo(scope.row)"
              >Grade Exam</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <span class="demonstration" />
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
  </div>
</template>

<script>
import { answerUserPaging } from '@/api/answer'
export default {


  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      data: {},
      examId: '',
      formInline: {}, // Initialize to the value or object structure you need
      myProperty: 'Initial Value', // Declare your property here
      input:'',
      onSubmit:'',
      handleSizeChange:'',
      handleCurrentChange:'',
    }
  },
  created() {
    this.examId = localStorage.getItem('answer_examId')
    this.getAnswerUserPage(
      this.pageNum,
      this.pageSize,
      localStorage.getItem('answer_examId')
    )
  },
  methods: {
    getAnswerUserPage(pageNum, pageSize, examId) {
      const params = { pageNum: pageNum, pageSize: pageSize, examId: examId }
      answerUserPaging(params).then((res) => {
        this.data = res.data
      })

    },
    screenInfo(row) {
      console.info('=====', row)
      sessionStorage.setItem('answer_info', JSON.stringify(row))
      this.$router.push({ name: 'make' })
    },

  }
}
</script>

<style scoped></style>
