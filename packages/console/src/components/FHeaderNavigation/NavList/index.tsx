import * as React from 'react';
import styles from './index.less';
import { FPlus } from '@/components/FIcons';

interface NavListProps {
  items: {
    id: string;
    text: string;
    href: string;
    target?: '_self' | '_blank';
  }[];
}

function NavList({ items }: NavListProps) {
  return (<div className={styles.NavList}>
    <div style={{ height: 10 }} />
    {
      items.map((i) => {
        return <a className={styles.NavItem} key={i.id}>
          {i.text}
        </a>;
      })
    }
    <div style={{ height: 10 }} />
    <a
      onClick={() => {
      }}
      className={styles.newButton}>
      <FPlus style={{ fontSize: 14 }} />
    </a>
  </div>);
}

export default NavList;
