import * as React from 'react';
import styles from './index.less';
import {Drawer} from 'antd';
import {DrawerProps} from "antd/lib/drawer";
import {FTitleText} from '@/components/FText';
import {FTextButton} from '@/components/FButton';
import {FClose} from '@/components/FIcons';

interface FDrawerProps extends DrawerProps {
  children: React.ReactNode | React.ReactNodeArray;
  title: string;
}

function FDrawer({children, title, onClose, ...props}: FDrawerProps) {
  return (<Drawer
    title={null}
    headerStyle={{display: 'none'}}
    // headerStyle={{fontWeight: 400, fontSize: 48}}
    bodyStyle={{padding: 0}}
    onClose={onClose}
    {...props}
  >
    <div className={styles.header}>
      <FTitleText type="h2" text={title}/>
      <FTextButton onClick={(e: any) => onClose && onClose(e)}><FClose/></FTextButton>
    </div>
    <div className={styles.content}>
      {children}
    </div>
  </Drawer>);
}

export default FDrawer;
