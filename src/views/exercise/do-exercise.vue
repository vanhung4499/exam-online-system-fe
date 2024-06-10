<template>
  <div style="width: 100%; height: 100%; background-color: #f0f2f5; padding: 20px 0 0">
    <!-- Begin -->
    <el-row :gutter="24">
      <el-col :span="24">
        <el-card style="margin-bottom: 10px">
          {{ repoTitle }} Repository
          <!-- <el-button
            :loading="loading"
            style="float: right; margin-top: -10px"
            type="primary"
            icon="el-icon-plus"
            @click="handHandExam()"
          >
            {{ handleText }}
          </el-button> -->
        </el-card>
      </el-col>

      <el-col :span="5" :xs="24" style="margin-bottom: 10px">
        <el-card class="content-h">
          <div class="btn_switch">
            <button
              class="btn_anniu"
              :class="{ newStyle: 0 === number }"
              @click="change(0)"
            >
              Orderly
            </button>
            <button
              class="btn_anniu"
              :class="{ newStyle: 1 === number }"
              @click="change(1)"
            >
              By Question Type
            </button>
            <div style="height: 20px" />
            <el-row :gutter="24" class="card-line" style="padding-left: 10px">
              <el-tag type="success">Correct Answer</el-tag>
              <el-tag type="danger">Incorrect Answer</el-tag>
              <el-tag type="info">Unanswered</el-tag>
              <el-tag type="warning">Current Question</el-tag>
              <div style="margin-bottom: 15px" />
            </el-row>
          </div>
          <!-- <div> -->
          <div v-if="0 === number">
            <!-- <p>Question type</p> -->
            <p class="card-title">Answer Sheet</p>
            <el-row :gutter="24" class="card-line" style="padding-left: 10px">
              <el-tag
                v-for="(item, index) in quList"
                :key="index"
                style="width: calc(100% / 8); text-align: center"
                :type="cardItemClass(item.exercised, item.quId, item.isRight)"
                @click="selectQuNum(item, index)"
              >{{ index + 1 }}</el-tag>
            </el-row>
          </div>

          <div v-if="1 === number">
            <div v-if="paperData.radioList.length > 0">
              <p class="card-title">Single Choice Questions</p>
              <el-row :gutter="24" class="card-line">
                <el-tag
                  v-for="(item, index) in paperData.radioList"
                  :key="index"
                  :type="cardItemClass(item.exercised, item.quId, item.isRight)"
                  @click="selectQuId(item, index)"
                >
                  {{ index + 1 }}</el-tag>
              </el-row>
            </div>

            <div
              v-if="paperData.multiList !== undefined && paperData.multiList.length > 0"
            >
              <p class="card-title">Multiple Choice Questions</p>
              <el-row :gutter="24" class="card-line">
                <el-tag
                  v-for="(item, index) in paperData.multiList"
                  :key="index"
                  :type="cardItemClass(item.exercised, item.quId, item.isRight)"
                  @click="selectQuId(item, index)"
                >{{ index + 1 }}</el-tag>
              </el-row>
            </div>

            <div
              v-if="paperData.judgeList !== undefined && paperData.judgeList.length > 0"
            >
              <p class="card-title">True/False Questions</p>
              <el-row :gutter="24" class="card-line">
                <el-tag
                  v-for="(item, index) in paperData.judgeList"
                  :key="index"
                  :type="cardItemClass(item.exercised, item.quId, item.isRight)"
                  @click="selectQuId(item, index)"
                >{{ index + 1 }}</el-tag>
              </el-row>
            </div>
            <div v-if="paperData.saqList !== undefined && paperData.saqList.length > 0">
              <p class="card-title">Short Answer Questions</p>
              <el-row :gutter="24" class="card-line">
                <el-tag
                  v-for="(item, index) in paperData.saqList"
                  :key="index"
                  :type="cardItemClass(item.exercised, item.quId, item.isRight)"
                  @click="selectQuId(item, index)"
                >{{ index + 1 }}</el-tag>
              </el-row>
            </div>
          </div>

          <!-- </div> -->
        </el-card>
      </el-col>

      <el-col :span="19" :xs="24">
        <el-card class="qu-content content-h">
          <p v-if="quDetail.content">
            {{ number === 1 ? curTypeIndex + 1 : currentQuIndex + 1 }}.{{ quDetail.content }}
            {{ shouQuType(quDetail.quType) }}
          </p>
          <p v-if="quDetail.image != null && quDetail.image !== ''">
            <el-image :src="quDetail.image" style="max-width: 100px" />
          </p>
          <div v-if="quDetail.quType === 1 || quDetail.quType === 3">
            <el-radio-group v-model="radioValue">
              <el-radio
                v-for="item in quDetail.options"
                :key="item.id"
                :label="item.id"
              >{{ numberToLetter(item.sort + 1) }}.{{ item.content }}
                <div v-if="item.image != null && item.image !== ''" style="clear: both">
                  <el-image :src="item.image" style="max-width: 100px" />
                </div>
              </el-radio>
            </el-radio-group>
          </div>

          <div v-if="quDetail.quType === 2">
            <el-checkbox-group v-model="multiValue">
              <el-checkbox
                v-for="item in quDetail.options"
                :key="item.id"
                :label="item.id"
              >{{ numberToLetter(item.sort + 1) }}.{{ item.content }}
                <div v-if="item.image != null && item.image !== ''" style="clear: both">
                  <el-image :src="item.image" style="max-width: 100px" />
                </div>
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <div v-if="quDetail.quType === 4">
            <el-input
              v-model="radioValue"
              type="textarea"
              resize="none"
              :clearable="true"
              placeholder="Please enter your answer"
            />
          </div>

          <div v-if="showAnalysis">
            <p v-if="quDetail.quType !== 4">
              Answer：<span>{{ rightQuAnswer.msg }}</span>
            </p>
            <p v-if="rightQuAnswer.data">Correct Answer: {{ getRightAnswer() }}</p>
            <p>Question Analysis: {{ rightQuAnswer.data.analysis }}</p>
          </div>

          <div style="margin-top: 20px">
            <el-button
              v-if="showPrevious"
              type="primary"
              icon="el-icon-back"
              @click="handPrevious()"
            >
              {{ preText }}
            </el-button>

            <el-button
              v-if="showNext"
              type="warning"
              icon="el-icon-right"
              @click="handNext()"
            >
              {{ nextText }}
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getQuestion, getQuestionDetail, submitAnswer } from '@/api/exercise'
// import { quDetail } from "@/api/question";
import { Loading } from 'element-ui'

// import { examStart, examQuList } from "@/api/exam";
export default {
  name: 'ExamProcess',

  data() {
    return {
      showAnalysis: 0,
      repoId: '',
      repoTitle: '',
      quId: '',
      // Current question ID, used for sequential question answering
      curQuId: '',
      // Single question details
      quDetail: {},
      // Question list
      quList: [],
      preText: 'Previous',
      nextText: 'Next',
      rightQuAnswer: {},
      number: 0,
      receivedRow: null,
      // Current question number index by question type
      curTypeIndex: 0,
      // Index pointing to which list
      curListIndex: 1,
      // Fullscreen mode
      isFullscreen: false,
      showPrevious: false,
      showNext: true,
      loading: false,
      handleText: 'Submit',
      pageLoading: false,
      // Current question index
      currentQuIndex: 0,
      // Paper ID
      paperId: '',
      // Current answer sheet
      cardItem: {},
      allItem: [],
      // Current question content
      quData: {
        answerList: []
      },
      // Paper information
      paperData: {
        radioList: [],
        multiList: [],
        judgeList: [],
        saqList: []
      },
      // Single choice selected value
      radioValue: '',
      // Multiple choice selected value
      multiValue: [],
      // Answered IDs
      answeredIds: []
    }
  },
  created() {
    this.repoId = this.$route.query.repoId
    this.repoTitle = this.$route.query.repoTitle

    this.getQuestionList()
    //   this.initCurrentIndex()
    //    setTimeout(()=> this.getCurrentQuDetial()
    //  ,100)
    this.getCurrentQuDetail()
  },
  methods: {
    // Get the list of question IDs
    async getQuestionList() {
      const res = await getQuestion(null, this.repoId)
      this.quList = res.data

      // By sequential order
      // if (this.number == 0) {
      this.paperData.radioList = []
      this.paperData.multiList = []
      this.paperData.judgeList = []
      this.paperData.saqList = []
      // }
      // By question type
      if (this.number === 1) {
        this.quList.forEach((item) => {
          if (item.quType === 1) {
            this.paperData.radioList.push(item)
          } else if (item.quType === 2) {
            this.paperData.multiList.push(item)
          } else if (item.quType === 3) {
            this.paperData.judgeList.push(item)
          } else if (item.quType === 4) {
            this.paperData.saqList.push(item)
          }
        })
        this.quList = []
        // Initialize the question ID
        this.initQuId()
        // alert(this.curQuId)
      }
    },

    numberToLetter(sort) {
      switch (sort) {
        case 1:
          return 'A'
        case 2:
          return 'B'
        case 3:
          return 'C'
        case 4:
          return 'D'
        case 5:
          return 'E'
        case 6:
          return 'F'
        default:
          return '' // Default value, or you can handle other cases
      }
    },

    change(index) {
      this.number = index // Important part
      this.preText = 'Previous'
      this.nextText = 'Next'
      this.showAnalysis = 0

      this.getQuestionList()

      setTimeout(() => this.getCurrentQuDetail(), 200)
    },

    getRightAnswer() {
      let arr = [];
      if (this.rightQuAnswer.data) {
        this.rightQuAnswer.data.options.forEach((option) => {
          if (option.isRight) {
            arr.push(this.numberToLetter(option.sort + 1))
          }
        })
      }

      let res = arr.join(',')
      if (this.quDetail.quType === 4) {
        res = this.rightQuAnswer.data.options[0].content
      }

      return res
      // },100)
    },
// Select question number by question type
    selectQuId(item, index) {
      // console.log("111111111111111")
      // console.log(item);
      this.curTypeIndex = index
      this.curQuId = item.quId
      if (item.quType === 1) {
        this.curListIndex = 1
      } else if (item.quType === 2) {
        this.curListIndex = 2
      } else if (item.quType === 3) {
        this.curListIndex = 3
      } else if (item.quType === 4) {
        this.curListIndex = 4
      }
      this.getCurrentQuDetail()
    },

    async getCurrentQuDetail() {
      const loading = Loading.service({
        text: 'Loading...',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if (this.number === 0) {
        // alert("00000000000"+this.currentQuIndex)
        setTimeout(() => {
          //
          getQuestionDetail(this.quList[this.currentQuIndex].quId).then((res) => {
            this.quDetail = res.data
          })
        }, 100)
      } else if (this.number === 1) {
        // alert("1111111111111"+this.curQuId);
        getQuestionDetail(this.curQuId).then((res) => {
          this.quDetail = res.data
        })
      }
      loading.close()
    },

    // Answer sheet style
    cardItemClass(answered, id, isRight) {
      if (id === this.quDetail.id) {
        return 'warning'
      } else if (isRight) {
        return 'success'
      } else if (answered) {
        return 'danger'
      } else {
        return 'info'
      }
    },

    // Initialize question ID for sequential question answering
    initQuId() {
      this.curQuId = this.paperData.radioList[0].quId
    },

    // Initialize question order for sequential question answering
    initCurrentIndex() {
      var exercisedCount = 0

      setTimeout(() => {
        this.quList.forEach((element) => {
          if (element.exercised) {
            this.currentQuIndex++
            exercisedCount++
          }
          if (exercisedCount === this.quList.length) {
            this.currentQuIndex = 0
          }
        })
        this.showButton()
      }, 100)
    },

    // Select question number
    selectQuNum(item, index) {
      // alert(this.nextText)
      // alert(this.rightQuAnswer);
      const loading = Loading.service({
        text: 'Loading...',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      // this.fillAnswer();
      this.preText = 'Previous'
      this.nextText = 'Next'
      this.showAnalysis = 0
      this.radioValue = ''
      this.multiValue = []
      this.currentQuIndex = index
      this.showButton()
      this.getCurrentQuDetail()
      loading.close()
    },

    // Display question type in the question stem
    shouQuType(type) {
      if (type === 1) {
        return '(Single Choice)'
      } else if (type === 2) {
        return '(Multiple Choice)'
      } else if (type === 3) {
        return '(True or False)'
      } else if (type === 4) {
        return '(Short Answer)'
      }
    },
    /**
     * Next question
     */
    handNext() {
      const loading = Loading.service({
        text: 'Loading...',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if (this.nextText === 'Next') {
        this.radioValue = ''
        this.multiValue = []
        this.showAnalysis = 0
        this.rightQuAnswer = {}
        // Click next question sequentially
        if (this.number === 0) {
          if (this.currentQuIndex < this.quList.length - 1) {
            this.currentQuIndex++
          }
        } else if (this.number === 1) {
          // Click next question by question type
          if (this.curListIndex === 1) {
            // Single choice questions
            this.curTypeIndex++
            if (this.curTypeIndex === this.paperData.radioList.length) {
              // If the index exceeds the single choice question range, move to multiple choice questions
              this.curListIndex = 2
              this.curTypeIndex = 0
              this.curQuId = this.paperData.multiList[this.curTypeIndex].quId
            } else {
              this.curQuId = this.paperData.radioList[this.curTypeIndex].quId
            }
          } else if (this.curListIndex === 2) {
            // If the current list is multiple choice questions
            this.curTypeIndex++
            if (this.curTypeIndex === this.paperData.multiList.length) {
              this.curListIndex = 3
              this.curTypeIndex = 0
              this.curQuId = this.paperData.judgeList[this.curTypeIndex].quId
            } else {
              this.curQuId = this.paperData.multiList[this.curTypeIndex].quId
            }
          } else if (this.curListIndex === 3) {
            // True or False questions
            this.curTypeIndex++
            if (this.curTypeIndex === this.paperData.judgeList.length) {
              this.curListIndex = 4
              this.curTypeIndex = 0
              this.curQuId = this.paperData.saqList[this.curTypeIndex].quId
            } else {
              this.curQuId = this.paperData.judgeList[this.curTypeIndex].quId
            }
          } else if (this.curListIndex === 4) {
            this.curTypeIndex++
            if (this.curTypeIndex === this.paperData.saqList.length) {
              this.curListIndex = 1
              this.curTypeIndex = 0
              this.curQuId = this.paperData.radioList[this.curTypeIndex].quId
            } else {
              this.curQuId = this.paperData.saqList[this.curTypeIndex].quId
            }
          }
        }
        this.getCurrentQuDetail()

        setTimeout(() => (this.nextText = 'Next'), 100)
      } else if (this.nextText === 'Next Step') {
        this.rightQuAnswer = {}
        this.fillAnswer()

        this.showAnalysis = 1

        setTimeout(() => {
          this.nextText = 'Next'
        }, 100)
      }
      this.showButton()
      loading.close()
    },

    // Fill in the answer
    async fillAnswer() {
      if (this.radioValue || this.multiValue.length) {
        let params = {}
        if (this.radioValue) {
          params = {
            repoId: this.quDetail.repoId,
            quId: this.quDetail.id,
            answer: this.radioValue,
            quType: parseInt(this.quDetail.quType)
          }
        }
        // Submit answer for multiple choice questions
        if (this.multiValue.length) {
          params = {
            repoId: this.quDetail.repoId,
            quId: this.quDetail.id,
            answer: this.multiValue.join(','),
            quType: parseInt(this.quDetail.quType)
          }
        }

        const res = await submitAnswer(params)

        this.rightQuAnswer = res
      }

      this.getQuestionList()
    },

    async showButton() {
      // alert(this.currentQuIndex)
      // alert(this.currentQuIndex)
      // alert(this.quList.length)
      // console.log(this.currentQuIndex)

      this.showPrevious = this.currentQuIndex !== 0;

      this.showNext = !(this.currentQuIndex === this.quList.length - 1 && this.nextText === 'Next');
    },


    /**
     * Previous question
     */
    handPrevious() {
      const loading = Loading.service({
        text: 'Loading...',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      if (this.preText === 'Previous Step') {
        this.fillAnswer()
        this.showAnalysis = 1
        setTimeout(() => (this.preText = 'Previous'), 100)
      }

      if (this.preText === 'Previous') {
        this.radioValue = ''
        this.multiValue = []
        this.rightQuAnswer = {}
        if (this.currentQuIndex > 0) {
          this.currentQuIndex--
          this.showButton()
          this.getCurrentQuDetail()
          setTimeout(() => (this.preText = 'Previous Step'), 100)
        }
        this.showAnalysis = 0
      }

      loading.close()
    }

  }
}
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
