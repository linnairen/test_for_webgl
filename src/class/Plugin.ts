import Equipment from './Equipment'
import EquipmentElement from '../components/Equipment.vue'

export default {
  Equipment: {
    install: function(Vue: any, options: any) {
      Vue.prototype.$Equipment = function(equipment: Equipment) {
        let equipmentElement = new EquipmentElement({
          propsData: { equipment }
        })
        document.body.appendChild(equipmentElement.$mount().$el)
      }
    }
  }
}
