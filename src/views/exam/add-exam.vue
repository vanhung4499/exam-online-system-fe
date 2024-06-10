<template>
  <div class="app-container">
    <h3>Exam Information</h3>
    <el-card style="margin-top: 20px">
      <div style="float: right; font-weight: bold; color: #ff0000">
        Total Score: {{ postForm.totalScore }} points
      </div>

      <div>
        <!-- <el-button class="filter-item" size="small" type="primary" icon="el-icon-plus" @click="handleAdd">
          Add Repository
        </el-button> -->

        <el-table
          :data="repoList"
          :border="false"
          empty-text="Please click on 'Add Repository' above to set"
          style="width: 100%; margin-top: 15px"
        >
          <el-table-column label="Repository" width="200">
            <template v-slot="scope">
              <repo-select
                v-model="scope.row.repoId"
                :multi="false"
                :excludes="excludes"
                @change="repoChange($event, scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="Single Choice Quantity" align="center">
            <template v-slot="scope">
              <el-input-number
                v-model="scope.row.radioCount"
                :min="0"
                :max="scope.row.totalRadio"
                :controls="false"
                style="width: 80px"
              />
              <template v-if="scope.row.totalRadio !== undefined">
                / {{ scope.row.totalRadio }}
              </template>
            </template>
          </el-table-column>

          <el-table-column label="Single Choice Score" align="center">
            <template v-slot="scope">
              <el-input-number
                v-model="scope.row.radioScore"
                :min="0"
                :controls="false"
                style="width: 80px"
              />
            </template>
          </el-table-column>

          <el-table-column label="Multiple Choice Quantity" align="center">
            <template v-slot="scope">
              <el-input-number
                v-model="scope.row.multiCount"
                :min="0"
                :max="scope.row.totalMulti"
                :controls="false"
                style="width: 80px"
              />
              <template v-if="scope.row.totalMulti !== undefined">
                / {{ scope.row.totalMulti }}
              </template>
            </template>
          </el-table-column>

          <el-table-column label="Multiple Choice Score" align="center">
            <template v-slot="scope">
              <el-input-number
                v-model="scope.row.multiScore"
                :min="0"
                :controls="false"
                style="width: 80px"
              />
            </template>
          </el-table-column>

          <el-table-column label="True/False Quantity" align="center">
            <template v-slot="scope">
              <el-input-number
                v-model="scope.row.judgeCount"
                :min="0"
                :max="scope.row.totalJudge"
                :controls="false"
                style="width: 80px"
              />
              <template v-if="scope.row.totalJudge !== undefined">
                / {{ scope.row.totalJudge }}
              </template>
            </template>
          </el-table-column>

          <el-table-column label="True/False Score" align="center">
            <template v-slot="scope">
              <el-input-number
                v-model="scope.row.judgeScore"
                :min="0"
                :controls="false"
                style="width: 80px"
              />
            </template>
          </el-table-column>
          <el-table-column label="Short Answer Quantity" align="center">
            <template v-slot="scope">
              <el-input-number
                v-model="scope.row.saqCount"
                :min="0"
                :max="scope.row.totalSaq"
                :controls="false"
                style="width: 80px"
              />
              <template v-if="scope.row.totalSaq !== undefined">
                / {{ scope.row.totalSaq }}
              </template>
            </template>
          </el-table-column>

          <el-table-column label="Short Answer Score" align="center">
            <template v-slot="scope">
              <el-input-number
                v-model="scope.row.saqScore"
                :min="0"
                :controls="false"
                style="width: 80px"
              />
            </template>
          </el-table-column>
          <!-- <el-table-column label="Delete" align="center" width="80px">
            <template v-slot="scope">
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="removeItem(scope.$index)"
              />
            </template>
          </el-table-column> -->
        </el-table>
      </div>
    </el-card>

    <h3>Exam Configuration</h3>
    <el-card style="margin-top: 20px">
      <el-form
        ref="postForm"
        :model="postForm"
        :rules="rules"
        label-position="left"
        label-width="150px"
      >
        <el-form-item label="Exam Name" prop="title">
          <el-input v-model="postForm.title" />
        </el-form-item>

        <el-form-item label="Description" prop="content">
          <el-input v-model="postForm.content" type="textarea" />
        </el-form-item>

        <el-form-item label="Total Score" prop="totalScore">
          <el-input-number :value="postForm.totalScore" disabled />
        </el-form-item>

        <el-form-item label="Passing Score" prop="passedScore">
          <el-input-number v-model="postForm.passedScore" :max="postForm.totalScore" />
        </el-form-item>

        <el-form-item label="Max Screen Switching Count" prop="maxCount">
          <el-input-number v-model="postForm.maxCount" />
        </el-form-item>
        <el-form-item label="Certificate" prop="maxCount">
          <CertificateSelect
            v-model="postForm.certificateId"
            is-multiple
            @change="onCertificateChange"
          />
          <!-- <el-input-number v-model="postForm.maxCount"  /> -->
        </el-form-item>
        <el-form-item label="Duration (Minutes)" prop="certificateId">
          <el-input-number v-model="postForm.examDuration" />
        </el-form-item>
        <el-form-item label="Exam Time Range" prop="start">
          <el-date-picker
            v-model="postForm.start"
            type="datetimerange"
            range-separator="to"
            start-placeholder="Start Date"
            end-placeholder="End Date"
          />
        </el-form-item>
        <!--
        <el-form-item label="Time Limitation">
          <el-checkbox v-model="postForm.timeLimit" />
        </el-form-item> -->

        <el-form-item v-if="postForm.timeLimit" label="Exam Time" prop="examDuration">
          <el-date-picker
            v-model="dateValues"
            type="datetimerange"
            range-separator="to"
            start-placeholder="Start Date"
            end-placeholder="End Date"
          />
        </el-form-item>
      </el-form>
    </el-card>


    <h3>Permission Configuration</h3>
    <el-card style="margin-top: 20px">
      <!-- <el-radio-group v-model="postForm.openType" style="margin-bottom: 20px">
        <el-radio :label="1" border>Completely Public</el-radio>
        <el-radio :label="2" border>Departmental Access</el-radio>
      </el-radio-group> -->

      <!-- <el-alert
        v-if="postForm.openType===1"
        title="It is open to everyone to take the exam!"
        type="warning"
      />

      <div v-if="postForm.openType===2">
        <el-input
          v-model="filterText"
          placeholder="Enter keyword to filter"
        />

        <el-tree

          v-loading="treeLoading"
          ref="tree"
          :data="treeData"
          :default-checked-keys="postForm.departIds"
          :props="defaultProps"
          :filter-node-method="filterNode"
          empty-text=" "
          default-expand-all
          show-checkbox
          node-key="id"
          @check-change="handleCheckChange"
        />

      </div> -->

      <div style="display: flex">
        <div style="align-items: center; display: flex">Exam Class:</div>
        <div style="margin-left: 10px">
          <ClassSelect v-model="postForm.classIds" is-multiple @change="onClassChange" />
          <!-- <el-input v-model="input" placeholder="Please enter content"></el-input> -->
        </div>
      </div>
    </el-card>

    <div style="margin-top: 20px">
      <el-button type="primary" @click="handleSave">Save</el-button>
    </div>
  </div>
</template>

<script>
// import { fetchDetail } from '@/api/exam'
import RepoSelect from '@/components/RepoSelect'
import ClassSelect from '@/components/ClassSelect'
import CertificateSelect from '@/components/CertificateSelect'
import { saveData } from '@/api/exam'
export default {
  name: 'ExamDetail',

  components: {RepoSelect, ClassSelect, CertificateSelect},
  data() {
    return {
      input: '',
      treeData: [],
      defaultProps: {
        label: 'deptName'
      },
      filterText: '',
      treeLoading: false,
      dateValues: [],
      // Question bank
      repoList: [
        {
          id: '',
          rowId: 0,
          radioCount: 0,
          radioScore: 0,
          multiCount: 0,
          multiScore: 0,
          judgeCount: 0,
          judgeScore: 0,
          saqCount: 0,
          saqScore: 0
        }
      ],
      // Selected question banks
      excludes: [],
      postForm: {
        // Total score
        totalScore: 0,
        // Question bank list
        repoList: [],
        // Open type
        openType: 1,
        // Exam class list
        departIds: []
      },
      rules: {
        title: [{ required: true, message: 'Exam name cannot be empty!' }],
        content: [{ required: true, message: 'Exam description cannot be empty!' }],
        open: [{ required: true, message: 'Exam permission cannot be empty!' }],
        totalScore: [{ required: true, message: 'Exam total score cannot be empty!' }],
        passedScore: [{ required: true, message: 'Passing score cannot be empty!' }],
        examDuration: [{ required: true, message: 'Exam duration cannot be empty!' }],
        ruleId: [{ required: true, message: 'Exam rule cannot be empty' }],
        password: [{ required: true, message: 'Exam password cannot be empty!' }]
      }
    };
  },

  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },

    dateValues: {
      handler() {
        this.postForm.startTime = this.dateValues[0]
        this.postForm.endTime = this.dateValues[1]
      }
    },

// Question bank change
    repoList: {
      handler(val) {
        let totalScore = 0;
        this.excludes = [];
        for (let i = 0; i < val.length; i++) {
          const item = val[i];
          if (item.radioCount > 0 && item.radioScore > 0) {
            totalScore += item.radioCount * item.radioScore;
          }

          if (item.multiCount > 0 && item.multiScore > 0) {
            totalScore += item.multiCount * item.multiScore;
          }

          if (item.judgeCount > 0 && item.judgeScore > 0) {
            totalScore += item.judgeCount * item.judgeScore;
          }

          if (item.saqCount > 0 && item.saqScore > 0) {
            totalScore += item.saqCount * item.saqScore;
          }
          this.excludes.push(item.id);
        }

        // Assign values
        this.postForm.totalScore = totalScore;
        this.postForm.repoList = val;
        this.$forceUpdate();
      },
      deep: true
    }
  },
  created() {
    const id = this.$route.params.id
    // if (typeof id !== undefined) {
    //   this.fetchData(id)
    // }

    // fetchTree({}).then((response) => {
    //   this.treeData = response.data
    // })
  },
  methods: {
    handleSave() {
      this.$refs.postForm.validate((valid) => {
        if (!valid) {
          return;
        }

        if (this.postForm.totalScore === 0) {
          this.$notify({
            title: 'Notice',
            message: 'The exam rule is not set correctly, please confirm!',
            type: 'warning',
            duration: 2000
          });
          return;
        }

        for (let i = 0; i < this.postForm.repoList.length; i++) {
          const repo = this.postForm.repoList[i];
          if (!repo.repoId) {
            this.$notify({
              title: 'Notice',
              message: 'The exam repository selection is not correct!',
              type: 'warning',
              duration: 2000
            });
            return;
          }

          if (
            (repo.radioCount > 0 && repo.radioScore === 0) ||
            (repo.radioCount === 0 && repo.radioScore > 0)
          ) {
            this.$notify({
              title: 'Notice',
              message: 'Invalid single-choice question configuration found in repository ' + (i + 1) + '!',
              type: 'warning',
              duration: 2000
            });
            return;
          }

          if (
            (repo.multiCount > 0 && repo.multiScore === 0) ||
            (repo.multiCount === 0 && repo.multiScore > 0)
          ) {
            this.$notify({
              title: 'Notice',
              message: 'Invalid multiple-choice question configuration found in repository ' + (i + 1) + '!',
              type: 'warning',
              duration: 2000
            });
            return;
          }

          if (
            (repo.judgeCount > 0 && repo.judgeScore === 0) ||
            (repo.judgeCount === 0 && repo.judgeScore > 0)
          ) {
            this.$notify({
              title: 'Notice',
              message: 'Invalid true/false question configuration found in repository ' + (i + 1) + '!',
              type: 'warning',
              duration: 2000
            });
            return;
          }
        }

        this.$confirm('Are you sure you want to save?', 'Notice', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.submitForm();
        });
      });
    },

    handleCheckChange() {
      const that = this;
      // Clear
      this.postForm.departIds = [];
      const nodes = this.$refs.tree.getCheckedNodes();
      nodes.forEach(function (item) {
        that.postForm.departIds.push(item.id);
      });
    },

// Add child item
    handleAdd() {
      this.repoList.push({
        id: '',
        rowId: 0,
        radioCount: 0,
        radioScore: 0,
        multiCount: 0,
        multiScore: 0,
        judgeCount: 0,
        judgeScore: 0,
        saqCount: 0,
        saqScore: 0
      });
    },

    removeItem(index) {
      this.repoList.splice(index, 1);
    },

// fetchData(id) {
//   fetchDetail(id).then((response) => {
//     this.postForm = response.data

//     if (this.postForm.startTime && this.postForm.endTime) {
//       this.dateValues[0] = this.postForm.startTime
//       this.dateValues[1] = this.postForm.endTime
//     }
//     this.repoList = this.postForm.repoList
//   })
// },

    formatDateToISOString(date) {
      // Ensure the input is a Date object
      if (!(date instanceof Date)) {
        throw new TypeError('Expected a Date object');
      }

      // Format to ISO 8601 format, note that the timezone will automatically adjust to UTC
      let isoString = date.toISOString();

      // Truncate and reassemble the string, remove the millisecond part and replace T with uppercase
      // This step can be adjusted according to your needs, typically ISO 8601 format includes milliseconds and T is lowercase
      isoString = isoString.split('.')[0].replace('T', 'T');

      return isoString;
    },


    submitForm() {
      // Validate and process data
      let cerTemp = '';
      if (this.postForm.certificateId != null && this.postForm.certificateId != '') {
        cerTemp = this.postForm.certificateId.join(',');
      }
      this.postForm.repoList = this.repoList;
      const params = {
        title: this.postForm.title,
        examDuration: this.postForm.examDuration,
        maxCount: this.postForm.maxCount,
        passedScore: this.postForm.passedScore,
        startTime: this.formatDateToISOString(this.postForm.start[0]),
        endTime: this.formatDateToISOString(this.postForm.start[1]),
        gradeIds: this.postForm.classIds.join(','),
        repoId: this.postForm.repoList[0].id,
        certificateId: cerTemp,
        radioCount: this.postForm.repoList[0].radioCount,
        radioScore: this.postForm.repoList[0].radioScore,
        multiCount: this.postForm.repoList[0].multiCount,
        multiScore: this.postForm.repoList[0].multiScore,
        judgeCount: this.postForm.repoList[0].judgeCount,
        judgeScore: this.postForm.repoList[0].judgeScore,
        saqCount: this.postForm.repoList[0].saqCount,
        saqScore: this.postForm.repoList[0].saqScore
      };
      saveData(params).then((res) => {
        if (res.code) {
          this.$notify({
            title: 'Success',
            message: 'Exam saved successfully!',
            type: 'success',
            duration: 2000
          });

          this.$router.push({ name: 'exam-management' });
        } else {
          this.$notify({
            title: 'Failed',
            message: res.msg,
            type: 'error',
            duration: 2000
          });
        }
      });
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.deptName.indexOf(value) !== -1;
    },
    onCertificateChange() {
      // Implementation here...
    },
    onClassChange() {
      // Implementation here...
    },
    repoChange(e, row) {
      // Assign ID
      row.id = e.id;
      console.log("-----");
      console.log(e);
      if (e != null) {
        row.totalRadio = e.radioNum;
        row.totalMulti = e.multiNum;
        row.totalJudge = e.judgeNum;
        row.totalSaq = e.saqNum;
      } else {
        row.totalRadio = 0;
        row.totalMulti = 0;
        row.totalJudge = 0;
        row.totalSaq = 0;
      }
    }

  }
}
</script>
