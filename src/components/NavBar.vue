<template>
  <!-- ログイン -->
  <v-dialog v-model="dlgLogin" width="auto">
    <Login @login-ok="fncLogin" @dlg-close="dlgLogin = false" />
  </v-dialog>
  <!-- 医師登録 -->
  <v-dialog v-model="dlgDoc" width="auto">
    <register-doctor :list="doctors" @dlg-close="dlgDoc = false" />
  </v-dialog>
  <!-- 看護師登録 -->
  <v-dialog v-model="dlgNur" width="auto">
    <register-nurse @dlg-close="dlgNur = false" />
  </v-dialog>
  <!-- 患者登録 -->
  <v-dialog v-model="dlgPat" width="auto">
    <register-patient @dlg-close="dlgPat = false" />
  </v-dialog>

  <v-app-bar elevation="3">
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    <v-app-bar-title>{{ store.id === '' ? 'ログインしてください' : store.name }}</v-app-bar-title>
    <v-spacer />
    <div>
      <v-btn
        color="primary"
        icon="fa-solid fa-file-import"
        elevation="2"
        class="mr-3"
        @click="dialog = true"
      />
      <v-dialog v-model="dialog" width="auto">
        <v-card>
          <v-card-text>データをインポートします。</v-card-text>
          <v-card-actions>
            <v-btn color="update" elevation="2" @click="impDoctors">医師データ</v-btn>
            <v-btn color="update" elevation="2" @click="impNurses">看護師データ</v-btn>
            <v-btn color="update" elevation="2" @click="impPatients">患者データ</v-btn>
            <v-btn color="update" elevation="2" @click="impInpatients">入院患者データ</v-btn>
            <v-btn elevation="2" @click="dialog = false">閉じる</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <!-- 医師登録 -->
    <v-btn
      v-show="store.id"
      color="primary"
      icon="fa-solid fa-user-doctor"
      elevation="2"
      class="mr-3"
      @click="dlgDoc = true"
    ></v-btn>
    <!-- 看護師登録 -->
    <v-btn
      v-show="store.id"
      color="primary"
      icon="fa-solid fa-user-nurse"
      elevation="2"
      class="mr-3"
      @click="dlgNur = true"
    ></v-btn>
    <!-- 患者登録 -->
    <v-btn
      v-show="store.id"
      color="primary"
      icon="fa-solid fa-hospital-user"
      elevation="2"
      class="mr-3"
      @click="dlgPat = true"
    ></v-btn>
    <!-- ログイン -->
    <v-btn
      v-show="!store.id"
      prepend-icon="fa-solid fa-right-to-bracket"
      round="lg"
      class="bg-primary"
      style="text-transform: none"
      @click="dlgLogin = true"
      >Login</v-btn
    >
    <v-btn
      v-show="store.id"
      prepend-icon="fa-solid fa-right-from-bracket"
      round="lg"
      class="bg-back"
      style="text-transform: none"
      @click="fncLogout"
      >Logout</v-btn
    >
  </v-app-bar>
</template>

<script>
import { firebaseDb } from '@/plugins/firebase'
import { collection, doc, setDoc } from 'firebase/firestore'
import jsonDoctors from '@/assets/doctors.json'
import jsonNurses from '@/assets/nurses.json'
import jsonPatients from '@/assets/patients.json'
import jsonInPatientStatus from '@/assets/inpatientStatus.json'

import Login from './Login.vue'
import RegisterDoctor from './RegisterDoctor.vue'
import RegisterNurse from './RegisterNurse.vue'
import RegisterPatient from './RegisterPatient.vue'

import { useUserStore } from '@/stores/user'

export default {
  setup() {
    const store = useUserStore()
    return {
      store
    }
  },
  components: {
    Login,
    RegisterDoctor,
    RegisterNurse,
    RegisterPatient
  },
  data: () => ({
    drawer: true,
    dialog: false,
    dlgLogin: false,
    dlgDoc: false,
    dlgNur: false,
    dlgPat: false
  }),
  methods: {
    fncLogin() {
      this.dlgLogin = false
      this.$router.push({
        name: 'Byoto',
        params: { byotoId: this.store.byoto }
      })
    },
    fncLogout() {
      this.store.$reset()
      this.$router.push('/')
    },
    // 看護師データImport
    impNurses() {
      const docRef = collection(firebaseDb, 'nurses')
      jsonNurses.forEach((nurse) => {
        this.setNurse(docRef, nurse)
      })
    },
    async setNurse(docRef, nurse) {
      await setDoc(doc(docRef, nurse.loginid), {
        tanto: nurse.tanto,
        name: nurse.name,
        medical: nurse.medical,
        byoto: nurse.byoto
      })
    },
    // 患者データImport
    impPatients() {
      const docRef = collection(firebaseDb, 'patients')
      let ix = 0
      jsonPatients.forEach((patient) => {
        ++ix
        const id = 'p' + ('000' + ix).slice(-4)
        this.setPatient(docRef, patient, id)
      })
    },
    async setPatient(docRef, patient, id) {
      await setDoc(doc(docRef, id), {
        name: patient.name,
        gender: patient.gender,
        birthday: patient.birthday,
        tel: patient.tel,
        blood: patient.blood,
        medical: patient.medical,
        nyuinFrom: patient.nyuinFrom,
        nyuinTo: patient.nyuinTo,
        roomNo: patient.roomNo,
        byoto: patient.byoto
      })
    },
    // 医師データImport
    impDoctors() {
      const docRef = collection(firebaseDb, 'doctors')
      jsonDoctors.forEach((doctor) => {
        this.setDoctor(docRef, doctor)
      })
    },
    async setDoctor(docRef, doctor) {
      await setDoc(doc(docRef, doctor.id), {
        name: doctor.name,
        medical: doctor.medical,
        yobi: doctor.yobi
      })
    },
    // 入院患者データImport
    impInpatients() {
      const docRef = collection(firebaseDb, 'inpatientStatus')
      jsonInPatientStatus.forEach((inpatient) => {
        this.setInpatients(docRef, inpatient)
      })
    },
    async setInpatients(docRef, inpatient) {
      await setDoc(doc(docRef, inpatient.id), {
        patientId: inpatient.patientid,
        date: inpatient.date,
        tempMo: inpatient.tempMo,
        tempEv: inpatient.tempEv,
        bloodPresureMoH: inpatient.bloodPresureMoH,
        bloodPresureMoL: inpatient.bloodPresureMoL,
        bloodPresureEvH: inpatient.bloodPresureEvH,
        bloodPresureEvL: inpatient.bloodPresureEvL,
        pulseRateMo: inpatient.pulseRateMo,
        pulseRateEv: inpatient.pulseRateEv,
        oxygenMo: inpatient.oxygenMo,
        oxygenEv: inpatient.oxygenEv,
        mealMo: inpatient.mealMo,
        mealAf: inpatient.mealAf,
        mealEv: inpatient.mealEv
      })
    }
  }
}
</script>
