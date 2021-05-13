import * as React from 'react';
import styles from './index.less';
import {FTipText} from '@/components/FText';
import {FRectBtn} from '@/components/FButton';
import Header from '../Header';

interface NoContentProps {

}

function NoContent({}: NoContentProps) {

  return (<>
    <Header/>
    <div className={styles.styles}>
      <FTipText text={'当前Bucket还没有上传任何对象'} type="first"/>
      <div style={{height: 30}}/>
      <FRectBtn
        size="large"
        type="primary"
      >上传对象</FRectBtn>
    </div>
  </>);
}

export default NoContent;
