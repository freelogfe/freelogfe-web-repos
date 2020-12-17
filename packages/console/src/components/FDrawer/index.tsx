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

function FDrawer({children, width, title, onClose, ...props}: FDrawerProps) {
  return (<Drawer
    title={null}
    headerStyle={{display: 'none'}}
    bodyStyle={{padding: 0}}
    width={width}
    onClose={onClose}
    {...props}
  >
    {/*<div style={{position: 'relative'}}>*/}
      <div className={styles.header} style={{width: width}}>
        <FTitleText type="h2" text={title}/>
        <FTextButton onClick={(e: any) => onClose && onClose(e)}><FClose/></FTextButton>
      </div>
      <div style={{height: 70}}/>
      <div className={styles.content}>
        {children}
      </div>
    {/*</div>*/}
  </Drawer>);
}

export default FDrawer;
