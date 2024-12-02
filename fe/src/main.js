import { createApp } from 'vue'
import App from './App.vue'
import '../src/assets/tailwind.css'
import { DefaultApolloClient } from '@vue/apollo-composable'
import apolloClient from './apollo'
import router from '../src/router';



createApp(App)
  .provide(DefaultApolloClient, apolloClient)
  .use(router)
  .mount('#app')

