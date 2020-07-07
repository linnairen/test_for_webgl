<template>
  <div class="equipment-shadow">
    <div class="equipment-box">
      <div class="equipment-box-close" @click="CloseShow"></div>
      <div class="equipment-item">
        <div class="equipment-image">{{ equipment.Name }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import destroyMixin from '../mixins/destroy.mixin'
import { mixins } from 'vue-class-component'
import { Component, Prop, Vue } from 'vue-property-decorator';
import Equipment from '../class/Equipment'
@Component({
  props: {
    equipment: {
      type: Equipment
    }
  }
})
export default class EquipmentElement extends mixins(destroyMixin) {
  @Prop() private msg!: string;
}
</script>
<style lang="scss" scoped>
.equipment-shadow {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba($color: #000000, $alpha: 0.2);
  .equipment-box {
    width: 360px;
    height: 450px;
    border: 5px solid #670;
    box-sizing: border-box;
    background: #fff;
    position: relative;
    &-close {
      position: absolute;
      top: 0;
      right: 0;
      width: 20px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #670;
      &::after {
        content: "x";
      }
    }
  }
}
</style>
