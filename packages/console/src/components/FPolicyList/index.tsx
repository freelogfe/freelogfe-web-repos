import * as React from 'react';
import styles from './index.less';
import FUtil1 from '@/utils';
import FSwitch from '@/components/FSwitch';
import { Space } from 'antd';
import { FContentText, FTitleText } from '@/components/FText';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import FModal from '@/components/FModal';
import FCodeFormatter from '@/components/FCodeFormatter';
import * as AHooks from 'ahooks';
import FFullScreen from '@/components/FIcons/FFullScreen';

interface FPolicyListProps {
  dataSource: {
    id: string;
    name: string;
    using: boolean;
    text: string;
  }[];

  atLeastOneUsing?: boolean;

  onCheckChange?(data: { id: string; using: boolean; }): void;
}

function FPolicyList({ dataSource, atLeastOneUsing = false, onCheckChange }: FPolicyListProps) {

  const disabledOnlyUsing: boolean = atLeastOneUsing ? dataSource.filter((ds) => {
    return ds.using;
  }).length <= 1 : false;

  return (<div className={styles.styles}>
    {
      dataSource.map((ds) => {
        return (<PolicyCard
          key={ds.id}
          name={ds.name}
          code={ds.text}
          online={ds.using}
          onlineDisable={disabledOnlyUsing && ds.using}
          onOnlineChange={(value) => {
            onCheckChange && onCheckChange({ id: ds.id, using: value });
          }}
        />);
      })
    }

    <div style={{ width: 420 }} />
    <div style={{ width: 420 }} />

  </div>);
}

export default FPolicyList;

interface PolicyCardProps {
  name: string;
  online: boolean;
  onlineDisable: boolean;
  code: string;

  onOnlineChange?(bool: boolean): void;
}

function PolicyCard({ name, online, onlineDisable, code, onOnlineChange }: PolicyCardProps) {

  const [activated, setActivated] = React.useState<'code' | 'text' | 'view'>('text');
  const [text, setText] = React.useState<string>('');

  const [fullScreenVisible, setFullScreenVisible] = React.useState<boolean>();

  AHooks.useMount(async () => {
    const { error, text } = await FUtil1.Tool.codeTranslationToText({ code, targetType: 'resource' });
    if (error) {
      setText('!!!解析错误\n' + '    ' + error[0]);
      return;
    }
    setText(text || '');
  });

  return (<div className={styles.policy}>
    <div className={styles.header}>
      <FContentText
        type='highlight'
        text={name}
        style={{ maxWidth: 150 }}
        singleRow
      />
      <Space size={8}>
        <label
          style={{ color: online ? '#42C28C' : '#B4B6BA' }}>{FUtil1.I18n.message('btn_activate_auth_plan')}</label>
        <FSwitch
          disabled={onlineDisable}
          checked={online}
          onChange={(value) => {
            onOnlineChange && onOnlineChange(value);
          }}
        />
      </Space>
    </div>
    <div className={styles.PolicyBody}>
      <div className={styles.PolicyBodyTabs}>
        <a
          className={activated === 'text' ? styles.PolicyBodyTabActivated : ''}
          onClick={() => {
            setActivated('text');
          }}
        >策略内容</a>
        <div style={{ width: 20 }} />
        <a
          className={activated === 'view' ? styles.PolicyBodyTabActivated : ''}
          onClick={() => {
            setActivated('view');
          }}
        >状态机视图</a>
        <div style={{ width: 20 }} />
        <a
          className={activated === 'code' ? styles.PolicyBodyTabActivated : ''}
          onClick={() => {
            setActivated('code');
          }}
        >策略代码</a>
      </div>
      <div className={styles.PolicyBodyContainer}>

        {
          activated === 'text' && (<div>
            <FCodeFormatter code={text} />
          </div>)
        }

        {
          activated === 'view' && (<div>
          </div>)
        }

        {
          activated === 'code' && (<div>
            <FCodeFormatter code={code} />
          </div>)
        }
      </div>

      <a
        className={styles.PolicyFullScreenBtn}
        onClick={() => {
          setFullScreenVisible(true);
        }}
      ><FFullScreen style={{ fontSize: 12 }} /></a>
    </div>
    <FModal
      title={null}
      visible={fullScreenVisible}
      onCancel={() => {
        setFullScreenVisible(false);
      }}
      width={1240}
      footer={null}
      centered
    >
      <div className={styles.ModalTile}>
        <FTitleText text={name} type='h2' />
        <div style={{ width: 20 }} />
        <label
          style={{ color: online ? '#42C28C' : '#B4B6BA' }}>{FUtil1.I18n.message('btn_activate_auth_plan')}</label>
        <div style={{ width: 10 }} />
        <FSwitch
          disabled={onlineDisable}
          checked={online}
          onChange={(value) => {
            onOnlineChange && onOnlineChange(value);
          }}
        />
      </div>

      <div className={styles.PolicyBodyTabs}>
        <a
          className={activated === 'text' ? styles.PolicyBodyTabActivated : ''}
          onClick={() => {
            setActivated('text');
          }}
        >策略内容</a>
        <div style={{ width: 20 }} />
        <a
          className={activated === 'view' ? styles.PolicyBodyTabActivated : ''}
          onClick={() => {
            setActivated('view');
          }}
        >状态机视图</a>
        <div style={{ width: 20 }} />
        <a
          className={activated === 'code' ? styles.PolicyBodyTabActivated : ''}
          onClick={() => {
            setActivated('code');
          }}
        >策略代码</a>
      </div>
      <div className={styles.PolicyBodyContainer} style={{ height: 770 }}>

        {
          activated === 'text' && (<div>
            <FCodeFormatter code={text} />
          </div>)
        }

        {
          activated === 'view' && (<div>
          </div>)
        }

        {
          activated === 'code' && (<div>
            <FCodeFormatter code={code} />
          </div>)
        }
      </div>
    </FModal>

  </div>);
}
