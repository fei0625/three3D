<template>
  <main class="h-screen flex flex-col pr-2" ref="statisticsMain">
    <article class="grid gap-2 grid-cols-4">
      <section
        v-for="(item, index) in carList"
        :key="index"
        class="bg-white p-5 pr-2.5 rounded-xl shadow-md flex gap-x-6 cursor-pointer"
        :class="activeCard === item.id ? 'border border-[--ms-color]' : ''"
        @click="cardTypeClick(item)"
      >
        <section class="flex items-center">
          <img :src="item.imgUrl" alt="" class="w-16 h-16 object-contain" />
        </section>
        <section class="flex-1 flex flex-col justify-between overflow-hidden">
          <div class="text-xs font-bold flex items-center">
            <ms-tooltip :tooltip="item.description" popper-class="filledPopper" :append-to="statisticsMain">
              <ms-icon icon="QuestionFilled" class="mr-3"></ms-icon>
            </ms-tooltip>
            {{ item.name }}
          </div>
          <article class="flex items-center justify-between gap-x-2">
            <div class="text-sm whitespace-nowrap">{{ getI18nValue('userStatisticalMsg.yesterday') }}</div>
            <ms-tooltip :tooltip="item.sum.toString()">
              <div class="text-3xl font-semibold truncate" :style="{ color: item.sizeColor }">{{ item.sum }}</div>
            </ms-tooltip>
          </article>
        </section>
      </section>
    </article>
    <article class="w-full mt-2.5 bg-white rounded-xl flex-1 flex flex-col overflow-hidden min-h-[400px]">
      <section class="flex justify-between p-5">
        <article class="flex items-center">
          <div class="mr-2.5 w-1 h-4 bg-[--ms-color] rounded-lg"></div>
          <p class="font-bold">{{ echartsTitle }}</p>
        </article>
        <article class="flex items-center gap-2.5">
          <p>{{ getI18nValue('userStatisticalMsg.dataComparison') }}</p>
          <el-select v-model="querySelect" placeholder="" @change="setImGroupCount">
            <template v-for="item in dataOptions" :key="item.value">
              <el-option v-if="activeCard != item.value" :label="item.label" :value="item.value" />
            </template>
          </el-select>
          <el-divider direction="vertical" class="h-full" />
          <el-date-picker
            @change="setImGroupCount"
            v-model="datepicker"
            type="daterange"
            :start-placeholder="getI18nValue('form.startDate')"
            :end-placeholder="getI18nValue('form.endDate')"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :disabled-date="disabledDateEnd"
          />
          <ms-button type="primary" @click="exportClick">
            <div class="flex items-center">
              <img :src="exportImg" alt="" />
              <p class="ml-2">{{ getI18nValue('btn.derivedData') }}</p>
            </div>
          </ms-button>
        </article>
      </section>
      <el-divider class="!my-2.5" />
      <section class="px-5 mb-2.5 flex">
        <section v-for="(item, index) in echartsLegend" :key="index" class="flex ml-16 mt-3 gap-x-2 items-center">
          <div class="w-3 h-3 rounded-full" :style="`background-color:${item.color}`"></div>
          <div>{{ item.title }}</div>
        </section>
      </section>
      <section class="flex-1" v-loading="echartsLoading">
        <LineEcharts :echarts-data="echartsData"></LineEcharts>
      </section>
    </article>
  </main>
</template>
<script setup lang="ts">
import activeGroupsImg from '@/assets/statistical/groupStatistics/activeGroups.png'
import silentGroupsImg from '@/assets/statistical/groupStatistics/silentGroups.png'
import newGroupsAddedImg from '@/assets/statistical/groupStatistics/newGroupsAdded.png'
import disbandedGroupsImg from '@/assets/statistical/groupStatistics/disbandedGroups.png'
import exportImg from '@/assets/statistical/export.png'
import LineEcharts from '@/views/imStatistical/components/lineEcharts.vue'
import { echartsPropsType } from '../components/index'
import { getI18nValue } from '@/utils/i18n'
import dayjs from 'dayjs'
import { groupsColorMap, groupsMap, CarListType, GroupsMapType, GroupsColorMapType } from './index'
import { getLastDayGroupCount, imGroupCount } from '@/apis/imStatistical/groupStatistics'
import type { LinesDataType } from '../components/index'

const echartsLoading = ref(false)
const statisticsMain = ref<HTMLDivElement>()
const carList = ref<CarListType[]>([
  {
    imgUrl: activeGroupsImg,
    name: getI18nValue('groupStatistics.activeGroups'),
    description: getI18nValue('groupStatistics.activeGroupsDescription'),
    sum: '--',
    sizeColor: '#209986',
    id: 1
  },
  {
    imgUrl: silentGroupsImg,
    name: getI18nValue('groupStatistics.silentGroups'),
    description: getI18nValue('groupStatistics.silentGroupsDescription'),
    sum: '--',
    sizeColor: '#566A96',
    id: 2
  },
  {
    imgUrl: newGroupsAddedImg,
    name: getI18nValue('groupStatistics.newGroupsAdded'),
    description: getI18nValue('groupStatistics.newGroupsAddedDescription'),
    sum: '--',
    sizeColor: '#6958BC',
    id: 3
  },
  {
    imgUrl: disbandedGroupsImg,
    name: getI18nValue('groupStatistics.disbandedGroups'),
    description: getI18nValue('groupStatistics.disbandedGroupsDescription'),
    sum: '--',
    sizeColor: '#FC660C',
    id: 4
  }
])
const activeCard = ref<number>(1)
const querySelect = ref<string | number>('All')
const dataOptions = [
  {
    value: 'All',
    label: getI18nValue('userStatisticalMsg.empty')
  },
  {
    value: 1,
    label: getI18nValue('groupStatistics.activeGroups')
  },
  {
    value: 2,
    label: getI18nValue('groupStatistics.silentGroups')
  },
  {
    value: 3,
    label: getI18nValue('groupStatistics.newGroupsAdded')
  },
  {
    value: 4,
    label: getI18nValue('groupStatistics.disbandedGroups')
  }
]
const datepicker = ref<any>([dayjs().subtract(7, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')])

// 大于今天的日期不可选
const disabledDateEnd = (time: any) => {
  const startTime = new Date().getTime()
  const endTime = time.getTime()
  return endTime > startTime
}

const echartsTitle = ref(getI18nValue('groupStatistics.activeGroups'))
const echartsData = ref({} as echartsPropsType)
const echartsLegend = computed(() => {
  const arr = [
    {
      title: groupsMap[activeCard.value as GroupsMapType],
      color: groupsColorMap[activeCard.value as GroupsColorMapType]
    }
  ]
  if (querySelect.value != 'All') {
    arr.push({
      title: groupsMap[querySelect.value as GroupsMapType],
      color: groupsColorMap[querySelect.value as GroupsColorMapType]
    })
  }
  return arr
})

// 卡片 点击事件
function cardTypeClick(row: CarListType) {
  querySelect.value = 'All'
  echartsTitle.value = row.name
  activeCard.value = row.id
  setImGroupCount()
}

// 导出数据
function exportClick() {
  console.log('导出数据')
}
// 设置每个用户数 数量
async function setLastDayGroupCount() {
  const { data } = await getLastDayGroupCount().send()
  if (!data) {
    return
  }
  const { activeGroupCount, silentGroupCount, newGroupCount, dissolveGroupCount } = data
  carList.value[0].sum = activeGroupCount
  carList.value[1].sum = silentGroupCount
  carList.value[2].sum = newGroupCount
  carList.value[3].sum = dissolveGroupCount
}

async function setImGroupCount() {
  echartsLoading.value = true
  const [startTime, endTime] = datepicker.value
  // 获取 接口所需类型id
  const queryType = [activeCard.value]
  if (querySelect.value !== 'All') {
    queryType.push(querySelect.value as number)
  }
  try {
    const { data } = await imGroupCount({
      startTime,
      endTime,
      queryType
    }).send()
    // 从接口返回内容 筛出所需要对应的数据
    let linesData: LinesDataType[] = []
    data.imUserCountYVos.forEach(element => {
      let color = groupsColorMap[+element.key as GroupsColorMapType]
      let params = {
        data: element.data,
        name: element.name,
        color
      }
      linesData.push(params)
    })
    echartsData.value = {
      xAxisData: data.date,
      linesData: linesData
    }
  } finally {
    echartsLoading.value = false
  }
}

onMounted(() => {
  setLastDayGroupCount()
  setImGroupCount()
})
</script>
<style lang="scss" scoped>
:deep(.filledPopper) {
  max-width: 20% !important;
}
</style>
