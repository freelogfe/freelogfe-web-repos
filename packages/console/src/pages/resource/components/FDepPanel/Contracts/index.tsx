import * as React from 'react';
import styles from "./index.less";
import {Checkbox, Space} from "antd";
import {FContentText} from "@/components/FText";
import {FDepPanelProps} from "@/pages/resource/components/FDepPanel";

interface ContractsProps {
  dataSource: FDepPanelProps['dataSource'][0]['enableReuseContracts'];
  onChange?: (dataRourece: ContractsProps['dataSource']) => void;
}

export default function Contracts({dataSource, onChange}: ContractsProps) {

  function onChangeChecked(checked: boolean, contract: ContractsProps['dataSource'][0]) {
    return onChange && onChange(dataSource.map((i) => {
      if (i.id !== contract.id) {
        return i;
      }
      return {
        ...i,
        checked,
      }
    }))
  }

  return <div className={styles.styles}>
    {dataSource.map((k) => (<div key={k.id} className={styles.Policy}>
      <div className={styles.PolicyGrammar}>
        <div className={styles.PolicyGrammarName}>
          <Checkbox
            checked={k.checked}
            onChange={(e) => onChangeChecked(e.target.checked, k)}
          />
          <div style={{width: 5}}/>
          <span>{k.title}</span>
          <div style={{width: 10}}/>
          <label className={styles[k.status]}>{k.status === 'executing' ? '执行中' : '已终止'}</label>
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
              {k.versions.map((i) => <span key={i}>{i}</span>)}
            </Space>
          </FContentText>
        </div>
      </div>
    </div>))}
  </div>
}
