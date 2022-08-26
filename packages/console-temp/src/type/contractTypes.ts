export type ContractStatus = 'active' | 'testActive' | 'inactive' | 'terminal';

export interface PolicyFullInfo_Type {
  fsmDescriptionInfo: {
    [k: string]: {
      serviceStates: string[];
      isAuth: boolean;
      isTestAuth: boolean;
      isInitial?: boolean;
      isTerminate?: boolean;
      transitions: Array<({
        args: {
          elapsed: number;
          timeUnit: 'year' | 'month' | 'week' | 'day' | 'cycle';
        };
        name: 'RelativeTimeEvent';
      } | {
        name: 'TimeEvent';
        args: { dateTime: string };
      } | {
        name: 'TransactionEvent';
        args: { amount: number; account: 'self.account' }
      }) & {
        toState: string;
        code: string;
        isSingleton: boolean;
        eventId: string;
        service: string;
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
