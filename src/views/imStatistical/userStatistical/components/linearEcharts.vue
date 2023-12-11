<template>
  <div class="h-full w-full" ref="myECharts" style="background-color: #ffffff"></div>
</template>
<script setup lang="ts">
import * as echarts from 'echarts'
import { echartsPropsType } from './index'

const props = defineProps<{
  echartsData: echartsPropsType
}>()

const myECharts = ref()
// 遍历需要的数组数据
const linesData = ref<any[]>([])
// legend 数据

function setLinesData() {
  linesData.value = []
  props.echartsData.linesData.forEach((item: any) => {
    let arr = {
      data: item.data,
      type: 'line',
      name: item.name,
      smooth: true,
      showSymbol: false,
      symbol: 'circle',
      symbolSize: 8,
      itemStyle: {
        color: item.color
      },
      lineStyle: {
        width: 2
      }
    }
    linesData.value.push(arr)
  })
}

const init = () => {
  // 图表对象
  let myChart = echarts.getInstanceByDom(myECharts.value!)
  if (myChart == null) {
    myChart = echarts.init(myECharts.value!)
  }
  let option = {
    grid: {
      left: '2%',
      right: '6%',
      bottom: '4%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        lineStyle: {
          color: '#ddd'
        }
      },
      backgroundColor: 'rgba(255,255,255,1)',
      padding: [5, 10],
      extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
    },

    xAxis: {
      type: 'category',
      data: props.echartsData.xAxisData,
      boundaryGap: false,
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: '#656D92'
        }
      },
      axisLabel: {
        margin: 20,
        fontSize: 14
      }
    },
    yAxis: {
      type: 'value',
      axisTick: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: '#656D92'
        }
      },
      axisLabel: {
        margin: 20,
        fontSize: 14
      }
    },

    series: linesData.value
  }

  myChart.setOption(option, true)
  addEventListener('resize', () => {
    myChart!.resize()
  })
  setTimeout(() => {
    myChart!.resize()
  })
}

watch(
  () => props.echartsData,
  () => {
    setLinesData()
    init()
  }
)
</script>

<style lang="less" scoped></style>
