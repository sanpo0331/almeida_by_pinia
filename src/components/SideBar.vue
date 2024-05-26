<template>
  <v-navigation-drawer class="bg-primary">
    <v-list nav @click:select="showDialog">
      <v-list-item-title class="app-title my-5">Almeida</v-list-item-title>
      <v-list-item
        v-show="store.id"
        prepend-icon="fa-solid fa-stethoscope"
        value="dlg01"
        active-class="teal-lighten-4"
      >
        <v-list-item-title>外来担当医登録</v-list-item-title>
      </v-list-item>
      <v-list-item
        v-show="store.id"
        prepend-icon="fa-regular fa-calendar-check"
        value="dlg02"
        active-class="teal-lighten-4"
      >
        <v-list-item-title>病棟看護師シフト登録</v-list-item-title>
      </v-list-item>
      <v-list-item
        prepend-icon="fa-regular fa-rectangle-list"
        value="dlg03"
        active-class="teal-lighten-4"
      >
        <v-list-item-title>外来担当一覧</v-list-item-title>
      </v-list-item>
      <v-list-item
        prepend-icon="fa-solid fa-clipboard-list"
        value="dlg04"
        active-class="teal-lighten-4"
      >
        <v-list-item-title>病棟看護師担当</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <!-- 外来担当医登録 -->
  <v-dialog v-model="dlgGairaiDoctor" width="auto">
    <RegisterGairaiDoctor @dlg-close="dlgGairaiDoctor = false" />
  </v-dialog>
  <!-- 病棟看護師シフト登録 -->
  <v-dialog v-model="dlgByotoShift" width="auto">
    <RegisterByotoShift @dlg-close="dlgByotoShift = false" />
  </v-dialog>
  <!-- 外来担当医一覧 -->
  <v-dialog v-model="dlgGairaiTanto">
    <cardGairaiTantoVue @dlg-close="dlgGairaiTanto = false" />
  </v-dialog>
  <!-- 病棟看護師 -->
  <v-dialog v-model="dlgNurseTanto">
    <cardNurseTanto @dlg-close="dlgNurseTanto = false" />
  </v-dialog>
</template>

<script setup></script>

<script>
import RegisterGairaiDoctor from './RegisterGairaiDoctor.vue'
import RegisterByotoShift from './RegisterByotoShift.vue'
import cardGairaiTantoVue from './cardGairaiTanto.vue'
import cardNurseTanto from './cardNurseTanto.vue'

import { useUserStore } from '@/stores/user'

export default {
  setup() {
    const store = useUserStore()
    return {
      store
    }
  },
  props: {
    loggedIn: {
      type: Boolean
    }
  },
  components: {
    RegisterGairaiDoctor,
    RegisterByotoShift,
    cardGairaiTantoVue,
    cardNurseTanto
  },
  data: () => ({
    dlgGairaiDoctor: false,
    dlgByotoShift: false,
    dlgGairaiTanto: false,
    dlgNurseTanto: false
  }),
  methods: {
    showDialog(arg) {
      switch (arg.id) {
        case 'dlg01':
          this.dlgGairaiDoctor = true
          break
        case 'dlg02':
          this.dlgByotoShift = true
          break
        case 'dlg03':
          this.dlgGairaiTanto = true
          break
        case 'dlg04':
          this.dlgNurseTanto = true
          break
      }
    }
  }
}
</script>

<style scoped>
.app-title {
  font-family: 'Dela Gothic One', sans-serif;
  font-size: 2.5rem;
  text-align: center;
  line-height: 2.5rem;
}
</style>
