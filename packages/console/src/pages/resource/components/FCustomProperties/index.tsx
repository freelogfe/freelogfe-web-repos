import * as React from 'react';
import FInput from '@/components/FInput';
import FSelect from '@/components/FSelect';
import styles from './index.less';
import {Switch} from 'antd';

export default function () {
  return (<div className={styles.styles}>
    <div className={styles.delete}>
      <a>删除</a>
    </div>

    <div className={styles.row}>
      <Field title={'key'} dot={true}>
        <FInput/>
      </Field>
      <Field title={'value'} dot={true}>
        <FInput/>
      </Field>
      <Field title={'属性说明'}>
        <FInput/>
      </Field>
      <Field title={'允许展品自定义'}>
        <Switch className={styles.Switch} size="default" defaultChecked/>
      </Field>
    </div>
    <div className={styles.row}>
      <Field className={styles.FSelect} title={'自定义方式'}>
        <FSelect
          className={styles.FSelect}
          dataSource={[{value: 1, title: '输入框'}, {value: 2, title: '下拉框'}]}
          placeholder={'请选择'}
        />
      </Field>
      <Field title={'属性说明'} className={styles.customOptions}>
        <FInput/>
      </Field>
    </div>
  </div>);
}


interface FieldProps {
  dot?: boolean;
  title: string;
  children?: React.ReactNode;
  className?: string;
}

function Field({className, dot = false, title, children}: FieldProps) {
  return (<div className={styles.Field + ' ' + className}>
    <div className={styles.FieldTitle}>
      {dot && <i className={styles.dot}/>}
      <span>{title}</span>
    </div>
    <div style={{height: 5}}/>
    <div className={styles.FieldBody}>
      {children}
    </div>
  </div>);
}
