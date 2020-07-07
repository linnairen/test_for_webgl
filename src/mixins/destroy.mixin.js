export default {
  methods: {
    CloseShow() {
      this.$destroy && this.$destroy()
    },
  },
  destroyed() {
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  }
}