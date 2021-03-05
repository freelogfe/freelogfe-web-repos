import * as H from "history";

// 市场
interface MarketParamsType {
  // nodeID: number;
}

export function market({}: MarketParamsType = {}): string {
  return `/market`;
}

// 资源详情
interface ResourceDetailsParamsType {
  resourceID: string;
}

export function resourceDetails({resourceID}: ResourceDetailsParamsType): string {
  return `/resource/${resourceID}`;
}

// 我的资源
interface MyResourcesParamsType {
}

export function myResources({}: MyResourcesParamsType = {}): string {
  return `/resource/list`;
}

// 我的收藏
interface MyCollectsParamsType {
}

export function myCollects({}: MyCollectsParamsType = {}): string {
  return `/resource/collect`;
}

// 资源信息
interface ResourceInfoParamsType {
  resourceID: string;
}

export function resourceInfo({resourceID}: ResourceInfoParamsType): string {
  return `/resource/${resourceID}/info`;
}

// 资源授权
interface ResourceAuthParamsType {
  resourceID: string;
}

export function resourceAuth({resourceID}: ResourceAuthParamsType): string {
  return `/resource/${resourceID}/auth`;
}

// 资源创建
interface ResourceCreateVersionParamsType {
  resourceID: string;
}

export function resourceCreateVersion({resourceID}: ResourceCreateVersionParamsType): string {
  return `/resource/${resourceID}/version/creator`;
}

// 资源版本信息
interface ResourceVersionParamsType {
  resourceID: string;
  version: string;
}

export function resourceVersion({resourceID, version}: ResourceVersionParamsType): string {
  return `/resource/${resourceID}/version/${version}`;
}

// 节点创建
interface NodeCreatorParamsType {
  // nodeID: number;
}

export function nodeCreator({}: NodeCreatorParamsType = {}): string {
  return `/node/creator`;
}

// 节点管理
interface NodeManagementParamsType {
  nodeID: number;
}

export function nodeManagement({nodeID}: NodeManagementParamsType): string {
  return `/node/${nodeID}/formal`;
}

// 展品管理
interface ExhibitManagementParamsType {
  exhibitID: string;
}

export function exhibitManagement({exhibitID}: ExhibitManagementParamsType): string {
  return `/node/exhibit/formal/${exhibitID}`;
}

// 测试节点管理
interface InformNodeManagementParamsType {
  nodeID: number;
}

export function informNodeManagement({nodeID}: InformNodeManagementParamsType): string {
  return `/node/${nodeID}/informal`;
}

// 测试展品管理
interface InformExhibitManagementParamsType {
  exhibitID: string;
}

export function informExhibitManagement({exhibitID}: InformExhibitManagementParamsType): string {
  return `/node/exhibit/informal/${exhibitID}`;
}

// 存储空间
interface StorageSpaceParamsType {
  bucketName: string;
}

// | ((location: H.Location<H.LocationState>) => H.LocationDescriptor<H.LocationState>)
export function storageSpace({bucketName}: StorageSpaceParamsType): H.LocationDescriptor<H.LocationState> {
  return {
    pathname: '/storage',
    // @ts-ignore
    query: {
      bucketName,
    },
  };
}

// 对象详情
interface ObjectDetailsParamsType {
  bucketName: string;
  objectID: string;
}

export function objectDetails({bucketName, objectID}: ObjectDetailsParamsType): H.LocationDescriptor<H.LocationState> | ((location: H.Location<H.LocationState>) => H.LocationDescriptor<H.LocationState>) {
  return {
    pathname: '/storage',
    // @ts-ignore
    query: {
      bucketName,
      objectID,
    },
  };
}

