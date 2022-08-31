import * as React from 'react';
import styles from './index.less';
import * as AHooks from 'ahooks';
import { policyCodeTranslationToText } from '../index';
import FComponentsLib from '@freelog/components-lib';
import { FUtil, FServiceAPI, FI18n } from '@freelog/tools-lib';
import { Space } from 'antd';

interface PolicyTemplatesProps {
  onSelect?({ title, text }: { title: string, text: string }): void;

  // onClickSelect?(num: number): void;
}

// export const title1: string = '免费订阅（包月）';
// export const text1: string = `for public
//
// initial:
// ~freelog.RelativeTimeEvent("24","hour")  =>  auth_expiration\t\t//设置等待周期
// ~freelog.TransactionEvent("0.19","self.account") => auth_permanent\t\t//设置价格
//
// auth_expiration [active]:
// ~freelog.RelativeTimeEvent("72","hour")  =>  initial\t\t// 设置免费周期
//
// auth_permanent [active]:
// \tterminate
// `;
//
// export const title2: string = '付费订阅（包月）';
// export const text2: string = 'for public\n' +
//   '\n' +
//   'initial:\n' +
//   '  ~freelog.TransactionEvent("10","self.account") => auth\n' +
//   'auth[active]:\n' +
//   '  ~freelog.RelativeTimeEvent("1","month") => finish\n' +
//   'finish:\n' +
//   '  terminate';

function PolicyTemplates({ onSelect, onClickSelect }: PolicyTemplatesProps) {
  // const [translation1, setTranslation1] = React.useState<string>('');
  // const [translation2, setTranslation2] = React.useState<string>('');

  const [templates, set_templates] = React.useState<{
    id: string;
    title: string;
    code: string;
    translation: string;
  }[]>([]);
  AHooks.useMount(async () => {

    // const promise1 = policyCodeTranslationToText(text1, 'resource');
    // const promise2 = policyCodeTranslationToText(text2, 'resource');
    // setTranslation1((await promise1)?.text || '');
    // setTranslation2((await promise2)?.text || '');

    const { data }: { data: any[] } = await FServiceAPI.Policy.policyTemplates();
    // console.log(data, ' 98ioskdjfksdjlfsjdflksjdlkj');
    const allP: Array<Promise<any>> = data.map((d: any) => {
      return policyCodeTranslationToText(d.template, 'resource');
    });
    const results: string[] = (await Promise.all(allP)).map((r) => {
      return r.text;
    });
    // console.log(results, '90ujsiodjflksaf09we3ujoiflsdjflksdjflksdjflksj');
    set_templates(data.map((d, i: number) => {
      return {
        id: d._id,
        title: d.title || ('标题' + i),
        code: d.template,
        translation: results[i],
      };
    }));
  });

  return (<Space size={20} direction={'vertical'} style={{ width: '100%' }}>
    {
      templates.map((t, i) => {
        return (<PolicyTemplate
          key={t.id}
          title={t.title}
          text={t.code}
          translation={t.translation}
          onSelect={() => {
            onSelect && onSelect({ text: t.code, title: t.title });
            // onClickSelect && onClickSelect(i + 1);
          }}
        />);
      })
    }

    {/*<div style={{ height: 20 }} />*/}
    {/*<PolicyTemplate*/}
    {/*  text={text2}*/}
    {/*  title={title2}*/}
    {/*  translation={translation2}*/}
    {/*  onSelect={() => {*/}
    {/*    onSelect && onSelect({ text: text2, title: '收费策略' });*/}
    {/*    onClickSelect && onClickSelect(2);*/}
    {/*  }}*/}
    {/*/>*/}
  </Space>);
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
      <FComponentsLib.FTitleText type='h1' text={title} />
      <FComponentsLib.FRectBtn
        type='primary'
        size='small'
        onClick={() => {
          onSelect && onSelect();
        }}
      >选择</FComponentsLib.FRectBtn>
    </div>
    <div style={{ height: 15 }} />
    <div className={styles.translation}>
      <FComponentsLib.FCodeFormatter code={translation} />
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
        <FComponentsLib.FCodeFormatter code={text} />
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
