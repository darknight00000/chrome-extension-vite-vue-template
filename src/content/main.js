import { createApp } from 'vue'
import App from './App.vue'

const ctn = document.createElement('div')
document.body.appendChild(ctn)
createApp(App).mount(ctn)
