import * as React from 'react';
import styles from './index.less';
import {FTitleText} from '@/components/FText';
import {Space} from 'antd';
import {FNormalButton} from '@/components/FButton';
import {connect, Dispatch} from 'dva';
import {CreateBucketAction} from '@/models/storageHomePage';

interface HeaderProps {
  dispatch: Dispatch;
}

function Header({dispatch}: HeaderProps) {
  return (<div className={styles.header}>
    <div className={styles.headerLeft}>
      <FTitleText type="h1" text={'bucket-001'}/>
      <div style={{height: 5}}/>
      <Space size={40}>
        <div>创建时间 2020.05.30</div>
        <div>存储对象 4</div>
      </Space>
    </div>
    <FNormalButton
      // onClick={() => dispatch<CreateBucketAction>({
      //   type: 'storageHomePage/createBucket',
      // })}
    >上传对象</FNormalButton>
  </div>);
}


export default connect()(Header);
