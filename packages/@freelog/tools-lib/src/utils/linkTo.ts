import * as querystring from 'querystring';

type TReturnType = string;

/************** www Start ******************************************************/
// 首页
interface HomeParamsType {

}

export function home({}: HomeParamsType = {}) {
  return `/home`;
}

// 活动列表
interface ActivitiesParamsType {

}

export function activities({}: ActivitiesParamsType = {}) {
  return `/activities`;
}

// 活动详情
interface ActivitiesParamsType {
  activityID: string;
}

export function activity({activityID}: ActivitiesParamsType) {
  return `/activity/${activityID}`;
}

/************** www End ******************************************************/

/************** console Start ******************************************************/
// dashboard
interface DashboardParamsType {

}

export function dashboard({}: DashboardParamsType = {}) {
  return `/dashboard`;
}

// 资源市场
interface MarketParamsType {
  // nodeID: number;
  query?: string;
}

export function market({...params}: MarketParamsType = {}): TReturnType {
  return `/market${handleQuery(params)}`;
}

// 示例节点
interface ExampleNodesParamsType {
}

export function exampleNodes({}: ExampleNodesParamsType = {}): TReturnType {
  return `/examples`;
}

// 资源详情
interface ResourceDetailsParamsType {
  resourceID: string;
  version?: string;
}

export function resourceDetails({resourceID, ...params}: ResourceDetailsParamsType): TReturnType {
  return `/resource/details/${resourceID}${handleQuery(params)}`;
}

// 资源创建
interface ResourceCreatorParamsType {
}

export function resourceCreator({}: ResourceCreatorParamsType = {}): TReturnType {
  return `/resource/creator`;
}

// 我的资源
interface MyResourcesParamsType {
}

export function myResources({}: MyResourcesParamsType = {}): TReturnType {
  return `/resource/list`;
}

// 我的收藏
interface MyCollectsParamsType {
}

export function myCollects({}: MyCollectsParamsType = {}): TReturnType {
  return `/resource/collect`;
}

// 资源信息
interface ResourceInfoParamsType {
  resourceID: string;
}

export function resourceInfo({resourceID}: ResourceInfoParamsType): TReturnType {
  return `/resource/info/${resourceID}`;
}

// 资源授权
interface ResourceAuthParamsType {
  resourceID: string;
}

export function resourceAuth({resourceID}: ResourceAuthParamsType): TReturnType {
  return `/resource/auth/${resourceID}`;
}

// 资源创建版本
interface ResourceCreateVersionParamsType {
  resourceID: string;
}

export function resourceCreateVersion({resourceID}: ResourceCreateVersionParamsType): TReturnType {
  return `/resource/version/creator/${resourceID}`;
}

// 资源版本信息
interface ResourceVersionParamsType {
  resourceID: string;
  version: string;
}

export function resourceVersion({resourceID, version}: ResourceVersionParamsType): TReturnType {
  return `/resource/version/info/${resourceID}/${version}`;
}

// 节点创建
interface NodeCreatorParamsType {
  // nodeID: number;
}

export function nodeCreator({}: NodeCreatorParamsType = {}): TReturnType {
  return `/node/creator`;
}

// 节点管理
interface NodeManagementParamsType {
  nodeID: number;
  showPage?: 'exhibit' | 'theme' | 'mappingRule';
}

export function nodeManagement({nodeID, showPage = 'exhibit', ...params}: NodeManagementParamsType): TReturnType {
  return `/node/formal/${nodeID}${handleQuery({showPage, ...params})}`;
}

// 展品管理
interface ExhibitManagementParamsType {
  exhibitID: string;
}

export function exhibitManagement({exhibitID}: ExhibitManagementParamsType): TReturnType {
  return `/node/exhibit/formal/${exhibitID}`;
}

// 测试节点管理
interface InformNodeManagementParamsType {
  nodeID: number;
  showPage?: 'exhibit' | 'theme' | 'mappingRule';
}

export function informNodeManagement({
                                       nodeID,
                                       showPage = 'exhibit',
                                       ...params
                                     }: InformNodeManagementParamsType): TReturnType {
  return `/node/informal/${nodeID}${handleQuery({showPage, ...params})}`;
}

// 测试展品管理
interface InformExhibitManagementParamsType {
  exhibitID: string;
}

export function informExhibitManagement({exhibitID}: InformExhibitManagementParamsType): TReturnType {
  return `/node/exhibit/informal/${exhibitID}`;
}

// 存储空间
interface StorageSpaceParamsType {
  bucketName?: string;
  createBucket?: boolean;
}

export function storageSpace({...params}: StorageSpaceParamsType = {}): TReturnType {
  return `/storage${handleQuery(params)}`;
}

// 对象详情
interface ObjectDetailsParamsType {
  bucketName: string;
  objectID: string;
}

export function objectDetails({...params}: ObjectDetailsParamsType): TReturnType {
  return `/storage${handleQuery(params)}`;
}

// 资源创建成功
interface ResourceCreateSuccessParamsType {
  resourceID: string;
}

export function resourceCreateSuccess({resourceID}: ResourceCreateSuccessParamsType) {
  return `/result/resource/create/success/${resourceID}`;
}

// 资源版本创建成功
interface ResourceVersionCreateSuccessParamsType {
  resourceID: string;
  version: string;
}

export function resourceVersionCreateSuccess({resourceID, version}: ResourceVersionCreateSuccessParamsType) {
  return `/result/resource/version/create/success/${resourceID}/${version}`;
}

// 资源版本正在创建
interface ResourceVersionCreateReleaseParamsType {
  resourceID: string;
  version: string;
}

export function resourceVersionCreateRelease({resourceID, version}: ResourceVersionCreateReleaseParamsType) {
  return `/result/resource/version/create/release/${resourceID}/${version}`;
}

// 节点创建成功
interface NodeCreateSuccessParamsType {
  nodeID: number;
}

export function nodeCreateSuccess({nodeID}: NodeCreateSuccessParamsType) {
  return `/result/node/create/success/${nodeID}`;
}

// 内测资格申请
interface InvitationParamsType {
  goTo?: string;
  invitationCode?: string;
}

export function invitation({goTo, ...params}: InvitationParamsType = {}) {
  // console.log(params.goTo, 'goTo9iowjefklsdj;flksdjflk')
  return `/invitation${handleQuery({
    ...params,
    returnUrl: goTo ? encodeURIComponent(goTo) : undefined,
  })}`;
}

// 403
interface Exception403ParamsType {
  from?: string;
}

export function exception403({...params}: Exception403ParamsType = {}) {

  let fromUrl: string = params.from || '';
  if (!fromUrl) {
    const {href, origin} = window.location;
    fromUrl = href.replace(origin, '');
  }

  return `/exception/403${handleQuery({
    from: fromUrl
  })}`;
}

// 节点封禁
interface NodeFreezeParamsType {
  nodeID: number;
}

export function nodeFreeze({nodeID}: NodeFreezeParamsType) {
  return `/result/node/freeze/${nodeID}`;
}

// 资源封禁
interface ResourceFreezeParamsType {
  resourceID: string;
}

export function resourceFreeze({resourceID}: ResourceFreezeParamsType) {
  return `/result/resource/freeze/${resourceID}`;
}

// 站内搜索
interface GlobalSearchParamsType {
  search: string;
}

export function globalSearch({search}: GlobalSearchParamsType) {
  return `/search${handleQuery({
    search,
  })}`;
}

/************** console End ******************************************************/


/************** user Start ******************************************************/
// 登录
interface LoginParamsType {
  goTo?: string;
}

export function login({goTo}: LoginParamsType = {}) {
  return `/login${handleQuery({
    goTo: goTo ? encodeURIComponent(goTo) : undefined,
  })}`;
}

// 注册
interface LoginParamsType {
  goTo?: string;
  invitationCode?: string;
}

export function logon({goTo, ...params}: LoginParamsType = {}) {
  return `/logon${handleQuery({
    goTo: goTo ? encodeURIComponent(goTo) : undefined,
    ...params,
  })}`;
}

// 绑定账户
interface LoginParamsType {
  goTo?: string;
  identityId?: string;
  returnUrl?: string;
}

export function bind({goTo, returnUrl, ...params}: LoginParamsType = {}) {
  return `/bind${handleQuery({
    goTo: goTo ? encodeURIComponent(goTo) : undefined,
    returnUrl: returnUrl ? encodeURIComponent(returnUrl) : undefined,
    ...params,
  })}`;
}

// 找回密码
interface RetrieveUserPasswordParamsType {
  goTo?: string;
}

export function retrieveUserPassword({goTo}: RetrieveUserPasswordParamsType = {}) {
  return `/retrieve${handleQuery({
    goTo: goTo ? encodeURIComponent(goTo) : undefined,
  })}`;
}

// 找回支付密码
interface RetrievePayPasswordParamsType {
  goTo?: string;
}

export function retrievePayPassword({}: RetrievePayPasswordParamsType = {}) {
  return `/retrievePayPassword`;
}

// 用户冻结
interface UserFreezeParamsType {
  // goTo?: string;
}

export function userFreeze({}: UserFreezeParamsType = {}) {
  return `/freeze`;
}

// 我的钱包
interface WalletParamsType {
}

export function wallet({}: WalletParamsType = {}) {
  return `/logged/wallet`;
}

// 活动奖励
interface RewardParamsType {
}

export function reward({}: RewardParamsType = {}) {
  return `/logged/reward`;
}

// 我的合约
interface ContractParamsType {
}

export function contract({}: ContractParamsType = {}) {
  return `/logged/contract`;
}

// 个人设置
interface SettingParamsType {
}

export function setting({}: SettingParamsType = {}) {
  return `/logged/setting`;
}


// 绑定
interface BindingParamsType {
}

export function binding({}: BindingParamsType = {}) {
  return `/logged/binding`;
}

// 绑定成功
interface ResultBindingSuccessParamsType {
}

export function resultBindingSuccess({}: ResultBindingSuccessParamsType = {}) {
  return `/result/binding`;
}


/************** user End ******************************************************/

function handleQuery(query: object): string {
  const obj: any = {};
  for (const [key, value] of Object.entries(query)) {
    if (key && value) {
      obj[key] = value;
    }
  }
  const result: string = querystring.stringify(obj);
  return result ? ('?' + result) : '';
}


