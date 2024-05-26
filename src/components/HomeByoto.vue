<template>
  <v-table density="compact">
    <thead>
      <tr class="bg-primary">
        <th rowspan="2"></th>
        <th rowspan="2">ID</th>
        <th rowspan="2">名前</th>
        <th rowspan="2">性別</th>
        <th rowspan="2">年齢</th>
        <th rowspan="2">病室</th>
        <th colspan="2">体温</th>
        <th colspan="2">血圧</th>
        <th colspan="2">脈拍</th>
        <th colspan="2">酸素濃度</th>
        <th colspan="3">食事</th>
      </tr>
      <tr class="bg-secondary">
        <th>朝</th>
        <th>夕</th>
        <th>朝</th>
        <th>夕</th>
        <th>朝</th>
        <th>夕</th>
        <th>朝</th>
        <th>夕</th>
        <th>朝</th>
        <th>昼</th>
        <th>夕</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, ix) in list" :key="ix">
        <td>
          <v-btn
            flat
            density="compact"
            color="update"
            rounded="xl"
            class="mr-3"
            @click="fncDlgOpen(ix)"
            >登録</v-btn
          >
          <v-btn flat density="compact" color="update" rounded="xl" @click="selectId = item.id"
            >過去データ</v-btn
          >
        </td>
        <td>{{ item.id }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.gender }}</td>
        <td>{{ item.age }}</td>
        <td>{{ item.roomNo }}</td>
        <td>
          <v-badge v-if="checkValue(item.tempMo, 'tempMo')" dot inline color="error" />{{
            item.tempMo
          }}
        </td>
        <td>
          <v-badge v-if="checkValue(item.tempEv, 'tempEv')" dot inline color="error" />{{
            item.tempEv
          }}
        </td>
        <td>
          <v-badge
            v-if="checkValue(item.bloodPresureMoH, 'bloodPresureMoH')"
            dot
            inline
            color="error"
          />{{ item.bloodPresureMoH }}-<v-badge
            v-if="checkValue(item.bloodPresureMoL, 'bloodPresureMoL')"
            dot
            inline
            color="error"
          />{{ item.bloodPresureMoL }}
        </td>
        <td>
          <v-badge
            v-if="checkValue(item.bloodPresureEvH, 'bloodPresureEvH')"
            dot
            inline
            color="error"
          />{{ item.bloodPresureEvH }}-<v-badge
            v-if="checkValue(item.bloodPresureEvL, 'bloodPresureEvL')"
            dot
            inline
            color="error"
          />{{ item.bloodPresureEvL }}
        </td>
        <td>
          <v-badge v-if="checkValue(item.pulseRateMo, 'pulseRateMo')" dot inline color="error" />{{
            item.pulseRateMo
          }}
        </td>
        <td>
          <v-badge v-if="checkValue(item.pulseRateEv, 'pulseRateEv')" dot inline color="error" />{{
            item.pulseRateEv
          }}
        </td>
        <td>
          <v-badge v-if="checkValue(item.oxygenMo, 'oxygenMo')" dot inline color="error" />{{
            item.oxygenMo
          }}
        </td>
        <td>
          <v-badge v-if="checkValue(item.oxygenEv, 'oxygenEv')" dot inline color="error" />{{
            item.oxygenEv
          }}
        </td>
        <td>{{ item.mealMo }}</td>
        <td>{{ item.mealAf }}</td>
        <td>{{ item.mealEv }}</td>
      </tr>
    </tbody>
  </v-table>
  <previous-state :patientId="selectId" />
  <v-dialog v-model="dlgOpen" width="700px">
    <register-inpatient-status :patient="selectData" @dlg-close="fncDlgClose" />
  </v-dialog>
</template>

<script>
import RegisterInpatientStatus from './RegisterInpatientStatus.vue'
import PreviousState from './PreviousState.vue'

import { firebaseDb } from '@/plugins/firebase'
import { collection, query, getDocs, where } from 'firebase/firestore'

export default {
  components: { RegisterInpatientStatus, PreviousState },
  data: () => ({
    dlgOpen: false,
    selectId: '',
    byoto: '',
    list: [],
    todayList: [],
    prevList: [],
    chartLabels: [],
    selectData: ''
  }),
  created: function () {
    this.byoto = this.$route.params.byotoId
    let instance = new Promise(this.getData)
    instance = instance.then(this.addList)
    console.log('todayList:', this.todayList)
    console.log('list:', this.list)
    console.log('instance:', instance)
  },
  methods: {
    async getData(resolve) {
      const today = new Date().toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
      this.list = []
      const q1 = query(collection(firebaseDb, 'patients'), where('byoto', '==', this.byoto))
      const q2 = query(collection(firebaseDb, 'inpatientStatus'), where('date', '==', today))
      // 患者の基本情報
      const querySnapshot1 = await getDocs(q1)
      querySnapshot1.forEach((doc) => {
        this.list.push({
          id: doc.id,
          name: doc.data().name,
          gender: doc.data().gender == 'm' ? '男' : '女',
          age: this.getAge(doc.data().birthday),
          nyuinFrom: doc.data().nyuinFrom,
          nyuinTo: doc.data().nyuinTo,
          roomNo: doc.data().roomNo
        })
      })
      // 患者の今日の状態
      const querySnapshot2 = await getDocs(q2)
      querySnapshot2.forEach((doc) => {
        this.todayList.push({
          id: doc.id,
          patientId: doc.id.substring(0, 5),
          tempMo: doc.data().tempMo,
          tempEv: doc.data().tempEv,
          bloodPresureMoH: doc.data().bloodPresureMoH,
          bloodPresureMoL: doc.data().bloodPresureMoL,
          bloodPresureEvH: doc.data().bloodPresureEvH,
          bloodPresureEvL: doc.data().bloodPresureEvL,
          pulseRateMo: doc.data().pulseRateMo,
          pulseRateEv: doc.data().pulseRateEv,
          oxygenMo: doc.data().oxygenMo,
          oxygenEv: doc.data().oxygenEv,
          mealMo: doc.data().mealMo,
          mealAf: doc.data().mealAf,
          mealEv: doc.data().mealEv
        })
      })
      resolve('ok')
    },
    addList() {
      this.list.forEach((item) => {
        const result = this.todayList.find((element) => element.patientId == item.id)
        if (result == undefined) {
          item.tempMo = ''
          item.tempEv = ''
          item.bloodPresureMoH = ''
          item.bloodPresureMoL = ''
          item.bloodPresureEvH = ''
          item.bloodPresureEvL = ''
          item.pulseRateMo = ''
          item.pulseRateEv = ''
          item.oxygenMo = ''
          item.oxygenEv = ''
          item.mealMo = ''
          item.mealAf = ''
          item.mealEv = ''
        } else {
          item.tempMo = result.tempMo
          item.tempEv = result.tempEv
          item.bloodPresureMoH = result.bloodPresureMoH
          item.bloodPresureMoL = result.bloodPresureMoL
          item.bloodPresureEvH = result.bloodPresureEvH
          item.bloodPresureEvL = result.bloodPresureEvL
          item.pulseRateMo = result.pulseRateMo
          item.pulseRateEv = result.pulseRateEv
          item.oxygenMo = result.oxygenMo
          item.oxygenEv = result.oxygenEv
          item.mealMo = result.mealMo
          item.mealAf = result.mealAf
          item.mealEv = result.mealEv
        }
      })
    },
    getAge(bd) {
      const y = bd.substring(0, 4)
      const m = bd.substring(4, 6) - 1
      const d = bd.substring(6, 8)
      const today = new Date()
      const thisBd = new Date(today.getFullYear(), m, d)
      let age = today.getFullYear() - y

      if (today < thisBd) {
        age--
      }
      return age
    },
    checkValue(val, kind) {
      // 血圧(H) : 135~:NG  134~116:wa  115~100:OK 100~:NG
      // 血圧(L) : 85~:NG   84~76:wa    75~60:OK   59~:NG

      if (!val) return false
      if (kind.indexOf('temp') !== -1) {
        return val >= 36 || val <= 37 ? false : true
      }
      if (kind.indexOf('bloodPresure') !== -1) {
        if (kind.endsWith('H')) {
          if (val >= 135) return true
          else if (val <= 134 && val >= 116) return true
          else if (val <= 115 && val >= 100) return false
          else return false
        }
        if (kind.endsWith('L')) {
          if (val > 85) return true
          else if (val <= 85 && val >= 75) return true
          else if (val <= 76 && val >= 60) return false
          else return true
        }
      }
      if (kind.indexOf('pulseRate') !== -1) {
        return val >= 60 && val <= 100 ? false : true
      }
      if (kind.indexOf('oxygen') !== -1) {
        return val >= 96 && val <= 99 ? false : true
      }
    },
    fncDlgOpen(ix) {
      this.selectData = this.list[ix]
      this.dlgOpen = true
    },
    fncDlgClose() {
      this.dlgOpen = false
      this.$emit('key-update')
    }
  }
}
</script>
