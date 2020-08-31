import * as React from 'react';
import styles from './index.less';
import {FTipText} from '@/components/FText';
import {FNormalButton} from '@/components/FButton';

interface NoContentProps {

}

function NoContent({}: NoContentProps) {
  return (<>
    <div style={{height: 100}}/>
    <div className={styles.styles}>
      <FTipText text={'自由创作从Freelog开始'} type="primary"/>
      <div style={{height: 60}}/>
      <FTipText text={'在Freelog模拟资源池，您可以创建存储空间，上传模拟资源并进行测试。'} type="secondary"/>
      <div style={{height: 60}}/>
      <FNormalButton theme="big">创建Bucket</FNormalButton>
    </div>
  </>);
}

export default NoContent;
