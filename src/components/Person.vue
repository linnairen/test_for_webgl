<template>
  <div class="person-item" :class="{ death: !Self.ALive }" :title="title">
    <div class="person-item-status">
      <div>名称:{{ Self.Name }}</div>
      <div>HP:{{ Self.HP - Self._Damage }}</div>
      <div>MP:{{ Self.MP }}</div>
      <div>存活状态:{{ Self.ALive ? '存活' : '死亡' }}</div>
    </div>
    <div class="person-item-head" @click="$emit('click')">
      <div class="person-item-head_eye eye_left"></div>
      <div class="person-item-head_eye eye_right"></div>
    </div>
    <div class="person-item-body" @click="$emit('click')">
      <div class="person-item-body_arm arm_left"></div>
      <div class="person-item-body_arm arm_right" :class="{ on_attack: Self._AttackStatus }"></div>
      <div class="person-item-body_leg leg_left"></div>
      <div class="person-item-body_leg leg_right"></div>
    </div>
    <div class="person-item-equipment">
      <div class="person-item-equipment-item" title="装备槽" @click="$Equipment(Equipment)">

      </div>
      <div class="person-item-equipment-item" title="装备槽">

      </div>
      <div class="person-item-equipment-item" title="装备槽">

      </div>
      <div class="person-item-equipment-item" title="装备槽">

      </div>
    </div>
  </div>
</template>
<script>
import Equipment from '../class/Equipment'
import Person from '../class/Person'
export default {
  props: {
    Name: { default: "某个人" },
    HP: { default: 0 },
    MP: { default: 0 }
  },
  data() {
    return {
      Self: new Person({ Name: this.Name, _HP: this.HP, _MP: this.MP, _Attack: 5 }),
      Equipment: new Equipment({ Name: '屠龙刀' })
    }
  },
  computed: {
    title() {
      return this.Self.Name + ',HP:' + this.Self.HP + ',MP:' + this.Self.MP + ',' + (this.Self.ALive ? '存活' : '死亡')
    }
  }
}
</script>
<style lang="scss" scoped>
.person-item {
  width: 200px;
  height: 450px;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &-head {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #000;
    position: relative;
    &_eye {
      background: #fff;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      position: absolute;
      top: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      &.eye_left {
        left: 8px;
      }
      &.eye_right {
        right: 8px;
      }
      &::after {
        content: '';
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #000;
      }
    }
  }
  &-body {
    width: 50px;
    height: 100px;
    border-radius: 50px;
    position: relative;
    background: #000;
    &_arm {
      width: 12px;
      height: 80px;
      border-radius: 10px;
      position: absolute;
      background: #000;
      top: 6px;
      transform-origin: 50% 0%;
      &.arm_left {
        left: 10px;
        transform: rotate(30deg);
      }
      &.arm_right {
        right: 10px;
        transform: rotate(-30deg);
        &.on_attack {
          animation: arm_attack 0.2s linear;
        }
      }
    }
  }
  &-equipment {
    width: 200px;
    height: 200px;
    border: 1px solid #eee;
    display: flex;
    flex-wrap: wrap;
    &-item {
      display: inline-flex;
      width: 100px;
      height: 100px;
      border: 1px solid #eee;
      box-sizing: border-box;
      background: #aaa;
      justify-content: center;
      align-items: center;
      &::after {
        content: '+';
      }
    }
  }
  &.death {
    .person-item-head_eye::after {
      background: #eee;
    }
  }
}
@keyframes arm_attack {
  0% {
    transform: rotate(-30deg);
  }
  30% {
    transform: rotate(-120deg);
  }
  60% {
    transform: rotate(-90deg);
    height: 80px;
  }
  65% {
    transform: rotate(-90deg);
    height: 250px;
  }
  70% {
    transform: rotate(-90deg);
    height: 80px;
  }
  100% {
    transform: rotate(-30deg);
  }
}
</style>
