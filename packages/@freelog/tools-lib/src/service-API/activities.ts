import FUtil from '../utils';

// 列出活动
interface List4ClientParamsType {
  skip?: number;
  limit?: number;
}

export function list4Client(params: List4ClientParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/activities/list4Client`,
    params: params,
  });
}

// 查询活动
interface Find4ClientParamsType {
  _id: string;
}

export function find4Client(params: Find4ClientParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/activities/find4Client`,
    params: params,
  });
}

// 列出广告
interface AdsListParamsType {
  skip?: number;
  limit?: number;
  place: 1 | 2 | 3 | 4; //  投放位置 1：顶部公告栏 2：右侧浮窗 3：概览页 4：发现页

}

export function adsList(params: AdsListParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/activities/ads/list4Client`,
    params: params,
  });
}

// 查询广告
interface AdsDetailsParamsType {
  skip?: number;
  limit?: number;
  place: 1 | 2 | 3 | 4; //  投放位置 1：顶部公告栏 2：右侧浮窗 3：概览页 4：发现页
}

export function adsDetails(params: AdsDetailsParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/activities/ads/find4Client`,
    params: params,
  });
}

// 访问广告（埋点）
interface EventTrackingAdsVisitParamsType {
  _id: string;
}

export function eventTrackingAdsVisit(params: EventTrackingAdsVisitParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/activities/ads/visit`,
    params: params,
  });
}

// 点击广告（埋点）
interface EventTrackingAdsClickParamsType {
  _id: string;
}

export function eventTrackingAdsClick(params: EventTrackingAdsClickParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/activities/ads/click`,
    params: params,
  });
}


// 获取基本任务详情
interface GetBaseTaskInfoParamsType {
}

export function getBaseTaskInfo(params: GetBaseTaskInfoParamsType = {}) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/activities/facade/getBaseTaskInfo`,
    params: params,
  });
}

// 获取资源任务详情
interface GetResourceTaskInfoParamsType {
}

export function getResourceTaskInfo(params: GetResourceTaskInfoParamsType = {}) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/activities/facade/getResourceTaskInfo`,
    params: params,
  });
}

// 获取节点任务详情
interface GetNodeTaskInfoParamsType {
}

export function getNodeTaskInfo(params: GetNodeTaskInfoParamsType = {}) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/activities/facade/getNodeTaskInfo`,
    params: params,
  });
}

// 获取奖励记录详情
interface GetRewardRecordInfoParamsType {
  rewardConfigCode: string;
}

export function getRewardRecordInfo(params: GetRewardRecordInfoParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/activities/facade/getRewardRecordInfo`,
    params: params,
  });
}

// 推送任务消息埋点
interface PushMessageTaskParamsType {
  taskConfigCode: string;
  meta?: any;
}

export function pushMessageTask(params: PushMessageTaskParamsType) {
  return FUtil.Request({
    method: 'POST',
    url: `/v2/activities/facade/pushMessage4Task`,
    data: params,
  });
}

// 运营钱包详情
interface GetCoinAccountParamsType {
  type: 1;
}

export function getCoinAccount(params: GetCoinAccountParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/activities/coin/account/find4Client`,
    params: params,
  });
}

// 运营钱包提现
interface WithdrawCoinAccountParamsType {
  reUserName: string;
  amount: number;
}

export function withdrawCoinAccount(params: WithdrawCoinAccountParamsType) {
  return FUtil.Request({
    method: 'POST',
    url: `/v2/activities/coin/account/cash4Client`,
    data: params,
  });
}

// 运营钱包流水
interface GetCoinAccountRecordsParamsType {
  skip?: number;
  limit?: number;
  coinAccountType: 1;
}

export function getCoinAccountRecords(params: GetCoinAccountRecordsParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/activities/coin/record/list4Client`,
    params: params,
  });
}

// 获取公众号绑定信息
interface GetWechatOfficialAccountInfoParamsType {
}

export function getWechatOfficialAccountInfo(params: GetWechatOfficialAccountInfoParamsType = {}) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/extensions/wechat/getRelationship4Client`,
    params: params,
  });
}

// 列出抽奖结果
interface LotteryListParamsType {
}

export function lotteryList(params: LotteryListParamsType = {}) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/activities/lottery/resource/list`,
    params: params,
  });
}

// 显示抽奖结果
interface LotteryShowParamsType {
  startDate: string;
  limitDate: string;
}

export function lotteryShow(params: LotteryShowParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/activities/lottery/resource/show`,
    params: params,
  });
}

// 列出邀请好友详情
type ListInviteFriendInfosParamsType = {
  userId: number;
  username: string;
  createDate: string;
}[];

export function listInviteFriendInfos(params: ListInviteFriendInfosParamsType) {
  return FUtil.Request({
    method: 'POST',
    url: `/v2/activities/facade/listInviteFriendInfos`,
    data: params,
  });
}

// 获取奖励记录详情列表
interface GetRewardRecordInfosParamsType {
  rewardGroupCode?: string;
  rewardConfigCode?: string;
  status?: 1 | 2 | 3; //奖励记录状态 1：未领取 2：可领取 3：已领取;
}

export function getRewardRecordInfos(params: GetRewardRecordInfosParamsType) {
  return FUtil.Request({
    method: 'POST',
    url: `/v2/activities/facade/getRewardRecordInfos`,
    data: params,
  });
}

// 个人奖励领取记录
interface ListRewardRecordInfosParamsType {
  rewardGroupCodes?: string[];
  statusArray?: number[];
}

export function listRewardRecordInfos(params: ListRewardRecordInfosParamsType = {}) {
  return FUtil.Request({
    method: 'POST',
    url: `/v2/activities/facade/listRewardRecordInfos`,
    data: params,
  });
}

// 统计个人的奖励情况
interface StatisticRewardRecordsParamsType {
  codes: string[];
}

export function statisticRewardRecords(params: StatisticRewardRecordsParamsType) {
  return FUtil.Request({
    method: 'POST',
    url: `/v2/activities/facade/statisticRewardRecords`,
    data: params,
  });
}

// 统计个人的任务情况
interface StatisticTaskRecordsParamsType {
  codes: string[];
}

export function statisticTaskRecords(params: StatisticTaskRecordsParamsType) {
  return FUtil.Request({
    method: 'POST',
    url: `/v2/activities/facade/statisticTaskRecords`,
    data: params,
  });
}

// 统计所有人的单个奖励情况
interface StatisticSingleRewardRecordForAllParamsType {
  code: string;
}

export function statisticSingleRewardRecordForAll(params: StatisticSingleRewardRecordForAllParamsType) {
  return FUtil.Request({
    method: 'POST',
    url: `/v2/activities/facade/statisticSingleRewardRecordForAll`,
    data: params,
  });
}
