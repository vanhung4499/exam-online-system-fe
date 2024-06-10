<template>
  <div>
    <!-- Prompt -->
    <div
      style="
        width: 98%;
        background-color: #fef0f0;
        height: 35px;
        margin: auto;
        display: flex;
        margin-top: 10px;
      "
    >
      <div
        style="
          color: rgb(228 59 59);
          align-items: center;
          display: flex;
          margin-left: 10px;
          letter-spacing: 0.1em;
        "
      >
        Click 'Start Exam' to automatically enter the exam. Please take the exam honestly!
      </div>
    </div>
    <!-- Content -->
    <div
      style="
        width: 98%;
        height: 400px;
        margin: auto;
        margin-top: 10px;
        background-color: #f0f2f5;
      "
    >
      <div style="padding: 40px 0 0 50px; letter-spacing: 0.1em">
        <span style="font-size: 14px">Exam Title:</span>
        <span style="margin-left: 5px; font-size: 14px">{{ data.title }}</span>
      </div>
      <div style="padding: 15px 0 0 50px; letter-spacing: 0.1em">
        <span style="font-size: 14px">Exam Duration:</span>
        <span style="margin-left: 5px; font-size: 14px">{{ data.examDuration }}</span>
      </div>
      <div style="padding: 15px 0 0 50px; letter-spacing: 0.1em">
        <span style="font-size: 14px">Total Score:</span>
        <span style="margin-left: 5px; font-size: 14px">{{ data.grossScore }}</span>
      </div>
      <div style="padding: 15px 0 0 50px; letter-spacing: 0.1em">
        <span style="font-size: 14px">Pass Score:</span>
        <span style="margin-left: 5px; font-size: 14px">{{ data.passedScore }}</span>
      </div>
      <div style="padding: 15px 0 0 50px; letter-spacing: 0.1em">
        <span style="font-size: 14px">Publisher:</span>
        <span style="margin-left: 5px; font-size: 14px">{{ data.username }}</span>
      </div>
      <div style="padding: 15px 0 0 50px; letter-spacing: 0.1em">
        <span style="font-size: 14px">Single Choice Count:</span>
        <span style="margin-left: 5px; font-size: 14px">{{ data.radioCount }}</span>
        <span style="margin-left: 5px; font-size: 14px">({{ data.radioScore }} points)</span>
      </div>
      <div style="padding: 15px 0 0 50px; letter-spacing: 0.1em">
        <span style="font-size: 14px">Multiple Choice Count:</span>
        <span style="margin-left: 5px; font-size: 14px">{{ data.multiCount }}</span>
        <span style="margin-left: 5px; font-size: 14px">({{ data.multiScore }} points)</span>
      </div>
      <div style="padding: 15px 0 0 50px; letter-spacing: 0.1em">
        <span style="font-size: 14px">True/False Count:</span>
        <span style="margin-left: 5px; font-size: 14px">{{ data.judgeCount }}</span>
        <span style="margin-left: 5px; font-size: 14px">({{ data.judgeScore }} points)</span>
      </div>
      <div style="padding: 15px 0 0 50px; letter-spacing: 0.1em">
        <span style="font-size: 14px">Short Answer Count:</span>
        <span style="margin-left: 5px; font-size: 14px">{{ data.saqCount }}</span>
        <span style="margin-left: 5px; font-size: 14px">({{ data.saqScore }})</span>
      </div>
    </div>
    <!-- Buttons -->
    <el-row class="ann">
      <el-button type="primary" @click="startExam()">▶ Start Exam</el-button>
      <!-- <el-button type="primary" plain style="margin-left: 20px">Back</el-button> -->
    </el-row>
  </div>
</template>

<script>
import { getExamDetail, examStart } from '@/api/exam'
export default {
  data() {
    return {
      receivedRow: null,
      data: {
        title: ''
      }
    }
  },
  created() {
    this.receivedRow = localStorage.getItem('examInfo_examId')
    this.getExamDetails(localStorage.getItem('examInfo_examId'))
  },
  methods: {
    // Paginated query
    async getExamDetails(examId) {
      const res = await getExamDetail(examId)
      this.data = res.data
    },
    startExam() {
      examStart(this.receivedRow).then((res) => {
        if (res.code) {
          localStorage.setItem('examId', this.receivedRow)
          this.$router.push({ name: 'do-exam', query: { zhi: this.receivedRow }})
        } else {
          this.$message({
            type: 'info',
            message: res.msg
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.ann {
  margin-top: 15px;
  margin-left: 20px;
}
</style>
