import * as H from "history";
import * as querystring from 'querystring';

// type TReturnType = H.LocationDescriptor<H.LocationState>;
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
}

export function resourceDetails({resourceID}: ResourceDetailsParamsType): TReturnType {
  return `/resource/${resourceID}`;
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
  return `/resource/${resourceID}/info`;
}

// 资源授权
interface ResourceAuthParamsType {
  resourceID: string;
}

export function resourceAuth({resourceID}: ResourceAuthParamsType): TReturnType {
  return `/resource/${resourceID}/auth`;
}

// 资源创建版本
interface ResourceCreateVersionParamsType {
  resourceID: string;
}

export function resourceCreateVersion({resourceID}: ResourceCreateVersionParamsType): TReturnType {
  return `/resource/${resourceID}/version/creator`;
}

// 资源版本信息
interface ResourceVersionParamsType {
  resourceID: string;
  version: string;
}

export function resourceVersion({resourceID, version}: ResourceVersionParamsType): TReturnType {
  return `/resource/${resourceID}/version/${version}`;
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
  return `/node/${nodeID}/formal`;
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
}

export function informNodeManagement({nodeID}: InformNodeManagementParamsType): TReturnType {
  return `/node/${nodeID}/informal`;
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

// | ((location: H.Location<H.LocationState>) => H.LocationDescriptor<H.LocationState>)
export function storageSpace({...params}: StorageSpaceParamsType = {}): TReturnType {
  // console.log(params, 'bucketName1paramsparamsparams==++++++');
  // console.log(handleQuery(params), 'handleQuery(params)q1234123412341234');
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

const FLinkTo = {
  market,
  resourceDetails,
  resourceCreator,
  myResources,
  myCollects,
  resourceInfo,
  resourceAuth,
  resourceCreateVersion,
  resourceVersion,
  nodeCreator,
  nodeManagement,
  exhibitManagement,
  informNodeManagement,
  informExhibitManagement,
  storageSpace,
  objectDetails,
};

export default FLinkTo;

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
