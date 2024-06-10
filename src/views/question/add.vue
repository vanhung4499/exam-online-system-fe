<template>
  <div class="app-container">
    <el-form
      ref="postForm"
      :model="postForm"
      :rules="rules"
      label-position="left"
      label-width="150px"
    >
      <el-card>
        <el-form-item label="Question Type" prop="quType">
          <el-select
            v-model="postForm.quType"
            :disabled="quTypeDisabled"
            class="filter-item"
            @change="handleTypeChange"
          >
            <el-option
              v-for="item in quTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Belonging Repository" prop="repoId">
          <repo-select v-model="postForm.repoId" :multi="false" />
        </el-form-item>

        <el-form-item label="Question Content" prop="content">
          <el-input v-model="postForm.content" type="textarea" />
        </el-form-item>

        <el-form-item label="Question Image" style="margin-left: 7px">
          <file-upload v-model="postForm.image" accept=".jpg,.jepg,.png" />
        </el-form-item>

        <el-form-item label="Entire Question Analysis" prop="oriPrice" style="margin-left: 7px">
          <el-input
            v-model="postForm.analysis"
            :precision="1"
            :max="999999"
            type="textarea"
          />
        </el-form-item>
      </el-card>

      <div
        v-if="postForm.quType !== 4"
        class="filter-container"
        style="margin-top: 25px"
      >
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          size="small"
          plain
          @click="handleAdd"
        >
          Add
        </el-button>

        <el-table :data="postForm.options" :border="true" style="width: 90%">
          <el-table-column label="Is Answer" width="120" align="center">
            <template v-slot="scope">
              <el-checkbox v-model="scope.row.isRight">Answer</el-checkbox>
            </template>
          </el-table-column>

          <el-table-column
            v-if="itemImage"
            label="Option Image"
            width="120px"
            align="center"
          >
            <template v-slot="scope">
              <file-upload v-model="scope.row.image" accept=".jpg,.jpeg,.png" />
            </template>
          </el-table-column>

          <el-table-column label="Answer Content">
            <template v-slot="scope">
              <el-input v-model="scope.row.content" type="textarea" />
            </template>
          </el-table-column>

          <!-- <el-table-column
            label="Answer Analysis"
          >
            <template v-slot="scope">
              <el-input v-model="scope.row.analysis" type="textarea" />
            </template>
          </el-table-column> -->

          <el-table-column label="Operation" align="center" width="100px">
            <template v-slot="scope">
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="removeItem(scope.$index)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-table
        v-if="postForm.quType === 4"
        :data="postForm.options"
        :border="true"
        style="width: 90%; margin-top: 30px"
      >
        <el-table-column label="Answer Content">
          <template v-slot="scope">
            <el-input v-model="scope.row.content" type="textarea" />
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <el-button type="primary" @click="submitForm">Save</el-button>
        <el-button type="info" @click="onCancel">Cancel</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { fetchDetail, quAdd, quDetail, quUpdate } from '@/api/question'
import RepoSelect from '@/components/RepoSelect'
import FileUpload from '@/components/FileUpload'

export default {
  name: 'QuDetail',
  components: { FileUpload, RepoSelect },
  data() {
    return {
      quId: '',
      quTypeDisabled: false,
      itemImage: true,

      levels: [
        { value: 1, label: 'Normal' },
        { value: 2, label: 'Hard' }
      ],

      quTypes: [
        {
          value: 1,
          label: 'Single Choice'
        },
        {
          value: 2,
          label: 'Multiple Choice'
        },
        {
          value: 3,
          label: 'True or False'
        },
        {
          value: 4,
          label: 'Short Answer'
        }
      ],

      postForm: {
        repoId: '',
        // tagList: [],
        options: []
      },
      rules: {
        content: [{ required: true, message: 'Question content cannot be empty!' }],

        quType: [{ required: true, message: 'Question type cannot be empty!' }],

        level: [{ required: true, message: 'Difficulty level must be selected!' }],

        repoId: [{ required: true, message: 'Please select the repository first!' }]
      }
    }
  },
  created() {
    // Initialize for adding a question
    const id = this.$route.params.id;
    if (typeof id !== 'undefined') {
      this.quTypeDisabled = true;
      this.fetchData(id);
    }
    // Initialize for editing a question
    this.quId = localStorage.getItem('quId');
    if (this.quId) {
      this.getQuDetail();
    }
  },
  beforeDestroy() {
    localStorage.removeItem('quId')
    this.postForm = {}
  },
  methods: {
    // Get single question details
    async getQuDetail() {
      const res = await quDetail(this.quId);
      if (res.code) {
        res.data.options.forEach(item => {
          item.isRight = item.isRight ? true : false;
        });
        this.postForm = res.data;
      }
    },

    // Handle type change
    handleTypeChange(v) {
      this.postForm.options = [];
      if (v === 3) {
        this.postForm.options.push({ isRight: true, content: 'Correct' });
        this.postForm.options.push({ isRight: false, content: 'Incorrect' });
      }

      if (v === 1 || v === 2) {
        for (let i = 0; i < 4; i++) {
          this.postForm.options.push({ isRight: false, content: '' });
        }
      }
      if (v === 4) {
        this.postForm.options.push({ isRight: true, content: '' });
      }
    },

    // Add sub-item
    handleAdd() {
      this.postForm.options.push({ isRight: false, content: '' });
    },

    removeItem(index) {
      this.postForm.options.splice(index, 1)
    },

    fetchData(id) {
      fetchDetail(id).then((response) => {
        this.postForm = response.data
      })
    },

    submitForm() {
      console.log(JSON.stringify(this.postForm));

      let rightCount = 0;

      this.postForm.options.forEach(item => {
        if (item.isRight) {
          rightCount += 1;
        }
      });

      if (this.postForm.quType === 1) {
        if (rightCount !== 1) {
          this.$message({
            message: 'There should be only one correct answer for single choice questions.',
            type: 'warning'
          });
          return;
        }
      }

      if (this.postForm.quType === 2) {
        if (rightCount < 2) {
          this.$message({
            message: 'There should be at least two correct answers for multiple choice questions!',
            type: 'warning'
          });
          return;
        }
      }

      if (this.postForm.quType === 3) {
        if (rightCount !== 1) {
          this.$message({
            message: 'There should be only one correct option for true/false questions!',
            type: 'warning'
          });
          return;
        }
      }

      this.$refs.postForm.validate(valid => {
        if (!valid) {
          return;
        }
        // Convert option correctness to numbers
        for (let i = 0; i < this.postForm.options.length; i++) {
          const option = this.postForm.options[i];
          option.isRight = option.isRight ? 1 : 0;
        }

        if (this.quId) {
          // Update question
          console.log('--------------');
          console.log(this.postForm);
          console.log('----------------');
          quUpdate(this.quId, this.postForm).then(res => {
            if (res.code) {
              this.$notify({
                title: 'Success',
                message: `${res.msg}`,
                type: 'success',
                duration: 2000
              });
              this.$router.push({ name: 'question-management' });
            } else {
              this.$notify({
                title: 'Failed',
                message: `${res.msg}`,
                type: 'error',
                duration: 2000
              });
            }
          });
        } else {
          // Add question
          quAdd(this.postForm).then(response => {
            this.postForm = response.data;
            if (response.code) {
              this.$notify({
                title: 'Success',
                message: 'Question saved successfully!',
                type: 'success',
                duration: 2000
              });
              this.$router.push({ name: 'question-management' });
            } else {
              this.$notify({
                title: 'Failed',
                message: `${response.msg}`,
                type: 'error',
                duration: 2000
              });
            }
          });
        }
      });
    },
    onCancel() {
      this.$router.push({ name: 'question-management' })
    }
  }
}
</script>

<style scoped>
.el-button--primary.is-plain {
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
  margin-bottom: 25px;
}
</style>
