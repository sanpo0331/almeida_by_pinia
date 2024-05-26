<template>
  <div>
    <v-card elevation="5" width="700" height="480" class="pa-5 bg-teal-lighten-5">
      <v-toolbar color="transparent" class="mb-4">
        <v-toolbar-title>医師登録</v-toolbar-title>
        <v-spacer />
        <v-icon icon="fa-solid fa-user-doctor" color="primary" size="60" />
      </v-toolbar>
      <v-row>
        <v-col cols="6">
          <v-form ref="frmValid">
            <v-text-field
              label="名前"
              density="compact"
              variant="outlined"
              :rules="[rules.required]"
              v-model="name"
            ></v-text-field>
            <v-select
              :items="medicals"
              density="compact"
              item-title="name"
              item-value="id"
              :rules="[rules.required]"
              v-model="medical"
            >
            </v-select>
            <v-text-field
              label="ID"
              density="compact"
              variant="outlined"
              :rules="[rules.required]"
              v-model="id"
            ></v-text-field>
            <v-card-actions class="mt-3">
              <v-spacer></v-spacer>
              <v-btn rounded="lg" elevation="2" color="update" @click="setData">更新</v-btn>
              <v-btn
                v-if="this.edit == true"
                rounded="lg"
                elevation="2"
                color="error"
                @click="deleteData"
                >削除</v-btn
              >
              <v-btn rounded="lg" elevation="2" @click="clear">クリア</v-btn>
              <v-btn rounded="lg" elevation="2" @click="transEvent">閉じる</v-btn>
            </v-card-actions>
          </v-form>
        </v-col>
        <v-col cols="6">
          <v-list density="compact" lines="two" style="max-height: 340px" class="overflow-y">
            <v-list-item
              v-for="(item, ix) in list"
              :key="ix"
              :title="item.name"
              :subtitle="getMedicalName(item.medical) + '(' + item.id + ')'"
            >
              <template v-slot:append>
                <v-btn
                  color="primary"
                  size="small"
                  icon="fa-solid fa-pencil"
                  @click="selDoctor(ix)"
                >
                </v-btn>
              </template>
              <v-divider></v-divider>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { firebaseDb } from '@/plugins/firebase'
import { collection, query, orderBy, getDocs, setDoc, deleteDoc, doc } from 'firebase/firestore'

export default {
  data: () => ({
    id: '',
    name: '',
    medical: '',
    yobi: '',
    edit: false,
    medicals: [
      { id: 'med101', name: '消化器内科' },
      { id: 'med102', name: '神経内科' },
      { id: 'med103', name: '循環器内科' },
      { id: 'med201', name: '外科・消化器外科' },
      { id: 'med301', name: '皮膚科' },
      { id: 'med302', name: '耳鼻咽喉科' },
      { id: 'med303', name: '小児科' }
    ],
    list: [],
    selectedId: '',
    rules: {
      required: (value) => !!value || '入力してください'
    }
  }),
  created: function () {
    this.getListDoctor()
  },
  methods: {
    transEvent: function () {
      this.$emit('dlg-close')
    },
    initData() {
      this.id = ''
      this.name = ''
      this.medical = ''
      this.edit = false
      this.getListDoctor()
    },
    async getListDoctor() {
      this.list = []
      const q = query(collection(firebaseDb, 'doctors'), orderBy('medical'))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        this.list.push({
          id: doc.id,
          name: doc.data().name,
          medical: doc.data().medical,
          yobi: doc.data().yobi
        })
      })
    },
    // 更新
    async setData() {
      const result = await this.$refs.frmValid.validate()
      if (!result.valid) return

      await setDoc(doc(firebaseDb, 'doctors', this.id), {
        name: this.name,
        medical: this.medical,
        yobi: this.yobi
      })
      this.initData()
    },
    deleteData() {
      deleteDoc(doc(firebaseDb, 'doctors', this.id))
      this.initData()
    },
    getMedicalName(getId) {
      const result = this.medicals.find(({ id }) => id === getId)
      return result.name
    },
    selDoctor(ix) {
      this.id = this.list[ix].id
      this.name = this.list[ix].name
      this.medical = this.list[ix].medical
      this.yobi = this.list[ix].yobi
      this.edit = true
    },
    clear() {
      this.id = ''
      this.name = ''
      this.medical = ''
      this.yobi = ''
      this.edit = false
    }
  }
}
</script>

<style></style>
