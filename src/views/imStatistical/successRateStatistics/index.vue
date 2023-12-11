<template>
  <main class="flex flex-col h-screen pr-2" ref="statisticsMain">
    <article class="grid gap-2 grid-cols-4">
      <section v-for="(item, index) in carList" :key="index" class="flex gap-x-6 bg-white p-5 pr-2.5 rounded-xl shadow-md" @click="handleCard(item)">
        <section class="flex-1 flex flex-col justify-between overflow-hidden">
          <div class="flex items-center text-base font-bold">
            <ms-tooltip :tooltip="item.description" popper-class="filledPopper" :append-to="statisticsMain">
              <ms-icon icon="QuestionFilled" class="mr-3"></ms-icon>
            </ms-tooltip>
            {{ item.name }}
          </div>
          <article class="flex">
            <div class="text-3xl" :style="{ color: item.sizeColor }">{{ item.sum }}</div>
          </article>
        </section>
      </section>
    </article>
    <article class="flex-1 flex flex-col w-full mt-2.5 bg-white rounded-xl overflow-hidden min-h-[400px]">
      <section class="flex justify-between p-5">
        <article class="flex items-center">
          <div class="mr-2.5 w-1 h-4 bg-[--ms-color] rounded-lg"></div>
          <p class="font-bold">{{ getI18nValue('successRateStatisticsMsg.historicalDataStatistics') }}</p>
        </article>
        <article class="flex items-center gap-2.5">
          <el-date-picker
            @change="setPushImCount"
            v-model="datepicker"
            type="daterange"
            :start-placeholder="getI18nValue('form.startDate')"
            :end-placeholder="getI18nValue('form.endDate')"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :disabled-date="disabledDateEnd"
          />
          <el-divider direction="vertical" class="h-full" />
          <p>{{ getI18nValue('successRateStatisticsMsg.percentage') }}</p>
          <el-select v-model="dividendSelected">
            <el-option v-for="item in dataOptions.dividendOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <p class="text-lg">÷</p>
          <el-select v-model="divisorSelected">
            <el-option v-for="item in dataOptions.divisorOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <ms-button type="primary" @click="exportClick">
            <div class="flex items-center">
              <img :src="exportImg" alt="" />
              <p class="ml-2">{{ getI18nValue('btn.derivedData') }}</p>
            </div>
          </ms-button>
        </article>
      </section>
      <section class="flex justify-between px-5">
        <article class="flex items-center">
          <p class="font-bold">
            <span>[{{ getI18nValue(`successRateStatisticsMsg.${dividendSelected}`) }}]</span>
            <span> {{ getI18nValue('successRateStatisticsMsg.accountedFor') }} </span>
            <span>[{{ getI18nValue(`successRateStatisticsMsg.${divisorSelected}`) }}]:</span>
          </p>
        </article>
        <article class="flex items-center">
          <p class="text-[#9A9A9A]">
            {{ getI18nValue('successRateStatisticsMsg.cannotBeSelected') }}
            <span v-if="getPushStatisticalInfo.filterData.length > 0" class="text-red-500"
              >( {{ getI18nValue('successRateStatisticsMsg.filteredData') }} : {{ getPushStatisticalInfo.filterData.join(',') }})</span
            >
          </p>
        </article>
      </section>
      <div class="grid grid-cols-3 gap-y-2 gap-x-5 w-fit px-5 ml-auto h-6 items-center">
        <span v-for="(item, index) in getPushStatisticalInfo.showData" :key="index">{{ item.name }} : {{ item.percentage }}%</span>
      </div>
      <el-divider class="!my-2.5" />
      <section class="flex-1">
        <ColumnEcharts :echarts-data="echartsData"></ColumnEcharts>
      </section>
    </article>
  </main>
</template>
<script setup lang="ts">
import type { PushImCountType } from '@/apis/imStatistical/successRateStatistics/type'
import type { CarListType, DividendSelectedType, DivisorSelectedType } from './'
import type { EchartsDataType } from '../components/index'

import { dividendOptions, divisorOptions, echartsInfo } from './'
import { getI18nValue } from '@/utils/i18n'
import { getLastDayPushImCountCount, pushImCount } from '@/apis/imStatistical/successRateStatistics'
import dayjs from 'dayjs'
import exportImg from '@/assets/statistical/export.png'
import ColumnEcharts from '@/views/imStatistical/components/columnEcharts.vue'

const statisticsMain = ref<HTMLDivElement>()

const echartsTitle = ref(getI18nValue('groupStatistics.activeGroups'))

const echartsData = ref({} as EchartsDataType)

// 推送统计
const pushStatisticalList = ref<PushImCountType[]>([])

// 选中的被除数
const dividendSelected = ref<DividendSelectedType>('sendSuccessCount')

// 选中的除数
const divisorSelected = ref<DivisorSelectedType>('sendTotalCount')

const carList = ref<CarListType[]>([
  {
    name: getI18nValue('successRateStatisticsMsg.dailyPushVolume'),
    description: getI18nValue('successRateStatisticsMsg.dailyPushVolumeDescription'),
    sum: '--',
    sizeColor: '#4E84FF'
  },
  {
    name: getI18nValue('successRateStatisticsMsg.successfulDailyPushVolume'),
    description: getI18nValue('successRateStatisticsMsg.successfulDailyPushVolumeDescription'),
    sum: '--',
    sizeColor: '#00C212'
  },
  {
    name: getI18nValue('successRateStatisticsMsg.failedDailyPushVolume'),
    description: getI18nValue('successRateStatisticsMsg.failedDailyPushVolumeDescription'),
    sum: '--',
    sizeColor: '#E5004F'
  },
  // {
  //   name: getI18nValue('successRateStatisticsMsg.dailyPushArrivals'),
  //   description: getI18nValue('successRateStatisticsMsg.dailyPushArrivalsDescription'),
  //   sum: 0,
  //   sizeColor: '#1D5EF3'
  // },

  {
    name: getI18nValue('successRateStatisticsMsg.dailyPushClicks'),
    description: getI18nValue('successRateStatisticsMsg.dailyPushClicksDescription'),
    sum: '--',
    sizeColor: '#E206EA'
  }
])

const datepicker = ref<any>([dayjs().subtract(8, 'day').format('YYYY-MM-DD'), dayjs().subtract(1, 'day').format('YYYY-MM-DD')])

// 大于等于今天的日期不可选
const disabledDateEnd = (time: any) => {
  const startTime = Date.now() - 24 * 3600 * 1000
  const endTime = time.getTime()
  return endTime > startTime
}

// 被除数 和 除数 不要相同的（没有意义）
const dataOptions = computed(() => {
  return {
    dividendOptions: dividendOptions.filter(item => item.value !== divisorSelected.value),
    divisorOptions: divisorOptions.filter(item => item.value !== dividendSelected.value)
  }
})

//  操作后的推送统计数据
const getPushStatisticalInfo = computed(() => {
  const filterPushStatistical = [] // 百分比 大于 100 的数据
  const showPushStatistical = [] //  百分比 小于等于 100 的数据

  for (let i = 0; i < pushStatisticalList.value.length; i++) {
    const item = pushStatisticalList.value[i]
    const percentage = +item[dividendSelected.value] / +item[divisorSelected.value]

    // 过滤 百分比大于100%(也就是1)的数据
    if (!percentage || typeof percentage !== 'number' || percentage > 1) {
      filterPushStatistical.push(item.manufacturer)
    } else {
      showPushStatistical.push({
        name: item.manufacturer,
        percentage: (+percentage * 100).toFixed(2)
      })
    }
  }
  return {
    filterData: filterPushStatistical,
    showData: showPushStatistical
  }
})

// 卡片 点击事件
function handleCard(row: any) {
  echartsTitle.value = row.name
}

// 导出数据
function exportClick() {
  console.log('导出数据')
}

// 设置  推送统计 数据
async function setPushImCount() {
  const [startTime, endTime] = datepicker.value
  const result = await pushImCount({
    startTime,
    endTime
  }).send()

  const data: PushImCountType[] = [
    {
      sendClickCount: '50',
      sendFailCount: '70',
      sendSuccessCount: '30',
      sendTotalCount: '150',
      manufacturer: '苹果'
    },
    {
      sendClickCount: '50',
      sendFailCount: '70',
      sendSuccessCount: '30',
      sendTotalCount: '150',
      manufacturer: '小米'
    },
    {
      sendClickCount: '50',
      sendFailCount: '70',
      sendSuccessCount: '30',
      sendTotalCount: '150',
      manufacturer: '华为'
    }
  ]

  pushStatisticalList.value = data
  setEchartsData()
}

// 设置 echarts 数据
function setEchartsData() {
  clearInfo()
  pushStatisticalList.value.forEach(item => {
    echartsInfo.xAxisData.push(item.manufacturer)
    echartsInfo.seriesData[0].data.push(+item.sendClickCount)
    echartsInfo.seriesData[1].data.push(+item.sendSuccessCount)
    echartsInfo.seriesData[2].data.push(+item.sendFailCount)
    echartsInfo.seriesData[3].data.push(+item.sendTotalCount)
  })
  echartsData.value = echartsInfo
}

function clearInfo() {
  echartsInfo.xAxisData = []
  for (const seriesInfo of echartsInfo.seriesData) {
    seriesInfo.data = []
  }
}

// 设置单日推送数据统计
async function setLastDayPushImCount() {
  const { data } = await getLastDayPushImCountCount().send()
  const { sendTotalCount, sendSuccessCount, sendFailCount, sendClickCount } = data
  carList.value[0].sum = sendTotalCount
  carList.value[1].sum = sendSuccessCount
  carList.value[2].sum = sendFailCount
  carList.value[3].sum = sendClickCount
}

onMounted(async () => {
  setLastDayPushImCount()
  setPushImCount()
  // 测试数据
})
</script>
<style lang="scss" scoped>
:deep(.filledPopper) {
  max-width: 20% !important;
}
</style>
