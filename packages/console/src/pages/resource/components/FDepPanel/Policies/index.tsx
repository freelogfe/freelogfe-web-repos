import * as React from 'react';
import styles from "./index.less";
import {FNormalButton} from "@/components/FButton";
import {FDepPanelProps} from "@/pages/resource/components/FDepPanel";
import {Checkbox} from "antd";

interface PoliciesProps {
  dataSource: FDepPanelProps['dataSource'][0]['enabledPolicies'];
  onChange?: (dataSource: PoliciesProps['dataSource']) => void;
}

export default function Policies({dataSource, onChange}: PoliciesProps) {
  function onChangeChecked(checked: boolean, contract: PoliciesProps['dataSource'][0]) {
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

  return (<div className={styles.styles}>
    {dataSource.map((i) => (
      <div key={i.id} className={styles.Policy}>
        <div className={styles.PolicyGrammar}>
          <div className={styles.PolicyName}>
            <Checkbox
              checked={i.checked}
              onChange={(e) => onChangeChecked(e.target.checked, i)}
            />
            <div style={{width: 5}}/>
            <span>{i.title}</span>
          </div>
          <div style={{height: 5}}/>
          <pre>{i.code}</pre>
        </div>
      </div>
    ))}
  </div>)
}
