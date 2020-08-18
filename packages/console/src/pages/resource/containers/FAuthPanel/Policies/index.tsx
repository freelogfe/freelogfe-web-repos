import * as React from 'react';
import styles from './index.less';
import PolicyCard from './PolicyCard';

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
      <PolicyCard
        key={i.id}
        title={i.title}
        code={i.code}
        onClickLicense={() => onLicense && onLicense(i.id, i)}
      />
    ))}
  </div>)
}


