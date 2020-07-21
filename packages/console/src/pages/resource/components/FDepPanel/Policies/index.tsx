import * as React from 'react';
import styles from "./index.less";
import {FNormalButton} from "@/components/FButton";
import {FDepPanelProps} from "@/pages/resource/components/FDepPanel";

interface PoliciesProps {
  dataSource: FDepPanelProps['dataSource'][0]['enabledPolicies'];
  onChange?: (dataRourece: PoliciesProps['dataSource']) => void;
}

export default function Policies({dataSource, onChange}: PoliciesProps) {
  return (<div className={styles.styles}>
    {dataSource.map((i) => (
      <div key={i.id} className={styles.Policy}>
        <div key={i.id} className={styles.PolicyGrammar}>
          <div className={styles.PolicyName}>
            <span>{i.title}</span>
            {/*<FNormalButton*/}
            {/*  size="small"*/}
            {/*  // onClick={() => onChange && onChange(i)}*/}
            {/*>获取授权</FNormalButton>*/}
          </div>
          <div style={{height: 5}}/>
          <pre>{i.code}</pre>
        </div>
      </div>
    ))}
  </div>)
}
