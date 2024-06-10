<template>
  <el-container style="height: 100vh; border: 1px solid #eee">
    <!-- <div class="left">
          <div class="fk">
            <div
              style="
                font-size: 25px;
                font-weight: 500;
                margin-left: 10px;
                padding: 10px 0 0 0;
              "
            >
              11
            </div>
            <div class="sj">
              <div>
                <span>Score</span>
                <span>50</span>
              </div>
              <div>
                <span>Time Taken</span>
                <span>50</span>
              </div>
              <div>
                <span>Submitted By</span>
                <span>50</span>
              </div>
              <el-divider></el-divider>
              <p>
                Total <span style="color: #1890ff">5 </span> questions, Total
                <span style="color: #1890ff">100</span> points
              </p>
              <el-row>
                <el-tag
                  v-for="index in 5"
                  :type="index === quIndex ? 'success' : ''"
                  @click="handleTag(index)"
                  class="type_tag"
                >
                  {{ index }}
                </el-tag>
              </el-row>
            </div>
          </div>
        </div> -->

    <el-container>
      <el-main class="right">
        <el-col>
          <el-card class="qu_list">
            <div>
              <template v-for="index in data">
                <div
                  v-if="index.quType === 1 || index.quType === 2 || index.quType === 3"
                  :class="'index' + index"
                >
                  <el-row :gutter="24">
                    <el-col :span="20" style="text-align: left">
                      <!-- Question: Number, Type, Title -->
                      <div>
                        <!-- <div class="qu_num">{{ index }}</div> -->
                        <!-- 【 Single Choice 】 -->
                        <div class="qu_content">{{ index.title }}</div>
                      </div>

                      <!-- Options -->
                      <el-radio-group class="qu_choose_group">
                        <!-- ['A', 'B', 'C', 'D'] -->
                        <el-radio
                          v-for="(item, indexs) in index.option"
                          :key="indexs"
                          :label="item.content"
                          border
                          class="qu_choose"
                          :class="{'isRight':index.myOption!=null&& isCheck(index.myOption ,item.sort)  && item.isRight , 'incorrect':index.myOption!=null && isCheck(index.myOption ,item.sort) && !item.isRight}"
                        >
                          <!-- Option flex float -->
                          <div class="qu_choose_tag">
                            <div class="qu_choose_tag_type">
                              {{ numberToLetter(indexs) }}. {{ item.content }}.
                            </div>
                            <!-- Option content and image -->
                            <div class="qu_choose_tag_content"/>
                          </div>
                          <div class="qu_choose_answer">
                            <!-- <i class="el-icon-success" style="color: #1aac1a"> Answer </i> -->
                          </div>
                        </el-radio>
                      </el-radio-group>

                      <!-- Question Analysis -->
                      <div class="qu_analysis">
                        <el-card>
                          <div>
                            <span>Examinee's Answer:</span>
                            <span>{{ numberToLetter(index.myOption) }}</span><br>
                          </div>
                          <div style="margin-top: 8px">
                            <span>Correct Answer:</span>
                            <span>{{ numberToLetter(index.rightOption) }}</span><br>
                          </div>
                          <div style="margin-top: 8px">
                            <span>Question Analysis:</span>
                            <span>{{ index.analyse }}</span><br>
                          </div>
                        </el-card>
                      </div>
                    </el-col>
                  </el-row>
                  <el-divider />
                </div>
              </template>
              <template v-for="index in data">
                <div v-if="index.quType === 4" :class="'index' + index">
                  <el-row :gutter="24">
                    <el-col :span="20" style="text-align: left">
                      <!-- Question: Number, Type, Title -->
                      <div>
                        <!-- <div class="qu_num">{{ index }}</div> -->
                        <!-- 【 Short Answer Question 】 -->
                        <div class="qu_content">{{ index.title }}</div>
                      </div>

                      <!-- Input field for short answer -->
                      <el-radio-group class="qu_choose_group">
                        <!-- ['A', 'B', 'C', 'D'] -->
                        <el-input
                          v-model="index.myOption"
                          style="margin-top: 10px"
                          type="textarea"
                          :autosize="{ minRows: 2, maxRows: 4 }"
                          placeholder="Enter content"
                        />
                      </el-radio-group>

                      <!-- Question Analysis -->
                      <div class="qu_analysis">
                        <el-card>
                          <div>
                            <!-- <span>Examinee's Answer:</span>
                            <span
                              :style="{
                                color:
                                  isRight === 1
                                    ? 'green'
                                    : isRight === 0
                                    ? 'red'
                                    : 'gray',
                              }"
                              >{{}}</span
                            ><br /> -->
                          </div>
                          <div style="margin-top: 8px">
                            <span>Correct Answer:</span>
                            <span>{{ index.rightOption }}</span>
                            <br>
                          </div>
                          <div style="margin-top: 8px">
                            <span>Question Analysis:</span>
                            <span>{{ index.analyse }}</span><br>
                          </div>
                        </el-card>
                      </div>
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
</template>

<script>
import { recordExerciseDetail } from '@/api/record'
export default {
  name: 'ExamProcess',
  data() {
    return {
      input: '',
      quIndex: -1,
      repoId: 0,
      data: {}
    }
  },
  created() {
    // this.examId=this.$route.query.zhi.examId
    this.repoId = localStorage.getItem('record_exercise_repoId')
    this.ExerciseDetail()
  },
  methods: {
    isCheck(myOption, sort) {
      const arr = myOption.split(",").map(Number); // Convert the string to an array of numbers
      if (arr.includes(sort)) {
        return true;
        console.log(`${valueToCheck} is in the array.`);
      } else {
        return false;
      }
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

      // Helper function: Convert a single number (string or number type) to a letter
      const singleNumberToLetter = (num) => numberToCharMap[parseInt(num, 10)] || ''

      // Helper function: Process comma-separated number strings
      const commaSeparatedNumbersToLetters = (str) => {
        const numbers = str.split(',').map((item) => parseInt(item.trim(), 10))
        return numbers.map((number) => numberToCharMap[number] || '').join(',')
      }

      // Determine the input type and call the corresponding function
      if (/^\d+$/.test(input)) {
        // Single number (string form can also match)
        return singleNumberToLetter(input)
      } else if (/^\d+(,\d+)*$/.test(input)) {
        // Contains comma-separated number strings
        return commaSeparatedNumbersToLetters(input)
      } else {
        return '' // Input does not match the expected format, return an empty string or handle as needed
      }
    },
    // Pagination query
    async ExerciseDetail() {
      const params = { repoId: this.repoId }
      const res = await recordExerciseDetail(params)
      this.data = res.data
    },

    // Clicking on the question number in the answer sheet, sliding the right side to the corresponding question
    handleTag(index) {
      // Highlight the selected question index label
      this.quIndex = index
      // Slide to the anchor point of the question
      const page = document.querySelector('.index' + index)
      page.scrollIntoView()
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
/* Question content style */
.qu_list {
  height: 100%;
  width: 100%;
  overflow: auto;
  page-break-after: always;

  /* Question number */
  .qu_num {
    display: inline-block;
    /* Background image */
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

  /* Question content */
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

      /* Remove radio button */
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
          /* color: #0a84ff; */
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

.isRight{
  background-color: rgb(215, 245, 215);
}
.incorrect{
  background-color: rgb(248, 197, 197);
}
</style>
