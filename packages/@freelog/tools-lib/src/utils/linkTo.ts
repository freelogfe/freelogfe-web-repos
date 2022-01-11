import * as querystring from 'querystring';

type TReturnType = string;

// 市场
interface MarketParamsType {
  // nodeID: number;
}

export function market({}: MarketParamsType = {}): TReturnType {
  return `/market`;
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
}

export function nodeManagement({nodeID}: NodeManagementParamsType): TReturnType {
  return `/node/formal/${nodeID}`;
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

// 节点创建成功
interface NodeCreateSuccessParamsType {
  nodeID: number;
}

export function nodeCreateSuccess({nodeID}: NodeCreateSuccessParamsType) {
  return `/result/node/create/success/${nodeID}`;
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
}

export function logon({goTo}: LoginParamsType = {}) {
  return `/logon${handleQuery({
    goTo: goTo ? encodeURIComponent(goTo) : undefined,
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
// interface RetrievePayPasswordParamsType {
//   goTo?: string;
// }

export function retrievePayPassword() {
  return `/retrievePayPassword`;
}

// 钱包
// interface WalletParamsType {
// }

export function wallet() {
  return `/logged/wallet`;
}

// interface ContractParamsType {
// }

export function contract() {
  return `/logged/contract`;
}

// interface SettingParamsType {
// }

export function setting() {
  return `/logged/setting`;
}

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


