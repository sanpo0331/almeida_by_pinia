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
import annotationPlugin from 'chartjs-plugin-annotation'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  annotationPlugin
)

export default {
  props: {
    prLabel: {
      type: String,
      default: null
    },
    prLabels: {
      type: Array,
      default: () => []
    },
    prData: {
      type: Array,
      default: () => []
    },
    prAnnotation: {
      type: Object,
      default: () => {}
    },
    prKey: {
      type: String
    }
  },
  components: {
    Line
  },
  watch: {
    prData: function (newVal) {
      this.chartData.datasets[0].data = [...newVal]
      this.chartData.datasets[0].label = this.prLabel
      this.chartData.labels = [...this.prLabels]
      this.options.plugins.annotation.annotations.box1.yMin = this.prAnnotation.yMin
      this.options.plugins.annotation.annotations.box1.yMax = this.prAnnotation.yMax
      // console.log('prData:', newVal)
    },
    prAnnotation: function (newVal) {}
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
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        annotation: {
          annotations: {
            box1: {
              type: 'box',
              xMin: 0,
              xMax: 31,
              yMin: 0,
              yMax: 0,
              backgroundColor: 'rgba(255,213,79,0.25)',
              borderWidth: 0
            }
          }
        }
      }
    }
  })
}
</script>
