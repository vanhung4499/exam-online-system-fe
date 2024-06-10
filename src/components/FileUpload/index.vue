<template>
  <div>
    <file-upload-local v-model="fileUrl" :accept="accept" :tips="tips" :list-type="listType" />
  </div>
</template>

<script>
import FileUploadLocal from './local'

export default {
  name: 'FileUpload',
  components: { FileUploadLocal },
  props: {
    value: String,
    accept: {
      type: String,
      default: '*'
    },
    tips: String,
    listType: {
      type: String,
      default: 'picture'
    }
  },
  data() {
    return {
      fileUrl: ''
    }
  },

  watch: {
    // Detect changes in value
    value: {
      handler() {
        this.fillValue()
      }
    },

    // Detect changes in fileUrl
    fileUrl: {
      handler() {
        this.$emit('input', this.fileUrl)
      }
    }
  },
  mounted() {

  },

  created() {
    this.fillValue()
  },

  methods: {

    fillValue() {
      this.fileUrl = this.value
    }

  }
}
</script>
