<template>
  <div class="h-full w-full" ref="myECharts" style="background-color: #ffffff"></div>
</template>
<script setup lang="ts">
import * as echarts from 'echarts'
import { EchartsDataType } from './index'

const props = defineProps<{
  echartsData: EchartsDataType
}>()
const myECharts = ref()

const init = () => {
  const { xAxisData, seriesData } = props.echartsData
  // 图表对象
  let myChart = echarts.getInstanceByDom(myECharts.value!)
  if (myChart == null) {
    myChart = echarts.init(myECharts.value!)
  }
  var option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    legend: {
      icon: 'roundRect',
      right: '10%',
      top: '1%'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: xAxisData
      }
    ],
    yAxis: [
      {
        type: 'value'
      },
      {
        type: 'value'
      }
    ],
    // 柱子 一个{}为每个集合里有1个柱子
    series: seriesData
  }

  // 使用刚指定的配置项和数据显示图表。
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
    init()
  }
)

onMounted(() => {
  init()
})
</script>

<style lang="less" scoped></style>
