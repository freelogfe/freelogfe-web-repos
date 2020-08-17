import * as React from 'react';
import styles from "./index.less";
import {FNormalButton} from "@/components/FButton";

interface PoliciesProps {
  dataSource: {
    id: string;
    title: string;
    code: string;
  }[];
  onLicense?: (id: string, record: PoliciesProps['dataSource'][0]) => void;
}

export default function Policies({dataSource, onLicense}: PoliciesProps) {
  return (<div className={styles.styles}>
    {dataSource.map((i) => (
      <div key={i.id} className={styles.Policy}>
        <div className={styles.PolicyGrammar}>
          <div className={styles.PolicyName}>
            <span>{i.title}</span>
            <FNormalButton
              size="small"
              onClick={() => onLicense && onLicense(i.id, i)}
            >获取授权</FNormalButton>
          </div>
          <div style={{height: 5}}/>
          <pre>{i.code}</pre>
        </div>
      </div>
    ))}
  </div>)
}
