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
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column fixed label="Number" align="center" width="80">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column prop="examTitle" label="Exam Name" align="center" />
      <el-table-column prop="classSize" label="Total Number" align="center" />
      <el-table-column prop="numberOfApplicants" label="Actual Number of Applicants" align="center" />
      <el-table-column prop="correctedPaper" label="Number of Papers Corrected" align="center" />
      <el-table-column fixed="right" label="Operation" align="center">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            size="small"
            style="font-size: 14px"
            :disabled="row.numberOfApplicants <= row.correctedPaper"
            @click="screenInfo(row)"
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
    <!-- Edit Dialog -->

    <!-- <el-dialog title="Edit" :visible.sync="dialogFormVisible">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form :model="form">
            <el-form-item label="Number" :label-width="formLabelWidth">
              <el-input v-model="form.date" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-form :model="form">
            <el-form-item label="Stem" :label-width="formLabelWidth">
              <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form :model="form">
            <el-form-item label="Question Type" :label-width="formLabelWidth">
              <el-input v-model="form.province" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-form :model="form">
            <el-form-item label="Belongs to Bank" :label-width="formLabelWidth">
              <el-input v-model="form.city" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form :model="form">
            <el-form-item label="Creation Time" :label-width="formLabelWidth">
              <el-input v-model="form.address" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">Confirm</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { answerExamPging } from '@/api/answer'
export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      data: {},
      input: '',
      input1: '',
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,

      formInline: {
        user: '',
        region: ''
      },
      cancel() {},
      // updateRow(row) {
      //   this.dialogFormVisible = true;
      //   this.form = row;
      // },
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
  computed: {
    tables() {
      // Define tables in your data table
      const input = this.input
      const input1 = this.input1
      if (input) {
        return this.tableData.filter((data) => {
          return Object.keys(data).some((key) => {
            return String(data[key]).toLowerCase().indexOf(input) > -1
          })
        })
      }
      if (input1) {
        return this.tableData.filter((data) => {
          return Object.keys(data).some((key) => {
            return String(data[key]).toLowerCase().indexOf(input1) > -1
          })
        })
      }

      return this.tableData
    }
  },
  created() {
    this.getAnswerPage()
  },
  methods: {
    getAnswerPage(pageNum, pageSize) {
      const params = { pageNum: pageNum, pageSize: pageSize }
      answerExamPaging(params).then((res) => {
        this.data = res.data
      })
    },
    handleSizeChange(val) {
      // Logic for setting how many items per page
      this.pageSize = val
      this.getAnswerPage(this.pageNum, val)
    },
    handleCurrentChange(val) {
      // Logic for setting the current page
      this.pageNum = val
      this.getAnswerPage(val, this.pageSize)
    },
    screenInfo(row) {
      console.info('=====', row)
      localStorage.setItem('answer_examId', row.examId)
      this.$router.push({ name: 'Ansck', query: { zhi: row }})
    }
    // open(index) {
    //   this.$confirm("This action will permanently delete the file, continue?", "Prompt", {
    //     confirmButtonText: "OK",
    //     cancelButtonText: "Cancel",
    //     type: "warning",
    //     center: true,
    //   });
    //   this.tableData
    //     .splice(index, 1)
    //     .then(() => {
    //       this.$message({
    //         type: "success",
    //         message: "Deleted successfully!",
    //       });
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "Deletion canceled",
    //       });
    //     });
    // },
  }
}
</script>
<style></style>
