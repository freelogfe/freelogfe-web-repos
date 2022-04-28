import * as React from 'react';
import styles from './index.less';
import { FPlus } from '@/components/FIcons';

interface NavListProps {

}

function NavList({}: NavListProps) {
  return (<div>
    <a
      onClick={() => {
      }}
      className={styles.newButton}>
      <FPlus style={{fontSize: 14}}/>
    </a>
  </div>);
}

export default NavList;
