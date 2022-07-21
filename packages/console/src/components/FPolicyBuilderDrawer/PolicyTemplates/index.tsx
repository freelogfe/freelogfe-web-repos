import * as React from 'react';
import styles from './index.less';
import { FTitleText } from '../../FText';
import FCodeFormatter from '../../FCodeFormatter';
import { FRectBtn } from '../../FButton';
import * as AHooks from 'ahooks';
import { policyCodeTranslationToText } from '../index';
import FComponentsLib from '@freelog/components-lib';

interface PolicyTemplatesProps {
  onSelect?({ title, text }: { title: string, text: string }): void;

  onClickSelect?(num: 1 | 2): void;
}

export const title1: string = '免费订阅（包月）';
export const text1: string = 'for public\n' +
  '\n' +
  'initial[active]:\n' +
  '  ~freelog.RelativeTimeEvent("1","month") => finish\n' +
  'finish:\n' +
  '  terminate';

export const title2: string = '付费订阅（包月）';
export const text2: string = 'for public\n' +
  '\n' +
  'initial:\n' +
  '  ~freelog.TransactionEvent("10","self.account") => auth\n' +
  'auth[active]:\n' +
  '  ~freelog.RelativeTimeEvent("1","month") => finish\n' +
  'finish:\n' +
  '  terminate';

function PolicyTemplates({ onSelect, onClickSelect }: PolicyTemplatesProps) {
  const [translation1, setTranslation1] = React.useState<string>('');
  const [translation2, setTranslation2] = React.useState<string>('');

  AHooks.useMount(async () => {
    const promise1 = policyCodeTranslationToText(text1, 'resource');
    const promise2 = policyCodeTranslationToText(text2, 'resource');
    setTranslation1((await promise1)?.text || '');
    setTranslation2((await promise2)?.text || '');
  });

  return (<div>
    <PolicyTemplate
      text={text1}
      title={title1}
      translation={translation1}
      onSelect={() => {
        onSelect && onSelect({ text: text1, title: '免费策略' });
        onClickSelect && onClickSelect(1);
      }}
    />
    <div style={{ height: 20 }} />
    <PolicyTemplate
      text={text2}
      title={title2}
      translation={translation2}
      onSelect={() => {
        onSelect && onSelect({ text: text2, title: '收费策略' });
        onClickSelect && onClickSelect(2);
      }}
    />
  </div>);
}

export default PolicyTemplates;

interface PolicyTemplateProps {
  title: string;
  translation: string;
  text: string;

  onSelect?(): void;
}

function PolicyTemplate({ text, title, translation, onSelect }: PolicyTemplateProps) {

  const [visible, setVisible] = React.useState<'none' | 'code' | 'view'>('none');

  return (<div className={styles.PolicyTemplate}>
    <div className={styles.header}>
      <FTitleText type='h1' text={title} />
      <FRectBtn
        type='primary'
        size='small'
        onClick={() => {
          onSelect && onSelect();
        }}
      >选择</FRectBtn>
    </div>
    <div style={{ height: 15 }} />
    <div className={styles.translation}>
      <FCodeFormatter code={translation} />
    </div>
    <div style={{ height: 15 }} />
    <div className={styles.navs}>
      {
        visible === 'code'
          ? (<FComponentsLib.FTextBtn
            type='primary'
            onClick={() => {
              setVisible('none');
            }}>隐藏代码</FComponentsLib.FTextBtn>)
          : (<FComponentsLib.FTextBtn
            type='primary'
            onClick={() => {
              setVisible('code');
            }}>显示代码</FComponentsLib.FTextBtn>)
      }

      <div style={{ width: 20 }} />

      {
        visible === 'view'
          ? (<FComponentsLib.FTextBtn
            type='primary'
            onClick={() => {
              setVisible('none');
            }}>隐藏状态机视图</FComponentsLib.FTextBtn>)
          : (<FComponentsLib.FTextBtn
            type='primary'
            onClick={() => {
              setVisible('view');
            }}>显示状态机视图</FComponentsLib.FTextBtn>)
      }

    </div>

    {
      visible === 'code' && (<>
        <div style={{ height: 15 }} />
        <FCodeFormatter code={text} />
      </>)
    }

    {
      visible === 'view' && (<>
        <div style={{ height: 15 }} />
        <div style={{ height: 200 }} />
      </>)
    }

  </div>);
}
