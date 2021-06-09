import * as React from 'react';
import styles from './index.less';
import img from '@/assets/file-object.svg';
import {FContentText} from '@/components/FText';
import {Progress} from 'antd';
import FUtil1 from "@/utils";
import {FTextBtn} from "@/components/FButton";

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
        <FContentText
          type="highlight"
          text={resourceObject.name}
        />
        <div style={{height: 18}}/>
        <div className={styles.info}>
          {
            progress === null
              ? <FContentText
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

    <FTextBtn
      type="danger"
      onClick={() => onClickDelete && onClickDelete()}
      className={styles.delete}>{progress !== null ? FUtil1.I18n.message('cancel_uploading') : FUtil1.I18n.message('remove')}</FTextBtn>
  </div>)
}

export default ObjectCard;
