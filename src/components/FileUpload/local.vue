<template>
  <div class="content">
    <el-upload
      v-model="fileUrl"
      :action="server"
      :accept="accept"
      :before-remove="beforeRemove"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-exceed="handleExceed"
      :drag="listType!=='picture'"
      :limit="limit"
      :headers="header"
      :file-list="fileList"
      :list-type="listType"
    >

      <el-button v-if="listType==='picture'" size="small" type="primary">Click to Upload</el-button>

      <i v-if="listType!=='picture'" class="el-icon-upload" />
      <div v-if="listType!=='picture'" class="el-upload__text">
        Drag files here, or
        <em>click to upload</em>
      </div>
      <div v-if="tips" slot="tip" class="el-upload__tip">{{ tips }}</div>
    </el-upload>

  </div>
</template>

<script>
import { getToken } from '@/utils/auth'

export default {
  name: 'FileUploadLocal',
  props: {
    value: String,
    accept: String,
    tips: String,
    listType: String,
    limit: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      server: `api/questions/uploadImage`,
      fileList: [],
      fileUrl: '',
      header: {}
    }
  },

  watch: {
    // Detect changes in value
    value: {
      handler() {
        this.fillValue()
      }
    }
  },

  created() {
    this.fillValue()
    this.header = { Authorization: getToken() }
  },

  methods: {

    fillValue() {
      this.fileList = []
      this.fileUrl = this.value
      if (this.fileUrl) {
        this.fileList = [{ name: this.fileUrl, url: this.fileUrl }]
      }
    },

    // Hook function when the number of files exceeds the limit
    handleExceed() {
      this.$message.warning(`Only ${this.limit} files can be uploaded at a time`)
    },

    // Hook function before removing files
    beforeRemove() {
      return this.$confirm(`Are you sure you want to remove this file?`)
    },

    // Hook function when removing files from the file list
    handleRemove() {
      this.$emit('input', '')
      this.fileList = []
    },

    // Hook function when files are successfully uploaded
    handleSuccess(response) {
      if (response.code === 1) {
        this.$message({
          type: 'success',
          message: response.msg
        })
        this.$emit('input', response.data)
        this.fileList = []
        return
      }
    }

  }
}
</script>
