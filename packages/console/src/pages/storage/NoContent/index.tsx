import * as React from 'react';
import styles from './index.less';
import {FTipText} from '@/components/FText';
import {FNormalButton} from '@/components/FButton';
import Header from '../Header';

interface NoContentProps {

}

function NoContent({}: NoContentProps) {

  return (<>
    <Header/>
    <div className={styles.styles}>
      <FTipText text={'当前Bucket还没有上传任何对象'} type="first"/>
      <div style={{height: 30}}/>
      <FNormalButton theme="big">上传对象</FNormalButton>
    </div>
  </>);
}

export default NoContent;
