<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="Exam Name">
        <el-input v-model="input" />
      </el-form-item>

      <!-- <el-form-item label="Exam Time" style="margin-left: 15px">
          <el-date-picker
            v-model="value1"
            type="datetimerange"
            range-separator="To"
            start-placeholder="Start Date"
            end-placeholder="End Date"
          >
          </el-date-picker>
        </el-form-item> -->

      <el-form-item>
        <el-button type="primary" @click="searchExam">Search</el-button>
        <el-button type="primary" @click="screenInfo">Add</el-button>
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
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column fixed label="Serial Number" align="center" width="80px">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column prop="title" label="Exam Name" align="center" />
      <el-table-column prop="examDuration" label="Exam Duration" align="center" />
      <el-table-column prop="maxCount" label="Maximum Screen Switches" align="center" width="120px" />
      <el-table-column prop="grossScore" label="Total Score" align="center" width="100px"/>
      <el-table-column prop="passedScore" label="Passing Score" align="center" width="100px"/>
      <el-table-column prop="radioCount" label="Number of Single Choice Questions" align="center" width="100px" />
      <el-table-column prop="multiCount" label="Number of Multiple Choice Questions" align="center" width="100px"/>
      <el-table-column prop="judgeCount" label="Number of True/False Questions" align="center" width="100px" />
      <el-table-column prop="saqCount" label="Number of Short Answer Questions" align="center" width="100px"/>
      <el-table-column prop="startTime" label="Start Time" align="center" />
      <el-table-column prop="endTime" label="End Time" align="center" />
      <el-table-column fixed="right" label="Operation" align="center">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            size="small"
            style="font-size: 14px"
            @click="updateRow(row)"
          >Edit</el-button>
          <el-button
            type="text"
            size="small"
            style="color: red; font-size: 14px"
            @click="delExam(row)"
          >Delete</el-button>
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

    <el-dialog title="Edit" :visible.sync="dialogFormVisible">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form :model="form">
            <el-form-item label="Exam Title  " :label-width="formLabelWidth">
              <el-input v-model="form.title" />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-form :model="form">
            <el-form-item label="Exam Duration" :label-width="formLabelWidth">
              <el-input v-model="form.examDuration" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form :model="form">
            <el-form-item label="Max Screen Times" :label-width="formLabelWidth">
              <el-input v-model="form.maxCount" />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-form :model="form">
            <el-form-item label="Passing Score" :label-width="formLabelWidth">
              <el-input v-model="form.passedScore" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <!-- <el-col :span="12">
          <el-form :model="form">
            <el-form-item label="Exam Class" :label-width="formLabelWidth">
              <el-input v-model="form.address"></el-input>
            </el-form-item>
          </el-form>
        </el-col> -->
        <el-col :span="12">
          <el-form :model="form">
            <el-form-item label="Single Choice Score" :label-width="formLabelWidth">
              <el-input v-model="form.radioScore" />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-form :model="form">
            <el-form-item label="Multiple Choice Score" :label-width="formLabelWidth">
              <el-input v-model="form.multiScore" />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-form :model="form">
            <el-form-item label="True/False Score" :label-width="formLabelWidth">
              <el-input v-model="form.judgeScore" />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-form :model="form">
            <el-form-item label="Short Answer Score" :label-width="formLabelWidth">
              <el-input v-model="form.saqScore" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div style="display: flex; justify-content: flex-end; width: 100%">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="updateExam()">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { examPaging, repoAdd, examUpdate, examDel } from '@/api/exam'
export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      data: {},
      input: '',
      formInline: {
        user: '',
        region: '',
        date1: '',
        date2: ''
      },
      value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      dialogVisible: false,
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        name: ''
      },
      cancel() {},
      updateRow(row) {
        this.dialogFormVisible = true
        this.form = row
      },
      diaTitle: 'New',
      formLabelWidth: '110px'
    }
  },
  computed: {
    tables() {
      // Define 'tables' in your data table
      const input = this.input;
      if (input) {
        // console.log("input输入的搜索内容：" + this.input)
        return this.tableData.filter((data) => {
          // console.log("object:" + Object.keys(data));
          return Object.keys(data).some((key) => {
            return String(data[key]).toLowerCase().indexOf(input) > -1;
          });
        });
      }
      return this.tableData;
    }
  },
  created() {
    this.getExamPage()
  },
  methods: {
    delExam(row) {
      this.$confirm('This operation will permanently delete the exam. Do you want to continue?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning',
        center: true
      })
        .then(() => {
          examDel(row.id).then((res) => {
            if (res.code) {
              this.getExamPage(this.pageNum, this.pageSize)
              this.tableData.splice(index, 1)
              this.$message({
                type: 'success',
                message: 'Successfully deleted!'
              })
            } else {
              this.$message({
                type: 'info',
                message: res.msg
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: 'Deletion canceled'
          })
        })
    },
    updateExam() {
      const data = {
        examDuration: this.form.examDuration,
        judgeScore: this.form.judgeScore,
        maxCount: this.form.maxCount,
        multiScore: this.form.multiScore,
        passedScore: this.form.passedScore,
        radioScore: this.form.radioScore,
        saqScore: this.form.saqScore,
        title: this.form.title
      }
      examUpdate(this.form.id, data).then((res) => {
        if (res.code) {
          this.getExamPage(this.pageNum, this.pageSize)
          this.dialogFormVisible = false
          this.$message({
            type: 'success',
            message: 'Successfully modified'
          })
        } else {
          this.$message({
            type: 'info',
            message: res.msg
          })
        }
      })
    },
    // Pagination query
    async getExamPage(pageNum, pageSize, title = null) {
      const params = { pageNum: pageNum, pageSize: pageSize, title: title }
      const res = await examPaging(params)
      this.data = res.data
    },
    searchExam() {
      this.getExamPage(this.pageNum, this.pageSize, this.input)
    },
    onSubmit() {
      console.log('submit!')
    },
    screenInfo(row) {
      console.info('=====', row)
      this.$router.push({ name: 'add-exam', query: { zhi: row }})
    },
    handleSizeChange(val) {
      // Set logic for how many items per page
      this.pageSize = val
      this.getExamPage(this.pageNum, val)
    },
    handleCurrentChange(val) {
      // Set logic for current page
      this.pageNum = val
      this.getExamPage(val, this.pageSize)
    }
  }
}
</script>
<style></style>
