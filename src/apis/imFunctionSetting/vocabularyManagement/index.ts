import { http } from '@/utils/alova/index'
import { ImVocabularyType, ImViolationType, ImViolationQueryType, ImVocabularyQueryType } from './type'

/**获取词维护分页*/
export const getImVocabularyPageList = (imVocabularyQuery: Partial<ImVocabularyQueryType>) =>
  http.postRequest<PagesType<ImVocabularyType[]>>('/imVocabulary/page', imVocabularyQuery)

/**词维护保存*/
export const imVocabularySave = (imVocabularySave: ImVocabularyType) => http.postRequest('/imVocabulary/save', imVocabularySave)

/**词维护导出*/
export const imVocabularyExport = (imVocabularyExportParams: ImVocabularyType) => http.postRequest<string>('/imVocabulary/export', imVocabularyExportParams)

/**词类别分页*/
export const getImViolationTypePageList = (imViolationTypeQuery: Partial<ImViolationQueryType>) =>
  http.postRequest<PagesType<ImViolationType[]>>('/imViolationType/page', imViolationTypeQuery)

/**词类别保存*/
export const imViolationTypeSave = (imViolationTypeSave: ImViolationType) => http.postRequest('/imViolationType/save', imViolationTypeSave)

/**词类别删除*/
export const imViolationTypeDel = (imViolationTypeDelParams: string) => http.postRequest('/imViolationType/removeById', imViolationTypeDelParams)

/**词类别列表*/
export const getImViolationTypeList = () => http.postRequest<ImViolationType[]>('/imViolationType/list')
