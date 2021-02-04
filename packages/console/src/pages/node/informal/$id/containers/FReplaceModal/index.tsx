import * as React from 'react';
import styles from './index.less';
import {FTitleText} from "@/components/FText";
import Replacer from "./Replacer";
import Replaced from "./Replaced";
import FModal from "@/components/FModal";
import {SwapRightOutlined} from '@ant-design/icons';

interface FReplaceModalProps {
  visible?: boolean;

  onCancel?(): void;
}

function FReplaceModal({visible, onCancel}: FReplaceModalProps) {
  return (<FModal
    title={null}
    width={947}
    visible={visible}
    closable={false}
    onCancel={() => {
      onCancel && onCancel();
    }}
  >
    <div className={styles.replaceHandler}>
      <div className={styles.replacer}>
        <FTitleText type="h5" text={'选择替换资源'}/>
        <div style={{height: 5}}/>
        <div className={styles.content}>
          <Replacer/>
        </div>
      </div>
      <div className={styles.arrow}>
        <SwapRightOutlined style={{fontSize: 36, fontWeight: 600, color: '#D8D8D8'}}/>
      </div>
      <div className={styles.replaced}>
        <FTitleText type="h5" text={'选择被替换资源'}/>
        <div style={{height: 5}}/>
        <div className={styles.content}>
          <Replaced/>
        </div>
      </div>
    </div>
  </FModal>);
}

export default FReplaceModal;
