import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import { FI18n } from '@freelog/tools-lib';
import img from '@/assets/file-object.svg';
import { RcFile } from 'antd/lib/upload/interface';

interface ErrorCardProps {
  order: number;
  errorInfo: {
    uid: string;
    file: RcFile | null;
    fileName: string;
    from: string;
    errorText: string;
  };

  onDelete?(): void;
}

function ErrorCard({ order, errorInfo, onDelete }: ErrorCardProps) {
  return (<div className={styles.resourceContainer}>
    <div className={styles.resourceOrder}>
      <FComponentsLib.FContentText
        text={FI18n.i18nNext.t('brr_resourcelisting_item_no', {
          ResourceNO: order,
        })}
        type={'highlight'}
        style={{ fontSize: 12 }}
      />
      <FComponentsLib.FTextBtn
        style={{ fontSize: 12 }}
        type={'danger'}
        onClick={() => {
          onDelete && onDelete();
          // const dataSource: HandleStates['dataSource'] = get$dataSource()
          //   .filter((rli) => {
          //     return rli.uid !== r.uid;
          //   });
          // set$dataSource(dataSource);
        }}
      >
        <FComponentsLib.FIcons.FDelete style={{ fontSize: 12 }} />
        &nbsp;{FI18n.i18nNext.t('brr_resourcelisting_item_btn_deleteitem')}
      </FComponentsLib.FTextBtn>
    </div>
    <div style={{ height: 5 }} />
    <div className={styles.fileInfo}>
      <div className={styles.card}>
        <img src={img} className={styles.img} alt='' />
        <div style={{ width: 20 }} />
        <div>
          <FComponentsLib.FContentText
            type='highlight'
            text={errorInfo.fileName}
            style={{ maxWidth: 600 }}
            singleRow
          />
          <div style={{ height: 18 }} />
          <div className={styles.info}>
            <FComponentsLib.FContentText
              className={styles.infoSize}
              type='additional1'
              text={errorInfo.from}
            />
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <FComponentsLib.FTextBtn
          type='danger'
          style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}
        >{errorInfo.errorText}</FComponentsLib.FTextBtn>
      </div>
    </div>
  </div>);
}

export default ErrorCard;
