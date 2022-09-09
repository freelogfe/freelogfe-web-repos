import * as React from 'react';
import styles from './index.less';
import * as AHooks from 'ahooks';
import { policyCodeTranslationToText } from '../index';
import FComponentsLib from '@freelog/components-lib';
import { FUtil, FServiceAPI, FI18n } from '@freelog/tools-lib';
import { Space } from 'antd';
import { Base64 } from 'js-base64';

interface PolicyTemplatesProps {
  onSelect?({ title, text }: { title: string, text: string }): void;
}

function PolicyTemplates({ onSelect }: PolicyTemplatesProps) {
  // const [translation1, setTranslation1] = React.useState<string>('');
  // const [translation2, setTranslation2] = React.useState<string>('');

  const [templates, set_templates] = React.useState<{
    id: string;
    title: string;
    code: string;
    translation: string;
  }[]>([]);
  AHooks.useMount(async () => {

    console.log(Base64.encode(`for public

initial:
~freelog.RelativeTimeEvent("24","hour")  =>  auth_expiration//设置等待周期
~freelog.TransactionEvent("0.19","self.account") => auth_permanent//设置价格

auth_expiration [active]:
~freelog.RelativeTimeEvent("72","hour")  =>  initial// 设置免费周期

auth_permanent [active]:
terminate`), '*(*********')

    const { data }: { data: any[] } = await FServiceAPI.Policy.policyTemplates();
    // console.log(data, ' 98ioskdjfksdjlfsjdflksjdlkj');
    const allP: Array<Promise<any>> = data.map((d: any, i) => {
      const t: string = d.template.replace(/(\t|\r)/g, ' ');
      const e: string = Base64.encode(t);
      return FServiceAPI.Policy.policyTranslation({ contract: e });
    });

    const results: string[] = (await Promise.all(allP)).map((r) => {
      return r.data;
    });
    console.log(results, '90ujsiodjflksaf09we3ujoiflsdjflksdjflksdjflksj');
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

      {/*{*/}
      {/*  visible === 'view'*/}
      {/*    ? (<FComponentsLib.FTextBtn*/}
      {/*      type='primary'*/}
      {/*      onClick={() => {*/}
      {/*        setVisible('none');*/}
      {/*      }}>隐藏状态机视图</FComponentsLib.FTextBtn>)*/}
      {/*    : (<FComponentsLib.FTextBtn*/}
      {/*      type='primary'*/}
      {/*      onClick={() => {*/}
      {/*        setVisible('view');*/}
      {/*      }}>显示状态机视图</FComponentsLib.FTextBtn>)*/}
      {/*}*/}

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
