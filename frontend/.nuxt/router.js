import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _c41d96e0 = () => interopDefault(import('..\\pages\\drive\\index.vue' /* webpackChunkName: "pages_drive_index" */))
const _0bab504e = () => interopDefault(import('..\\pages\\evoked\\index.vue' /* webpackChunkName: "pages_evoked_index" */))
const _01c9cd51 = () => interopDefault(import('..\\pages\\login\\index.vue' /* webpackChunkName: "pages_login_index" */))
const _4e46907a = () => interopDefault(import('..\\pages\\previousTrips\\index.vue' /* webpackChunkName: "pages_previousTrips_index" */))
const _ed88a1de = () => interopDefault(import('..\\pages\\profile\\index.vue' /* webpackChunkName: "pages_profile_index" */))
const _08ac6cf7 = () => interopDefault(import('..\\pages\\register\\index.vue' /* webpackChunkName: "pages_register_index" */))
const _02bcb8fc = () => interopDefault(import('..\\pages\\ride\\index.vue' /* webpackChunkName: "pages_ride_index" */))
const _3952bd94 = () => interopDefault(import('..\\pages\\sock\\index.vue' /* webpackChunkName: "pages_sock_index" */))
const _52b2c20c = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages_index" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/drive",
    component: _c41d96e0,
    name: "drive"
  }, {
    path: "/evoked",
    component: _0bab504e,
    name: "evoked"
  }, {
    path: "/login",
    component: _01c9cd51,
    name: "login"
  }, {
    path: "/previousTrips",
    component: _4e46907a,
    name: "previousTrips"
  }, {
    path: "/profile",
    component: _ed88a1de,
    name: "profile"
  }, {
    path: "/register",
    component: _08ac6cf7,
    name: "register"
  }, {
    path: "/ride",
    component: _02bcb8fc,
    name: "ride"
  }, {
    path: "/sock",
    component: _3952bd94,
    name: "sock"
  }, {
    path: "/",
    component: _52b2c20c,
    name: "index"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
