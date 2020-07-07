
import { Component, Prop, Vue, Provide } from 'vue-property-decorator';
@Component({})
export default class DestroyMixin extends Vue {
  /**
   * 关闭显示并卸载
   */
  CloseShow() {
    this.$destroy && this.$destroy()
  }
  destroyed() {
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  }
}