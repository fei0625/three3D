<template>
  <div>
    <Editor v-model="myValue" :init="init" :disabled="props.disabled" />
  </div>
</template>
<script setup lang="ts">
import tinymce from 'tinymce/tinymce' //tinymce核心文件
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver/theme' // 主题文件
import 'tinymce/icons/default'
import 'tinymce/models/dom'
// tinymce插件可按自己的需要进行导入
// 更多插件参考：https://www.tiny.cloud/docs/plugins/
import 'tinymce/plugins/image' // 插入上传图片插件
import 'tinymce/plugins/importcss' //图片工具
import 'tinymce/plugins/media' // 插入视频插件
import 'tinymce/plugins/table' // 插入表格插件
import 'tinymce/plugins/lists' // 列表插件
import 'tinymce/plugins/charmap' // 特殊字符
import 'tinymce/plugins/wordcount' // 字数统计插件
import 'tinymce/plugins/codesample' // 插入代码
import 'tinymce/plugins/code' // 查看源码
import 'tinymce/plugins/fullscreen' //全屏
import 'tinymce/plugins/link' //
import 'tinymce/plugins/preview' // 预览
import 'tinymce/plugins/template' //插入模板
import 'tinymce/plugins/save' // 保存
import 'tinymce/plugins/searchreplace' //查询替换
import 'tinymce/plugins/pagebreak' //分页
import 'tinymce/plugins/insertdatetime' //时间插入
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/autosave'
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/emoticons'
import 'tinymce/plugins/quickbars'
import 'tinymce/plugins/help'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/accordion'
import 'tinymce/plugins/emoticons/js/emojis'
import 'tinymce/plugins/help/js/i18n/keynav/en'
import { useGlobalStore } from '@/stores/modules/global'
import { uploadImage } from '@/apis/common'
// import { uploadImage } from '@/api/user'
// 指定tinymce文件加载的位置
tinymce.baseURL = 'tinymce'

interface Props {
  modelValue?: string
  height?: string | number
  disabled?: boolean
}
interface BlobInfo {
  id: () => string
  name: () => string
  filename: () => string
  blob: () => Blob
  base64: () => string
  blobUri: () => string
  uri: () => string | undefined
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  id: buildShortUUID('tiny-vue'),
  height: 300,
  disabled: false
})

const emits = defineEmits(['update:modelValue'])
const globalStore = useGlobalStore()
const myValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  }
})

const example_image_upload_handler = (blobInfo: BlobInfo) => {
  return new Promise(async resolve => {
    const form = new FormData()
    form.append('file', blobInfo.blob(), blobInfo.filename())
    form.append('platform', '4')
    form.append('version', '1.0')
    try {
      const res = await uploadImage(form).send()
      resolve(res.data)
    } catch (error) {
      resolve('')
    }
  })
}

const init = reactive({
  selector: `#${props.id}`,
  height: props.height, // 编辑器高度，可以考虑获取窗口高度，以适配不同设备屏幕
  toolbar:
    'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | pagebreak anchor codesample | ltr rtl',
  menubar: false, // 是否隐藏顶部菜单
  language_url: '/tinymce/langs/' + globalStore.global.language + '.js', // 汉化路径
  language: globalStore.global.language,
  skin: 'oxide',
  skin_url: '/tinymce/skins/ui/oxide',
  content_css: '/tinymce/skins/ui/oxide/content.min.css',
  branding: false,
  resize: false,
  default_link_target: '_blank',
  nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
  elementpath: false, //隐藏底栏的元素路径
  file_picker_types: 'media',
  promotion: false, //隐藏右上角upgrade按钮
  browser_spellchecker: true,
  contextmenu_never_use_native: true,
  images_upload_handler: example_image_upload_handler,
  plugins:
    'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount charmap quickbars emoticons accordion',
  editimage_cors_hosts: ['picsum.photos'],
  autosave_ask_before_unload: true,
  autosave_interval: '30s',
  autosave_prefix: '{path}{query}-{id}-',
  autosave_restore_when_empty: false,
  autosave_retention: '2m',
  image_advtab: true,
  importcss_append: true,
  image_caption: true,
  quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
  noneditable_class: 'mceNonEditable',
  toolbar_mode: 'sliding',
  contextmenu: 'link image table'
})

onMounted(() => {
  tinymce.init({})
})
</script>
