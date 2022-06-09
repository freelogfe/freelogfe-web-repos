import * as React from 'react';
import styles from './index.less';
import {Table} from 'antd';
import {TableProps} from 'antd/lib/table';

interface FTableProps extends TableProps<any> {
  rowClassName?: string;
}

function FTable({className, rowClassName, ...props}: FTableProps) {
  return (<Table
    className={[className, styles.styles].join(' ')}
    pagination={false}
    rowClassName={[styles.rowClassName, rowClassName || ''].join(' ')}
    {...props}
  />);
}

export default FTable;
