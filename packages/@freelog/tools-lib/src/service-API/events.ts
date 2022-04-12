import FUtil from '../utils';

// 批量获取授权策略列表
interface TransactionParamsType {
  contractId: string;
  eventId: string;
  accountId: string;
  transactionAmount: number;
  password: string;
}

export function transaction({contractId, ...params}: TransactionParamsType) {
  return FUtil.Request({
    method: 'POST',
    url: `/v2/contracts/${contractId}/events/payment`,
    data: params,
  });
}
