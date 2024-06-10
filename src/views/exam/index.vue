<template>
  <div style="width: 100%; height: 100%; background-color: #f0f2f5; padding: 20px 0 0">
    <!-- Header -->
    <el-row :gutter="24">
      <el-col :span="24">
        <el-card style="margin-bottom: 10px">
          Time left until the end of the exam:
          <exam-timer v-model="paperData.leftSeconds" @timeout="doHandler()" />
          <!-- handHandExam -->
          <el-button
            :loading="loading"
            style="float: right; margin-top: -10px"
            type="primary"
            icon="el-icon-plus"
            @click="handHandExamPre()"
          >
            {{ handleText }}
          </el-button>
        </el-card>
      </el-col>
      <!-- Answer Sheet Area -->
      <el-col :span="5" :xs="24" style="margin-bottom: 10px">
        <el-card class="content-h">
          <p class="card-title">Answer Sheet</p>
          <el-row :gutter="24" class="card-line" style="padding-left: 10px">
            <el-tag type="info">Unanswered</el-tag>
            <el-tag type="success">Answered</el-tag>
          </el-row>

          <div
            v-if="
          paperData.radioList !== null &&
          paperData.radioList !== undefined &&
          paperData.radioList.length > 0
        "
          >
            <p class="card-title">Single Choice</p>
            <el-row :gutter="24" class="card-line">
              <el-tag
                v-for="(item, index) in paperData.radioList"
                :key="index"
                :type="cardItemClass(item.checkout, item.questionId)"
                @click="handSave(item)"
              >
                {{ item.sort + 1 }}</el-tag
              >
            </el-row>
          </div>

          <div
            v-if="
          paperData.multiList !== null &&
          paperData.multiList !== undefined &&
          paperData.multiList.length > 0
        "
          >
            <p class="card-title">Multiple Choice</p>
            <el-row :gutter="24" class="card-line">
              <el-tag
                v-for="(item, index) in paperData.multiList"
                :key="index"
                :type="cardItemClass(item.checkout, item.questionId)"
                @click="handSave(item)"
              >{{ item.sort + 1 }}</el-tag
              >
            </el-row>
          </div>

          <div
            v-if="
          paperData.judgeList !== null &&
          paperData.judgeList !== undefined &&
          paperData.judgeList.length > 0
        "
          >
            <p class="card-title">True/False</p>
            <el-row :gutter="24" class="card-line">
              <el-tag
                v-for="(item, index) in paperData.judgeList"
                :key="index"
                :type="cardItemClass(item.checkout, item.questionId)"
                @click="handSave(item)"
              >{{ item.sort + 1 }}</el-tag
              >
            </el-row>
          </div>
          <div
            v-if="
          paperData.saqList != null &&
          paperData.saqList !== undefined &&
          paperData.saqList.length > 0
        "
          >
            <p class="card-title">Short Answer</p>
            <el-row :gutter="24" class="card-line">
              <el-tag
                v-for="(item, index) in paperData.saqList"
                :key="index"
                :type="cardItemClass(item.checkout, item.questionId)"
                @click="handSave(item)"
              >{{ item.sort + 1 }}</el-tag
              >
            </el-row>
          </div>
        </el-card>
      </el-col>
      <!-- Single question area -->
      <el-col :span="19" :xs="24">
        <el-card class="qu-content content-h">
          <!-- Question Stem -->
          <p v-if="quData.content">{{ quData.sort + 1 }}.{{ quData.content }}</p>
          <p v-if="quData.image != null && quData.image != ''">
            <el-image :src="quData.image" style="max-width: 200px" />
          </p>
          <!-- Single Choice and Multiple Choice Options Area -->
          <div v-if="quData.quType === 1 || quData.quType === 3">
            <el-radio-group v-model="radioValue">
              <el-radio v-for="item in quData.answerList" :key="item.id" :label="item.id"
              >{{ numberToLetter(item.sort) }}.{{ item.content }}
                <div v-if="item.image != null && item.image != ''" style="clear: both">
                  <el-image :src="item.image" style="max-width: 200px" />
                </div>
              </el-radio>
            </el-radio-group>
          </div>
          <!-- Multiple Choice Options Area -->
          <div v-if="quData.quType === 2">
            <el-checkbox-group v-model="multiValue">
              <el-checkbox
                v-for="item in quData.answerList"
                :key="item.id"
                :label="item.id"
              >{{ numberToLetter(item.sort) }}.{{ item.content }}
                <div v-if="item.image != null && item.image != ''" style="clear: both">
                  <el-image :src="item.image" style="max-width: 200px" />
                </div>
              </el-checkbox>
            </el-checkbox-group>
          </div>

          <!-- Short Answer Area -->
          <div v-if="quData.quType === 4">
            <el-input
              v-model="saqTextarea"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="Please enter your answer"
            />
          </div>

          <!-- Summary before submission -->
          <el-dialog
            top="2vh"
            title="Pre-exam Summary"
            :visible.sync="examPreVisible"
            width="80%"
            :before-close="handleClose"
          >
            <el-container style="height: 70vh; border: 1px solid #eee">
              <el-container>
                <el-main class="right">
                  <el-col>
                    <el-card class="qu_list">
                      <div>
                        <!-- Objective Section -->
                        <template v-for="index in recordData">
                          <div
                            v-if="
                              index.quType === 1 ||
                              index.quType === 2 ||
                              index.quType === 3
                            "
                            :class="'index' + index"
                          >
                            <el-row :gutter="24">
                              <el-col :span="20" style="text-align: left">
                                <!-- Question: Number, Type, Stem -->
                                <!-- Stem Area -->
                                <div>
                                  <div class="qu_content">
                                    {{ index.title }}
                                  </div>
                                </div>
                                <!-- Options Area -->
                                <el-radio-group class="qu_choose_group">
                                  <!-- ['A', 'B', 'C', 'D'] -->
                                  <el-radio
                                    v-for="(item, indexs) in index.option"
                                    :key="index"
                                    :label="item.content"
                                    border
                                    class="qu_choose"
                                    :class="{
                                      current: index.myOption != null && isCheck(index.myOption, item.sort),
                                    }"
                                  >
                                    {{ numberToLetter(indexs) }}.{{ item.content }}

                                    <!-- <div class="qu_choose_answer">
                                    </div> -->
                                  </el-radio>
                                </el-radio-group>

                                <!-- My Answer Area -->
                                <div class="qu_analysis">
                                  <el-card>
                                    <div>
                                      <span>My Answer:</span>
                                      <span
                                        :style="{
                                          color:
                                            isRight === 1
                                              ? 'green'
                                              : isRight === 0
                                              ? 'red'
                                              : 'gray',
                                        }"
                                      >{{ numberToLetter(index.myOption) }}</span
                                      ><br />
                                    </div>
                                  </el-card>
                                </div>
                              </el-col>
                            </el-row>
                            <el-divider />
                          </div>
                        </template>
                        <!-- Subjective Section -->
                        <template v-for="index in recordData">
                          <div v-if="index.quType === 4" :class="'index' + index">
                            <el-row :gutter="24">
                              <el-col :span="20" style="text-align: left">
                                <!-- Question: Number, Type, Stem -->
                                <!-- Stem Part -->
                                <div>
                                  <div class="qu_content">
                                    {{ index.title }}
                                  </div>
                                </div>

                                <!-- Short Answer Content Area -->
                                <el-radio-group class="qu_choose_group">
                                  <!-- ['A', 'B', 'C', 'D'] -->
                                  <el-input
                                    v-model="index.myOption"
                                    style="margin-top: 10px"
                                    type="textarea"
                                    :autosize="{ minRows: 2, maxRows: 4 }"
                                    placeholder="Please enter your answer"
                                  />
                                </el-radio-group>
                              </el-col>
                            </el-row>
                            <el-divider />
                          </div>
                        </template>
                      </div>
                      <el-divider />
                    </el-card>
                  </el-col>
                </el-main>
              </el-container>
            </el-container>
            <span slot="footer" class="dialog-footer">
              <el-button @click="examPreVisible = false">Cancel</el-button>
              <el-button type="primary" @click="doHandler">Confirm</el-button>
            </span>
          </el-dialog>

          <div style="margin-top: 20px">
            <el-button
              v-if="showPrevious"
              type="primary"
              icon="el-icon-back"
              @click="handPrevious()"
            >
              Previous
            </el-button>

            <el-button
              v-if="showNext"
              type="warning"
              icon="el-icon-right"
              @click="handNext()"
            >
              Next
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- Screen Switching Popup -->
    <el-dialog
      title="Notification"
      :visible.sync="tipsFlag"
      width="480px"
      class="commonDialog multi clickLight"
      center
      :close-on-click-modal="false"
    >
      {{ examMeg }}
      <span slot="footer" class="dialog-footer">
        <el-button v-if="tips === 1" @click="tipsFlag = false">Cancel</el-button>
        <el-button v-if="tips === 1" type="primary" @click="onConfirmTip"
        >Confirm</el-button
        >
        <el-button v-if="tips === 2" type="primary" @click="onConfirmTip"
        >Got it</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  paperDetail,
  quDetail,
  handExam,
  fillAnswer,
  examStart,
  examCollect,
  examCheat,
  examQuList,
} from "@/api/exam";
import { Loading } from "element-ui";
import ExamTimer from "@/components/ExamTimer";

export default {
  name: "ExamProcess",
  components: { ExamTimer },
  data() {
    return {
      examId: "",
      receivedRow: null,
      // Full screen / not full screen
      isFullscreen: false,
      showPrevious: false,
      showNext: true,
      loading: false,
      handleText: "Submit",
      saqTextarea: "",
      pageLoading: false,
      // Paper ID
      paperId: "",
      // Current answer sheet
      cardItem: {},
      allItem: [],
      tipsFlag: false,
      examPreVisible: false,
      // Current question content
      quData: {
        answerList: [],
      },
      testData: {},
      pkExam: null,
      examMeg: "",
      // Paper information
      paperData: {
        leftSeconds: 99999,
        radioList: [],
        multiList: [],
        judgeList: [],
      },
      // Single choice selected value
      radioValue: "",
      // Multiple choice selected value
      multiValue: [],
      // Answered IDs
      answeredIds: [],
      recordData: null,
    };
  },
  created() {
    this.examId = localStorage.getItem("examId");
    this.startExam(localStorage.getItem("examId"));
    this.paperId = localStorage.getItem("examId");
    this.fetchData(localStorage.getItem("examId"));
    // if (typeof id !== 'undefined') {
    //   this.paperId = id
    //   this.fetchData(28)
    // }
  },
  mounted() {
    // Listen for scrolling
    window.addEventListener("scroll", this.handleScroll);
    // Listen for browser window resizing
    window.addEventListener("resize", this.getLfetDistance);
    // Listen for page visibility
    window.addEventListener("visibilitychange", this.pageHidden);
    this.$nextTick(function () {
      const body = document.querySelector("body");
      body.style.overflow = "auto";
      this.flexLeft = (body.offsetWidth - 1200) / 2;
    });
  },
  methods: {
    isCheck(myOption, sort) {
      const arr = myOption.split(",").map(Number); // Convert string to array of numbers
      if (arr.includes(sort)) {
        return true;
        console.log(`${valueToCheck} is in the array.`);
      } else {
        return false;
      }
    },
    handleClose(done) {
      this.$confirm("Are you sure you want to close?")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    // Convert 0-5 to A-F
    numberToLetter(input) {
      const numberToCharMap = {
        0: "A",
        1: "B",
        2: "C",
        3: "D",
        4: "E",
        5: "F",
      };

      // Helper function: Convert single number (string or number type) to letter
      const singleNumberToLetter = (num) => numberToCharMap[parseInt(num, 10)] || "";

      // Helper function: Process comma-separated number string
      const commaSeparatedNumbersToLetters = (str) => {
        const numbers = str.split(",").map((item) => parseInt(item.trim(), 10));
        return numbers.map((number) => numberToCharMap[number] || "").join(",");
      };

      // Determine input type and call corresponding function
      if (/^\d+$/.test(input)) {
        // Single number (string form also matches)
        return singleNumberToLetter(input);
      } else if (/^\d+(,\d+)*$/.test(input)) {
        // Contains comma-separated number string
        return commaSeparatedNumbersToLetters(input);
      } else {
        return ""; // Input does not match expectations, return empty string or handle as needed
      }
    },
    handHandExamPre() {
      // Submit and save answers
      this.handSave(this.cardItem);
      examCollect(this.examId).then((res) => {
        this.recordData = res.data;
      });
      this.examPreVisible = true;
    },
    // Page change detection
    pageHidden(e = null, isReduce = 0, router = false) {
      return new Promise((resolve, reject) => {
        if (document.visibilityState === "hidden" || router) {
          examCheat(this.examId).then((res) => {
            // let data = res.data;
            if (res.code) {
              this.examMeg = res.msg;
              this.tipsFlag = true;
              if (res.data) {
                setTimeout(() => {
                  //
                  getQuestionDetail(this.quList[this.currentQuIndex].quId).then((res) => {
                    this.quDetail = res.data;
                  });
                }, 100);
                this.$router.push({
                  name: "exam-center",
                  params: { id: this.paperId },
                });
              }

              resolve();
            } else {
              reject();
            }
          });
        }
      });
    },
    destroyed() {
      window.removeEventListener("visibilitychange", this.pageHidden);
      window.removeEventListener("scroll", this.handleScroll);
      window.removeEventListener("resize", this.getLfetDistance);
      clearInterval(this.countdownTime); // 计时器
    },
    startExam(examId) {
      examQuList(examId).then((res) => {
        this.paperData = res.data;
      });
    },
    // Answer sheet style
    cardItemClass(checkout, quId) {
      if (sessionStorage.getItem("exam_" + quId) === 1 || checkout) {
        return "success";
      }

      if (sessionStorage.getItem("exam_" + quId === 0) || checkout) {
        return "info";
      }
    },

    /**
     * Count how many questions are unanswered
     * @returns {number}
     */
    countNotAnswered() {
      let notAnswered = 0;

      if (this.paperData.radioList) {
        this.paperData.radioList.forEach(function (item) {
          if (!item.checkout) {
            notAnswered += 1;
          }
        });
      }
      if (this.paperData.multiList) {
        this.paperData.multiList.forEach(function (item) {
          if (!item.checkout) {
            notAnswered += 1;
          }
        });
      }
      if (this.paperData.judgeList) {
        this.paperData.judgeList.forEach(function (item) {
          if (!item.checkout) {
            notAnswered += 1;
          }
        });
      }
      if (this.paperData.saqList) {
        this.paperData.saqList.forEach(function (item) {
          if (!item.checkout) {
            notAnswered += 1;
          }
        });
      }

      return notAnswered;
    },

    /**
     * Go to the next question
     */
    handNext() {
      const index = this.cardItem.sort + 1;
      this.handSave(this.allItem[index]);
    },

    /**
     * Go to the previous question
     */
    handPrevious() {
      const index = this.cardItem.sort - 1;
      this.handSave(this.allItem[index]);
    },
    // Clear session storage
    // Function to clear all key-value pairs starting with "exam_"
    clearSessionStorageByPrefix(prefix) {
      for (var key in sessionStorage) {
        if (sessionStorage.hasOwnProperty(key) && key.startsWith(prefix)) {
          sessionStorage.removeItem(key);
        }
      }
    },

    // 交卷
    doHandler() {
      const that = this;
      const notAnswered = that.countNotAnswered();

      let msg = "Are you sure you want to submit the exam?";

      if (notAnswered > 0) {
        msg = "You have " + notAnswered + " questions unanswered. Are you sure you want to submit the exam?";
      }

      that
        .$confirm(msg, "Tip", {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          type: "warning",
        })
        .then(() => {
          this.handleText = "Submitting, please wait...";
          this.loading = true;

          handExam(this.examId).then(() => {
            this.$message({
              message: "Exam submitted successfully. Redirecting to exam details...",
              type: "success",
            });
            this.clearSessionStorageByPrefix("exam_");
            this.$router.push({ name: "exam-center", params: { id: this.paperId } });
          });
        })
        .catch(() => {
          that.$message({
            type: "info",
            message: "Submission canceled. You can continue answering!",
          });
        });
    },

    // Submit operation
    handHandExam() {
      const that = this;

      // Submit and save answers
      this.handSave(this.cardItem, function () {
        const notAnswered = that.countNotAnswered();

        let msg = "Are you sure you want to submit the exam?";

        if (notAnswered > 0) {
          msg = "You have " + notAnswered + " questions unanswered. Are you sure you want to submit the exam?";
        }

        that
          .$confirm(msg, "Tip", {
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            type: "warning",
          })
          .then(() => {
            that.doHandler();
          })
          .catch(() => {
            that.$message({
              type: "info",
              message: "Submission canceled. You can continue answering!",
            });
          });
      });
    },

    // Save answer
    handSave(item, callback) {
      if (item.id === this.allItem[0].id) {
        this.showPrevious = false;
      } else {
        this.showPrevious = true;
      }

      // Last index
      const last = this.allItem.length - 1;

      if (item.id === this.allItem[last].id) {
        this.showNext = false;
      } else {
        this.showNext = true;
      }

      const answers = this.multiValue;
      if (this.radioValue !== "") {
        answers.push(this.radioValue);
      }

      console.log(
        "aaa",
        this.allItem[this.cardItem.sort].type == 4 ? this.saqTextarea : answers.join(",")
      );
      const params = {
        examId: this.paperId,
        quId: this.cardItem.questionId,
        answer:
          this.allItem[this.cardItem.sort].type == 4
            ? this.saqTextarea
            : answers.join(","),
      };
      fillAnswer(params).then((res) => {
        if (res.code) {
          sessionStorage.setItem("exam_" + this.cardItem.questionId, 1);
        } else {
          sessionStorage.setItem("exam_" + this.cardItem.questionId, 0);
        }
        this.saqTextarea = "";
        // Must choose one value
        if (answers.length > 0) {
          // Add to answered list
          this.cardItem.answered = true;
        }

        // Last action, submit
        if (callback) {
          callback();
        }

        // Fetch details
        this.fetchQuData(item);
      });
    },

    // Fetch question details
    fetchQuData(item) {
      // Open loading
      const loading = Loading.service({
        text: "Loading...",
        background: "rgba(0, 0, 0, 0.7)",
      });

      // Get details
      this.cardItem = item;
      const examId = localStorage.getItem("examId");
      // Find next detail
      const params = { examId: examId, questionId: item.questionId };
      quDetail(params).then((response) => {
        this.quData = response.data;
        this.radioValue = "";
        this.multiValue = [];

        if (response.data.quType === 4 && response.data.answerList != null) {
          this.saqTextarea = response.data.answerList[0].content;
        } else if (
          response.data.quType === 1 ||
          response.data.quType === 2 ||
          response.data.quType === 3
        ) {
          this.quData.answerList.forEach((item) => {
            if ((this.quData.quType === 1 || this.quData.quType === 3) && item.checkout) {
              this.radioValue = item.id;
            }
            if (this.quData.quType === 2 && item.checkout) {
              this.multiValue.push(item.id);
            }
          });
        }
        // Fill in the answer to the question
        // Close loading
        loading.close();
      });
      loading.close();
    },

    // Fetch question details
    fetchData(examId) {
      examQuList(examId).then((response) => {
        // Exam content
        this.paperData = response.data;

        // Get the content of the first question
        if (this.paperData.radioList && this.paperData.radioList.length > 0) {
          this.cardItem = this.paperData.radioList[0];
        } else if (this.paperData.multiList && this.paperData.multiList.length > 0) {
          this.cardItem = this.paperData.multiList[0];
        } else if (this.paperData.judgeList && this.paperData.judgeList.length > 0) {
          this.cardItem = this.paperData.judgeList[0];
        } else if (this.paperData.saqList && this.paperData.saqList.length > 0) {
          this.cardItem = this.paperData.saqList[0];
        }

        const that = this;
        if (this.paperData.radioList && this.paperData.radioList.length > 0) {
          this.paperData.radioList.forEach(function (item) {
            that.allItem.push(item);
          });
        }
        if (this.paperData.multiList && this.paperData.multiList.length > 0) {
          this.paperData.multiList.forEach(function (item) {
            that.allItem.push(item);
          });
        }
        if (this.paperData.judgeList && this.paperData.judgeList.length > 0) {
          this.paperData.judgeList.forEach(function (item) {
            that.allItem.push(item);
          });
        }
        if (this.paperData.saqList && this.paperData.saqList.length > 0) {
          this.paperData.saqList.forEach(function (item) {
            that.allItem.push(item);
          });
        }
        // Current selection
        this.fetchQuData(this.cardItem);
      });
    },
  },
};
</script>

<style scoped>
page {
  background: #ebecee;
}

.qu-content div {
  line-height: 30px;
  width: 100%;
}

.el-checkbox-group label,
.el-radio-group label {
  width: 100%;
}

.content-h {
  height: calc(100vh - 110px);
  overflow-y: auto;
}

.card-title {
  background: #eee;
  line-height: 35px;
  text-align: center;
  font-size: 14px;
}
.card-line {
  padding-left: 10px;
}
.card-line span {
  cursor: pointer;
  margin: 2px;
}

::v-deep .el-radio,
.el-checkbox {
  padding: 9px 20px 9px 10px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  margin-bottom: 10px;
  width: 100%;
}

.is-checked {
  border: #409eff 1px solid;
}

.el-radio img,
.el-checkbox img {
  max-width: 200px;
  max-height: 200px;
  border: #dcdfe6 1px dotted;
}

::v-deep .el-checkbox__inner {
  display: none;
}

::v-deep .el-radio__inner {
  display: none;
}

::v-deep .el-checkbox__label {
  line-height: 30px;
}

::v-deep .el-radio__label {
  line-height: 30px;
}

/* 考试记录 */
.content {
  width: 97%;
  height: 60px;
  border: 1px solid #0a84ff;
  margin-top: 8px;
  margin-left: 10px;
  padding: 10px;
  font-weight: 200;
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
  width: 250px;
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

/* // 试题内容样式 */
.qu_list {
  height: 100%;
  width: 100%;
  overflow: auto;
  page-break-after: always;

  .qu_num {
    display: inline-block;
    /* // background: url('~@/assets/images/tkxl/btbj.png') no-repeat 100% 100%; */
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

  /* // 选项组 */
  .qu_choose_group {
    width: 100%;

    /* 单个选项 */
    .qu_choose {
      display: block;
      margin: 10px;
      .el-radio__label {
        line-height: 20px;
      }
      /* // 去除前面的radio */
      ::v-deep .el-radio__input .el-radio__inner {
        display: none;
      }

      /* // 单个选项内容样式 */
      .qu_choose_tag {
        display: inline-flex;
        width: 90%;
        /* // 选项标签 */
        .qu_choose_tag_type {
          font-weight: bold;
          /* // color: #0a84ff; */
          width: 10px;
        }
        /* // 选项内容 */
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
      /* // 选项答案 */
      .qu_choose_answer {
        float: right;
      }
    }
  }

  /* // 试题解析 */
  .qu_analysis {
    padding: 10px;

    .qu_analysis_content {
      padding-top: 10px;
    }
  }

  /* // 试题赋分 */
  .qu_assign_score {
    background: #f5f5f5;
    height: 100px;
    padding-top: 35px;

    .qu_assign_score_content {
      width: 80px;
    }
  }
}
.current {
  background: #f5f5f5;
}
</style>
