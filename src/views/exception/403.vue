<template>
  <div class="flex flex-col justify-center page-container">
    <div class="text-center">
      <img src="@/assets/exception/403.svg" alt="" />
    </div>
    <div class="text-center">
      <h1 class="text-base text-gray-500">{{ getI18nValue('errCode.403') }}</h1>
      <ms-button type="info" @click="goHome">{{ getI18nValue('common.backHome') }}</ms-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getI18nValue } from '@/utils/i18n'
const router = useRouter()
function goHome() {
  router.push('/')
}
</script>

<style lang="scss" scoped>
.page-container {
  width: 100%;
  border-radius: 4px;
  padding: 50px 0;
  height: 100vh;

  .text-center {
    h1 {
      color: #666;
      padding: 20px 0;
    }
  }

  img {
    width: 350px;
    margin: 0 auto;
  }
}
</style>
