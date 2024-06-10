<template>
  <div
    style="
      width: 1000px;
      height: 500px;
      background-color: rgb(240 242 245);
      margin: auto;
      margin-top: 40px;
      display: flex;
    "
  >
    <div style="width: 60%; height: 100%">
      <ul style="list-style: none; font-size: large; font-weight: 500">
        <li style="padding-top: 50px; padding-left: 80px">
          Username: {{ this.data.userName }}
        </li>
        <li style="padding-top: 50px; padding-left: 80px">
          Real Name: {{ this.data.realName }}
        </li>
        <li style="padding-top: 50px; padding-left: 80px">
          Class: {{ this.data.gradeName }}
          <el-button
            type="primary"
            icon="el-icon-plus"
            circle
            size="mini"
            style="margin-left: 15px"
            @click="addClassBt"
          />
        </li>
        <li style="padding-top: 50px; padding-left: 80px">
          Registration Time: {{ this.data.createTime }}
        </li>
        <li style="padding-top: 50px; padding-left: 80px">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="fileDialogVisible = true"
          >Edit Avatar</el-button>
        </li>
      </ul>
      <!-- Edit Personal Information -->
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
          :auto-upload="false"
          :on-remove="handleRemove"
          :on-change="handleFileChange"
          :file-list="fileList"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">Drag file here, or <em>click to upload</em></div>
          <div slot="tip" class="el-upload__tip">Only xls/xlsx files are allowed, and no larger than 500kb</div>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button @click="fileDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="importAvatar">Confirm</el-button>
        </div>
      </el-dialog>
      <!-- Add Class -->
      <el-dialog title="Join Class" :visible.sync="addClassDialogVisible">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form :model="form">
              <el-form-item label="Class Code" :label-width="formLabelWidth">
                <el-input v-model="form.code" autocomplete="off" />
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addClassDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="addClass">Confirm</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <img
        style="
          width: 150px;
          height: 150px;
          margin-right: 60px;
          margin-top: 55px;
          border-radius: 200px;
        "
        :src="this.data.avatar"
        alt=""
      >
      <div style="margin-left: 53px; margin-top: 38px; font-size: 20px">Avatar</div>
    </div>
  </div>
</template>

<script>
import { getInfo, userAddClass, uploadAvatar } from '@/api/user'
export default {
  data() {
    return {
      imageUrl: '',
      fileDialogVisible: false,
      fileList: [],
      data: {},
      form: {
        code: ''
      },
      addClassDialogVisible: false
    }
  },
  created() {
    getInfo().then((res) => {
      if (res.code) {
        this.data = res.data
      }
    })
  },
  methods: {
    handleFileChange(file, fileList) {
      this.fileList = fileList // Collect file information
    },
    // File removal handler method
    handleRemove(file, fileList) {
      if (fileList.length == 0) {
        this.hasFiles = false
      }
    },
    // File upload logic
    importAvatar() {
      if (this.fileList.length > 0) {
        const formData = new FormData() // Create FormData object
        formData.append('file', this.fileList[0].raw) // Add file to formData
        uploadAvatar(formData)
          .then((response) => {
            getInfo().then((res) => {
              if (res.code) {
                this.data = res.data
              }
            })
            this.$message.success('File uploaded successfully!')
            this.fileDialogVisible = false // Close dialog
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

    addClassBt() {
      this.addClassDialogVisible = true
    },
    addClass() {
      const params = { code: this.form.code }
      userAddClass(params).then((res) => {
        if (res.code) {
          this.addClassDialogVisible = false
          this.$message({
            type: 'success',
            message: 'Successfully joined'
          })
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
    }
  }
}
</script>

<style>
/* Edit personal avatar */
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

