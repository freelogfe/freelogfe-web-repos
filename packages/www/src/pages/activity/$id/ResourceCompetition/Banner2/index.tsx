import * as React from 'react';
import styles from './index.less';
import FModal from '@/components/FModal';
import FComponentsLib from '@freelog/components-lib';

interface Banner2Props {
  onClickRuleBtn?(): void;
}

function Banner2({ onClickRuleBtn }: Banner2Props) {



  return (<>
    <div className={styles.banner2}>
      <div className={styles.content}>
        <FComponentsLib.FRectBtn style={{
          position: 'absolute',
          top: 218,
          left: 206,
          // top: 218px;
          // left: 206px;
          height: 50,
          padding: '0 50px',
        }}>立即参赛</FComponentsLib.FRectBtn>
        <FComponentsLib.FTextBtn
          type='primary'
          style={{ bottom: 0, left: 0, position: 'absolute' }}
          onClick={() => {
            // set_ModalVisible(true);
            onClickRuleBtn && onClickRuleBtn();
          }}
        >如何参赛？</FComponentsLib.FTextBtn>
        {/*<FComponentsLib.FTextBtn*/}
        {/*  type='primary'*/}
        {/*  style={{ bottom: 0, left: 80, position: 'absolute' }}*/}
        {/*  onClick={() => {*/}
        {/*    set_ModalVisible(true);*/}
        {/*  }}*/}
        {/*>规则详情</FComponentsLib.FTextBtn>*/}
      </div>
    </div>

  </>);
}

export default Banner2;
