import { LoadingOutlined } from '@ant-design/icons';
import * as React from 'react';
import styles from './index.less';

export const FDialog = (props: {
  show: boolean;
  title: string;
  desc: string;
  cancelText?: string;
  cancel: () => void;
  sureText?: string;
  sure: () => void;
  loading?: boolean;
  footer?: any;
}) => {
  const {
    show,
    title,
    desc,
    cancelText = '取消',
    cancel,
    sureText = '确定',
    sure,
    loading = false,
    footer,
  } = props;

  return (
    <>
      {show && (
        <div className={styles.modal} onClick={cancel}>
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <i className={`freelog fl-icon-guanbi ${styles['close-btn']}`} onClick={cancel} />
            <div className={styles.title}>{title}</div>
            <div className={styles.desc}>{desc}</div>
            <div className={styles.btns}>
              <div className={styles['cancel-btn']} onClick={cancel}>
                {cancelText}
              </div>
              <div className={styles['sure-btn']} onClick={sure}>
                {loading && <LoadingOutlined className={styles.loader} />}
                {sureText}
              </div>
            </div>
            <div className={styles.footer}>{footer}</div>
          </div>
        </div>
      )}
    </>
  );
};
