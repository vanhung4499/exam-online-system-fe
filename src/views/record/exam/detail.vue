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
            <span>得分</span>
            <span>50</span>
          </div>
          <div>
            <span>耗时</span>
            <span>50</span>
          </div>
          <div>
            <span>提交人</span>
            <span>50</span>
          </div>
          <el-divider></el-divider>
          <p>
            共 <span style="color: #1890ff">5 </span> 题, 共
            <span style="color: #1890ff">100</span> 分
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
                <div v-if="index.quType === 1 || index.quType === 2 || index.quType === 3" :class="'index' + index">
                  <el-row :gutter="24">
                    <el-col :span="20" style="text-align: left">
                      <!-- Question: Number, Type, Stem -->
                      <div>
                        <!-- <div class="qu_num">{{ index }}</div> -->
                        <!-- 【 Single Choice Question 】 -->
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
                          :class="{'isRight': index.myOption != null && isCheck(index.myOption, item.sort) && item.isRight, 'incorrect': index.myOption != null && isCheck(index.myOption, item.sort) && !item.isRight}"
                        >
                          <!-- Option Flex Float -->
                          <div class="qu_choose_tag">
                            <div class="qu_choose_tag_type">
                              {{ numberToLetter(indexs) }}、{{ item.content }}.
                            </div>
                            <!-- Option Content and Image -->
                            <div class="qu_choose_tag_content" />
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
                            <span>Student's Answer: </span>
                            <span>{{ numberToLetter(index.myOption) }}</span><br>
                          </div>
                          <div style="margin-top: 8px">
                            <span>Correct Answer: </span>
                            <span>{{ numberToLetter(index.rightOption) }}</span><br>
                          </div>
                          <div style="margin-top: 8px">
                            <span>Question Analysis: </span>
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
                      <!-- Question: Number, Type, Stem -->
                      <div>
                        <!-- <div class="qu_num">{{ index }}</div> -->
                        <!-- 【 Short Answer Question 】 -->
                        <div class="qu_content">{{ index.title }}</div>
                      </div>

                      <!-- Answer Input -->
                      <el-radio-group class="qu_choose_group">
                        <el-input
                          v-model="index.myOption"
                          style="margin-top: 10px"
                          type="textarea"
                          :autosize="{ minRows: 2, maxRows: 4 }"
                          placeholder=""
                          :disabled="true"
                        />
                      </el-radio-group>

                      <!-- Question Analysis -->
                      <div class="qu_analysis">
                        <el-card>
                          <div>
                            <!-- <span>Student's Answer: </span>
                            <span
                              :style="{
                                color: isRight === 1 ? 'green' : isRight === 0 ? 'red' : 'gray',
                              }"
                              >{{}}</span
                            ><br /> -->
                          </div>
                          <div style="margin-top: 8px">
                            <span>Correct Answer: </span>
                            <span>{{ index.rightOption }}</span>
                            <br>
                          </div>
                          <div style="margin-top: 8px">
                            <span>Question Analysis: </span>
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
import { recordExamDetail } from '@/api/record'
export default {
  name: 'ExamProcess',
  data() {
    return {
      input: '',
      quIndex: -1,
      examId: 0,
      data: null,
      index: {
        quType: 4 // Make sure there is a value here
      }
    }
  },
  created() {
    // this.examId=this.$route.query.zhi.examId
    this.examId = localStorage.getItem('record_exam_examId')
    this.ExamDetail()
  },
  methods: {
    isCheck(myOption, sort) {
      const arr = myOption.split(",").map(Number); // Convert the string to an array of numbers
      if (arr.includes(sort)) {
        console.log(`${sort} is in the array.`);
        return true;
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
      };

      // Helper function: Convert a single number (string or number type) to a letter
      const singleNumberToLetter = (num) => numberToCharMap[parseInt(num, 10)] || '';

      // Helper function: Handle comma-separated number strings
      const commaSeparatedNumbersToLetters = (str) => {
        const numbers = str.split(',').map((item) => parseInt(item.trim(), 10));
        return numbers.map((number) => numberToCharMap[number] || '').join(',');
      };

      // Check the input type and call the corresponding function
      if (/^\d+$/.test(input)) {
        // Single number (string form also matches)
        return singleNumberToLetter(input);
      } else if (/^\d+(,\d+)*$/.test(input)) {
        // Contains comma-separated number strings
        return commaSeparatedNumbersToLetters(input);
      } else {
        return ''; // Return an empty string if the input does not meet the expectations
      }
    },
    // Pagination query
    async ExamDetail() {
      const params = { examId: this.examId };
      const res = await recordExamDetail(params);
      this.data = res.data;
    },
    // Click on the question number in the answer sheet to slide the corresponding question on the right side
    handleTag(index) {
      // Highlight the selected question index label
      this.quIndex = index;
      // Slide the question to the anchor point
      const page = document.querySelector('.index' + index);
      page.scrollIntoView();
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
.isRight{
  background-color: rgb(215, 245, 215);
}
.incorrect{
  background-color: rgb(248, 197, 197);
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

// Question content style
.qu_list {
  height: 100%;
  width: 100%;
  overflow: auto;
  page-break-after: always;

  .qu_num {
    display: inline-block;
    // background: url('~@/assets/images/tkxl/btbj.png') no-repeat 100% 100%;
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

  // Option group
  .qu_choose_group {
    width: 100%;

    // Single option
    .qu_choose {
      display: block;
      margin: 10px;

      // Remove radio button
      ::v-deep .el-radio__input .el-radio__inner {
        display: none;
      }

      // Single option content style
      .qu_choose_tag {
        display: inline-flex;
        width: 90%;

        // Option label
        .qu_choose_tag_type {
          font-weight: bold;
          // color: #0a84ff;
          width: 10px;
        }

        // Option content
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

      // Option answer
      .qu_choose_answer {
        float: right;
      }
    }
  }

  // Question analysis
  .qu_analysis {
    padding: 10px;

    .qu_analysis_content {
      padding-top: 10px;
    }
  }

  // Question assignment score
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
