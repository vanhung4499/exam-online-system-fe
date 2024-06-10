<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="Exam Name">
        <el-input v-model="searchTitle" placeholder="Please enter" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchUserBook">Search</el-button>
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
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column label="No." align="center" width="80">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column prop="title" align="center" label="Exam Name" width="250" />
      <el-table-column prop="numberOfErrors" align="center" label="Number of Errors" />
      <el-table-column prop="createTime" align="center" label="Creation Time" />
      <el-table-column align="center" label="Operation">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            size="small"
            style="color: red; font-size: 14px"
            @click="screenInfo(row)"
          >Retry</el-button>
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
    <el-dialog title="View" :visible.sync="dialogFormVisible">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form :model="form">
            <el-form-item label="No." :label-width="formLabelWidth">
              <el-input v-model="form.xh" :disabled="true" />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-form :model="form">
            <el-form-item label="Exam Name" :label-width="formLabelWidth">
              <el-input v-model="form.sjmc" :disabled="true" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form :model="form">
            <el-form-item label="Number of Errors" :label-width="formLabelWidth">
              <el-input v-model="form.ctsl" :disabled="true" />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-form :model="form">
            <el-form-item label="Creation Time" :label-width="formLabelWidth">
              <el-input v-model="form.cjsj" :disabled="true" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { userbookPaging } from '@/api/userbook'
export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      data: {},
      input: '',
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,
      formInline: {
        user: '',
        region: ''
      },

      dialogVisible: false,
      form: {
        name: ''
      },
      cancel() {},
      updateRow(row) {
        this.dialogFormVisible = true
        this.form = row
      },
      searchTitle: '',
      dialogFormVisible: false,
      formLabelWidth: '110px'
    }
  },
  computed: {
    tables() {
      // Define your tables in your data table
      const input = this.searchTitle;
      if (input) {
        return this.data.records.filter((record) => {
          return Object.keys(record).some((key) => {
            return String(record[key]).toLowerCase().indexOf(input.toLowerCase()) > -1;
          });
        });
      }
      return this.data.records;
    }
  },
  created() {
    this.getUserBookPage()
  },
  methods: {
    handleSizeChange(val) {
      // Logic for setting how many items per page
      this.pageSize = val;
      this.getUserBookPage(this.pageNum, val);
    },
    handleCurrentChange(val) {
      // Logic for setting the current page
      this.pageNum = val;
      this.getUserBookPage(val, this.pageSize);
    },
    // Pagination query
    async getUserBookPage(pageNum, pageSize, examName = null) {
      const params = { pageNum: pageNum, pageSize: pageSize, examName: examName };
      const res = await userbookPaging(params);
      this.data = res.data;
    },
    searchUserBook() {
      this.getUserBookPage(this.pageNum, this.pageSize, this.searchTitle);
    },
    handleClose(done) {
      this.$confirm('Confirm close?')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
    screenInfo(row) {
      localStorage.setItem('userbook_examId', row.examId);
      this.$router.push({ path: '/review-exam' });
    }
  }

}
</script>
<style scoped>
.qb {
  margin-top: 20px;
  width: 100%;
  height: 8000px;
}

.sf {
  width: 100%;
  height: 80px;
}

.xx {
  width: 1200px;
  height: 40px;
  padding: 20px 0px 0px 50px;
}

.block {
  padding: 30px 0 0 50px;
}
</style>
