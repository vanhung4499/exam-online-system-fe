<template>
  <div class="app-container">
    <!-- table -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="Real Name">
        <el-input v-model="searchRealName" placeholder="Enter name" />
      </el-form-item>
      <el-form-item label="Class">
        <ClassSelect v-model="searchClassName" :is-multiple="false" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchUser">Search</el-button>
        <el-button type="primary" @click="dialogTableVisible = true">Add</el-button>
        <el-button type="primary" @click="fileDialogVisible = true">Import</el-button>
      </el-form-item>
    </el-form>
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
      <el-table-column label="No" align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="Username" align="center" />
      <el-table-column prop="realName" label="Real Name" align="center" />
      <el-table-column prop="roleName" label="Role Name" align="center" />
      <el-table-column prop="gradeName" label="Class" align="center" />
      <el-table-column prop="createTime" label="Registration Time" align="center" />
      <el-table-column align="center" label="Operation">
        <template slot-scope="{ row }">
          <el-button
            v-if="role == 'teacher'"
            type="text"
            size="small"
            style="color: red; font-size: 14px"
            @click="removeUserClass(row)"
          >Remove Class</el-button>
          <el-button
            v-if="role == 'admin'"
            type="text"
            size="small"
            style="color: red; font-size: 14px"
            @click="delUser(row)"
          >Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Import dialog -->
    <el-dialog
      title="Import"
      :visible.sync="dialogInportVisible"
      style="width: 800px; margin: auto"
    >
      <el-upload
        class="upload-demo"
        drag
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">Drag file here, or <em>click to upload</em></div>
        <div slot="tip" class="el-upload__tip">Only jpg/png files are allowed, and cannot exceed 500kb</div>
      </el-upload>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogInportVisible = false">Cancel</el-button>
        <el-button type="primary" @click="addClass">Confirm</el-button>
      </div>
    </el-dialog>

    <!-- Add dialog -->
    <el-dialog :title="diaTitle" :visible.sync="dialogTableVisible">
      <el-row>
        <el-col :span="12">
          <el-form :model="addForm">
            <el-form-item label="Username" :label-width="formLabelWidth">
              <el-input v-model="addForm.userName" autocomplete="off" />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-form :model="addForm">
            <el-form-item label="Real Name" :label-width="formLabelWidth">
              <el-input v-model="addForm.realName" autocomplete="off" />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col v-if="role == 'admin'" :span="12">
          <el-form :model="addForm">
            <el-form-item label="Role Selection" :label-width="formLabelWidth">
              <el-select v-model="addForm.region" placeholder="Select role">
                <el-option label="Student" value="1" />
                <el-option label="Teacher" value="2" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">Cancel</el-button>
        <el-button type="primary" @click="addClass">Confirm</el-button>
      </div>
    </el-dialog>
    <!-- File upload -->
    <el-dialog
      width="400px"
      :show-close="false"
      :close-on-click-modal="false"
      title="Upload File"
      :visible.sync="fileDialogVisible"
    >
      <el-upload
        class="upload-demo"
        drag
        action="xxxxxx"
        multiple
        :limit="1"
        accept=".xlsx, .xls"
        :auto-upload="false"
        :on-remove="handleRemove"
        :on-change="handleFileChange"
        :file-list="fileList"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">Drag file here, or <em>click to upload</em></div>
        <div slot="tip" class="el-upload__tip">Only xls/xlsx files are allowed, and cannot exceed 500kb</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="fileDialogVisible = false">Cancel</el-button>
        <el-button type="success" plain @click="startDownload">Download Template</el-button>

        <el-button type="primary" @click="importUser">Confirm</el-button>
      </div>
    </el-dialog>

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
  </div>
</template>

<script>
import ClassSelect from '@/components/ClassSelect'
import { userPaging, classAdd, userDel, userImport } from '@/api/user'
import { userClassRemove } from '@/api/class_'
export default {
  components: { ClassSelect },
  data() {
    return {
      formLabelWidth: '',
      searchRealName: '',
      searchClassName: '',
      role: '',
      pageNum: 1,
      diaTitle: 'Add',
      pageSize: 10,
      data: {},
      fileList: [],
      dialogTableVisible: false,
      dialogInportVisible: false,
      fileDialogVisible: false,
      addForm: {
        userName: '',
        realName: '',
        region: ''
      },
      form: {
        gradeName: ''
      },
      formLabelWidth: '110px'
    }
  },
  created() {
    // 获取用户角色
    this.role = localStorage.getItem('roles')
    // 获取分页数据
    this.getUserPage()
  },
  methods: {
    // Paginated query
    async getUserPage(pageNum, pageSize, realName = null, gradeId = null) {
      const params = {
        pageNum: pageNum,
        pageSize: pageSize,
        realName: realName,
        gradeId: gradeId
      }
      const res = await userPaging(params)
      this.data = res.data
    },
// Search functionality
    searchUser() {
      this.getUserPage(
        this.pageNum,
        this.pageSize,
        this.searchRealName,
        this.searchClassName
      )
    },
// Logic for setting number of items per page
    handleSizeChange(val) {
      this.pageSize = val
      this.getUserPage(this.pageNum, val)
    },
// Logic for setting the current page
    handleCurrentChange(val) {
      this.pageNum = val
      this.getUserPage(val, this.pageSize)
    },
// Logic for adding a user
    addClass() {
      const data = {
        userName: this.addForm.userName,
        realName: this.addForm.realName,
        roleId: this.addForm.region
      }
      classAdd(data).then((res) => {
        if (res.code) {
          this.getUserPage(this.pageNum, this.pageSize)
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
// File upload logic
    importUser() {
      if (this.fileList.length > 0) {
        const formData = new FormData() // Create FormData object
        formData.append('file', this.fileList[0].raw) // Add file to formData
        userImport(formData)
          .then((response) => {
            if (response.code) {
              this.getUserPage(this.pageNum, this.pageSize)
              this.$message.success(`${response.msg}`)
              this.fileDialogVisible = false // Close dialog
            } else {
              this.$message.error(`${response.msg}`)
            }

            // Handle success logic here, such as refreshing data
          })
          .catch((error) => {
            console.error('File upload failed:', error)
            this.$message.error('File upload failed!')
          })
      } else {
        this.$message.warning('Please select a file before uploading!')
      }
    },
    handleFileChange(file, fileList) {
      this.fileList = fileList // Collect file information
    },
    // File removal handler method
    handleRemove(file, fileList) {
      if (fileList.length == 0) {
        this.hasFiles = false
      }
    },
    delUser(row) {
      this.$confirm('This action will permanently delete the user, do you want to continue?', 'Prompt', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning',
        center: true
      })
        .then(() => {
          userDel(row.id).then((res) => {
            if (res.code) {
              this.getUserPage(this.pageNum, this.pageSize)
              this.tableData.splice(index, 1)
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
            message: 'Deletion cancelled'
          })
        })
    },
// Remove user from class
    removeUserClass(row) {
      userClassRemove(row.id).then((res) => {
        if (res.code) {
          this.getUserPage(this.pageNum, this.pageSize)
          this.$message({
            type: 'success',
            message: 'Removed successfully!'
          })
        } else {
          this.$message({
            type: 'info',
            message: res.msg
          })
        }
      })
    },
    // Download template
    async startDownload() {
      const a = document.createElement("a");
      a.href = "./template/ImportUserTemplate.xlsx";
      a.download = "Import User Template.xlsx";
      // Hide the <a> tag
      a.style.display = "none";
      // Append the <a> tag to the document object
      document.body.appendChild(a);
      // Simulate clicking the <a> tag, triggering the href reading, and the browser will automatically download
      a.click();
      // One-time use, delete the <a> tag after use
      a.remove();
    }
  }
}

</script>
<style>
.el-table--border,
.el-table--group {
  border: 1px solid #b3b3b3;
}
</style>
