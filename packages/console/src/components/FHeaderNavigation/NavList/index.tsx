import * as React from 'react';
import styles from './index.less';
import { FPlus } from '@/components/FIcons';
import AOrLink from '../AOrLink';

interface NavListProps {
  items: {
    id: string;
    text: string;
    href: string;
    target?: '_self' | '_blank';
  }[];
  createBtn?: {
    href: string;
    target?: '_self' | '_blank';
  } | null;
}

function NavList({ items, createBtn = null }: NavListProps) {
  return (<div className={styles.NavList}>
    <div style={{ height: 10 }} />
    {
      items.map((i) => {
        return <AOrLink className={styles.NavItem} key={i.id} href={i.href}>
          {i.text}
        </AOrLink>;
      })
    }
    <div style={{ height: 10 }} />
    {
      createBtn && (<>
        {/*{*/}
        {/*  createBtn.href.startsWith('http')*/}
        {/*    ? (<a*/}
        {/*      className={styles.newButton}*/}
        {/*      href={createBtn.href}*/}
        {/*      target={createBtn.target}*/}
        {/*    >*/}
        {/*      <FPlus style={{ fontSize: 14 }} />*/}
        {/*    </a>)*/}
        {/*    : (<Link*/}
        {/*      className={styles.newButton}*/}
        {/*      to={createBtn.href}*/}
        {/*      target={createBtn.target}*/}
        {/*    >*/}
        {/*      <FPlus style={{ fontSize: 14 }} />*/}
        {/*    </Link>)*/}
        {/*}*/}
        <AOrLink
          className={styles.newButton}
          href={createBtn.href}
          target={createBtn.target}
        >
          <FPlus style={{ fontSize: 14 }} />
        </AOrLink>
      </>)
    }

  </div>);
}

export default NavList;
