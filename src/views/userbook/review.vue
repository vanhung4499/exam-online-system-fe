<template>
  <div style="width: 100%; height: 100%; background-color: #f0f2f5; padding: 20px 0 0">
    <el-row :gutter="24">
      <el-col :span="24">
        <el-card style="margin-bottom: 10px">
          Wrong Questions Book
          <el-button
            :loading="loading"
            style="float: right; margin-top: -10px"
            type="primary"
            icon="el-icon-plus"
            @click="handHandExam()"
          >
            {{ handleText }}
          </el-button>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-card class="qu-content content-h">
          <!-- Question Stem -->
          <p v-if="quData.content">{{ quData.content }}</p>
          <p v-if="quData.image != null && quData.image != ''">
            <el-image :src="quData.image" style="max-width: 200px" />
          </p>

          <!-- Single Choice or True/False -->
          <div v-if="quData.quType === 1 || quData.quType === 3">
            <!-- Options -->
            <el-radio-group v-model="radioValue">
              <el-radio v-for="item in quData.answerList" :key="item.id" :label="item.id">
                {{ numberToLetter(item.sort) }}.{{ item.content }}
                <div v-if="item.image != null && item.image != ''" style="clear: both">
                  <el-image :src="item.image" style="max-width: 200px" />
                </div>
              </el-radio>
            </el-radio-group>

            <!-- Answer and Analysis -->
            <div v-if="flag == true && (quData.quType === 1 || quData.quType === 3)">
              <!-- <div>
                <span>My Answer: {{ myAnswers }}</span>
              </div> -->
              <div>
                <span>Correct Answer: {{ numberToLetter(parseInt(this.failQuData.rightAnswers)) }}</span>
              </div>
              <div>
                <span>Question Analysis: {{ this.failQuData.analysis }}</span>
              </div>
            </div>
          </div>

          <!-- Multiple Choice -->
          <div v-if="quData.quType === 2">
            <el-checkbox-group v-model="multiValue">
              <el-checkbox v-for="item in quData.answerList" :key="item.id" :label="item.id">
                {{ numberToLetter(item.sort) }}.{{ item.content }}
                <div v-if="item.image != null && item.image != ''" style="clear: both">
                  <el-image :src="item.image" style="max-width: 200px" />
                </div>
              </el-checkbox>
            </el-checkbox-group>
          </div>

          <div v-if="flag == true && quData.quType === 2">
            <!-- <div>
              <span>My Answer: {{ myAnswers }}</span>
            </div> -->
            <div>
              <span>Correct Answer:  {{ numberToLetter(this.failQuData.rightAnswers) }}</span>
            </div>
            <div>
              <span>Question Analysis:  {{ this.failQuData.analysis }}</span>
            </div>
          </div>

          <div v-if="quData.quType === 4">
            <el-input
              v-model="saqTextarea"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="Please enter content"
            />
            <!-- <el-checkbox-group v-model="multiValue"> -->
            <!-- <el-checkbox
                v-for="item in quData.answerList"
                :key="item.id"
                :label="item.id"
                >{{  numberToLetter(item.sort)  }}.{{ item.content }}
                <div v-if="item.image != null && item.image != ''" style="clear: both">
                  <el-image :src="item.image" style="max-width: 100%" />
                </div>
              </el-checkbox> -->
            <!-- </el-checkbox-group> -->
          </div>

          <div v-if="flag == true && quData.quType === 4" style="margin-top: 10px;">
            <!-- <div>
              <span>My Answer: {{ myAnswers }}</span>
            </div> -->
            <div>
              <span>Correct Answer:  {{ this.failQuData.rightAnswers }}</span>
            </div>
            <div>
              <span>Question Analysis:  {{ this.failQuData.analysis }}</span>
            </div>
          </div>

          <div style="margin-top: 20px">
            <!-- <el-button type="primary" @click="handPrevious()">
              Previous Question
            </el-button> -->
            <el-button type="warning" icon="el-icon-right" @click="handNext()">
              Next Question
            </el-button>
          </div>

        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { fullBook, getSingleQu, getUserBookList } from "@/api/userbook";
export default {
  data() {
    return {
      repoId: "",
      repoTitle: "",
      routeData: {},
      // Fullscreen mode
      isFullscreen: false,
      showPrevious: false,
      showNext: true,
      loading: false,
      handleText: "Submit",
      pageLoading: false,
      nextText: false,
      userBookList: [],
      index: 0,
      quDataLen: 0,
      examId: "",
      failQuData: {},
      flag: false,
      // Current question content
      quData: {
        answerList: [],
      },
      // Paper information
      radioValue: "",
      showAnswer: false,
      // Multiple choice selected value
      multiValue: [],
      // Answered ID
      answeredIds: [],
      saqTextarea: "",
      myAnswers: "",
      lastIndex: 0,
      paperData: {
        leftSeconds: 99999,
        radioList: [],
        multiList: [],
        judgeList: [],
      },
    };
  },
  created() {
    this.routeData = this.$route.query.zhi;
    this.examId = localStorage.getItem("userbook_examId");
    this.getUserBookListFun();
    // this.getSingleQuFun()
  },

  methods: {
    handHandExam() {
      const that = this;
      // Submitting exam and saving answers
      const msg = "Are you sure you want to submit?";
      that
        .$confirm(msg, "Prompt", {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          type: "warning",
        })
        .then(() => {
          this.$router.push({ name: "exam-error" });
        })
        .catch(() => {
          that.$message({
            type: "info",
            message: "Submission canceled, you can continue answering!",
          });
        });
    },

    getSingleQuFun(quId) {
      getSingleQu(quId).then((res) => {
        this.quData = res.data;
      });
    },
    getUserBookListFun() {
      getUserBookList(this.examId).then((res) => {
        this.userBookList = res.data;
        this.quDataLen = res.data.length;
        this.getSingleQuFun(res.data[this.index]["quId"]);
        this.lastIndex = this.userBookList.length;
      });
    },

    numberToLetter(input) {
      const numberToCharMap = {
        0: 'A',
        1: 'B',
        2: 'C',
        3: 'D',
        4: 'E',
        5: 'F'
      }

      // Helper function: Convert single number (string or number type) to letter
      const singleNumberToLetter = (num) => numberToCharMap[parseInt(num, 10)] || ''

      // Helper function: Process comma-separated number strings
      const commaSeparatedNumbersToLetters = (str) => {
        const numbers = str.split(',').map((item) => parseInt(item.trim(), 10))
        return numbers.map((number) => numberToCharMap[number] || '').join(',')
      }

      // Determine input type and call the corresponding function
      if (/^\d+$/.test(input)) {
        // Single number (string form can also match)
        return singleNumberToLetter(input)
      } else if (/^\d+(,\d+)*$/.test(input)) {
        // Includes comma-separated number string
        return commaSeparatedNumbersToLetters(input)
      } else {
        return '' // Input doesn't match expectations, return empty string or handle as needed
      }
    },
    /**
     * Next question
     */
    handNext() {
      if (!this.flag) {
        this.index = this.index + 1;
        this.handSave(this.index);
      } else {
        if (this.index >= this.lastIndex) {
          this.handHandExam();
        }
        this.handSave(this.index);
      }
    },


    /**
     * Previous question
     */
    handPrevious() {
      this.index = this.index - 1;
      this.handSave(this.index);
    },

// Save answer
    handSave(index) {

      if (index - 1 >= this.lastIndex) {
        this.handHandExam();
        //   this.$router.push({ name: 'Wrongbook' })
      } else {
        const answers = this.multiValue;
        if (this.radioValue !== "") {
          answers.push(this.radioValue);
        }

        const params = {
          examId: this.examId,
          quId: this.userBookList[index - 1]["quId"],
          answer: this.quData.quType == 4 ? this.saqTextarea : answers.join(","),
        };

        // this.myAnswers = params.answer;
        if (!this.flag) {
          fullBook(params).then((res) => {
            if (res.code) {
              this.failQuData = res.data;

              if (res.data.correct) {
                this.$message({
                  type: "success",
                  message: res.msg,
                });
              } else {
                this.$message({
                  type: "error",
                  message: res.msg,
                });
              }
            } else {
              this.$message({
                type: "error",
                message: res.msg,
              });
            }
          });
        }

        if (this.flag == true) {
          // Fetch details
          this.fetchQuData(index);
          this.flag = false;
        } else {
          this.flag = true;
        }
      }
      // });
    },

    // Fetching exam details
    fetchQuData(index) {
      this.getSingleQuFun(this.userBookList[index]["quId"]);
    },

  },
};
</script>
<style scoped>
page {
  background: #ebecee;
}

.btn_anniu {
  width: 50%;
  padding: 10px 0;
  font-size: 19px;
  font-weight: bold;
  border: 0 solid #fff;
  color: #000;
  outline: none;
  background: #fff;
}

.newStyle {
  border-bottom: 2px solid #f0892e;
  color: #f0892e;
  font-size: 21px;
  font-weight: bold;
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
</style>
