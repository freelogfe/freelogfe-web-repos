import * as React from 'react';
import styles from './index.less';
import FCodeFormatter from '../FCodeFormatter';
import * as AHooks from 'ahooks';
import { FUtil } from '@freelog/tools-lib';
import { PolicyFullInfo } from '@/type/contractTypes';

interface FPolicyDisplayProps {
  // code: string;
  fullInfo: PolicyFullInfo;
  containerHeight?: string | number;
}

function FPolicyDisplay({ fullInfo, containerHeight = 'auto' }: FPolicyDisplayProps) {
  // console.log(fullInfo, 'fullInfo#############');

  const [activated, setActivated] = React.useState<'code' | 'text' | 'view'>('text');

  return (<div className={styles.PolicyBody}>
    <div className={styles.PolicyBodyTabs}>
      <a
        className={activated === 'text' ? styles.PolicyBodyTabActivated : ''}
        onClick={() => {
          setActivated('text');
        }}
      >策略内容</a>
      <div style={{ width: 15 }} />
      <a
        className={activated === 'view' ? styles.PolicyBodyTabActivated : ''}
        onClick={() => {
          setActivated('view');
        }}
      >状态机视图</a>
      <div style={{ width: 15 }} />
      <a
        className={activated === 'code' ? styles.PolicyBodyTabActivated : ''}
        onClick={() => {
          setActivated('code');
        }}
      >策略代码</a>
    </div>
    <div className={styles.PolicyBodyContainer}
         style={{ height: containerHeight, overflowY: containerHeight !== undefined ? 'auto' : 'hidden' }}>

      {
        activated === 'text' && (<div style={{ width: '100%' }}>
          <FCodeFormatter code={fullInfo.translateInfo.content} />
        </div>)
      }

      {
        activated === 'view' && (<div style={{ height: (typeof containerHeight === 'number') ? containerHeight : 170 }}>
        </div>)
      }

      {
        activated === 'code' && (<div style={{ width: '100%' }}>
          <FCodeFormatter code={fullInfo.policyText} />
        </div>)
      }
    </div>

  </div>);
}

export default FPolicyDisplay;

// export async function policyCodeTranslationToText(code: string, targetType: string): Promise<{
//   error: string[] | null;
//   text?: string;
// }> {
//   try {
//     const result = await compile(
//       code,
//       targetType,
//       completeUrlByDomain('qi'),
//       window.location.origin.endsWith('.freelog.com') ? 'prod' : 'dev',
//     );
//     // console.log(result, 'result!@#$@#$@#$@#$@#');
//     const contract: ContractEntity = {
//       audiences: result.state_machine.audiences,
//       fsmStates: Object.entries<any>(result.state_machine.states)
//         .map((st) => {
//           return {
//             name: st[0],
//             serviceStates: st[1].serviceStates,
//             events: st[1].transitions.map((ts: any) => {
//
//               return {
//                 id: ts.code,
//                 name: ts.name,
//                 args: ts.args,
//                 state: ts.toState,
//               };
//             }),
//           };
//         }),
//     };
//     const rrr = report(contract);
//     // console.log(rrr, 'rrrrrrRRRR0923jlksdfjl');
//     return {
//       error: null,
//       text: rrr.audienceInfos[0].content + rrr.content,
//     };
//   } catch (err) {
//     return {
//       error: [err.message],
//     };
//   }
// }
