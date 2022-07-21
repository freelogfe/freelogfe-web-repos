import * as React from 'react';
import styles from './index.less';
import {FTipText} from '@/components/FText';
import Header from '../Header';
import FComponentsLib from '@freelog/components-lib';

interface NoContentProps {

}

function NoContent({}: NoContentProps) {

  return (<>
    <Header/>
    <div className={styles.styles}>
      <FTipText text={'当前Bucket还没有上传任何对象'} type="first"/>
      <div style={{height: 30}}/>
      <FComponentsLib.FRectBtn
        size="large"
        type="primary"
      >上传对象</FComponentsLib.FRectBtn>
    </div>
  </>);
}

export default NoContent;
