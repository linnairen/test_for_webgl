<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->
    <!-- <div>当前选中人物：{{ selected !== -1 ? (persons[selected] ? persons[selected].Name : '') : '未选中' }}</div> -->
    <!-- <div>状态：{{ msg }}</div> -->
    <!-- <Person :Name="it.Name" :HP="it.HP" :MP="it.MP" @click="personDeal(i)" v-for="(it, i) in persons" :key="i" ref="person" /> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import Person from '@/components/Person.vue'; // @ is an alias to /src

@Component({
  components: {
    HelloWorld,
    Person
  },
})
export default class Home extends Vue {
  @Provide() public persons = [
    { Name:'1号', HP: 100, MP: 100 }, 
    { Name:'2号', HP: 100, MP: 100 }
  ]
  @Provide() public selected:number = -1
  @Provide() public msg:string = '和平'

  async personDeal(key: number) {
    let person:any = this.$refs.person
    if (this.selected === -1) {
      if (!person[key].$data.Self.ALive) {
        this.msg = '不能选中死亡角色'
        return
      }
      this.selected = key
    } else {
      if (person[this.selected].$data.Self._AttackStatus) {
        this.msg = "处于攻击状态中，不可以再发起攻击"
        return
      }
      if (!person[this.selected].$data.Self.ALive) {
        this.msg = '死亡角色无法发起攻击'
        return
      }
      this.msg = `${this.persons[this.selected].Name}正在攻击${this.persons[key].Name}`
      let Damage:number = await person[this.selected].$data.Self.AttackEmiter(person[key].$data.Self)
      if (person[key].$data.Self.ALive) {
        this.msg = Damage ? `${this.persons[this.selected].Name}对${this.persons[key].Name}造成${Damage}点伤害` : `${this.persons[this.selected].Name}的攻击被${this.persons[key].Name}闪避开了`
      } else {
        this.msg = `${this.persons[this.selected].Name}无法对${this.persons[key].Name}的尸体造成伤害`
      }
      if (!person[this.selected].$data.Self.ALive) {
        this.selected = -1
      }
    }
  }
}
</script>
