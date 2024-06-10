<template>
  <el-container style="height: 700px; border: 1px solid #eee">
    <div class="left">
      <div class="fk">
        <!-- <div
          style="
            font-size: 25px;
            font-weight: 500;
            margin-left: 10px;
            padding: 10px 0 0 0;
          "
        >
          11
        </div> -->
        <div class="sj">
          <!--
          <div>
            <span>Score</span>
            <span>50</span>
          </div>
          <div>
            <span>Time Spent</span>
            <span>50</span>
          </div>
          <div>
            <span>Submitter</span>
            <span>50</span>
          </div>
          -->

          <el-divider />
          <p>
            Total <span style="color: #1890ff"> {{ waitQuList.length }} </span> questions, Total
            <span style="color: #1890ff">{{ waitQuList.length * waitQuList[0].totalScore }}</span>
            points
          </p>

          <el-row>
            <el-tag
              v-for="(item, index) in waitQuList"
              :key="index"
              :type="index === quIndex ? 'success' : ''"
              class="type_tag"
              @click="handleTag(index)"
            >
              {{ index + 1 }}
            </el-tag>
          </el-row>
          <el-button type="success" class="ann" @click="subCorrect">Submit Correction</el-button>
        </div>
      </div>
    </div>

    <el-container>
      <el-main class="right">
        <el-col>
          <el-card class="qu_list">
            <div>
              <template v-for="(item, index) in waitQuList">
                <div :class="'index' + index">
                  <!-- Short Answer -->
                  <el-row :gutter="24">
                    <el-col :span="20" style="text-align: left">
                      <!-- Question: Number, Type, Stem -->
                      <div>
                        <!-- <div class="qu_num">{{ item.quId }}</div>
                        【 Short Answer 】 -->
                        <div class="qu_content">{{ index + 1 }}. {{ item.quTitle }}</div>
                      </div>
                      <div class="content">
                        {{ item.answer }}
                      </div>
                      <!-- Question Analysis -->
                      <div class="qu_analysis">
                        <el-card>
                          <div style="display: flex; align-items: center">
                            <span style="color: #e6a23c">Score:</span>
                            <el-input
                              v-model="item.correctScore"
                              type="number"
                              style="width: 100px; margin-left: 20px"
                            />
                            <span
                              v-if="item.correctScore < 0 ||
                  item.correctScore > item.totalScore "
                              style="color: #f00; margin-left: 10px"
                            >

              Score should be between 0 and {{ item.totalScore }}
            </span>
                          </div>
                          <div style="margin-top: 18px">
                            <span>Reference Answer:</span>
                            <span>{{ item.refAnswer }}</span>
                          </div>
                        </el-card>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <el-row class="qu_assign_score">
                        This Question
                        <el-input-number
                          :controls="false"
                          :min="0"
                          :precision="2"
                          disabled
                          :value="item.totalScore"
                          class="qu_assign_score_content"
                        />
                        Points
                      </el-row>
                    </el-col>
                  </el-row>
                </div>
              </template>
            </div>
            <el-divider />
          </el-card>
        </el-col>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// {{ computedStatus(userForm.agencyBaseVO.status) }}
import { answerDetail, correct } from '@/api/answer'
export default {
//   computedStatus(val) {
//     console.log('val', val)
//     return val === '' ? '' : this.optionsBasic.statusMap[val]
// },
  name: 'ExamProcess',
  data() {
    return {
      quIndex: -1,
      // Exam information
      info: {},
      // Questions to be corrected
      waitQuList: [],
      scoreData: null,
    }
  },
  created() {
    this.info = JSON.parse(sessionStorage.getItem('answer_info'))

    this.getUserAnswerDetail()
  },
  methods: {
    // Click on the question number in the answer sheet, slide to the corresponding question on the right
    handleTag(index) {
      // Highlight the selected question index tag
      this.quIndex = index
      // Scroll the question to the anchor point
      const page = document.querySelector('.index' + index)
      page.scrollIntoView()
    },
    // Get user answer details
    async getUserAnswerDetail() {
      const params = { userId: this.info.userId, examId: this.info.examId }

      const res = await answerDetail(params)
      this.waitQuList = res.data
    },
    subCorrect() {
      const list = []
      // Validate legality
      for (let i = 0; i < this.waitQuList.length; i++) {
        const element = this.waitQuList[i]
        if (!element.correctScore) {
          // Display warning operation
          this.$message({
            message: `Please score question ${i + 1} first`,
            type: 'error'
          })
          return
        }
        if (element.correctScore < 0 || element.correctScore > element.totalScore) {
          this.$message({
            message: `The score for question ${i + 1} should be between 0 and ${element.totalScore}`,
            type: 'error'
          })
          return
        }
        const obj = {
          userId: element.userId,
          examId: element.examId,
          questionId: element.quId,
          score: element.correctScore
        }
        list.push(obj)
      }
      // Send request
      correct(list).then((res) => {
        if (res.code) {
          this.$notify({
            title: 'Success',
            message: `${res.msg}`,
            type: 'success',
            duration: 2000
          })
          this.$router.push({ name: 'Ansck' })
        } else {
          this.$notify({
            title: 'Failed',
            message: `${res.msg}`,
            type: 'error',
            duration: 2000
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  width: 97%;
  height: 60px;
  border: 1px solid #0a84ff;
  margin-top: 8px;
  margin-left: 10px;
  padding: 10px;
  font-weight: 200;
}
.ann {
  width: 130px;
  margin-top: 25px;
  margin-left: 15px;
}
.sj {
  margin-top: 10px;
  margin-left: 10px;
  line-height: 22px;
}
.fk {
  width: 200px;
  height: 100%;
  box-shadow: 0 0 15px rgb(197, 197, 197);
  margin: auto;
  margin-top: 20px;
  margin-left: 15px;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.left {
  width: 17%;
  height: 100%;
}
.right {
  width: 70%;
  height: 100%;
}
.el-divider--horizontal {
  display: block;
  height: 1px;
  width: 95%;
  margin: 24px 0;
}
.type_tag {
  margin-right: 5px;
  margin-top: 10px;
}

/* Question content style */
.qu_list {
  height: 100%;
  width: 100%;
  overflow: auto;
  page-break-after: always;

  .qu_num {
    display: inline-block;
    /* background: url('~@/assets/images/tkxl/btbj.png') no-repeat 100% 100%; */
    background-size: contain;
    height: 30px;
    width: 30px;
    line-height: 25px;
    color: #fff;
    font-size: 14px;
    text-align: center;
    margin-right: 15px;
    flex-shrink: 0;
  }

  .qu_content {
    padding-left: 10px;
  }

  /* Option group */
  .qu_choose_group {
    width: 100%;

    /* Single option */
    .qu_choose {
      display: block;
      margin: 10px;

      /* Remove radio */
      ::v-deep .el-radio__input .el-radio__inner {
        display: none;
      }

      /* Single option content style */
      .qu_choose_tag {
        display: inline-flex;
        width: 90%;

        /* Option label */
        .qu_choose_tag_type {
          font-weight: bold;
          color: #0a84ff;
          width: 10px;
        }

        /* Option content */
        .qu_choose_tag_content {
          padding: 0 10px 10px 10px;
        }

        .qu_choose_tag_img {
          height: auto;
          display: block;
          margin: 10px;
        }

        .qu_choose_tag_el_image {
          clear: both;
          padding-top: 10px;
        }
      }

      /* Option answer */
      .qu_choose_answer {
        float: right;
      }
    }
  }

  /* Question analysis */
  .qu_analysis {
    padding: 10px;

    .qu_analysis_content {
      padding-top: 10px;
    }
  }

  /* Question assignment score */
  .qu_assign_score {
    background: #f5f5f5;
    height: 100px;
    padding-top: 35px;

    .qu_assign_score_content {
      width: 80px;
    }
  }
}

</style>
