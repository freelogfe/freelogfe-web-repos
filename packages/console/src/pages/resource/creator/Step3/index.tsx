import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '../../../../../../@freelog/components-lib';
import { FI18n } from '@freelog/tools-lib';

interface Step1Props {

}

function Step1({}: Step1Props) {
  return (<>
    <div style={{ height: 40 }} />
    <div className={styles.block}>
      <FComponentsLib.FContentText text={'授权策略'} type={'highlight'} />
      {/*<FComponentsLib.FContentText text={FI18n.i18nNext.t('authplanmgnt_title')} type={'highlight'}/>*/}
      <div style={{ height: 10 }} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <FComponentsLib.FContentText text={'资源需添加授权策略才能上架到资源市场，开放签约。'} type={'additional2'} />
        <FComponentsLib.FContentText text={'授权策略，即资源对外授权范围和条件的申明，如支付10元获得一个月使用授权。'} type={'additional2'} />
        <div style={{ height: 20 }} />

        {/*{FI18n.i18nNext.t('authplanmgnt_list_empty_btn')}*/}
        <FComponentsLib.FRectBtn
          disabled={true}
          type={'primary'}
          onClick={() => {

          }}
        >添加授权策略</FComponentsLib.FRectBtn>
      </div>
      {/*<FComponentsLib.FContentText text={FI18n.i18nNext.t('authplanmgnt_list_empty_msg')} type={'additional2'} />*/}

    </div>

    <div style={{ height: 30 }} />

    <div className={styles.btn}>

      {/*{FI18n.i18nNext.t('rqr_step3_btn_later')}*/}
      <FComponentsLib.FTextBtn type={'default'}>稍后处理</FComponentsLib.FTextBtn>

      {/*{FI18n.i18nNext.t('rqr_step3_btn_next')}*/}
      <FComponentsLib.FRectBtn
        disabled={true}
        type={'primary'}
        onClick={() => {

        }}
      >下一步</FComponentsLib.FRectBtn>
    </div>
    <div style={{ height: 100 }} />
  </>);
}

export default Step1;
