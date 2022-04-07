import * as React from 'react';
import styles from './index.less';
import FCodeFormatter from '../FCodeFormatter';
import * as AHooks from 'ahooks';
// import { FUtil } from '@freelog/tools-lib';
import { PolicyFullInfo_Type } from '@/type/contractTypes';
import { policyCodeTranslationToText } from '../FPolicyBuilderDrawer';

interface FPolicyDisplayProps {
  code?: string;
  fullInfo?: PolicyFullInfo_Type;
  containerHeight?: string | number;
}

function FPolicyDisplay({ code, fullInfo, containerHeight = 'auto' }: FPolicyDisplayProps) {
  // console.log(fullInfo, 'fullInfo#############');

  const [activated, setActivated] = React.useState<'code' | 'text' | 'view'>('text');

  const [text, setText] = React.useState<string>('');

  AHooks.useMount(async () => {

    const { error, text } = await policyCodeTranslationToText(code || '', 'resource');
    // const { error, text } = await policyCodeTranslationToText(code, 'resource');
    // console.log(text, code, '@@@@@@########$#$#$#$');
    if (error) {
      setText('!!!解析错误\n' + '    ' + error[0]);
      return;
    }
    setText(text || '');
  });

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
          <FCodeFormatter code={code ? code : fullInfo ? fullInfo.translateInfo.content : ''} />
        </div>)
      }

      {
        activated === 'view' && (<div style={{ height: (typeof containerHeight === 'number') ? containerHeight : 170 }}>
        </div>)
      }

      {
        activated === 'code' && (<div style={{ width: '100%' }}>
          <FCodeFormatter code={code ? text : fullInfo ? fullInfo.policyText : ''} />
        </div>)
      }
    </div>

  </div>);
}

export default FPolicyDisplay;
