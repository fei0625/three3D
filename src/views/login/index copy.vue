<template>
  <div class="login-container">
    <div class="login-box">
      <ms-i18n class="i18n"></ms-i18n>
      <section class="content">
        <div class="login-left">
          <img class="login-left-img" src="@/assets/login_left.png" alt="login" />
        </div>
        <div class="login-form">
          <h2 class="logo-text">{{ getI18nValue('login.welcome') }}</h2>
          <IotLog />
        </div>
      </section>

      <article class="footer">
        Copyright &nbsp;© 2022湖南麦石信息技术有限公司
        <a href="https://beian.miit.gov.cn" class="text-blue-500">&nbsp;湘ICP备2022003350号-1 </a>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getI18nValue } from '@/utils/i18n'
import IotLog from './iotLog.vue'
</script>

<style lang="scss" src="./styles.scss" scoped />
