import { ref, onUnmounted, unref, watch } from 'vue'
import { CardProps, CardActionType } from '../types'
import { FormColumn } from '@/components/ms-form'

export default function useCard(props?: CardProps) {
  const cardAction = ref<CardActionType | null>(null)

  function register(instance: CardActionType) {
    onUnmounted(() => {
      cardAction.value = null
    })

    cardAction.value = instance
    // 监听 props， 若props改变了
    // 则使用 form 实例调用内部的 setProps 方法将新的props设置到form组件内部
    watch(
      () => props,
      () => {
        if (props) {
          instance.setProps(props)
        }
      },
      { immediate: true, deep: true }
    )
  }
  async function getCard() {
    await nextTick()
    const card = unref(cardAction)
    if (!card) {
      throw new Error('The card instance has not been obtained, please make sure that the form has been rendered when performing the form operation!')
    }
    await nextTick()
    return card as CardActionType
  }
  const methods: CardActionType = {
    setProps: async (props: CardProps) => {
      const card = await getCard()
      card.setProps(props)
    },
    load: async () => {
      const card = await getCard()
      card.load()
    },
    formGetValue: async () => {
      const card = await getCard()
      return card.formGetValue()
    },
    formSetValue: async (props: any) => {
      const card = await getCard()
      card.formSetValue(props)
    },

    formUpdateFormColumn: async (props: Partial<FormColumn> | Partial<FormColumn>[]) => {
      const card = await getCard()
      card.formUpdateFormColumn(props)
    },
    computeTableHeight: async () => {
      const card = await getCard()
      card.computeTableHeight()
    }
  }

  return { register, methods }
}
