import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
// import FLink from '@/components/FLink';
import { Link } from 'umi';

interface FNavTabsProps {
  options: {
    value: string;
    label: string;
    href: string;
  }[];
  activated: string;
  className?: string;
}

function FNavTabs({ options, activated }: FNavTabsProps) {
  return (<div className={styles.styles}>
    <Space size={60}>
      {
        options.map((o) => {
          return (<Link
           key={o.value}
            className={[styles.Link, activated === o.value ? styles.activated : ''].join(' ')}
            to={o.href}
          >
            <span>{o.label}</span>
          </Link>);
        })
      }
    </Space>
  </div>);
}

export default FNavTabs;
