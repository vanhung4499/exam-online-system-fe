<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="Notice Title">
        <el-input v-model="searchTitle" placeholder="Notice Title" />
      </el-form-item>
      <!-- <el-form-item label="Question Type" style="margin-left:28px">
          <el-input v-model="input1" placeholder="Question Type"></el-input>
        </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="searchNotice">Search</el-button>
        <el-button type="primary" @click="dialogTableVisible = true">Add</el-button>
        <!-- <el-button type="primary" style="margin-left: 40px" @click="daoru"
            >Import</el-button
          > -->
      </el-form-item>
    </el-form>

    <!-- Popup -->
    <el-dialog title="Add New" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">Confirm</el-button>
      </span>
    </el-dialog>

    <!-- table -->
    <el-table :data="data.records" border fit highlight-current-row :header-cell-style="{
      background: '#f2f3f4',
      color: '#555',
      'font-weight': 'bold',
      'line-height': '32px',
    }">
      <el-table-column fixed label="Index" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column prop="title" label="Notice Title" align="center" />
      <el-table-column prop="content" label="Content" align="center">
        <template slot-scope="scope">
          <div v-html="scope.row.content" />
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Operation" align="center">
        <template slot-scope="{ row }">
          <el-button type="text" size="small" style="font-size: 14px" @click="updateRow(row)">Edit</el-button>
          <el-button type="text" size="small" style="color: red; font-size: 14px"
                     @click="delNotice(row.id)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination :current-page="data.current" :page-sizes="[10, 20, 30, 40]" :page-size="data.size"
                     layout="total, sizes, prev, pager, next, jumper" :total="data.total" @size-change="handleSizeChange"
                     @current-change="handleCurrentChange" />
    </div>

    <!-- Add New Popup -->

    <el-dialog :title="diaTitle" :visible.sync="dialogTableVisible">
      <el-row>
        <el-col :span="12">
          <el-form :model="form">
            <el-form-item label="Notice Title" :label-width="formLabelWidth">
              <el-input v-model="form.title" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Notice Content" :label-width="formLabelWidth">
              <div>
                <quill-editor ref="myQuillEditor" v-model="content" :options="editorOption" class="my-quill-editor"
                              @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)" />
              </div>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">Cancel</el-button>
        <el-button type="primary" @click="addNotice">Confirm</el-button>
      </span>
    </el-dialog>

    <!-- Edit Popup -->

    <el-dialog title="Edit" :visible.sync="dialogFormVisible">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form :model="form">
            <el-form-item label="Notice Title" :label-width="formLabelWidth">
              <el-input v-model="form.title" :disabled="true" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Notice Content" :label-width="formLabelWidth">
              <quill-editor ref="myQuillEditor" v-model="form.content" :options="editorOption" class="my-quill-editor"
                            @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="updateNotice()">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

import { noticePaging, noticeAdd, noticeDel, noticeUpdate } from '@/api/notice'
export default {


  components: {
    quillEditor

  },

  data() {
    return {
      items: [],
      content: '',
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // Font
            ['blockquote', 'code-block'],

            [{ header: 1 }, { header: 2 }], // Style Headers
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }], // Subscript, Superscript
            [{ indent: '-1' }, { indent: '+1' }], // Indent
            [{ direction: 'rtl' }],
            [{ size: ['small', false, 'large', 'huge'] }], // Font Size
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ['clean'] // Format Clearing
          ]
        }
      },

      pageNum: 1,
      pageSize: 10,
      data: {},
      searchTitle: '',
      input1: '',

      abcd: '',
      dialogVisible: false,

      formInline: {
        user: '',
        region: ''
      },
      updateRow(row) {
        this.dialogFormVisible = true
        this.form = row
      },
      diaTitle: 'Add New',
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        content: '',
        title: ''
      },
      formLabelWidth: '120px'
    }
  },

  computed: {

    editor() {
      return this.$refs.myQuillEditor.quill
    },
    tables() {
      // Define tables in your data table
      const input = this.input
      const input1 = this.input1
      if (input) {
        // console.log("input search content: " + this.input)
        return this.tableData.filter((data) => {
          // console.log("object: " + Object.keys(data));
          return Object.keys(data).some((key) => {
            return String(data[key]).toLowerCase().indexOf(input) > -1
          })
        })
      }
      if (input1) {
        // console.log("input search content: " + this.input)
        return this.tableData.filter((data) => {
          // console.log("object: " + Object.keys(data));
          return Object.keys(data).some((key) => {
            return String(data[key]).toLowerCase().indexOf(input1) > -1
          })
        })
      }

      return this.tableData
    }
  },

  created() {
    this.getNoticePage()
  },
  methods: {

    onEditorBlur(quill) {
      console.log('editor blur!', quill)
    },
    onEditorFocus(quill) {
      console.log('editor focus!', quill)
    },
    onEditorReady(quill) {
      console.log('editor ready!', quill)
    },
    // Pagination query
    async getNoticePage(pageNum, pageSize, title = null) {
      const params = { pageNum: pageNum, pageSize: pageSize, title: title }
      const res = await noticePaging(params)
      this.data = res.data
    },
    updateNotice() {
      const data = { title: this.form.title, content: this.form.content }
      noticeUpdate(this.form.id, data).then((res) => {
        if (res.code) {
          this.getNoticePage(this.pageNum, this.pageSize)
          this.dialogFormVisible = false
          this.$message({
            type: 'success',
            message: 'Successfully edited!'
          })
        } else {
          this.$message({
            type: 'info',
            message: res.msg
          })
        }
      })
    },
    searchNotice() {
      this.getNoticePage(this.pageNum, this.pageSize, this.searchTitle)
    },

    delNotice(id) {
      this.$confirm('This will permanently delete the file, continue?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning',
        center: true
      }).then(() => {
        noticeDel(id).then((res) => {
          if (res.code) {
            this.getNoticePage(this.pageNum, this.pageSize)
            this.getNoticePage(1)
            this.$message({
              type: 'success',
              message: 'Successfully deleted!'
            })
          }
        })

      }).catch((error) => {
        if (error === 'cancel') {
          this.$message({
            type: 'info',
            message: 'Operation cancelled',
          });
        } else {
          console.error('An error occurred:', error);
        }
      });
    },


    addNotice() {
      const data = { title: this.form.title, content: this.content }
      noticeAdd(data).then((res) => {
        if (res.code) {
          this.form.title = ''
          this.content = ''
          this.getNoticePage(this.pageNum, this.pageSize)
          this.dialogTableVisible = false
          this.$message({
            type: 'success',
            message: 'Successfully added!'
          })
        } else {
          this.$message({
            type: 'info',
            message: res.msg
          })
        }
      })
    },
    handleClick(row) {
      // console.log(row);
    },
    handleSizeChange(val) {
      // Set logic for how many items per page
      this.pageSize = val
      this.getNoticePage(this.pageNum, val)
    },
    handleCurrentChange(val) {
      // Set logic for current page
      this.pageNum = val
      this.getNoticePage(val, this.pageSize)
    },

    handleClose(done) {
      this.$confirm('Confirm to close?')
        .then((_) => {
          done()
        })
        .catch((_) => { })
    }
  },
}
</script>

<style>
.my-quill-editor {
  width: 40em;
}
</style>
