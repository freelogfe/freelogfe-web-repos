import * as React from 'react';
import styles from './index.less';
import { FRectBtn, FTextBtn } from '@/components/FButton';
import FModal from '@/components/FModal';

interface Banner2Props {

}

function Banner2({}: Banner2Props) {
  return (<>
    <div className={styles.banner2}>
      <div className={styles.content}>
        <FRectBtn style={{
          position: 'absolute',
          top: 218,
          left: 206,
          // top: 218px;
          // left: 206px;
          height: 50,
          padding: '0 50px',
        }}>立即参赛</FRectBtn>
        <FTextBtn
          type='primary'
          style={{ bottom: 0, left: 0, position: 'absolute' }}
        >如何参赛？</FTextBtn>
        <FTextBtn
          type='primary'
          style={{ bottom: 0, left: 80, position: 'absolute' }}
          onClick={() => {

          }}
        >规则详情</FTextBtn>
      </div>
    </div>
    <FModal
      width={1440}
      visible={false}
      footer={null}
    >
      <div>
        1234
      </div>
    </FModal>
  </>);
}

export default Banner2;
