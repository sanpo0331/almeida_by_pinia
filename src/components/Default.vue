<template>
  <v-app>
    <nav-bar />
    <side-bar />
    <main-view />
  </v-app>
</template>

<script setup></script>

<script>
import NavBar from './NavBar.vue'
import SideBar from './SideBar.vue'
import MainView from './Main.vue'

export default {
  components: {
    NavBar,
    SideBar,
    MainView
  }
}
</script>
