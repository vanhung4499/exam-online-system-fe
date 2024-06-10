<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="Certificate Name">
        <el-input v-model="searchCertificateName" placeholder="Certificate Name" />
      </el-form-item>
      <el-form-item label="Certification Unit">
        <el-input v-model="searchCertificationNuit" placeholder="Certification Unit" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchCertificate">Search</el-button>
        <el-button type="primary" @click="dialogTableVisible = true">Add</el-button>
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
    'line-height': '32px'
  }"
    >
      <el-table-column fixed label="No." align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column prop="certificateName" label="Certificate Name" align="center" />
      <el-table-column prop="certificationNuit" label="Certification Unit" align="center" />
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
            @click="delCertificate(row.id)"
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
    <!-- New dialog -->
    <el-dialog :title="diaTitle" :visible.sync="dialogTableVisible">
      <el-row>
        <el-form :model="form">
          <el-form-item label="Certificate Name" :label-width="formLabelWidth">
            <el-input v-model="form.certificateName" autocomplete="off" />
          </el-form-item>
          <el-form-item label="Certification Unit" :label-width="formLabelWidth">
            <el-input v-model="form.certificationNuit" autocomplete="off" />
          </el-form-item>
        </el-form>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">Cancel</el-button>
        <el-button type="primary" @click="addCertificate">Confirm</el-button>
      </div>
    </el-dialog>

    <!-- Edit dialog -->
    <el-dialog title="Edit" :visible.sync="dialogFormVisible">
      <el-row>
        <el-col :span="12">
          <el-form :model="form">
            <el-form-item label="Certificate Name" :label-width="formLabelWidth">
              <el-input v-model="form.certificateName" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Certification Unit" :label-width="formLabelWidth">
              <el-input v-model="form.certificationNuit" autocomplete="off" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="updateCertificate">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  certificatePaging,
  certificateDel,
  certificateAdd,
  certificateUpdate
} from '@/api/certificate'
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
      diaTitle: '',
      searchCertificateName: '',
      searchCertificationNuit: '',
      formInline: {
        user: '',
        region: ''
      },
      cancle() {},
      updateRow(row) {
        this.dialogFormVisible = true
        this.form = row
      },
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
      const input = this.input;
      const input1 = this.input1;

      if (input) {
        // Filter data based on input
        return this.tableData.filter((data) => {
          return Object.keys(data).some((key) => {
            return String(data[key]).toLowerCase().indexOf(input) > -1;
          });
        });
      }

      if (input1) {
        // Filter data based on input1
        return this.tableData.filter((data) => {
          return Object.keys(data).some((key) => {
            return String(data[key]).toLowerCase().indexOf(input1) > -1;
          });
        });
      }

      // Return original data if no input provided
      return this.tableData;
    }
  },
  created() {
    this.getCertificatePage()
  },
  methods: {
// Pagination query
    async getCertificatePage(
      pageNum,
      pageSize,
      certificateName = null,
      searchCertificationUnit = null
    ) {
      const params = {
        pageNum: pageNum,
        pageSize: pageSize,
        certificateName: certificateName,
        certificationUnit: searchCertificationUnit
      }
      const res = await certificatePaging(params)
      this.data = res.data
    },

    searchCertificate() {
      this.getCertificatePage(
        this.pageNum,
        this.pageSize,
        this.searchCertificateName,
        this.searchCertificationUnit
      )
    },

    updateCertificate() {
      const data = {
        certificateName: this.form.certificateName,
        certificationUnit: this.form.certificationUnit
      }
      certificateUpdate(this.form.id, data).then((res) => {
        if (res.code) {
          this.getCertificatePage(this.pageNum, this.pageSize)
          this.dialogFormVisible = false
          this.$message({
            type: 'success',
            message: 'Edit successful!'
          })
        } else {
          this.$message({
            type: 'info',
            message: res.msg
          })
        }
      })
    },
    addCertificate() {
      const data = {
        certificateName: this.form.certificateName,
        certificationUnit: this.form.certificationUnit
      }
      certificateAdd(data).then((res) => {
        if (res.code) {
          this.getCertificatePage(this.pageNum, this.pageSize)
          this.dialogTableVisible = false
          this.$message({
            type: 'success',
            message: 'Add successful!'
          })
        } else {
          this.$message({
            type: 'info',
            message: res.msg
          })
        }
      })
    },

    delCertificate(id) {
      this.$confirm('This action will permanently delete the file, continue?', 'Prompt', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning',
        center: true
      })
        .then(() => {
          certificateDel(id).then((res) => {
            if (res.code) {
              this.getCertificatePage(this.pageNum, this.pageSize)
              this.$message({
                type: 'success',
                message: 'Delete successful!'
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
            message: 'Delete canceled'
          })
        })
    },

    handleSizeChange(val) {
      // Logic to set the number of items per page
      this.pageSize = val
      this.getCertificatePage(this.pageNum, val)
    },
    handleCurrentChange(val) {
      // Logic to set the current page
      this.pageNum = val
      this.getCertificatePage(val, this.pageSize)
    },
    handleClick(row) {
      // console.log(row);
    }
  }
}
</script>
<style></style>
