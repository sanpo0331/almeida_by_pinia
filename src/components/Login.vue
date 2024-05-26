<template>
  <div>
    <v-card elevation="5" width="400" class="pa-5 bg-teal-lighten-5">
      <v-toolbar color="transparent" class="mb-4">
        <v-toolbar-title>ログイン</v-toolbar-title>
        <v-spacer />
        <v-icon icon="fa-solid fa-user" color="primary" size="60" />
      </v-toolbar>
      <v-form ref="frmValid">
        <v-text-field
          label="ID"
          density="compact"
          :rules="[rules.required, rules.counter]"
          counter="5"
          flat
          class="mt-5"
          v-model="loginid"
        ></v-text-field>
        <v-text-field
          label="password"
          density="compact"
          hide-details
          flat
          class="mt-5"
          v-model="password"
        ></v-text-field>
        <v-card-actions class="mt-3">
          <v-spacer />
          <v-btn rounded="lg" elevation="2" color="update" @click="transEventLogin">ログイン</v-btn>
          <v-btn rounded="lg" elevation="2" @click="transEventClose">閉じる</v-btn>
        </v-card-actions>
      </v-form>
      <p class="errMessage">{{ errMessage }}</p>
    </v-card>
  </div>
</template>

<script>
import { firebaseDb } from '@/plugins/firebase'
import { doc, getDoc } from 'firebase/firestore'

import { useUserStore } from '@/stores/user'

export default {
  setup() {
    const store = useUserStore()
    return {
      store
    }
  },
  data: () => ({
    loginid: '',
    password: '',
    dn: '',
    rules: {
      required: (value) => !!value || '入力してください',
      counter: (value) => value.length <= 5 || '５文字入力してください。'
    },
    errMessage: ''
  }),
  methods: {
    async transEventLogin() {
      const result = await this.$refs.frmValid.validate()
      if (!result.valid) return

      let docRef = ''
      if (this.loginid.substring(0, 1) === 'd') {
        this.dn = 'doctor'
        docRef = doc(firebaseDb, 'doctors', this.loginid)
      } else {
        this.dn = 'nurse'
        docRef = doc(firebaseDb, 'nurses', this.loginid)
      }
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        this.store.id = this.loginid
        this.store.name = docSnap.data().name
        this.store.medical = docSnap.data().medical
        this.store.byoto = docSnap.data().byoto
        this.$emit('loginOk')
      } else {
        this.errMessage = 'IDを確認してください。'
      }
    },
    transEventClose: function () {
      this.$emit('dlg-close')
    }
  }
}
</script>

<style scoped>
.errMessage {
  font-weight: 700;
  color: firebrick;
}
</style>
