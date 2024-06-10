<template>
  <div class="app-container">
    <!-- Inline form for filtering -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="Question Bank Name">
        <el-input v-model="input" placeholder="Please enter" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Search</el-button>
      </el-form-item>
    </el-form>

    <!-- Table displaying data -->
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
      <el-table-column label="No." align="center" width="80">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column prop="title" align="center" label="Question Bank Name" width="250" />
      <el-table-column prop="createTime" align="center" label="Practice Time" />
      <el-table-column align="center" label="Actions">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            size="small"
            style="font-size: 14px"
            @click="updateRow(row)"
          >View</el-button>
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

    <!-- Dialog for detailed view -->
    <el-dialog title="View" :visible.sync="dialogFormVisible">
      <el-row>
        <!-- Left side of the dialog -->
        <el-col :span="12">
          <el-form :model="form">
            <el-form-item label="Serial Number" :label-width="formLabelWidth">
              <el-input v-model="form.xh" :disabled="true" />
            </el-form-item>
          </el-form>
        </el-col>
        <!-- Right side of the dialog -->
        <el-col :span="12">
          <el-form :model="form">
            <el-form-item label="Class Name" :label-width="formLabelWidth">
              <el-input v-model="form.sjmc" :disabled="true" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <!-- Left side of the dialog -->
        <el-col :span="12">
          <el-form :model="form">
            <el-form-item label="Class Password" :label-width="formLabelWidth">
              <el-input v-model="form.ctsl" :disabled="true" />
            </el-form-item>
          </el-form>
        </el-col>
        <!-- Right side of the dialog -->
        <el-col :span="12">
          <el-form :model="form">
            <el-form-item label="Class Date" :label-width="formLabelWidth">
              <el-input v-model="form.cjsj" :disabled="true" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <!-- Dialog footer with buttons -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { recordExercisePaging } from '@/api/record'
export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      data: {},
      input: '',

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
        // console.info("=====", row);
        localStorage.setItem('record_exercise_repoId', row.id)
        this.$router.push({ name: 'exercise-record-detail', query: { zhi: row }})
        // this.dialogFormVisible = true;
        // this.form = row;
      },
      diaTitle: 'Add',
      dialogTableVisible: false,

      dialogFormVisible: false,
      formLabelWidth: '110px'

    }
  },
  computed: {
    tables() {
      // Define 'tables' in your data table
      const input = this.input;
      if (input) {
        // console.log("Search content entered in input: " + this.input)
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
    this.getExerciseRecordPaging()
  },
  methods: {
    // Pagination query
    async getExerciseRecordPaging(pageNum, pageSize) {
      const params = { pageNum: pageNum, pageSize: pageSize };
      const res = await recordExercisePaging(params);
      this.data = res.data;
    },
    onSubmit() {
      // console.log("submit!");
    },
    handleSizeChange(val) {
      // console.log(`Number of items per page: ${val}`);
    },
    handleCurrentChange(val) {
      // console.log(`Current page: ${val}`);
    },
    handleClose(done) {
      this.$confirm('Confirm to close?')
        .then((_) => {
          done();
        })
        .catch((_) => {});
    }
  }
}
</script>
<style scoped>
.qb {
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
