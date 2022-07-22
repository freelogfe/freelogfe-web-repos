import * as React from 'react';
import styles from './index.less';
import AOrLink from '../AOrLink';
import FComponentsLib from '../../';

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
  activeID?: string;

  UmiLinkPatch?: any;
}

function NavList({ items, createBtn = null, activeID = '', UmiLinkPatch }: NavListProps) {
  return (<div className={styles.NavList}>
    <div style={{ height: 10 }} />
    {
      items.map((i) => {
        return <AOrLink
          className={[styles.NavItem, i.id === activeID ? styles.active : ''].join(' ')}
          key={i.id}
          href={i.href}
          UmiLinkPatch={UmiLinkPatch}
        >{i.text}</AOrLink>;
      })
    }
    <div style={{ height: 10 }} />
    {
      createBtn && (<>
        <AOrLink
          className={styles.newButton}
          href={createBtn.href}
          target={createBtn.target}
          UmiLinkPatch={UmiLinkPatch}
        >
          <FComponentsLib.FIcons.FPlus style={{ fontSize: 14 }} />
        </AOrLink>
      </>)
    }

  </div>);
}

export default NavList;
