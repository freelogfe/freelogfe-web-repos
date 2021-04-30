// export const apiHost = `${window.location.protocol}//qi.${(window.location.host.match(/(?<=\.).*/) || [''])[0]}`;

// 预设资源类型
export const resourceTypes: string[] = ['json', 'widget', 'image', 'audio', 'markdown', 'theme', 'reveal_slide', 'license', 'video', 'catalog'];

// 全局列表加载条目数
export const pageSize: number = 100;

// 签约方用户的身份类型定义
export enum ContractPartyIdentityType {
  resource = 1,
  node,
  consumer,
}

// 标的物类型定义
export enum SubjectType {
  resource = 1,
  exhibit,
  user,
}

// 合约状态定义
export enum ContractStatus {
  effect, // 生效中(不代表获得授权)
  stopped,
  exception,
}

// 合约授权状态定义
// export enum ContractAuthStatus {
//
// }
