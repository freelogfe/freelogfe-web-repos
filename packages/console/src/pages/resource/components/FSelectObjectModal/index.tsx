import * as React from 'react';
import styles from './index.less';
import {Dropdown, Modal} from 'antd';
import FMenu from '@/components/FMenu';
import FInput from '@/components/FInput';
import {DownOutlined} from '@ant-design/icons';
import {FNormalButton} from '@/components/FButton';
import {FContentText} from '@/components/FText';

const types = [{
  children: '全部',
  id: 1,
}, {
  children: '部分',
  id: 2,
}];

export default function () {
  return (<Modal
    className={styles.Modal}
    // wrapClassName={styles.Modal}
    title="选择对象"
    width={640}
    bodyStyle={{paddingLeft: 40, paddingRight: 40, height: 600, overflow: 'scroll'}}
    visible={false}
    // onOk={this.handleOk}
    // onCancel={this.handleCancel}
    footer={null}
  >

    <div className={styles.SelectBucket}>
      <div className={styles.filter}>
        <div className={styles.filterSelect}>
          <Dropdown overlay={<FMenu dataSource={types}/>}>
            <span style={{cursor: 'pointer'}}>全部Bucket<DownOutlined style={{marginLeft: 8}}/></span>
          </Dropdown>
        </div>

        <FInput className={styles.filterInput} theme="dark" size="small"/>
      </div>

      <div style={{height: 17}}/>

      {
        [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i: number) => (
          <div key={i} className={styles.bucket}>
            <div>
              <FContentText text={'bucket1/xxx.png'}/>
              <div style={{height: 2}}/>
              <FContentText type={'additional2'} text={'资源类型 image | 更新时间 2019.02.10  12:12'}/>
            </div>
            <FNormalButton theme="weaken">选择</FNormalButton>
          </div>
        ))
      }
    </div>
  </Modal>);
}
