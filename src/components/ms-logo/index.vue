<template>
  <img :src="logoImg" class="w-[200px]" v-if="logoImg" />
</template>
<script setup lang="ts">
import { useGlobalStore } from '@/stores/modules/global'
const globalStore = useGlobalStore()
const logoImg = computed(() => (globalStore.systemConfig.photoUrl ? globalStore.systemConfig.photoUrl : ''))
</script>
<style lang="scss" scoped></style>
