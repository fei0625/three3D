<template>
  <main class="h-screen flex flex-col pr-2" ref="statisticsMain">
    <article class="grid gap-2 grid-cols-5">
      <section
        v-for="(item, index) in carList"
        :key="index"
        class="bg-white p-5 pr-2 rounded-xl shadow-md flex gap-x-3 cursor-pointer"
        :class="activeCard === item.id ? 'border border-[--ms-color]' : ''"
        @click="cardTypeClick(item)"
      >
        <section>
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

    <article v-loading="isLoading" class="flex flex-col w-full mt-2.5 bg-white rounded-xl flex-1 overflow-hidden min-h-[400px]">
      <section class="flex justify-between p-5">
        <article class="flex items-center">
          <div class="mr-2.5 w-1 h-4 bg-[--ms-color] rounded-lg"></div>
          <p class="font-bold">{{ echartsTitle }}</p>
        </article>
        <article class="flex items-center gap-2.5">
          <p>{{ getI18nValue('userStatisticalMsg.dataComparison') }}</p>
          <el-select v-model="dataSelect" @change="setImUserCount">
            <template v-for="item in dataOptions" :key="item.value">
              <el-option v-if="item.value !== activeCard" :label="item.label" :value="item.value" />
            </template>
          </el-select>
          <el-divider direction="vertical" class="h-full" />
          <el-checkbox v-model="isSystem" @change="setImUserCount">{{ getI18nValue('userStatisticalMsg.splitPlatform') }}</el-checkbox>
          <el-divider direction="vertical" class="h-full" />
          <el-date-picker
            @change="setImUserCount"
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
      <section class="px-5">
        <section v-for="(item, key) in userCompilerInfo" :key="key" class="flex mt-3 first:mt-0">
          <span class="w-14 mr-10">{{ item.title }}:</span>
          <div v-for="(cItem, cIndex) in item.data" :key="cIndex" class="flex gap-x-2 items-center odd:ml-16">
            <div class="w-3 h-3 rounded-full" :style="`background-color:${cItem.color}`"></div>
            <div>{{ cItem.name }}</div>
          </div>
        </section>
      </section>
      <section class="flex-1 mt-4">
        <LinearEcharts :echarts-data="echartsData"></LinearEcharts>
      </section>
    </article>
  </main>
</template>
<script setup lang="ts">
import dayjs from 'dayjs'
import activeUsersImg from '@/assets/statistical/activeUsers.png'
import sendMessageImg from '@/assets/statistical/sendMessage.png'
import newUsersImg from '@/assets/statistical/newUsers.png'
import onlinePeakImg from '@/assets/statistical/onlinePeak.png'
import exportImg from '@/assets/statistical/export.png'
import silentImg from '@/assets/statistical/silent.png'
import LinearEcharts from './components/linearEcharts.vue'
import { getI18nValue } from '@/utils/i18n'
import { getLastDayUserCount, imUserCount } from '@/apis/imStatistical/userStatistical'
import { platformMap, platformUserMap, ParamsType, platformUserColorMap, CarListType, PlatformUserMapType, PlatformMapType } from './index'
import type { LinesDataType, EchartsType } from '../components/index'
const userCompilerInfo = ref({} as Record<string, { title: string; data: { name: string; color: string }[] }>)

const isLoading = ref(false)
const statisticsMain = ref<HTMLDivElement>()
const carList = ref<CarListType[]>([
  {
    imgUrl: activeUsersImg,
    name: getI18nValue('userStatisticalMsg.activeUsers'),
    description: getI18nValue('userStatisticalMsg.activeUsersDescription'),
    sum: '--',
    sizeColor: '#32C45D',
    id: 1
  },
  {
    imgUrl: sendMessageImg,
    name: getI18nValue('userStatisticalMsg.messagingUsers'),
    description: getI18nValue('userStatisticalMsg.messagingUsersDescription'),
    sum: '--',
    sizeColor: '#4576E4',
    id: 2
  },
  {
    imgUrl: newUsersImg,
    name: getI18nValue('userStatisticalMsg.newUsers'),
    description: getI18nValue('userStatisticalMsg.newUsersDescription'),
    sum: '--',
    sizeColor: '#522DFF',
    id: 3
  },
  {
    imgUrl: onlinePeakImg,
    name: getI18nValue('userStatisticalMsg.simultaneousOnline'),
    description: getI18nValue('userStatisticalMsg.simultaneousOnlineDescription'),
    sum: '--',
    sizeColor: '#FC0C43',
    id: 4
  },
  {
    imgUrl: silentImg,
    name: getI18nValue('userStatisticalMsg.silentUsers'),
    description: getI18nValue('userStatisticalMsg.silentUsersDescription'),
    sum: '--',
    sizeColor: '#F79C43',
    id: 5
  }
])
const activeCard = ref(1)
const isSystem = ref(false)

const dataSelect = ref<string | number>('All')

// 用户数对比
const dataOptions = [
  {
    value: 'All',
    label: getI18nValue('userStatisticalMsg.empty')
  },
  {
    value: 1,
    label: getI18nValue('userStatisticalMsg.activeUsers')
  },
  {
    value: 2,
    label: getI18nValue('userStatisticalMsg.messagingUsers')
  },
  {
    value: 3,
    label: getI18nValue('userStatisticalMsg.newUsers')
  },
  {
    value: 4,
    label: getI18nValue('userStatisticalMsg.simultaneousOnline')
  },
  {
    value: 5,
    label: getI18nValue('userStatisticalMsg.silentUsers')
  }
]

const datepicker = ref<any>([dayjs().subtract(8, 'day').format('YYYY-MM-DD'), dayjs().subtract(1, 'day').format('YYYY-MM-DD')])

// 大于等于今天的日期不可选
const disabledDateEnd = (time: any) => {
  const startTime = Date.now() - 24 * 3600 * 1000
  const endTime = time.getTime()
  return endTime > startTime
}
const echartsTitle = ref(getI18nValue('userStatisticalMsg.activeUsers'))
const echartsData = ref({} as EchartsType)

// 卡片 点击事件
function cardTypeClick(row: CarListType) {
  // 点击和当前不同数据时才进行处理
  if (row.id === activeCard.value) {
    return
  }
  dataSelect.value = 'All'
  echartsTitle.value = row.name
  activeCard.value = row.id
  isSystem.value = false
  setImUserCount()
}

// 导出数据
function exportClick() {
  console.log('导出数据')
}

// 设置每个用户数 数量
async function setLastDayUserCount() {
  const { data } = await getLastDayUserCount().send()
  const { activeUserCount, addUserCount, onlineCount, sendMessageCount } = data
  carList.value[0].sum = activeUserCount
  carList.value[1].sum = sendMessageCount
  carList.value[2].sum = addUserCount
  carList.value[3].sum = onlineCount
}

// 设置用户对比数据
function setUserCompilerInfo({ platform, userType }: ParamsType) {
  if (!userCompilerInfo.value[platform]) {
    userCompilerInfo.value[platform] = {
      title: '',
      data: []
    }
  }
  userCompilerInfo.value[platform].title = platformMap[platform]
  userCompilerInfo.value[platform].data.push({
    name: platformUserMap[userType],
    color: platformUserColorMap[platform][userType]
  })
}

// 得到 echarts LinesData 数据
function getEchartsLinesData({ item, platform, userType }: ParamsType) {
  return {
    data: item.data,
    name: item.name,
    color: platformUserColorMap[platform][userType]
  }
}

// 设置 用户数 数据
async function setImUserCount() {
  const [startTime, endTime] = datepicker.value
  const queryType = [activeCard.value]
  if (dataSelect.value != 'All') {
    queryType.push(dataSelect.value as number)
  }
  try {
    isLoading.value = true
    const { data } = await imUserCount({
      startTime,
      endTime,
      queryType,
      isSystem: isSystem.value
    }).send()

    const linesData: LinesDataType[] = []
    userCompilerInfo.value = {}
    data.imUserCountYVos.forEach(item => {
      const [platform, userType] = item.key.split('_') as [PlatformMapType, PlatformUserMapType]
      const params = {
        item,
        platform,
        userType
      }
      linesData.push(getEchartsLinesData(params))
      setUserCompilerInfo(params)
    })

    echartsData.value = {
      xAxisData: data.date,
      linesData
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  setLastDayUserCount()
  setImUserCount()
})
</script>
<style lang="scss" scoped>
:deep(.filledPopper) {
  max-width: 20% !important;
}
</style>
