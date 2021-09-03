import * as React from 'react';
import styles from './index.less';
import FCodeFormatter from '@/components/FCodeFormatter';
import * as AHooks from 'ahooks';
import FUtil1 from '@/utils';

interface FPolicyDisplayProps {
  code: string;
  containerHeight?: string | number;
}

function FPolicyDisplay({ code, containerHeight = 'auto' }: FPolicyDisplayProps) {

  const [activated, setActivated] = React.useState<'code' | 'text' | 'view'>('text');
  const [text, setText] = React.useState<string>('');

  AHooks.useMount(async () => {
    const { error, text } = await FUtil1.Tool.codeTranslationToText({ code, targetType: 'resource' });
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
    <div className={styles.PolicyBodyContainer} style={{ height: containerHeight }}>

      {
        activated === 'text' && (<div>
          <FCodeFormatter code={text} />
        </div>)
      }

      {
        activated === 'view' && (<div style={{ height: (typeof containerHeight === 'number') ? containerHeight : 170 }}>
        </div>)
      }

      {
        activated === 'code' && (<div>
          <FCodeFormatter code={code} />
        </div>)
      }
    </div>

  </div>);
}

export default FPolicyDisplay;
