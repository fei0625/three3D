<template>
  <main class="h-screen flex flex-col pr-2">
    <article class="flex items-center">
      <div class="mr-2.5 w-1 h-4 bg-[--ms-color] rounded-lg"></div>
      <p class="font-bold">{{ getI18nValue('audioVideoUsageStatisticsMsg.overviewTotalUsage') }}</p>
    </article>
    <article class="mt-2.5 grid grid-cols-2 gap-3.5">
      <section v-for="(item,index) in cardData" :key="index" class="bg-white p-5 pr-2.5 rounded-xl flex gap-x-6">
        <section class="flex-1 flex flex-col justify-between pl-8 gap-3.5">
          <div class="text-base w-full">{{ item.totalUsageTitle }}</div>
          <div class="text-2xl font-bold flex text-[--ms-color]">
            {{ item.totalUsage }}
            <p class="font-normal text-black">m</p>
          </div>
        </section>
        <el-divider direction="vertical" class="h-full" />
        <section class="flex-1 flex flex-col justify-between pl-8">
          <div class="text-base w-full">{{ item.singleChatTitle }}</div>
          <div class="text-2xl font-bold w-auto flex">
            {{ item.singleChat }}
            <p class="font-normal">m</p>
          </div>
        </section>
        <section class="flex-1 flex flex-col justify-between pl-8">
          <div class="text-base w-full">{{ item.groupChatTitle }}</div>
          <div class="text-2xl font-bold w-auto flex">
            {{ item.groupChat }}
            <p class="font-normal">m</p>
          </div>
        </section>
      </section>
    </article>
    <article class="w-full mt-2.5 bg-white rounded-xl flex-1 flex flex-col overflow-hidden min-h-[400px]">
      <section class="flex justify-between p-5">
        <article class="flex items-center">
          <div class="mr-2.5 w-1 h-4 bg-[--ms-color] rounded-lg"></div>
          <p class="font-bold">{{ getI18nValue('audioVideoUsageStatisticsMsg.usageStatisticsDetails') }}</p>
        </article>
        <article class="flex items-center gap-2.5">
          <el-date-picker
            @change="setImVideoCount"
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
      <section class="flex-1" v-loading="echartsLoading">
        <LineEcharts :echarts-data="echartsData"></LineEcharts>
      </section>
    </article>
  </main>
</template>
<script setup lang="ts">
import dayjs from "dayjs";
import exportImg from '@/assets/statistical/export.png'
import LineEcharts from '@/views/imStatistical/components/lineEcharts.vue'
import { echartsPropsType } from '../components/index'
import { getI18nValue } from '@/utils/i18n'
import { getLastDayImVideoCountCount, ImVideoCount } from "@/apis/imStatistical/audioVideoUsageStatistics";
import { CarListType, echartsColorMap, echartsNameMap } from "./index";

const datepicker = ref<any>([dayjs().subtract(7, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')])
// 大于今天的日期不可选
const disabledDateEnd = (time: any) => {
  const startTime = new Date().getTime()
  const endTime = time.getTime()
  return endTime > startTime
}
const echartsLoading = ref(false)
const echartsData = ref({} as echartsPropsType)
const cardData = ref<CarListType []>([{
  totalUsageTitle: echartsNameMap['videoUsageDuration'],
  totalUsage: '--',
  singleChatTitle: echartsNameMap['chatVideo'],
  singleChat: '--',
  groupChatTitle: echartsNameMap['groupVideo'],
  groupChat: '--',
},{
  totalUsageTitle: echartsNameMap['voiceUsageDuration'],
  totalUsage: '--',
  singleChatTitle: echartsNameMap['chatAudio'],
  singleChat: '--',
  groupChatTitle: echartsNameMap['groupAudio'],
  groupChat: '--',
}])

// 导出数据
function exportClick() {
  console.log('导出数据')
}

// 获取顶部数据
async function setLastDayImVideoCountCount() {
  const { data } =  await getLastDayImVideoCountCount().send()
  if (!data){
    return
  }
  const { totalVideoTime, chatVideoTime, groupVideoTime, totalAudioTime, chatAudioTime, groupAudioTime} = data
  cardData.value[0].totalUsage = totalVideoTime
  cardData.value[0].singleChat = chatVideoTime
  cardData.value[0].groupChat = groupVideoTime
  cardData.value[1].totalUsage = totalAudioTime
  cardData.value[1].singleChat = chatAudioTime
  cardData.value[1].groupChat = groupAudioTime
}

// 获取折线图所需数据方法
async function setImVideoCount() {
  echartsLoading.value = true
  const [startTime, endTime] = datepicker.value;
  let xData: string[] = [];
  let chatVideoTime: number[] = [];
  let groupVideoTime: number[] = [];
  let chatAudioTime: number[] = [];
  let groupAudioTime: number[] = [];
  try {
    const { data } = await ImVideoCount({ startTime, endTime }).send();
    // 遍历获取 四条线的数据和日期数据
    data.forEach((element) => {
      xData.push(element.date);
      chatVideoTime.push(element.chatVideoTime);
      groupVideoTime.push(element.groupVideoTime);
      chatAudioTime.push(element.chatAudioTime);
      groupAudioTime.push(element.groupAudioTime);
    });
    echartsData.value = {
      xAxisData: xData,
      linesData: [
        {
          name: echartsNameMap['chatVideo'],
          data: chatVideoTime,
          color: echartsColorMap['chatVideo'],
        },
        {
          name: echartsNameMap['groupVideo'],
          data: groupVideoTime,
          color: echartsColorMap['groupVideo'],
        },
        {
          name: echartsNameMap['chatAudio'],
          data: chatAudioTime,
          color: echartsColorMap['chatAudio'],
        },
        {
          name: echartsNameMap['groupAudio'],
          data: groupAudioTime,
          color: echartsColorMap['groupAudio'],
        },
      ],
    };
  }finally {
    echartsLoading.value = false
  }
}

onMounted(() => {
  setLastDayImVideoCountCount()
  setImVideoCount()
})

</script>
<style lang="scss" scoped>
:deep(.el-divider--vertical) {
  height: 100%;
  margin: 0;
}
</style>
