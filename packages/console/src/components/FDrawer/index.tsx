import * as React from 'react';
import styles from './index.less';
import {Drawer} from 'antd';
import {DrawerProps} from "antd/lib/drawer";
import FComponentsLib from '@freelog/components-lib';

interface FDrawerProps extends DrawerProps {
  children: React.ReactNode | React.ReactNodeArray;
  title: string | React.ReactNode;
  // width?: number | string;
  topRight?: React.ReactNode;
}

function FDrawer({children, topRight, width = 720, title, onClose, ...props}: FDrawerProps) {
  return (<Drawer
    className={styles.style}
    title={null}
    headerStyle={{display: 'none'}}
    bodyStyle={{padding: 0}}
    width={width || 720}
    onClose={onClose}
    maskClosable={false}
    {...props}
  >
    <div className={styles.header} style={{width: width}}>
      {typeof title === 'string' ? <FComponentsLib.FTitleText type="h2" text={title}/> : title}
      {
        topRight || (<FComponentsLib.FTextBtn type="default" onClick={(e: any) => onClose && onClose(e)}><FComponentsLib.FIcons.FClose/></FComponentsLib.FTextBtn>)
      }
    </div>
    <div style={{height: 70}}/>
    <div className={styles.content}>
      {children}
    </div>
  </Drawer>);
}

export default FDrawer;
