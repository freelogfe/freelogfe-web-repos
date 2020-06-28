import * as React from 'react';
import {Pagination, Select} from 'antd';
import styles from './index.less';

const {Option} = Select;
export default function ({className}: any) {
  return (
    <div className={className + ' ' + styles.FPagination}>
      <Select
        className={styles.Select}
        defaultValue={20}
        style={{width: 90}}
        size="small"
        // onChange={handleChange}
      >
        <Option value={10}>10条/页</Option>
        <Option value={20}>20条/页</Option>
        <Option value={30}>30条/页</Option>
        <Option value={40}>40条/页</Option>
        <Option value={50}>50条/页</Option>
      </Select>
      <Pagination
        // size="small"
        defaultCurrent={6}
        total={500}
        // showTotal={}
        showSizeChanger={false}
      />
    </div>);
}
