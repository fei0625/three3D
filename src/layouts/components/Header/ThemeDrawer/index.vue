<template>
  <el-drawer title="布局设置" size="290px">
    <!-- 全局主题 -->
    <el-divider class="divider" content-position="center">
      <ms-icon icon="ColdDrink"></ms-icon>

      全局主题
    </el-divider>
    <div class="theme-item">
      <span>系统色调</span>
      <el-select v-model="globalStore.global.system" @change="changeSystem">
        <el-option label="深色" :value="1"></el-option>
        <el-option label="自动" :value="2"></el-option>
        <el-option label="浅色" :value="3"></el-option>
      </el-select>
    </div>
    <div class="theme-item">
      <span>主题颜色</span>
      <el-color-picker v-model="globalStore.global.primary" :predefine="colorList" @change="changePrimary" />
    </div>
    <!-- <div class="theme-item">
      <span>暗黑模式</span>
      <el-switch v-model="globalStore.global.isDark" inline-prompt :active-icon="Sunny" :inactive-icon="Moon" @change="switchDark" />
    </div> -->
    <!-- <div class="theme-item">
      <span>灰色模式</span>
      <el-switch v-model="globalStore.global.isGrey" @change="changeGrey" />
    </div> -->
    <!-- 界面设置 -->
    <el-divider class="divider" content-position="center">
      <ms-icon icon="Setting"></ms-icon>

      界面设置
    </el-divider>

    <div class="theme-item">
      <span>标签栏</span>
      <el-switch v-model="globalStore.global.tabs" />
    </div>
    <div class="theme-item">
      <span>页脚</span>
      <el-switch v-model="globalStore.global.footer" />
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { useTheme } from '@/hooks/useTheme'
import { useGlobalStore } from '@/stores/modules/global'
// import { Sunny, Moon } from '@element-plus/icons-vue'

// const { changePrimary, changeGrey, switchDark } = useTheme()
const { changePrimary, changeSystem } = useTheme()

const globalStore = useGlobalStore()

// 预定义主题颜色
const colorList = ['#015cff', '#daa96e', '#0c819f', '#409eff', '#27ae60', '#ff5c93', '#e74c3c', '#fd726d', '#f39c12', '#9b59b6']
</script>

<style lang="scss" src="./styles.scss" scoped />
