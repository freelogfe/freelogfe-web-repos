import * as React from 'react';
import styles from "./index.less";
import {Checkbox, Space} from "antd";
import {FContentText} from "@/components/FText";

interface ContractsProps {
  dataSource: {
    checked: boolean;
    title: string;
    status: string;
    code: string;
    id: string;
    date: string;
    versions: { version: string; checked: boolean; }[];
  }[];
}

export default function Contracts({dataSource}: ContractsProps) {
  return <div className={styles.styles}>
    {dataSource.map((k) => (<div key={k.id} className={styles.Policy}>
      <div className={styles.PolicyGrammar}>
        <div className={styles.PolicyGrammarName}>
          <span>{k.title}</span>
          <label className={styles.executing}>执行中</label>
        </div>
        <div style={{height: 15}}/>
        <pre className={styles.highlight}>{k.code}</pre>
      </div>
      <div className={styles.PolicyInfo}>
        <Space size={40}>
          <FContentText type="additional2" text={'合约ID：' + k.id}/>
          <FContentText type="additional2" text={'签约时间：' + k.date}/>
        </Space>
        <div style={{height: 9}}/>
        <div>
          <FContentText type="additional2">
            应用版本：
            <Space size={15}>
              {k.versions.map((i) => <Space size={2} key={i.version}>
                <Checkbox checked={i.checked}/>
                <span>{i.version}</span>
              </Space>)}
            </Space>
          </FContentText>
        </div>
      </div>
    </div>))}
  </div>
}
