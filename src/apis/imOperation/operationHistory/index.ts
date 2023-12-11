import { http } from '@/utils/alova/index'
import { OperationHistoryPageListType } from './type'

/**获取申请授权列表*/
export const getOperationHistoryPageList = (operationHistoryPageListType: Partial<OperationHistoryPageListType>) =>
  http.postRequest<PagesType<OperationHistoryPageListType[]>>('/im/operationHistory/page', operationHistoryPageListType)
