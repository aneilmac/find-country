import { createApp} from 'vue'
import App from './App.vue'
import InlineSvg from 'vue-inline-svg';
import vSelect from 'vue-select';

createApp(App)
    .component('inline-svg', InlineSvg)
    .component('v-select', vSelect)
    .mount('#app');
import 'vue-select/dist/vue-select.css';