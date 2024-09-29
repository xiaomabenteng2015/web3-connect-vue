import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { WagmiPlugin } from '@wagmi/vue'
import { config } from './config'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'

const app = createApp(App)

const queryClient = new QueryClient()

app.use(createPinia())
app.use(router)
app.use(WagmiPlugin, {config})
app.provide('queryClient', queryClient);
app.use(VueQueryPlugin, { queryClient });
app.mount('#app')
