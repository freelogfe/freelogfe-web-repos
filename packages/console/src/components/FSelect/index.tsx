import * as React from 'react';
import {Select} from 'antd';
import {SelectProps} from 'antd/lib/select';
import styles from './index.less';

interface Option {
  value: string | number;
  title: string | number;
  disabled?: boolean;
}

interface FSelectProps extends SelectProps<any> {
  dataSource: Option[];
}

function FSelect({dataSource, className, ...props}: FSelectProps) {
  return (<Select className={className + ' ' + styles.Select} {...props}>
    {
      dataSource.map((i: Option) => (
        <Select.Option
          key={i.value}
          value={i.value}
          disabled={i.disabled}
        >{i.title}</Select.Option>))
    }
  </Select>);
}

export default FSelect;
