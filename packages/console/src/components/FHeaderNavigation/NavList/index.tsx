import * as React from 'react';
import styles from './index.less';
import { FPlus } from '@/components/FIcons';
import { Link } from 'umi';

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
        return <a className={styles.NavItem} key={i.id}>
          {i.text}
        </a>;
      })
    }
    <div style={{ height: 10 }} />
    {
      createBtn && (<>
        {
          createBtn.href.startsWith('http')
            ? (<a
              className={styles.newButton}
              href={createBtn.href}
              target={createBtn.target}
            >
              <FPlus style={{ fontSize: 14 }} />
            </a>)
            : (<Link
              className={styles.newButton}
              to={createBtn.href}
              target={createBtn.target}
            >
              <FPlus style={{ fontSize: 14 }} />
            </Link>)
        }
        {/*<a*/}
        {/*  onClick={() => {*/}
        {/*  }}*/}
        {/*  className={styles.newButton}>*/}
        {/* */}
        {/*</a>*/}
      </>)
    }

  </div>);
}

export default NavList;
