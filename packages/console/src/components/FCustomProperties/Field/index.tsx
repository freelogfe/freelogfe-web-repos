import * as React from 'react';
import styles from './index.less';
import FHorn from '@/pages/resource/components/FHorn';
import {FTextButton} from '@/components/FButton';
import {Space} from 'antd';
import {i18nMessage} from '@/utils/i18n';
import {EditOutlined} from '@ant-design/icons';

interface FieldProps {
  dot?: boolean;
  title: string;
  children?: React.ReactNode;
  className?: string;
  // status?: 'normal' | 'editable' | 'editing';

  // onClickEdit?(): void;

  // onClickCancel?(): void;

  // onClickConfirm?(): void;
}

function Field({className, dot = false, title, children}: FieldProps) {
  return (<div className={styles.Field + ' ' + (className || '')}>
      <div className={styles.FieldTitle}>
        {dot && <i className={styles.dot}/>}
        <span>{title}</span>
      </div>
      <div style={{height: 5}}/>

      {/*<FHorn extra={<>*/}
      {/*  {*/}
      {/*    status === 'editable' && (*/}
      {/*      <FTextButton className={styles.editable} onClick={onClickEdit}>*/}
      {/*        <EditOutlined/>*/}
      {/*      </FTextButton>*/}
      {/*    )*/}
      {/*  }*/}
      {/*  {*/}
      {/*    status === 'editing' && (*/}
      {/*      <Space size={10}>*/}
      {/*        <FTextButton onClick={onClickCancel}>{i18nMessage('cancel')}</FTextButton>*/}
      {/*        <FTextButton onClick={onClickConfirm} theme="primary">{i18nMessage('save')}</FTextButton>*/}
      {/*      </Space>)*/}
      {/*  }*/}
      {/*</>}>*/}
      {children}
      {/*</FHorn>*/}
    </div>
  );
}

export default Field;
