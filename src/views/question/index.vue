<template>
  <div class="app-container">
    <!-- form -->

    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="Question Name">
        <el-input v-model="searchName" placeholder="Enter question name" />
      </el-form-item>
      <el-form-item label="Belongs to Repository">
        <repo-select
          v-model="selectedRepoSingleSearch"
          @change="handleRepoChangeSingle"
        />
      </el-form-item>
      <el-form-item label="Repository Type">
        <el-select v-model="selValue" placeholder="Please select">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchQu">Search</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="screenInfo()">Add New</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fileDialogVisible = true">Import</el-button>
      </el-form-item>
    </el-form>

    <!-- File upload -->
    <el-dialog
      width="400px"
      :show-close="false"
      :close-on-click-modal="false"
      title="Upload File"
      :visible.sync="fileDialogVisible"
    >
      <!-- v-model="scope.row.repoId" -->
      <!-- @change="repoChange($event, scope.row)" -->
      Please select repository:
      <repo-select
        v-model="selectedRepoSingle"
        style="margin-bottom: 10px"
        @change="handleRepoChangeSingle"
      />
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
        :file-list="form.fileList"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">Drag file here, or <em>click to upload</em></div>
        <div slot="tip" class="el-upload__tip">You can only upload xls/xlsx files, and the file size should not exceed 500kb</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="fileDialogVisible = false">Cancel</el-button>
        <el-button type="success" plain @click="startDownload">Download Template</el-button>
        <el-button type="primary" @click="importQu">Confirm</el-button>
      </div>
    </el-dialog>

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
      <el-table-column label="No." align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column prop="content" label="Question" align="center" />
      <el-table-column label="Question Type" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.quType == 1">Single Choice</span>
          <span v-else-if="scope.row.quType == 2">Multiple Choice</span>
          <span v-else-if="scope.row.quType == 3">True/False</span>
          <span v-else-if="scope.row.quType == 4">Short Answer</span>
        </template>
      </el-table-column>
      <el-table-column prop="repoTitle" label="Belongs to Repository" align="center" />
      <el-table-column prop="createTime" label="Creation Time" align="center" />
      <el-table-column align="center" label="Operation">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            size="small"
            style="font-size: 14px"
            @click="updateRow(row)"
          >Edit</el-button
          >
          <el-button
            type="text"
            size="small"
            style="color: red; font-size: 14px"
            @click="delQu(row)"
          >Delete</el-button
          >
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
    <!-- Edit Dialog -->

    <!-- <el-dialog title="Edit" :visible.sync="dialogFormVisible">
      <el-row>
        <el-col :span="12">
          <el-form :model="form">
            <el-form-item label="Question" :label-width="formLabelWidth">
              <el-input v-model="form.content" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form :model="form">
            <el-form-item label="Belongs to Repository" :label-width="formLabelWidth">
              <el-input v-model="form.repoTitle" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="updateQu">Confirm</el-button>
      </div>
    </el-dialog> -->

  </div>
</template>

<script>
import { quPaging, quAdd, quDel, quUpdate, importQue } from "@/api/question";
import RepoSelect from "@/components/RepoSelect";

export default {
  components: { RepoSelect },
  data() {
    return {
      options: [
        {
          value: null,
          label: "All Types",
        },
        {
          value: 1,
          label: "Single Choice",
        },
        {
          value: 2,
          label: "Multiple Choice",
        },
        {
          value: 3,
          label: "True/False",
        },
        {
          value: 4,
          label: "Short Answer",
        },
      ],
      length:'',
      selValue: '',
      searchName: '',
      pageNum: 1,
      pageSize: 10,
      data: {},
      fileDialogVisible: false,

      selectedRepoSingle: "",
      selectedRepoSingleSearch: "",
      input: "",
      input1: "",
      formInline: {
        user: "",
        region: "",
      },
      cancel() {},

      dialogTableVisible: false,
      dialogFormVisible: false,
      hasFiles: null,
      fileList: null,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      formLabelWidth: "110px",
    };
  },
  computed: {
    // tables() {
    //   // Define tables in your data table
    //   const input = this.input;
    //   const input1 = this.input1;
    //   if (input) {
    //     // console.log("input entered search content: " + this.input)
    //     return this.tableData.filter((data) => {
    //       console.log("object:" + Object.keys(data));
    //       return Object.keys(data).some((key) => {
    //         return String(data[key]).toLowerCase().indexOf(input) > -1;
    //       });
    //     });
    //   }
    //   if (input1) {
    //     // console.log("input entered search content: " + this.input)
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
    this.getQuPage();
  },
  methods: {
    handleRepoChangeSingle(repo) {
      console.log("Single Repository Changed:", repo);
      // You can further process the repo object here, such as updating UI or sending network requests
    },
    updateRow(row) {
      localStorage.setItem("quId", row.id);
      this.$router.push({ name: "add-question" });
    },
    importQu() {
      if (this.fileList && this.fileList.length > 0 && this.selectedRepoSingle !== "") {
        const formData = new FormData(); // Create FormData object
        formData.append("file", this.fileList[0].raw); // Add file to formData
        importQue(this.selectedRepoSingle, formData)
          .then((response) => {
            if (response.code) {
              this.$message.success("Import successful!");
              this.getQuPage(this.pageNum, this.pageSize);
              this.fileDialogVisible = false; // Close the dialog
              // You can handle the success logic here, such as refreshing data, etc.
            } else {
              this.$message({
                type: "error",
                message: response.msg,
              });
            }
          })
          .catch((error) => {
            console.error("File upload failed:", error);
            this.$message.error("File upload failed!");
          });
      } else {
        this.$message.warning("Please select a file before uploading!");
      }
    },
    handleFileChange(file, fileList) {
      this.fileList = fileList; // Collect file information
    },

// Remove file handling method
    handleRemove(file, fileList) {
      if (fileList.length == 0) {
        this.hasFiles = false;
      }
    },
// Pagination query
    async getQuPage(pageNum, pageSize, content = null, repoId = null, type = null) {
      const params = {
        pageNum: pageNum,
        pageSize: pageSize,
        content: content,
        repoId: repoId,
        type: type,
      };
      const res = await quPaging(params);
      this.data = res.data;
    },
// Edit repository
    updateQu() {
      quUpdate(this.form.id, { title: this.form.title })
        .then((res) => {
          if (res.code) {
            this.getQuPage(this.pageNum, this.pageSize);
            this.dialogFormVisible = false;
            this.$message({
              type: "success",
              message: "Edit successful!",
            });
          } else {
            this.$message({
              type: "info",
              message: res.msg,
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Cancel edit",
          });
        });
    },

// Delete repository
    delQu(row) {
      this.$confirm("This action will permanently delete the file. Continue?", "Warning", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
        center: true,
      })
        .then(() => {
          quDel(row.id).then((res) => {
            if (res.code) {
              this.getQuPage(this.pageNum, this.pageSize)
              // this.tableData.splice(index, 1)
              this.getQuPage(1)
              this.$message({
                type: "success",
                message: "Delete successful!",
              });
            } else {
              this.$message({
                type: "info",
                message: res.msg,
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Delete canceled",
          });
        });
    },
    searchQu() {
      this.getQuPage(
        this.pageNum,
        this.pageSize,
        this.searchName,
        this.selectedRepoSingleSearch,
        this.selValue
      );
    },


    screenInfo(row, index, done) {
      console.info("=====", row);
      this.$router.push({ name: "add-question", query: { zhi: row } });
    },

    handleSizeChange(val) {
      // Set logic for how many items per page
      this.pageSize = val;
      this.getQuPage(this.pageNum, val);
    },
    handleCurrentChange(val) {
      // Set logic for current page
      this.pageNum = val
      this.getQuPage(val, this.pageSize)
    },
    // Download template
    async startDownload() {
      const a = document.createElement("a");
      a.href = "./template/ImportQuestionTemplate.xlsx";
      a.download = "ImportQuestionTemplate.xlsx";
      // Hide the a tag
      a.style.display = "none";
      // Append the a tag to the document
      document.body.appendChild(a);
      // Simulate a click on the <a> tag, which triggers the href of the <a> tag, and the browser will automatically download
      a.click();
      // Once used, remove the a tag
      a.remove();
    }
  }
}
</script>

<style></style>
