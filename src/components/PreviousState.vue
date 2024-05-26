<template>
  <v-row>
    <v-col cols="5">
      <CardChart
        v-show="patientId"
        :prLabel="tempMoLabel"
        :prLabels="chartLabels"
        :prData="tempMoData"
        :prAnnotation="tempAnno"
        :prKey="prevKey[0]"
      />
    </v-col>
    <v-col cols="5">
      <CardChart
        v-show="patientId"
        :prLabel="tempEvLabel"
        :prLabels="chartLabels"
        :prData="tempEvData"
        :prAnnotation="tempAnno"
        :prKey="prevKey[1]"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="5">
      <CardChartMultiple
        v-show="patientId"
        :prLabel1="bloodPresureMoHLabel"
        :prLabel2="bloodPresureMoLLabel"
        :prLabels="chartLabels"
        :prData1="bloodPresureMoHData"
        :prData2="bloodPresureMoLData"
        :prKey="prevKey[2]"
      />
    </v-col>
    <v-col cols="5">
      <CardChartMultiple
        v-show="patientId"
        :prLabel1="bloodPresureEvHLabel"
        :prLabel2="bloodPresureEvLLabel"
        :prLabels="chartLabels"
        :prData1="bloodPresureEvHData"
        :prData2="bloodPresureEvLData"
        :prKey="prevKey[3]"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="5">
      <CardChart
        v-show="patientId"
        :prLabel="pulseRateMoLabel"
        :prLabels="chartLabels"
        :prData="pulseRateMoData"
        :prAnnotation="pulseRateAnno"
        :prKey="prevKey[4]"
      />
    </v-col>
    <v-col cols="5">
      <CardChart
        v-show="patientId"
        :prLabel="pulseRateEvLabel"
        :prLabels="chartLabels"
        :prData="pulseRateEvData"
        :prAnnotation="pulseRateAnno"
        :prKey="prevKey[4]"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="5">
      <CardChart
        v-show="patientId"
        :prLabel="oxygenMoLabel"
        :prLabels="chartLabels"
        :prData="oxygenMoData"
        :prAnnotation="oxygenAnno"
        :prKey="prevKey[5]"
      />
    </v-col>
    <v-col cols="5">
      <CardChart
        v-show="patientId"
        :prLabel="oxygenEvLabel"
        :prLabels="chartLabels"
        :prData="oxygenEvData"
        :prAnnotation="oxygenAnno"
        :prKey="prevKey[6]"
      />
    </v-col>
  </v-row>
</template>

<script>
import CardChart from './cardChart.vue'
import CardChartMultiple from './cardChartMultiple.vue'

import { firebaseDb } from '@/plugins/firebase'
import { collection, query, getDocs, where } from 'firebase/firestore'

export default {
  components: {
    CardChart,
    CardChartMultiple
  },
  data: () => ({
    tempMoLabel: '体温(朝)',
    tempEvLabel: '体温(夕)',
    bloodPresureMoHLabel: '血圧-高(朝)',
    bloodPresureMoLLabel: '血圧-低(朝)',
    bloodPresureEvHLabel: '血圧-高(夕)',
    bloodPresureEvLLabel: '血圧-低(夕)',
    pulseRateMoLabel: '脈拍(朝)',
    pulseRateEvLabel: '脈拍(夕)',
    oxygenMoLabel: '酸素濃度(朝)',
    oxygenEvLabel: '酸素濃度(夕)',
    tempAnno: { yMin: 36, yMax: 37 },
    pulseRateAnno: { yMin: 60, yMax: 100 },
    oxygenAnno: { yMin: 96, yMax: 99 },
    tempMoData: [],
    tempEvData: [],
    bloodPresureMoHData: [],
    bloodPresureMoLData: [],
    bloodPresureEvHData: [],
    bloodPresureEvLData: [],
    pulseRateMoData: [],
    pulseRateEvData: [],
    oxygenMoData: [],
    oxygenEvData: [],
    chartLabels: [],
    prevKey: ['0', '1', '2', '3', '4', '5', '6']
  }),
  props: {
    patientId: {
      type: String
    }
  },
  watch: {
    patientId: function (newVal) {
      this.getPreviosData(newVal)
    }
  },
  methods: {
    async getPreviosData(id) {
      // 1か月前の日付
      const dt = new Date()
      const month = dt.getMonth() + 1
      dt.setMonth(month - 2)
      const prevDate = dt.toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
      const q = query(
        collection(firebaseDb, 'inpatientStatus'),
        where('patientId', '==', id),
        where('date', '>=', prevDate)
      )
      const querySnapshot = await getDocs(q)
      this.chartLabels = []
      this.tempMoData = []
      this.tempEvData = []
      this.bloodPresureMoHData = []
      this.bloodPresureMoLData = []
      this.bloodPresureEvHData = []
      this.bloodPresureEvLData = []
      this.pulseRateMoData = []
      this.pulseRateEvData = []
      this.oxygenMoData = []
      this.oxygenEvData = []
      let oldKey = ''
      let newKey = ''
      querySnapshot.forEach((doc) => {
        newKey = doc.data().date.substring(5, 7)
        if (oldKey != newKey) {
          this.chartLabels.push(doc.data().date.substring(5))
          oldKey = newKey
        } else {
          this.chartLabels.push(doc.data().date.substring(8))
        }
        this.tempMoData.push(doc.data().tempMo)
        this.tempEvData.push(doc.data().tempEv)
        this.bloodPresureMoHData.push(doc.data().bloodPresureMoH)
        this.bloodPresureMoLData.push(doc.data().bloodPresureMoL)
        this.bloodPresureEvHData.push(doc.data().bloodPresureEvH)
        this.bloodPresureEvLData.push(doc.data().bloodPresureEvL)
        this.pulseRateMoData.push(doc.data().pulseRateMo)
        this.pulseRateEvData.push(doc.data().pulseRateEv)
        this.oxygenMoData.push(doc.data().oxygenMo)
        this.oxygenEvData.push(doc.data().oxygenEv)
      })
      this.prevKey = []
      for (let ix = 0; ix < 8; ix++) {
        this.prevKey.push(id + ix)
      }
    }
  }
}
</script>
