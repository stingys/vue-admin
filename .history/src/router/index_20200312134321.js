import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect:'login',
  },
  {
    path: "/",
    redirect:'login',
    component: () =>
      import(/* webpackChunkName: "about" */ "@/views/Home/index")
  }
];

const router = new VueRouter({
  routes
});

export default router;
