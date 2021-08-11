import * as React from 'react';
import styles from './index.less';
import { FContentText, FTitleText } from '@/components/FText';
import FCodeFormatter from '@/components/FCodeFormatter';
import { FRectBtn, FTextBtn } from '@/components/FButton';

interface PolicyTemplatesProps {
  onSelect?({ title, text }: { title: string, text: string }): void;
}

const text1: string = `for public

initial[active]:
  ~freelog.RelativeTimeEvent("1","month") => finish
finish:
  terminate`;

const text2: string = `for public

initial:
  ~freelog.TransactionEvent("10","self.account") => auth
auth[active]:
  ~freelog.RelativeTimeEvent("1","month")  =>  finish
finish:
  terminate`;

const policiesText: string[] = [];

function PolicyTemplates({ onSelect }: PolicyTemplatesProps) {
  return (<div>
    <PolicyTemplate
      text={text1}
      title={'免费订阅（包月）'}
      translation={'免费获取授权一个月'}
      onSelect={() => {
        onSelect && onSelect({ text: text1, title: '免费策略' });
      }}
    />
    <div style={{ height: 20 }} />
    <PolicyTemplate
      text={text2}
      title={'付费订阅（包月）'}
      translation={'支付 10枚 羽币，可获取一个月的授权'}
      onSelect={() => {
        onSelect && onSelect({ text: text2, title: '收费策略' });
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
      <FRectBtn type='primary' size='small'>选择</FRectBtn>
    </div>
    <div style={{ height: 15 }} />
    <div className={styles.translation}>
      <FContentText text={translation} />
    </div>
    <div style={{ height: 15 }} />
    <div className={styles.navs}>
      {
        visible === 'code'
          ? (<FTextBtn
            type='primary'
            onClick={() => {
              setVisible('none');
            }}>隐藏代码</FTextBtn>)
          : (<FTextBtn
            type='primary'
            onClick={() => {
              setVisible('code');
            }}>显示代码</FTextBtn>)
      }

      <div style={{ width: 20 }} />

      {
        visible === 'view'
          ? (<FTextBtn
            type='primary'
            onClick={() => {
              setVisible('none');
            }}>隐藏状态机视图</FTextBtn>)
          : (<FTextBtn
            type='primary'
            onClick={() => {
              setVisible('view');
            }}>显示状态机视图</FTextBtn>)
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
