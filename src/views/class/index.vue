<template>
  <div class="app-container">
    <!-- form -->

    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="Class">
        <el-input v-model="formInline.searchTitle" placeholder="Enter class name" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchExam">Search</el-button>
      </el-form-item>
      <el-form-item>
        <el-button :title="diaTitle" type="primary" @click="dialogTableVisible = true">
          Add</el-button>
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
      <el-table-column label="No." align="center" width="80px">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="gradeName" label="Class Name" align="center" />
      <el-table-column prop="gradeCount" label="Number of Students" align="center" />
      <el-table-column prop="code" label="Class Code" align="center" />
      <el-table-column prop="userName" label="Created By" align="center" />
      <el-table-column align="center" label="Action">
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
            @click="delClass(row)"
          >Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
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

    <!-- Add New Popup -->
    <el-dialog :title="diaTitle" :visible.sync="dialogTableVisible">
      <el-row>
        <el-form :model="addForm">
          <el-form-item label="Class Name" :label-width="formLabelWidth">
            <el-input v-model="addForm.gradeName" autocomplete="off" />
          </el-form-item>
        </el-form>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">Cancel</el-button>
        <el-button type="primary" @click="addClass">Confirm</el-button>
      </div>
    </el-dialog>


    <!-- Edit Popup -->
    <el-dialog title="Edit" :visible.sync="dialogFormVisible">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form :model="form">
            <el-form-item label="Class name" :label-width="formLabelWidth">
              <el-input v-model="form.gradeName" autocomplete="off" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="updateClass">Confirm</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { classPaging, classDel, classUpdate, classAdd } from '@/api/class_'
export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      data: {},
      diaTitle: 'Add New',
      dialogTableVisible: false,
      dialogFormVisible: false,
      addForm: {
        gradeName: ''
      },
      formInline: {
        searchTitle: ''
      },
      form: {
        gradeName: ''
      },
      formLabelWidth: '110px'
    }
  },

  computed: {
    // tables() {
    //   //在你的数据表格中定义tabels
    //   const input = this.input;
    //   const input1 = this.input1;
    //   if (input) {
    //     // console.log("input输入的搜索内容：" + this.input)
    //     return this.tableData.filter((data) => {
    //       console.log("object:" + Object.keys(data));
    //       return Object.keys(data).some((key) => {
    //         return String(data[key]).toLowerCase().indexOf(input) > -1;
    //       });
    //     });
    //   }
    //   if (input1) {
    //     // console.log("input输入的搜索内容：" + this.input)
    //     return this.tableData.filter((data) => {
    //       console.log("object:" + Object.keys(data));
    //       return Object.keys(data).some((key) => {
    //         return String(data[key]).toLowerCase().indexOf(input1) > -1;
    //       });
    //     });
    //   }
    //   return this.tableData;
    // },
  },
  created() {
    this.getClassPage()
  },
  methods: {
    // Pagination query
    async getClassPage(pageNum, pageSize, title = null) {
      const params = { pageNum: pageNum, pageSize: pageSize, gradeName: title }
      const res = await classPaging(params)
      this.data = res.data
    },
    addClass() {
      const data = { gradeName: this.addForm.gradeName }
      classAdd(data).then((res) => {
        if (res.code) {
          this.addForm.gradeName = ''
          this.getClassPage(this.pageNum, this.pageSize)
          this.dialogTableVisible = false
          this.$message({
            type: 'success',
            message: 'Added successfully!'
          })
        } else {
          this.$message({
            type: 'info',
            message: res.msg
          })
        }
      })
    },
    delClass(row) {
      this.$confirm('This action will permanently delete the class. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
        center: true
      })
        .then(() => {
          classDel(row.id).then((res) => {
            if (res.code) {
              this.getClassPage(this.pageNum, this.pageSize)
              const index = this.data.records.indexOf(row)
              if (index !== -1) {
                this.data.records.splice(index, 1)
              }
              this.$message({
                type: 'success',
                message: 'Deleted successfully!'
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
    updateClass() {
      classUpdate(this.form.id, { gradeName: this.form.gradeName })
        .then((res) => {
          if (res.code) {
            this.getClassPage(this.pageNum, this.pageSize)
            this.dialogFormVisible = false
            this.$message({
              type: 'success',
              message: 'Edited successfully!'
            })
          } else {
            this.$message({
              type: 'info',
              message: res.msg
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: 'Edit canceled'
          })
        })
    },
    updateRow(row) {
      this.dialogFormVisible = true
      this.form = row
    },
    searchExam() {
      this.getClassPage(this.pageNum, this.pageSize, this.formInline.searchTitle)
    },
    handleClick(row) {
      console.log(row)
    },
    handleSizeChange(val) {
      // Logic for setting how many items per page
      this.pageSize = val
      this.getClassPage(this.pageNum, val)
    },
    handleCurrentChange(val) {
      // Logic for setting the current page
      this.pageNum = val
      this.getClassPage(val, this.pageSize)
    }
  }
}
</script>

<style>
.el-table--border,
.el-table--group {
  border: 1px solid #b3b3b3;
}

.bj {
  margin-top: 40px;
  margin-left: 30px;
}
</style>
