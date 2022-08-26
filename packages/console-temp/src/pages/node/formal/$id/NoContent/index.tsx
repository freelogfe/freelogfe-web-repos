import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';

interface NoContentProps {

}

function NoContent({}: NoContentProps) {
  return (<div className={styles.styles}>
    <div className={styles.title}>当前节点没有添加展品</div>
    <div style={{height: 30}}/>
    <FComponentsLib.FRectBtn
      className={styles.button}
      type="primary"
    >进入资源市场</FComponentsLib.FRectBtn>
  </div>);
}

export default NoContent;
