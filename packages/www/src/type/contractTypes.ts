export type ContractStatus = 'active' | 'testActive' | 'inactive' | 'terminal';

export interface PolicyFullInfo_Type {
  fsmDescriptionInfo: any;
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
