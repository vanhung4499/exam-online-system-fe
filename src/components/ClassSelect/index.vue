<template>
  <el-select
    v-model="selectedClassIds"
    :multiple="isMultiple"
    :remote-method="fetchClasses"
    filterable
    remote
    reserve-keyword
    clearable
    automatic-dropdown
    placeholder="Select or search classes"
    class="class-selector"
    @change="handleClassChange"
  >
    <el-option
      v-for="cls in classList"
      :key="cls.id"
      :label="cls.gradeName"
      :value="cls.id"
    />
  </el-select>
</template>

<script>
import { fetchClasses } from '@/api/class_' // Assume this is the API for fetching class list

export default {
  name: 'ClassSelect',
  props: {
    isMultiple: {
      type: Boolean,
      default: false
    },
    value: [String, Array],
    excludes: Array // If there are class IDs to be excluded, this parameter can be passed
  },
  data() {
    return {
      classList: [], // Stores the list of classes
      selectedClassIds: [] // IDs of currently selected classes
    }
  },
  watch: {
    value: {
      handler(newValue) {
        this.selectedClassIds = newValue
      },
      immediate: true // Ensure setting the initial value immediately upon component creation
    }
  },
  created() {
    this.fetchClasses()
  },
  methods: {
    fetchClasses(query = '') {
      // Use the query parameter for filtering, if necessary, further filter based on props.excludes
      fetchClasses({ pageNum: 1, pageSize: 1000, name: query }).then((response) => {
        this.classList = response.data || [] // Assuming the API response contains a 'records' field
      })
    },
    handleClassChange(selectedIds) {
      // Ensure selectedIds is always an array, even if a single value is passed for single selection
      const idsArray = Array.isArray(selectedIds) ? selectedIds : [selectedIds]

      // Handle logic for selected classes, such as finding detailed information about selected classes
      const selectedClasses = this.classList.filter((cls) => idsArray.includes(cls.id))

      // Send the selected classes' array of objects to the parent component, even if it's single selection, send as an array with one element
      this.$emit('change', selectedClasses)

      // Update the value bound to v-model, if it's single selection, the parent component should expect to receive a single value, but here sending as an array according to multi-selection logic
      // The parent component can differentiate between single and multiple selection by checking the array length
      this.$emit('input', selectedIds)
    }
  }
}
</script>
