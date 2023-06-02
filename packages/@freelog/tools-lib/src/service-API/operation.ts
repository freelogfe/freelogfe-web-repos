import FUtil from '../utils';

// 列出运营分类分组排序
interface OperationCategoriesParamsType {
  name?: string;
  status?: number;
}

export function operationCategories({...params}: OperationCategoriesParamsType = {}) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/resources/operation-categories/listSimpleByGroup`,
    params: params,
  });
}
