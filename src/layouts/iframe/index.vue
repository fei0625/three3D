<template>
  <iframe :src="url" frameborder="0" class="border-none h-full w-full"></iframe>
</template>
<script setup lang="ts">
defineOptions({
  name: 'Iframe'
})
const route = useRoute()
const url = computed(() => {
  return route.meta.frameSrc
})
</script>
<style lang="less" scoped></style>
