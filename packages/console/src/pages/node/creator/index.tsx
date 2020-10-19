import * as React from 'react';
import styles from './index.less';
import FCenterLayout from "@/layouts/FCenterLayout";
import {FTitleText, FContentText} from '@/components/FText';
import {FNormalButton} from '@/components/FButton';
import {Input} from 'antd';

interface NodeCreatorProps {

}

function NodeCreator({}: NodeCreatorProps) {
  return (<FCenterLayout>
    <div className={styles.header}>
      <FTitleText type="h1" text={'创建节点'}/>
    </div>
    <div className={styles.body}>
      <div className={styles.domain}>
        <FContentText type="negative" text={'节点地址'}/>
        <div className={styles.inputWrap}>
          <Input className={styles.input} placeholder={'输入节点地址'}/>
        </div>
        <FContentText type="negative" text={'.freelog.com'}/>
      </div>
      <div className={styles.errorTip}>
        {/*该节点地址已经存在或已经被其它用户使用*/}
        只能包括小写字母、数字和短横线（-）。<br/>
        必须以小写字母或者数字开头和结尾。<br/>
        长度必须在 4-24 字符之间。
      </div>
      <div className={styles.name}>
        <FContentText type="negative" text={'节点名称'}/>
        <div className={styles.inputWrap}>
          <Input className={styles.input} placeholder={'输入节点名称'}/>
        </div>
      </div>
      <div className={styles.errorTip}>
        {/*该节点名称已经存在或已经被其它用户使用*/}
        长度必须在 1-100 字符之间。<br/>
        不能以正斜线（/）或者反斜线（\）开头。<br/>
        开头和结尾的空格会自动删除。
      </div>
      <FNormalButton className={styles.button}>创建节点</FNormalButton>
    </div>
  </FCenterLayout>);
}

export default NodeCreator;
