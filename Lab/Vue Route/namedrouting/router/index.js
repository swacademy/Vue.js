import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Contacts from '../views/Contacts.vue'
import ContactByNo from '../views/ContactByNo.vue'

Vue.use(VueRouter)

const routes = [
  { path: "/", component: Home },
  { path: "/home", name: "home", component: Home },
  { path: "/about", name: "about", component: About },
  {
    path: "/contacts",
    name: "contacts",
    component: Contacts,
    children: [{ path: ":no", name: "contactbyno", component: ContactByNo }]
  }
];

const router = new VueRouter({
  //mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
