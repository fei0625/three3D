<template>
  <div class="lockScreen" :class="{ onLockLogin: userLoginInfo.showLogin }" @mousedown.stop @contextmenu.prevent>
    <template v-if="!userLoginInfo.showLogin">
      <div class="p-4 text-lg font-bold">长时间未操作,系统自动锁屏</div>
      <div class="lockScreen-unLock" @click="onLockLogin">
        <ms-icon icon="Lock" size="30"></ms-icon>
      </div>
      <!--充电-->
      <Recharge />

      <div class="local-time">
        <div class="time">{{ hour }}:{{ minute }}</div>
        <div class="date">{{ month }}月{{ day }}号，星期{{ week }}</div>
      </div>
    </template>

    <!--登录-->
    <template v-else>
      <div class="login">
        <div class="login-user">
          <ms-icon icon="User" size="128" />
        </div>
        <div class="username" v-if="userName">{{ userName }}</div>
        <el-input type="password" v-model.trim="userLoginInfo.password" @keyup.enter="onLogin" placeholder="请输入登录密码" show-password> </el-input>
        <div class="login-btn">
          <div @click="userLoginInfo.showLogin = false">返回</div>
          <div @click="goLogin">重新登录</div>
          <div @click="onLogin">进入系统</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import Recharge from './components/Recharge/index.vue'
import { useTime } from './useTime'
import { useGlobalStore } from '@/stores/modules/global'
import { useUserStore } from '@/stores/modules/user'
import { PageEnum } from '@/enums/pageEnum'
import { unlock } from '@/apis/common'

const userStore = useUserStore()
const globalStore = useGlobalStore()
const router = useRouter()
const emits = defineEmits(['timekeeping'])
// 获取时间
const { month, day, hour, minute, week } = useTime()

const userLoginInfo = reactive({
  password: '',
  showLogin: false
})

const userName = computed(() => {
  const { lastName, firstName } = userStore.userInfo
  if (!lastName || !lastName) return ''
  return `${firstName}.${lastName}`
})

// 解锁登录
const onLockLogin = () => (userLoginInfo.showLogin = true)

// 登录
const onLogin = async () => {
  if (!userLoginInfo.password) {
    new useMessage().warning({
      message: '请输入有效密码'
    })
    return
  }
  await unlock(userLoginInfo.password).send()
  globalStore.lockStatus = false
  emits('timekeeping')
}

async function goLogin() {
  userStore.removeUserIonfo()
  await router.push(PageEnum.BASE_LOGIN)
  globalStore.lockStatus = false
}

function fobidden_back() {
  //防止页面后退
  history.pushState(null, '', document.URL)
  window.addEventListener('popstate', back_common)
}
function back_common() {
  history.pushState(null, '', document.URL)
}
fobidden_back()
</script>

<style lang="scss" scoped src="./styles.scss"></style>
