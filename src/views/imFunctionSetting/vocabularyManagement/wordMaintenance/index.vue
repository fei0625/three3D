<template>
  <MSTable @register="tableRegister">
    <template #status="{ row }">
      <div>
        <el-switch
          v-if="hasPermission('imVocabulary/save')"
          :model-value="row.status"
          :activeValue="1"
          :inactiveValue="0"
          @change="changeStatus(row)"
        ></el-switch>
        <div v-else>{{ getStatus(row.status) }}</div>
      </div>
    </template>
    <template #toolbar>
      <ms-button @click="handleAdd" icon="Plus" type="primary" auth="imVocabulary/save">{{ getI18nValue('btn.add') }}</ms-button>

      <ms-button type="primary" :icon="exportIcon" @click="handleExport" :loading="isLoad" auth="imVocabulary/export">{{
        getI18nValue('btn.export')
      }}</ms-button>

      <ms-upload action="/imVocabulary/upload" auth="imVocabulary/upload" class="ml-3" accept="json" @success="uploadSuccess"></ms-upload>
    </template>
  </MSTable>
  <MSDialog @register="dialogRegister" @ok="handleConfirm" :title="title">
    <div class="flex">
      <MSForm @register="formRegister" class="flex-1">
        <template #sensitiveUser>
          <article class="flex items-center gap-x-3">
            <el-select v-model="markUser.sensitiveUser">
              <el-option :label="getI18nValue('imVocabulary.sensitiveUser0')" :value="0" />
              <el-option :label="getI18nValue('imVocabulary.sensitiveUser1')" :value="1" />
            </el-select>
            <el-radio-group v-model="markUser.type">
              <el-radio :label="1">{{ getI18nValue('imVocabulary.immediately') }}</el-radio>
              <el-radio :label="2">
                {{ getI18nValue('imVocabulary.within') }}
                <el-select v-model="markUser.day" class="w-[80px]">
                  <el-option :label="getI18nValue('imVocabulary.day3')" :value="3" />
                  <el-option :label="getI18nValue('imVocabulary.day7')" :value="7" />
                  <el-option :label="getI18nValue('imVocabulary.day30')" :value="30" />
                  <el-option :label="getI18nValue('imVocabulary.day90')" :value="90" />
                  <el-option :label="getI18nValue('imVocabulary.day180')" :value="180" />
                  <el-option :label="getI18nValue('imVocabulary.day360')" :value="360" />
                </el-select>

                {{ getI18nValue('imVocabulary.days') }},
                {{ getI18nValue('imVocabulary.exceed') }}
                <el-input-number v-model="markUser.count" :min="1" :max="99" controls-position="right" @blur="numberBlur($event)" />
                {{ getI18nValue('imVocabulary.timesOrLess') }}
              </el-radio>
            </el-radio-group>
          </article>
        </template>
        <template #accountEffect>
          <article v-for="(item, index) in accountEffect" :key="index" class="flex items-baseline gap-x-3 mt-3 first:mt-0">
            {{ getI18nValue('imVocabulary.within') }}
            <el-select v-model="item.day" class="w-[80px]">
              <el-option :label="getI18nValue('imVocabulary.day3')" :value="3" />
              <el-option :label="getI18nValue('imVocabulary.day7')" :value="7" />
              <el-option :label="getI18nValue('imVocabulary.day30')" :value="30" />
              <el-option :label="getI18nValue('imVocabulary.day90')" :value="90" />
              <el-option :label="getI18nValue('imVocabulary.day180')" :value="180" />
              <el-option :label="getI18nValue('imVocabulary.day360')" :value="360" />
            </el-select>
            <div class="flex w-[70px]">
              {{ getI18nValue('imVocabulary.days') }},
              {{ getI18nValue('imVocabulary.below') }}
            </div>
            <el-input-number v-model="item.count" :min="1" :max="99" controls-position="right" @blur="numberBlur($event)" />
            <p>{{ getI18nValue('imVocabulary.timesOrLess') }},</p>
            <el-select v-model="item.effect" class="w-[80px]">
              <el-option :label="getI18nValue('imVocabulary.impact0')" :value="0" />
              <el-option :label="getI18nValue('imVocabulary.impact3')" :value="1" />
              <el-option :label="getI18nValue('imVocabulary.impact4')" :value="2" />
              <el-option :label="getI18nValue('imVocabulary.impact5')" :value="3" />
            </el-select>
            <el-select v-model="item.punishDay" v-if="item.effect == 2 || item.effect == 1" class="w-[80px]">
              <el-option :label="getI18nValue('imVocabulary.day3')" :value="3" />
              <el-option :label="getI18nValue('imVocabulary.day7')" :value="7" />
              <el-option :label="getI18nValue('imVocabulary.day30')" :value="30" />
              <el-option :label="getI18nValue('imVocabulary.day90')" :value="90" />
              <el-option :label="getI18nValue('imVocabulary.day180')" :value="180" />
              <el-option :label="getI18nValue('imVocabulary.day360')" :value="360" />
              <el-option :label="getI18nValue('imVocabulary.day0')" :value="-1" />
            </el-select>
            <div v-if="index == 0" class="w-10 flex items-center cursor-pointer">
              <ms-icon icon="Plus" @click="addAccountEffect" :size="18"></ms-icon>
            </div>
            <div v-if="index != 0" class="w-10 flex items-center cursor-pointer">
              <ms-icon icon="Delete" @click="delAccountEffect(index)" :size="18"></ms-icon>
            </div>
          </article>
        </template>
      </MSForm>

      <div class="w-[12%]"></div>
    </div>
  </MSDialog>
</template>
<script setup lang="ts">
import { useTable, MSTable } from '@/components/ms-table'
import { useForm, MSForm } from '@/components/ms-form'
import { useDialog, MSDialog } from '@/components/ms-dialog'
import { getImVocabularyPageList, imVocabularySave, imVocabularyExport } from '@/apis/imFunctionSetting/vocabularyManagement'
import { tableColumns, formColumns, searchColumns } from './index'
import { getI18nValue } from '@/utils/i18n/index'
import { hasPermission } from '@/utils/permission'
import { ImVocabularyType } from '@/apis/imFunctionSetting/vocabularyManagement/type'
import { ImViolationType } from '@/apis/imFunctionSetting/vocabularyManagement/type'

const message = new useMessage()
const messageBox = new useMessageBox()
const title = ref<string>('')
const isLoad = ref<Boolean>(false)
const exportIcon = ref<string>('Download')
const props = defineProps<{
  wordCategoriesRowData: ImViolationType
}>()

const markUser = ref({ sensitiveUser: 0, day: 7, type: 1, count: 3 })
const accountEffect = ref([
  {
    effect: 0,
    day: 7,
    type: 1,
    count: 3,
    punishDay: 3
  }
])

const { register: tableRegister, methods: tableMethods } = useTable({
  tableColumns: tableColumns,
  api: getImVocabularyPageList,
  showPagination: true,
  isAutoHeight: true,
  searchColumns: searchColumns,
  isImmediate: false,
  actionColumn: [
    {
      icon: 'Edit',
      onClick: handleEdit,
      link: true,
      auth: 'imVocabulary/save',
      tooltip: getI18nValue('btn.edit')
    }
  ]
})
const { register: formRegister, methods: formMethods } = useForm({
  formColumns,
  labelWidth: '15%'
})
const { register: dialogRegister, methods: dialogMethods } = useDialog({
  width: '70%'
})

function numberBlur(v: any) {
  if (!v.target.value) {
    v.target.value = 3
  }
}

function numberBlurDay(v: any) {
  if (!v.target.value) {
    v.target.value = 7
  }
}

/**账号影响新增 */
function addAccountEffect() {
  if (accountEffect.value.length == 3) {
    return
  }
  let length = accountEffect.value.length + 1
  accountEffect.value.push({
    effect: 0,
    day: 7,
    type: 1,
    count: length * 3,
    punishDay: 3
  })
}
/**账号影响删除*/
function delAccountEffect(index: number) {
  accountEffect.value.splice(index, 1)
}

/**上传成功刷新 */
function uploadSuccess() {
  tableMethods.load()
}

/** 新增 */
function handleAdd() {
  markUser.value = { sensitiveUser: 0, day: 7, type: 1, count: 3 }
  accountEffect.value = [
    {
      effect: 0,
      day: 7,
      type: 1,
      count: 3,
      punishDay: 3
    }
  ]
  dialogMethods.setIsVisible(true)
  title.value = getI18nValue('imVocabulary.addSensitive')
}

/** 编辑 */
function handleEdit(row: ImVocabularyType) {
  dialogMethods.setIsVisible(true)
  title.value = getI18nValue('imVocabulary.editSensitive')
  console.log(row)
  accountEffect.value = row.accountEffect
  markUser.value = row.markUser
  formMethods.setValue(row)
}

/**保存 */
const handleConfirm = async () => {
  try {
    await formMethods.validate()
    dialogMethods.setConfirmLoading(true)
    const data: ImVocabularyType = await formMethods.getValue()
    data.accountEffect = accountEffect.value
    data.markUser = markUser.value

    await imVocabularySave(data).send()
    tableMethods.load()
    dialogMethods.setIsVisible(false)
  } finally {
    dialogMethods.setConfirmLoading(false)
  }
}
/** 导出 */
async function handleExport() {
  try {
    exportIcon.value = 'Loading'
    isLoad.value = true
    const rows = (await tableMethods.getSelectionRows()) as ImVocabularyType[]
    const formGetValue = await tableMethods.formGetValue()
    const idList = rows.map(res => res.id)
    const { data } = await imVocabularyExport({ ...formGetValue, idList }).send()
    if (data) {
      window.location.href = data
    }
  } finally {
    isLoad.value = false
    exportIcon.value = 'Download'
  }
}
/** 启用/禁用 */
function changeStatus(row: ImVocabularyType) {
  if (Object.keys(row).length == 0) return
  const status = row.status == 1 ? 0 : 1
  const msg = status == 0 ? 'msg.disableConfirm' : 'msg.enableConfirm'
  const messages = status == 0 ? 'msg.disableSuccess' : 'msg.enableSuccess'
  messageBox.MessageBox({
    message: getI18nValue(msg),
    beforeClose: async (action, instance, done) => {
      if (action == 'confirm') {
        try {
          instance.confirmButtonLoading = true
          row.status = status
          await imVocabularySave(row).send()
          await tableMethods.load()
          done()
          message.success({
            message: getI18nValue(messages)
          })
        } finally {
          instance.confirmButtonLoading = false
        }
      } else {
        done()
      }
    }
  })
}
/**获取状态 */
function getStatus(status: number) {
  if (!status) {
    return ''
  }
  if (status == 1) return getI18nValue('common.enable')
  else return getI18nValue('common.disable')
}
onMounted(async () => {
  tableMethods.formSetValue({ violationTypeId: props.wordCategoriesRowData.id })
  tableMethods.load()
})
</script>
