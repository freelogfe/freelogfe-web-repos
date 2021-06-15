// export const apiHost = `${window.location.protocol}//qi.${(window.location.host.match(/(?<=\.).*/) || [''])[0]}`;

// 预设资源类型
export const resourceTypes: string[] = ['json', 'widget', 'image', 'audio', 'markdown', 'theme', 'reveal_slide', 'license', 'video', 'catalog'];

// 全局列表加载条目数
export const pageSize: number = 20;

// 签约方用户的身份类型定义
export enum EnumContractPartyIdentityType {
  resource = 1,
  node,
  consumer,
}

// 标的物类型定义
export enum EnumSubjectType {
  resource = 1,
  exhibit,
  user,
}

// 合约状态定义
export enum EnumContractStatus {
  pending,
  authorized,
  stopped,
}

// 合约授权状态定义
// export enum ContractAuthStatus {
//
// }
