<template>
  <el-select
    v-model="selectedCertificateIds"
    :multiple="isMultiple"
    :remote-method="fetchCertificates"
    filterable
    remote
    reserve-keyword
    clearable
    automatic-dropdown
    placeholder="Select or search certificates"
    class="certificate-selector"
    @change="handleCertificateChange"
  >
    <el-option
      v-for="cert in certificateList"
      :key="cert.id"
      :label="cert.certificateName"
      :value="cert.id"
    />
  </el-select>
</template>

<script>
import { certificatePaging } from '@/api/certificate'

export default {
  name: 'CertificateSelect',
  props: {
    isMultiple: {
      type: Boolean,
      default: false
    },
    value: [String, Array], // Supports single or multiple selection
    excludes: Array // Optional items to exclude
  },
  data() {
    return {
      certificateList: [], // List of certificates
      selectedCertificateIds: [] // IDs of selected certificates
    }
  },
  watch: {
    value: {
      handler(newValue) {
        this.selectedCertificateIds = newValue
      },
      immediate: true
    }
  },
  created() {
    this.fetchCertificates()
  },
  methods: {
    fetchCertificates() {
      certificatePaging({ pageNum: 1, pageSize: 1000 }).then((response) => {
        this.certificateList = response.data.records || []
      })
    },
    handleCertificateChange(selectedIds) {
      const selectedCertificates = this.certificateList.filter((cert) =>
        selectedIds.includes(cert.id)
      )
      this.$emit('change', selectedCertificates) // Send the selected certificate objects to the parent component
      this.$emit('input', selectedIds) // Update the value bound to v-model
    }
  }
}
</script>
