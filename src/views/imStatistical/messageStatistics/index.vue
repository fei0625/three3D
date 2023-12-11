<template>
  <main class="h-screen flex flex-col pr-2 overflow-x-hidden overflow-y-auto" ref="statisticsMain">
    <article class="flex gap-3">
      <section class="bg-white p-5 rounded-xl shadow-md gap-x-6 w-[12%] flex flex-wrap justify-end content-between">
        <div v-for="item in messageList" :key="item.id" :class="activeMessage === item.id ? 'activeHove' : 'activeClass'" @click="handleMsgType(item)">
          {{ item.name }}
        </div>
      </section>
      <section
        v-if="activeMessage == 1"
        :style="{ background: globalStore.global.language === 'zh_CN' ? `url(${singleChatBGImg}) no-repeat` : '', backgroundSize: 'cover' }"
        class="illustrate h-[200px] w-[87%]"
      ></section>
      <section
        v-else-if="activeMessage == 2"
        :style="{ background: globalStore.global.language === 'zh_CN' ? `url(${groupChatBGImg}) no-repeat` : '', backgroundSize: 'cover' }"
        class="illustrate h-[200px] w-[87%]"
      ></section>
      <section
        v-else-if="activeMessage == 3"
        :style="{ background: globalStore.global.language === 'zh_CN' ? `url(${systemMessageBGImg}) no-repeat` : '', backgroundSize: 'cover' }"
        class="illustrate h-[200px] w-[87%]"
      ></section>
    </article>
    <article class="mt-2.5 grid gap-2 grid-cols-4" :class="activeMessage === 3 ? 'grid-cols-5' : 'grid-cols-4'">
      <section
        v-for="(item, index) in carList"
        :key="index"
        :class="[activeCard === item.id ? 'border border-[--ms-color]' : '', item.id ? 'cursor-pointer' : '']"
        class="bg-white p-5 pr-2.5 rounded-xl shadow-md flex gap-x-3"
        @click="item.id && cardTypeClick(item)"
      >
        <!-- 没有 id 的数据，为假数据，不可以操作 -->
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
    <article v-loading="isLoading" class="w-full mt-2.5 bg-white rounded-xl flex-1 flex flex-col min-h-[400px]">
      <section class="flex justify-between p-5">
        <article class="flex items-center">
          <div class="mr-2.5 w-1 h-4 bg-[--ms-color] rounded-lg"></div>
          <p class="font-bold">{{ echartsTitle }}</p>
        </article>
        <article class="flex items-center gap-2.5">
          <p>{{ getI18nValue('userStatisticalMsg.dataComparison') }}</p>
          <el-select v-model="dataSelect" @change="setImMessageCount">
            <template v-for="item in dataOptions" :key="item.value">
              <el-option v-if="activeCard != item.value" :label="item.label" :value="item.value" />
            </template>
          </el-select>
          <el-divider v-if="activeMessage === 1" direction="vertical" class="h-full" />
          <el-checkbox v-if="activeMessage === 1" v-model="isSystem" @change="setImMessageCount">{{
            getI18nValue('userStatisticalMsg.splitPlatform')
          }}</el-checkbox>
          <el-divider direction="vertical" class="h-full" />
          <el-date-picker
            v-model="datepicker"
            type="daterange"
            :start-placeholder="getI18nValue('form.startDate')"
            :end-placeholder="getI18nValue('form.endDate')"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :disabled-date="disabledDateEnd"
            @change="setImMessageCount"
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
        <section v-for="(item, key) in msgCompilerInfo" :key="key" class="flex mt-3 first:mt-0">
          <span class="w-14 mr-10">{{ item.title }}:</span>
          <div v-for="(cItem, cIndex) in item.data" :key="cIndex" class="flex gap-x-2 items-center odd:ml-16">
            <div class="w-3 h-3 rounded-full" :style="`background-color:${cItem.color}`"></div>
            <div>{{ cItem.name }}</div>
          </div>
        </section>
      </section>
      <section class="flex-1">
        <LineEcharts :echarts-data="echartsData"></LineEcharts>
      </section>
    </article>
  </main>
</template>
<script setup lang="ts">
import uplinkMessageImg from '@/assets/statistical/messageStatistics/uplinkMessage.png'
import perCapitaUplinkMessageImg from '@/assets/statistical/messageStatistics/perCapitaUplinkMessage.png'
import downNewsImg from '@/assets/statistical/messageStatistics/downNews.png'
import perCapitaDownNewsImg from '@/assets/statistical/messageStatistics/perCapitaDownNews.png'
import singleChatBGImg from '@/assets/statistical/messageStatistics/singleChatBG.png'
import groupChatBGImg from '@/assets/statistical/messageStatistics/groupChatBG.png'
import systemMessageBGImg from '@/assets/statistical/messageStatistics/systemMessageBG.png'
import PushMessagesImg from '@/assets/statistical/messageStatistics/PushMessagesImg.png'
import LineEcharts from '@/views/imStatistical/components/lineEcharts.vue'
import { getI18nValue } from '@/utils/i18n'
import exportImg from '@/assets/statistical/export.png'
import {
  CarListType,
  MessageListType,
  MessageOptionsType,
  PlatformMapType,
  platformUserColorMap,
  PlatformMsgMapType,
  ParamsType,
  messageList,
  platformMap,
  uplinkChatOptions,
  groupChatOptions,
  systemMessageOptions,
  platformMsgMap
} from './index'
import type { LinesDataType, EchartsType } from '../components/index'
import { useGlobalStore } from '@/stores/modules/global'
import { getLastDayMessageCount, imMessageCount } from '@/apis/imStatistical/messageStatistics'
import dayjs from 'dayjs'
const globalStore = useGlobalStore()
const activeMessage = ref(1)
const isLoading = ref(false)

const dataSelect = ref<string | number>('All')
const isSystem = ref(false)
const activeCard = ref(1)

const dataOptions = ref<MessageOptionsType[]>(uplinkChatOptions)

const statisticsMain = ref<HTMLDivElement>()

const echartsTitle = ref(getI18nValue('messageStatisticsMsg.uplinkSingleChat'))
const echartsData = ref({} as EchartsType)

const datepicker = ref<any>([dayjs().subtract(8, 'day').format('YYYY-MM-DD'), dayjs().subtract(1, 'day').format('YYYY-MM-DD')])

const msgCompilerInfo = ref({} as Record<string, { title: string; data: { name: string; color: string }[] }>)

// 单聊tab下  card数据
const uplinkChat = ref<CarListType[]>([
  {
    imgUrl: uplinkMessageImg,
    name: getI18nValue('messageStatisticsMsg.uplinkSingleChat'),
    description: getI18nValue('messageStatisticsMsg.uplinkSingleChatDescription'),
    sum: '--',
    sizeColor: '#5481EA',
    id: 1
  },
  {
    imgUrl: perCapitaUplinkMessageImg,
    name: getI18nValue('messageStatisticsMsg.upstreamMessagesChat'),
    description: getI18nValue('messageStatisticsMsg.upstreamMessagesChatDescription'),
    sum: '--',
    sizeColor: '#446C4C',
    id: 2
  },
  {
    imgUrl: downNewsImg,
    name: getI18nValue('messageStatisticsMsg.downlinkMessageCount'),
    description: getI18nValue('messageStatisticsMsg.downlinkMessageCountDescription'),
    sum: '--',
    sizeColor: '#6958BC'
  },
  {
    imgUrl: perCapitaDownNewsImg,
    name: getI18nValue('messageStatisticsMsg.perPersonCount'),
    description: getI18nValue('messageStatisticsMsg.perPersonCountDescription'),
    sum: '--',
    sizeColor: '#FC5B0C'
  }
])
// 群聊tab下 card数据
const groupChat = ref<CarListType[]>([
  {
    imgUrl: uplinkMessageImg,
    name: getI18nValue('messageStatisticsMsg.groupChatUplinkMessages'),
    description: getI18nValue('messageStatisticsMsg.groupChatUplinkMessagesDescription'),
    sum: '--',
    sizeColor: '#5481EA',
    id: 3
  },
  {
    imgUrl: perCapitaUplinkMessageImg,
    name: getI18nValue('messageStatisticsMsg.uplinkMessagesGroupChat'),
    description: getI18nValue('messageStatisticsMsg.uplinkMessagesGroupChatDescription'),
    sum: '--',
    sizeColor: '#446C4C',
    id: 4
  },
  {
    imgUrl: downNewsImg,
    name: getI18nValue('messageStatisticsMsg.groupChatDistributionMessages'),
    description: getI18nValue('messageStatisticsMsg.groupChatDistributionMessagesDescription'),
    sum: '--',
    sizeColor: '#6958BC'
  },
  {
    imgUrl: perCapitaDownNewsImg,
    name: getI18nValue('messageStatisticsMsg.groupChatDownlinkMessages'),
    description: getI18nValue('messageStatisticsMsg.groupChatDownlinkMessagesDescription'),
    sum: '--',
    sizeColor: '#FC5B0C'
  }
])
// 系统消息tab下 card数据
const systemMessage = ref<CarListType[]>([
  {
    imgUrl: uplinkMessageImg,
    name: getI18nValue('messageStatisticsMsg.systemMessageUplinkMessages'),
    description: getI18nValue('messageStatisticsMsg.systemMessageUplinkMessagesDescription'),
    sum: '--',
    sizeColor: '#5481EA',
    id: 5
  },
  {
    imgUrl: perCapitaUplinkMessageImg,
    name: getI18nValue('messageStatisticsMsg.systemMessageDistributionMessages'),
    description: getI18nValue('messageStatisticsMsg.systemMessageDistributionMessagesDescription'),
    sum: '--',
    sizeColor: '#446C4C',
    id: 6
  },
  {
    imgUrl: downNewsImg,
    name: getI18nValue('messageStatisticsMsg.systemMessageDownlinkMessages'),
    description: getI18nValue('messageStatisticsMsg.systemMessageDownlinkMessagesDescription'),
    sum: '--',
    sizeColor: '#6958BC'
  },
  {
    imgUrl: perCapitaDownNewsImg,
    name: getI18nValue('messageStatisticsMsg.systemPerPersonDownlinkMessages'),
    description: getI18nValue('messageStatisticsMsg.systemPerPersonDownlinkMessagesDescription'),
    sum: '--',
    sizeColor: '#FC5B0C'
  },
  {
    imgUrl: PushMessagesImg,
    name: getI18nValue('messageStatisticsMsg.systemMessagePushMessages'),
    description: getI18nValue('messageStatisticsMsg.systemMessagePushMessagesDescription'),
    sum: '--',
    sizeColor: '#4366CA',
    id: 7
  }
])

const carList = ref<CarListType[]>(uplinkChat.value)

// 大于今天以及今天的日期不可选
const disabledDateEnd = (time: any) => {
  const startTime = Date.now() - 24 * 3600 * 1000
  const endTime = time.getTime()
  return endTime > startTime
}

// 切换消息类型(单聊/群聊/系统消息)
function handleMsgType(row: MessageListType) {
  if (row.id === activeMessage.value) {
    return
  }
  activeMessage.value = row.id
  if (row.id === 1) {
    carList.value = uplinkChat.value
    dataOptions.value = uplinkChatOptions
  } else if (row.id === 2) {
    carList.value = groupChat.value
    dataOptions.value = groupChatOptions
  } else {
    carList.value = systemMessage.value
    dataOptions.value = systemMessageOptions
  }
  activeCard.value = carList.value[0].id! // 切换tab时重置选择的卡片下标
  dataSelect.value = 'All'
  isSystem.value = false
  setImMessageCount()
}
// 卡片 点击事件
function cardTypeClick(row: CarListType) {
  // 点击和当前不同数据时才进行处理
  if (row.id === activeCard.value) {
    return
  }
  activeCard.value = row.id!
  echartsTitle.value = row.name
  dataSelect.value = 'All'
  setImMessageCount()
}

// 导出数据
function exportClick() {
  console.log('导出数据')
}

// 设置消息对比数据
function setMsgCompilerInfo({ platform, msgType }: ParamsType) {
  if (!msgCompilerInfo.value[platform]) {
    msgCompilerInfo.value[platform] = {
      title: '',
      data: []
    }
  }
  msgCompilerInfo.value[platform].title = platformMap[platform]
  msgCompilerInfo.value[platform].data.push({
    name: platformMsgMap[msgType],
    color: platformUserColorMap[platform][msgType]
  })
}

// 得到 echarts LinesData 数据
function getEchartsLinesData({ item, platform, msgType }: ParamsType) {
  const p = platformUserColorMap[platform]
  return {
    data: item.data,
    name: item.name,
    color: p[msgType as keyof typeof p]
  }
}

// 设置昨日消息数
async function setLastDayMessageCount() {
  const { data } = await getLastDayMessageCount().send()
  const {
    sendMessageCount,
    sendAvagMessageCount,
    groupSendMessageCount,
    groupSendAvagMessageCount,
    sysSendMessageCount,
    sysUserSendMessageCount,
    sysSendMessagePushCount
  } = data
  uplinkChat.value[0].sum = sendMessageCount
  uplinkChat.value[1].sum = sendAvagMessageCount
  groupChat.value[0].sum = groupSendMessageCount
  groupChat.value[1].sum = groupSendAvagMessageCount
  systemMessage.value[0].sum = sysSendMessageCount
  systemMessage.value[1].sum = sysUserSendMessageCount
  systemMessage.value[4].sum = sysSendMessagePushCount
}

// 设置消息数据
async function setImMessageCount() {
  const [startTime, endTime] = datepicker.value

  const queryType = [activeCard.value]
  if (dataSelect.value !== 'All') {
    queryType.push(dataSelect.value as number)
  }

  try {
    isLoading.value = true

    const { data } = await imMessageCount({
      startTime,
      endTime,
      queryType,
      isSystem: isSystem.value
    }).send()

    const linesData: LinesDataType[] = []
    msgCompilerInfo.value = {}
    data.imUserCountYVos.forEach(item => {
      const [platform, msgType] = item.key.split('_') as [PlatformMapType, PlatformMsgMapType]
      const params = {
        item,
        platform,
        msgType
      }
      linesData.push(getEchartsLinesData(params))
      setMsgCompilerInfo(params)
    })

    echartsData.value = {
      xAxisData: data.date,
      linesData
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  setLastDayMessageCount()
  setImMessageCount()
})
</script>
<style lang="scss" scoped>
.activeClass {
  @apply h-[30px]  cursor-pointer w-full text-right;
}
.activeHove {
  @apply text-[--ms-color] border-b-2 border-[--ms-color] h-[30px]   cursor-pointer;
}
:deep(.el-row) {
  text-align: center;
  align-items: center;
}
:deep(.filledPopper) {
  max-width: 20% !important;
}
.illustrate {
  @apply bg-white p-5 rounded-xl shadow-md flex gap-x-6;
}
</style>
