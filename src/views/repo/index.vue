<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="Question Bank Name:">
        <el-input v-model="searchTitle" placeholder="Please enter search content" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchRepo">Search</el-button>
        <el-button type="primary" @click="addRepoDialogVisible = true">Add New</el-button>
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
      <el-table-column fixed label="No." align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column prop="title" label="Question Bank Name" align="center" />
      <el-table-column prop="createTime" label="Creation Time" align="center" />
      <el-table-column fixed="right" label="Actions" align="center">
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
            @click="delRepo(row)"
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

    <!-- Edit Dialog -->

    <el-dialog title="Edit" :visible.sync="dialogFormVisible">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form :model="form">
            <el-form-item label="Question Bank Name" :label-width="formLabelWidth">
              <el-input v-model="form.title" autocomplete="off" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="updateRepo">Confirm</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="Add Question Bank"
      :visible.sync="addRepoDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-row :gutter="20">
        <el-col>
          <el-form>
            <el-form-item label="Question Bank Name:" :label-width="formLabelWidth">
              <el-input
                v-model="addTitle"
                autocomplete="off"
                style="width: 80%"
              />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
    <el-button @click="addRepoDialogVisible = false">Cancel</el-button>
    <el-button type="primary" @click="addRepo">Confirm</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import { repoPaging, repoDel, repoUpdate, repoAdd } from '@/api/repo'
export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      data: {},
      addTitle: '',
      delVisible: false,
      searchTitle: '',
      Obj: {},
      formInline: {
        user: '',
        region: ''
      },
      cancel() {},

      diaTitle: 'Add New',
      form: {
        title: ''
      },
      formLabelWidth: '120px',
      dialogVisible: false,
      addRepoDialogVisible: false,
      dialogTableVisible: false,
      dialogFormVisible: false
    }
  },
  computed: {
    tables() {
      // Define 'tables' in your data table
      const input = this.input;
      if (input) {
        return this.tableData.filter((data) => {
          return Object.keys(data).some((key) => {
            return String(data[key]).toLowerCase().indexOf(input) > -1;
          });
        });
      }
      return this.tableData;
    }
  },

  created() {
    this.getRepoPage()
  },
  methods: {
    // Pagination query
    async getRepoPage(pageNum, pageSize, title = null) {
      const params = { pageNum: pageNum, pageSize: pageSize, title: title };
      const res = await repoPaging(params);
      this.data = res.data;
    },

    // Update row function
    updateRow(row) {
      this.dialogFormVisible = true;
      this.form = row;
    },

    // Add new question bank
    addRepo() {
      repoAdd({ title: this.addTitle })
        .then((res) => {
          if (res.code) {
            this.addRepoDialogVisible = false;
            this.getRepoPage(this.pageNum, this.pageSize);
            this.$message({
              type: 'success',
              message: 'Added successfully'
            });
          } else {
            this.$message({
              type: 'info',
              message: res.msg
            });
          }
        })
        .catch(() => {});
    },

    // Update question bank
    updateRepo() {
      repoUpdate(this.form.id, { title: this.form.title })
        .then((res) => {
          if (res.code) {
            this.getRepoPage(this.pageNum, this.pageSize);
            this.dialogFormVisible = false;
            this.$message({
              type: 'success',
              message: 'Edited successfully!'
            });
          } else {
            this.$message({
              type: 'info',
              message: res.msg
            });
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: 'Canceled editing'
          });
        });
    },

    // Delete question bank
    delRepo(row) {
      this.$confirm('This action will permanently delete the file. Continue?', 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'warning',
        center: true
      })
        .then(() => {
          repoDel(row.id).then((res) => {
            if (res.code) {
              this.getRepoPage(this.pageNum, this.pageSize);
              const index = this.tableData.findIndex((item) => item.id === row.id);
              if (index !== -1) {
                this.tableData.splice(index, 1);
              }
              this.$message({
                type: 'success',
                message: 'Deleted successfully!'
              });
            } else {
              this.$message({
                type: 'info',
                message: res.msg
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: 'Deletion canceled'
          });
        });
    },

    handleClose(done) {
      // This method confirms if the user intends to close the dialog.
      this.$confirm('Are you sure you want to close?')
        .then((_) => {
          done(); // If confirmed, it proceeds to close the dialog.
        })
        .catch((_) => {});
    },

    searchRepo() {
      // This method initiates a search operation based on the provided search title.
      this.getRepoPage(this.pageNum, this.pageSize, this.searchTitle);
    },

    handleSizeChange(val) {
      // This method handles the logic for changing the number of items displayed per page.
      // It updates the page size and retrieves data based on the new size.
      this.pageSize = val;
      this.getRepoPage(this.pageNum, val);
    },

    handleCurrentChange(val) {
      // This method handles the logic for changing the current page.
      // It updates the page number and retrieves data for the new page.
      this.pageNum = val;
      this.getRepoPage(val, this.pageSize);
    }
  }
}
</script>
<style></style>
