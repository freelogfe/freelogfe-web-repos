export type ContractStatus = 'active' | 'testActive' | 'inactive' | 'terminal';

export interface PolicyFullInfo_Type {
  fsmDescriptionInfo: {
    [k: string]: {
      isAuth: boolean;
      isInitial: boolean;
      isTestAuth: boolean;
      transitions: Array<({
        args: { elapsed: number, timeUnit: 'month' };
        name: 'RelativeTimeEvent';
      } | {
        name: 'TimeEvent';
        args: { dateTime: string };
      } | {
        name: 'TransactionEvent';
        args: { amount: number; account: 'self.account' }
      }) & {
        toState: string;
      }>;
    }
  };
  policyId: string;
  policyName: string;
  policyText: string;
  status: 0 | 1;
  translateInfo: {
    audienceInfos: any[];
    content: string;
    fsmInfos: string[];
  };
}
