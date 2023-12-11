<template>
  <main class="ms-card">
    <article class="ms-card-header" v-if="slots.header">
      <slot name="header"></slot>
    </article>
    <article class="ms-card-search" v-if="propsRef?.searchColumns && propsRef.searchColumns.length > 0">
      <MSForm @register="formRegister">
        <template #[item]="scope" v-for="(item, index) in formSlots" :key="index">
          <slot :name="item" v-bind="scope"></slot>
        </template>
        <template #search>
          <section class="flex gap-x-3">
            <ms-button type="primary" icon="Search" v-if="propsRef.isSearchBtn" @click="load(true)">{{ getI18nValue('btn.query') }}</ms-button>
            <ms-button icon="Refresh" class="!ml-0" v-if="propsRef.isResetBtn" @click="reset">{{ getI18nValue('btn.reset') }}</ms-button>
            <div @click="handelMore" class="text-[--ms-more-color] cursor-pointer flex items-center" v-if="propsRef.isMore && getSearchForm(2).length > 3">
              {{ isMore ? getI18nValue('btn.merge') : getI18nValue('btn.expand') }}
              <ms-icon icon="ArrowRight" :class="isMore ? '-rotate-90' : 'rotate-90'" class="ml-1 transition-all"></ms-icon>
            </div>
          </section>
        </template>
      </MSForm>
    </article>
    <article class="ms-card-content">
      <section class="ms-card-content-toolbar" v-if="slots.toolbar">
        <slot name="toolbar"></slot>
      </section>
      <section class="ms-card-content-body" v-loading="loading" ref="cardRef" :style="{ height: propsRef?.isAutoHeight ? height + 'px' : '' }">
        <article v-if="cardData.length > 0" class="flex-1 overflow-y-auto">
          <el-row :gutter="10" class="!mx-0 gap-y-2.5">
            <el-col v-for="(item, index) in cardData" :key="index" :span="6" :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
              <el-card :body-style="{ padding: '0px' }" shadow="hover">
                <section v-if="propsRef?.cardHeader" class="flex items-center p-2.5">
                  <img :src="getImageName(item, propsRef?.cardHeader.imageName)" alt="" class="w-8 h-8 object-cover" />
                  <div v-if="propsRef?.cardHeader.name" class="ml-3 font-bold truncate text-xs">{{ item[propsRef?.cardHeader.name] }}</div>
                </section>
                <section v-if="propsRef?.cardColumns" class="px-6">
                  <section class="flex mt-2.5" v-for="(cardItem, cardIndex) in propsRef?.cardColumns" :key="cardIndex">
                    <div class="mr-6 text-xs">{{ cardItem.label }}:</div>
                    <div v-if="cardItem.slot" class="flex-1 text-xs flex items-center">
                      <slot :name="cardItem.slot" :row="item"></slot>
                    </div>
                    <div v-else v-html="getContent(cardItem, item)" class="flex-1 text-xs flex items-center"></div>
                  </section>
                </section>

                <section v-if="propsRef?.actionColumn && propsRef.actionColumn.length > 0" class="card-footer">
                  <template v-for="actionItem in propsRef.actionColumn" :key="actionItem.icon">
                    <div v-if="hasShow(actionItem, item)" @click="actionItem.onClick(item)">
                      <ms-button v-bind="getButtonArrts(actionItem)">{{ actionItem.label }}</ms-button>
                    </div>
                  </template>
                </section>
              </el-card>
            </el-col>
          </el-row>
        </article>
        <article v-else>
          <el-empty></el-empty>
        </article>
        <section class="flex justify-end mt-2.5" v-if="propsRef?.showPagination && cardData.length > 0">
          <ms-pagination :total="total" v-model="pagination"></ms-pagination>
        </section>
      </section>
    </article>
  </main>
</template>
<script setup lang="ts">
import { useForm, MSForm, FormColumn } from '@/components/ms-form'
import { getImageName, getContent, getButtonArrts, hasShow } from './index'
import { getI18nValue } from '@/utils/i18n/index'
import { CardActionType, CardProps } from './types'
import { get, set } from '@/utils/cache'
import { CacheEnumKey } from '@/enums/cacheEnum'
import { getViewportOffset } from '@/utils/domUtils'
import { useGlobalStore } from '@/stores/modules/global'
const globalStore = useGlobalStore()
interface Pagination {
  current: number
  size: number
}
const emits = defineEmits(['register'])
const cardRef = ref() //card 实例
const propsRef = ref<CardProps>() //hooks属性
const loading = ref(false) //加载效果
const height = ref() //高度
const cardData = ref<any[]>([]) //table数据
const isMore = ref(false) //展开查询条件
const pagination = ref<Pagination>({ current: 1, size: 20 }) //page分页
const total = ref<number>(0) //总条数
const searchFlage = ref(true) //查询或者重置的时候需要用到防止请求两次接口
const slots = useSlots() //插槽
const formSlots = Object.keys(slots).filter(item => item.includes('form-'))
const { register: formRegister, methods: formMethods } = useForm()

async function setProps(props: CardProps) {
  if (isRef(props.cardColumns)) {
    throw new Error('tableColumns不支持ref')
  }
  propsRef.value = deepCopy(props)

  if (propsRef.value?.isSearchBtn ?? true) {
    propsRef.value['isSearchBtn'] = true
  }
  if (propsRef.value?.isResetBtn ?? true) {
    propsRef.value['isResetBtn'] = true
  }
  if (propsRef.value?.isMore ?? true) {
    propsRef.value['isMore'] = true
  } else {
    isMore.value = true
  }
  if (!propsRef.value?.extrasSearchParams) {
    propsRef.value['extrasSearchParams'] = {}
  }
  if (propsRef.value?.searchColumns && propsRef.value.searchColumns.length > 0) {
    let parmas = {}
    if (propsRef.value.cacheName) {
      const staff = get(CacheEnumKey.STAFF)
      const cacheName = get(staff.staffCode + '_' + propsRef.value.cacheName)
      if (cacheName) {
        const { isMore: more, ...obj } = cacheName
        parmas = obj
        isMore.value = more
      }
    }
    await setFrom(parmas)
  }
  if (propsRef.value?.isImmediate ?? true) {
    await load()
  }
  computeTableHeight()
  window.addEventListener('resize', computeTableHeight)
}
async function load(isResetpagination?: boolean) {
  let res = { ...propsRef.value?.extrasSearchParams }
  //获取搜索框的查询参数
  if (propsRef.value?.searchColumns && propsRef.value.searchColumns.length > 0) {
    const data = await formMethods.getValue()
    res = { ...res, ...data }
  }
  if (propsRef.value?.onBeforeLoad) {
    const data = propsRef.value.onBeforeLoad({ ...res })
    if (data) {
      res = data
    }
  }
  if (propsRef.value?.cacheName) {
    const staff = get(CacheEnumKey.STAFF)
    set(staff.staffCode + '_' + propsRef.value.cacheName, { ...res, isMore: isMore.value })
  }
  if (isResetpagination) {
    pagination.value.current = 1
    searchFlage.value = true
  }
  if (propsRef.value?.api) {
    apiRequest(res)
  }
  if (propsRef.value?.cardData && !propsRef.value?.api) {
    if (propsRef.value?.showPagination) {
      const t = pagination.value.current * pagination.value.size - pagination.value.size
      cardData.value = propsRef.value?.cardData.slice(t, t + pagination.value.size)
      total.value = propsRef.value?.cardData.length
    } else {
      cardData.value = unref(propsRef)?.cardData
    }
    if (propsRef.value?.onSuccess) {
      propsRef.value?.onSuccess(cardData)
    }
    searchFlage.value = true
  }
}
async function apiRequest(res: Record<string, any>) {
  let params = { ...res }
  if (propsRef.value?.showPagination) {
    params = Object.assign({}, params, {
      page: pagination.value.current,
      pageSize: pagination.value.size
    })
  }

  try {
    loading.value = true
    const { data } = await unref(propsRef)?.api!(params).send()
    if (Array.isArray(data)) {
      cardData.value = data
    } else {
      cardData.value = data.records
    }
    if (propsRef.value?.showPagination) {
      total.value = data.total
    }
    if (propsRef.value?.onSuccess) {
      propsRef.value?.onSuccess(cardData.value)
    }
    computeTableHeight()
  } catch (err) {
    cardData.value = []
  } finally {
    loading.value = false
    searchFlage.value = true
  }
}
async function computeTableHeight() {
  if (!cardRef.value || !propsRef.value?.isAutoHeight) return
  const { bottomIncludeBody } = getViewportOffset(unref(cardRef))
  height.value = bottomIncludeBody - 18 - (propsRef.value?.resizeHeightOffset ?? 0) - (globalStore.global.footer ? 29 : 0)
}

async function reset() {
  if (propsRef.value?.resetParams) {
    await formMethods.resetFields(propsRef.value?.resetParams)
  } else {
    await formMethods.resetFields()
  }
  if (propsRef.value?.onResetSuccess) {
    let data = await formMethods.getValue()
    let newData = propsRef.value?.onResetSuccess(data)
    if (newData) {
      formMethods.setValue(newData)
    }
  }
  load(true)
}
async function handelMore() {
  isMore.value = !isMore.value
  await setFrom()
  computeTableHeight()
}
async function setFrom(parmas?: Record<string, any>) {
  if (propsRef.value?.searchColumns) {
    await formMethods.setProps({
      formColumns: getSearchForm(isMore.value ? 2 : 1),
      colProps: propsRef.value?.formColProps ?? { xs: 24, sm: 12, md: 8, lg: 4, xl: 4 },
      gutter: 20,
      inline: true
    })
    formMethods.setValue(parmas ?? {})
  }
}
/**
 * 1 返回查询数组 2返回更多帅选数组
 */
function getSearchForm(type: number): FormColumn[] {
  let hiddenArr: FormColumn[] = []
  let arr: FormColumn[] = []
  if (propsRef.value?.searchColumns && propsRef.value.searchColumns.length > 0) {
    hiddenArr = propsRef.value?.searchColumns.filter((item: FormColumn) => item.componentProps?.type == 'hidden')
    arr = propsRef.value?.searchColumns.filter((item: FormColumn) => item.componentProps?.type != 'hidden')
  }
  return type == 1 ? [...hiddenArr, ...arr.slice(0, 3)] : [...hiddenArr, ...arr]
}

const cardAction: CardActionType = {
  setProps,
  load,
  computeTableHeight,
  formGetValue: formMethods.getValue,
  formSetValue: formMethods.setValue,
  formUpdateFormColumn: formMethods.updateFormColumn
}

watch(
  pagination,
  () => {
    if (searchFlage.value) {
      load()
    }
  },
  { deep: true }
)

onMounted(() => {
  emits('register', cardAction)
})
onUnmounted(() => {
  window.removeEventListener('resize', computeTableHeight)
})
watch([() => globalStore.global.footer, () => globalStore.global.tabs], () => {
  computeTableHeight()
})
</script>
<style lang="scss" scoped src="./styles.scss"></style>
