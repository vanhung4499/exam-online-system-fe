<template>
  <div class="app-container">
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
      <el-table-column fixed label="Number" align="center" width="80">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column prop="certificateName" label="Certificate Name" align="center" />
      <el-table-column prop="certificationUnit" label="Issuing Authority" align="center" />
      <el-table-column prop="examName" label="Exam Name" align="center" />
      <el-table-column prop="createTime" label="Award Time" align="center" />
      <el-table-column fixed="right" label="Action" align="center">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            size="small"
            style="font-size: 14px"
            @click="preview(row)"
          >Preview Certificate</el-button>
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

    <!-- Delete Dialog -->
    <!-- <el-dialog title="Prompt" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">Deletion is irreversible. Are you sure you want to delete?</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">Cancel</el-button>
        <el-button type="primary" @click="deleteRow">Confirm</el-button>
      </span>
    </el-dialog> -->

    <!-- Edit Dialog -->

    <!-- <el-dialog title="Edit" :visible.sync="dialogFormVisible">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form :model="form">
            <el-form-item label="Repository Name" :label-width="formLabelWidth">
              <el-input v-model="form.title" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="updateRepo">Confirm</el-button>
      </div>
    </el-dialog> -->

    <el-dialog
      title="Certificate Preview and Download"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose"
    >
      <div id="pdfDom">
        <div class="proBox">
          <p class="tit"><center>Certificate</center></p>
          <p class="con">
            <span>Congratulations: </span>
          </p>
          <p class="con-text">
            {{ jwtInfo.realName }}
          </p>
          <p class="con">
            <span>Awarded the {{ currentdata.certificateName }} certificate in the {{ currentdata.examName }} exam!</span>
          </p>
          <p class="con-height">
            <span><center>{{ level }}</center></span>
          </p>
          <div class="con-unit">
            <p class="time">Certificate Number: {{ currentdata.code }}</p>
            <p class="time">Issuing Authority: {{ currentdata.certificationNuit }}</p>
            <p class="time">Issue Date: {{ currentdata.createTime }}</p>
          </div>
          <div v-show="isShow" class="chapter">
            <canvas id="chapterCanvas" width="150" height="150" />
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-switch
      v-model="downType"
      inactive-color="#67c23a"
      active-text="Image Download"
      inactive-text="PDF Download"
      style="margin-right: 20px"
    />
    <el-button @click="dialogVisible = false">Cancel</el-button>
    <el-button type="primary" @click="getPdf('#pdfDom')">Download</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import { certificateMy } from '@/api/certificate'
import { getTokenInfo } from '@/utils/jwt-utils'
export default {

  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      data: {},
      // Get the current login account and level from local storage
      userName: localStorage.getItem('username'),
      level: localStorage.getItem('level'),
      // Get the current date
      start: '',
      dialogVisible: false,
      pageData: null, // Receives HTML format code
      htmlTitle: 'Honor Certificate',
      isShow: true,
      isCanvas: false,
      downType: true, // false for PDF, true for image
      currentdata: {},
      currentUser: '',
      jwtInfo: {}
    }
  },
  created() {
    this.getCerPage()

    this.jwtInfo = getTokenInfo()
  },
  methods: {
    handleSizeChange(val) {
      // Logic for setting the number of items per page
      this.pageSize = val;
      this.getCerPage(this.pageNum, val);
    },
    handleCurrentChange(val) {
      // Logic for setting the current page
      this.pageNum = val;
      this.getCerPage(val, this.pageSize);
    },
    // Pagination query
    async getCerPage(pageNum, pageSize) {
      const params = { pageNum: pageNum, pageSize: pageSize };
      const res = await certificateMy(params);
      this.data = res.data;
    },
    handleClose() {
      // Close the dialog
      this.dialogVisible = false;
    },
    preview(row) {
      // Display certificate preview
      this.currentdata = row;
      var vm = this;
      // Get the current date
      var data = new Date(new Date().setHours(0, 0, 0, 0));
      vm.start = data.getFullYear() + '-' + (data.getMonth() + 1) + '-' + data.getDate();

      this.dialogVisible = true;
      this.$nextTick(() => {
        if (!this.isCanvas) {
          // Only draw once
          this.isCanvas = true;
          this.getChapter();
        }
      });
    },
    getChapter() {
      // Method to get certificate chapter
      this.getChapter = this.getChapter.bind(this);
    }
  }
}
</script>

<style>
.border {
  width: 90%;
  height: 550px;
  margin: auto;
  margin-top: 40px;
  box-shadow: 0px 0px 7px 4px #f0f2f5;
}
::v-deep .el-dialog__body {
  padding: 0px;
  display: flex;
  justify-content: center;
}
#pdfDom {
  padding: 20px;
  width: 750px;
}
.proBox {
  background: url("../../assets/img/zs.jpeg") no-repeat;

  background-size: cover;
  width: 750px;
  height: 525px;
  padding: 90px 94px;
  box-sizing: border-box;
  margin: 0 auto;
  position: relative;
  color: #000;
  font-family: SimSun;
}
.tit {
  color: #cf0c0c;
  font-size: 36px;
  font-weight: 700;
  position: relative;
  top: -6px;
  left: 8px;
  letter-spacing: 20px;
  font-family: STHeiti;
  margin: 20px 0;
}
.proid {
  text-align: right;
  margin: 0;
  font-weight: 500;
}

.con {
  font-size: 20px;
  font-weight: 700;
  text-align: left;
  margin: 10px 0;
  line-height: 32px;
  text-indent: 2em;
}
.con-text {
  font-size: 20px;
  font-weight: 700;
  text-align: left;
  margin: 10px 0;
  line-height: 32px;
  text-indent: 5em;
}
.con-name {
  font-family: 华文行楷, STXingkai;
  border-bottom: 2px solid #000;
}
.con-height {
  font-family: 华文行楷, STXingkai;
  font-weight: 700;
  font-size: 2em;
}
.con-unit {
  display:flex;
  justify-content: right;
  flex-direction: column;
  padding-left: 100px;
  font-size: 18px;
  font-weight: 700;
  position: absolute;
  right: 130px;
  bottom: 100px;
  /* text-align: center; */
  letter-spacing: 3px;
}
.con-unit p {
  margin: 5px 0;
}
.con-footer {
  font-size: 18px;
  font-weight: 700;
  position: absolute;
  bottom: 45px;
  left: 0;
  right: 0;
  text-align: center;
}
.chapter {
  border-radius: 50%;
  position: absolute;
  bottom: 75px;
  right: 134px;
}
.button {
  margin: 50px 50px;
  position: absolute;
  font-family: 华文行楷, STXingkai;
  font-weight: 700;
  font-size: 2em;
}
</style>
