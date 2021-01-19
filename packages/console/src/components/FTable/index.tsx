import * as React from 'react';
import styles from './index.less';
import {Table} from 'antd';
import {TableProps} from 'antd/lib/table';

interface FTableProps extends TableProps<any> {

}

function FTable({className, ...props}: FTableProps) {
  return (<Table
    className={[className, styles.styles].join(' ')}
    pagination={false}
    {...props}
  />);
}

export default FTable;
