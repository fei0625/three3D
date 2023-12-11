<template>
  <div class="container">
    <div class="number">{{ battery.level }}%</div>
    <div class="contrast">
      <div class="circle"></div>
      <ul class="bubbles">
        <li v-for="i in 15" :key="i"></li>
      </ul>
    </div>
    <div class="charging">
      <div>{{ batteryStatus }}</div>
      <div v-show="Number.isFinite(battery.dischargingTime) && battery.dischargingTime != 0">剩余可使用时间：{{ calcDischargingTime }}</div>
      <span v-show="Number.isFinite(battery.chargingTime) && battery.chargingTime != 0"> 距离电池充满需要：{{ calcChargingTime }} 6456</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useBattery } from './useBattery'

const { battery, batteryStatus, calcDischargingTime, calcChargingTime } = useBattery()
</script>

<style lang="scss" scoped src="./styles.scss"></style>
