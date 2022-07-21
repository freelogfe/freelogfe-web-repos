import * as React from 'react';
import styles from './index.less';
import img from '@/assets/file-object.svg';
import {Progress} from 'antd';
import { FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';

interface ObjectCardProps {
  resourceObject: {
    name: string;
    path: string;
  };
  progress: number | null;
  onClickDelete?: () => void;
}

function ObjectCard({resourceObject, progress = null, onClickDelete}: ObjectCardProps) {
  return (<div className={styles.styles}>
    <div className={styles.card}>
      <img src={img} className={styles.img} alt=""/>
      <div style={{width: 20}}/>
      <div>
        <FComponentsLib.FContentText
          type="highlight"
          text={resourceObject.name}
        />
        <div style={{height: 18}}/>
        <div className={styles.info}>
          {
            progress === null
              ? <FComponentsLib.FContentText
                className={styles.infoSize}
                type="additional1"
                text={resourceObject.path}
              />
              : (<>
                <span style={{paddingRight: 10}}>{progress}%</span>
                <Progress
                  className={styles.Progress}
                  width={100}
                  showInfo={false}
                  percent={progress}
                  size="small"
                  trailColor="#EBEBEB"
                />
              </>)
          }
        </div>
      </div>
    </div>

    <FComponentsLib.FTextBtn
      type="danger"
      onClick={() => onClickDelete && onClickDelete()}
      className={styles.delete}>{progress !== null ? FI18n.i18nNext.t('cancel_uploading') : FI18n.i18nNext.t('remove')}</FComponentsLib.FTextBtn>
  </div>)
}

export default ObjectCard;
