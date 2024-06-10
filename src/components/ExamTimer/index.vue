<template>
  <span style="color: #ff0000; font-weight: 700">{{ min }} minutes {{ sec }} seconds</span>
</template>

<script>
export default {
  name: 'ExamTimer',
  props: {
    value: Number
  },

  data() {
    return {
      leftSeconds: 0,
      min: '00',
      sec: '00'
    }
  },

  watch: {
    value: {
      handler() {
        this.leftSeconds = this.value
        this.countdown()
      }
    }
  },

  created() {
    this.leftSeconds = this.value
  },

  methods: {
    // Perform countdown
    countdown() {
      // Countdown is over
      if (this.leftSeconds < 0) {
        this.$emit('timeout')
        return
      }

      // Hours
      const min = parseInt(this.leftSeconds / 60)
      const sec = parseInt(this.leftSeconds % 60)

      this.min = min > 9 ? min : '0' + min
      this.sec = sec > 9 ? sec : '0' + sec
      this.leftSeconds -= 1

      const that = this
      setTimeout(function () {
        that.countdown()
      }, 1000)
    }
  }
}
</script>
