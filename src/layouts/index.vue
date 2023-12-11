<template>
  <RouterView v-if="isRouterAlive"> </RouterView>
</template>
<script setup lang="ts">
defineOptions({
  name: 'Layout'
})
const isRouterAlive = ref(true)

function reload() {
  isRouterAlive.value = false
  nextTick(() => {
    isRouterAlive.value = true
  })
}
provide('appReload', reload)
</script>
