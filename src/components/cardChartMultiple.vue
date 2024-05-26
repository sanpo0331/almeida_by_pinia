<template>
  <Line :data="chartData" :options="options" :key="prKey" />
</template>

<script>
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale)

export default {
  props: {
    prLabel1: {
      type: String,
      default: ''
    },
    prLabel2: {
      type: String,
      default: ''
    },
    prLabels: {
      type: Array,
      default: () => []
    },
    prData1: {
      type: Array,
      default: () => []
    },
    prData2: {
      type: Array,
      default: () => []
    },
    prKey: {
      type: String
    }
  },
  components: {
    Line
  },
  watch: {
    prData1: function (newVal) {
      this.chartData.datasets[0].data = [...newVal]
      this.chartData.labels = [...this.prLabels]
      this.chartData.datasets[0].label = this.prLabel1
      this.chartData.datasets[1].label = this.prLabel2
      // console.log("prData:", newVal);
    },
    prData2: function (newVal) {
      this.chartData.datasets[1].data = [...newVal]
    }
  },
  data: () => ({
    chartData: {
      labels: [],
      datasets: [
        {
          label: '',
          data: [],
          fill: false,
          borderColor: '#039BE5',
          tension: 0.1
        },
        {
          label: '',
          data: [],
          fill: false,
          borderColor: '#E53935',
          tension: 0.1
        }
      ]
    },
    options: {
      responsive: true
    }
  })
}
</script>
