<template>
  <aside class="relative h-full aside">
    <el-scrollbar>
      <el-menu unique-opened :default-active="getRouteName" :collapse="collapse">
        <el-menu-item index="/dashboard/workplace" @click="$router.push(PageEnum.BASE_HOME_REDIRECT)">
          <ms-icon icon="Monitor" :size="12"></ms-icon>
          <template #title>
            <div class="menu-item">
              {{ getI18nNoUnknownValue('menu.work') }}
            </div>
          </template>
        </el-menu-item>
        <SubMenu :data="item" v-for="(item, index) in asyncRouteStore.getMenus" :key="index"></SubMenu>
      </el-menu>
    </el-scrollbar>
    <div class="handover" @click="collapse = !collapse">
      <ms-icon icon="CaretRight" v-if="collapse"></ms-icon>
      <ms-icon icon="CaretLeft" v-if="!collapse"></ms-icon>
    </div>
  </aside>
</template>
<script setup lang="ts">
import { useAsyncRouteStore } from '@/stores/modules/asyncRoute'
import { getI18nNoUnknownValue } from '@/utils/i18n/index'
import { PageEnum } from '@/enums/pageEnum'

import SubMenu from './components/SubMenu/index.vue'
const asyncRouteStore = useAsyncRouteStore()
const route = useRoute()
const collapse = ref(false)
const getRouteName = computed(() => {
  if (route.meta.activeMenu) {
    return route.meta.activeMenu
  }
  return route.path
}) as unknown as string
</script>
<style lang="scss" src="./styles.scss" scoped />
