import * as React from 'react';
import styles from './index.less';
import {FNormalButton} from '@/components/FButton';

interface NoContentProps {

}

function NoContent({}: NoContentProps) {
  return (<div className={styles.styles}>
    <div className={styles.title}>当前节点没有添加展品</div>
    <div style={{height: 30}}/>
    <FNormalButton className={styles.button}>进入资源市场</FNormalButton>
  </div>);
}

export default NoContent;
