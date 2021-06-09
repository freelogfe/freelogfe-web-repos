import * as React from 'react';
import styles from './index.less';
import FUtil1 from "@/utils";
// import {FUtil} from '@freelog/tools-lib';
import FSwitch from "@/components/FSwitch";
import {Space} from "antd";
import {FContentText} from "@/components/FText";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import FModal from "@/components/FModal";

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

function FPolicyList({dataSource, atLeastOneUsing = false, onCheckChange}: FPolicyListProps) {

  const [fullScreenText, setFullScreenText] = React.useState<string>('');

  const disabledOnlyUsing: boolean = atLeastOneUsing ? dataSource.filter((ds) => {
    return ds.using;
  }).length <= 1 : false;

  return (<div className={styles.styles}>
    {
      dataSource.map((ds) => {
        return (<div key={ds.id} className={styles.policy}>
          <div className={styles.header}>
            <FContentText
              type="highlight"
              text={ds.name}
              style={{maxWidth: 150}}
              singleRow
            />
            <Space size={8}>
              <label
                style={{color: ds.using ? '#42C28C' : '#B4B6BA'}}>{FUtil1.I18n.message('btn_activate_auth_plan')}</label>
              <FSwitch
                disabled={disabledOnlyUsing && ds.using}
                checked={ds.using}
                onChange={(value) => {
                  onCheckChange && onCheckChange({id: ds.id, using: value});
                }}
              />
            </Space>
          </div>
          <div className={styles.body}>
            <pre>{ds.text}</pre>
            <a
              className={styles.fullScreenBtn}
              onClick={() => {
                setFullScreenText(ds.text);
              }}
            >全屏查看</a>
          </div>
        </div>);
      })
    }

    <div style={{width: 270}}/>
    <div style={{width: 270}}/>

    <FModal
      title="查看策略"
      visible={!!fullScreenText}
      onCancel={() => {
        setFullScreenText('');
      }}
      footer={null}
    >
      <SyntaxHighlighter
        showLineNumbers={true}
      >{fullScreenText}</SyntaxHighlighter>
    </FModal>
  </div>);
}

export default FPolicyList;
