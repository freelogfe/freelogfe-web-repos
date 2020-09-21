import * as React from 'react';
import {Pagination, Select} from 'antd';
import styles from './index.less';

interface FPaginationProps {
  current?: number
  pageSize?: number;
  total?: number;
  className?: string;
  onChangeCurrent?: (value: number) => void;
  onChangePageSize?: (value: number) => void;
}

function FPagination({className, current = 1, pageSize = 20, total = -1, onChangeCurrent, onChangePageSize}: FPaginationProps) {
  return (
    <div className={className + ' ' + styles.FPagination}>
      <Select
        className={styles.Select}
        value={pageSize}
        style={{width: 90}}
        size="small"
        onChange={(value) => onChangePageSize && onChangePageSize(value)}
      >
        <Select.Option value={10}>10条/页</Select.Option>
        <Select.Option value={20}>20条/页</Select.Option>
        <Select.Option value={30}>30条/页</Select.Option>
        <Select.Option value={40}>40条/页</Select.Option>
        <Select.Option value={50}>50条/页</Select.Option>
      </Select>
      <Pagination
        // size="small"
        current={current}
        pageSize={pageSize}
        total={total}
        // showTotal={}
        onChange={(page) => onChangeCurrent && onChangeCurrent(page)}
        showSizeChanger={false}
      />
    </div>);
}

export default FPagination;
