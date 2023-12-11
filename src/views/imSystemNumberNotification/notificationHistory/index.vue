<template>
  <MSTable @register="tableRegister"> </MSTable>
</template>
<script setup lang="ts">
import { useTable, MSTable } from '@/components/ms-table'
import { tableColumns, searchColumns } from './index'
import { getI18nValue } from '@/utils/i18n/index'
import { getNotificationHistoryPage, revokeNotification } from '@/apis/imSystemNumberNotification/notificationHistory'
const message = new useMessage()
import { NotificationHistory } from '@/apis/imSystemNumberNotification/notificationHistory/type'
const messageBox = new useMessageBox()
const { register: tableRegister, methods: tableMethods } = useTable({
  tableColumns: tableColumns,
  api: getNotificationHistoryPage,
  showPagination: true,
  isAutoHeight: true,
  searchColumns: searchColumns,
  actionColumn: [
    {
      icon: 'WarnTriangleFilled',
      link: true,
      onClick: handleRevoke,
      auth: 'imNotificationHistory/revoke',
      tooltip: getI18nValue('btn.revoke'),
      ifShow: (data: NotificationHistory) => {
        return data.status == 0 && data.pushType == 1
      }
    }
  ]
})

/** 撤回 */
function handleRevoke(row) {
  messageBox.MessageBox({
    message: getI18nValue('msg.revokeConfirm'),
    beforeClose: async (action, instance, done) => {
      if (action == 'confirm') {
        try {
          instance.confirmButtonLoading = true

          await revokeNotification(row.id)

          await tableMethods.load()
          done()
          message.success({
            message: getI18nValue('msg.revokeSuccess')
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
</script>
