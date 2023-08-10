import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import FResourceTypeInput from '@/components/FResourceTypeInput';
import { FI18n } from '@freelog/tools-lib';

interface Step1Props {

}

function Step1({}: Step1Props) {
  return (<>
    <div style={{ height: 40 }} />
    <div className={styles.block}>
      <FComponentsLib.FContentText text={'资源类型'} type={'highlight'} />
      {/*<FComponentsLib.FContentText text={'rqr_input_resourcetype'} type={'highlight'}/>*/}
      <div style={{ height: 5 }} />
      <FComponentsLib.FContentText text={'选择最贴切描述此资源的类型，其它用户会通过资源类型在资源市场中寻找他们想要的资源。'} type={'additional2'} />
      {/*<FComponentsLib.FContentText text={'rqr_input_resourcetype_help'} type={'additional2'} />*/}
      <div style={{ height: 20 }} />
      <FResourceTypeInput
        value={null}
        onChange={(value) => {

        }}
      />
    </div>
    <div style={{ height: 5 }} />
    <div className={styles.block}>
      <FComponentsLib.FContentText text={'资源授权标识'} type={'highlight'} />
      {/*<FComponentsLib.FContentText text={FI18n.i18nNext.t('rqr_input_resourceauthid')} type={'highlight'}/>*/}
      <div style={{ height: 5 }} />
      <FComponentsLib.FContentText text={'此资源在整个授权系统中的唯一标识符，一旦创建则不能更改。'} type={'additional2'} />
      {/*<FComponentsLib.FContentText text={FI18n.i18nNext.t('rqr_input_resourceauthid_help')} type={'additional2'} />*/}
      <div style={{ height: 20 }} />
      <div className={styles.resourceName}>
        <FComponentsLib.FContentText
          text={`Liu /`}
          style={{ lineHeight: '38px' }}
        />
        <div>
          <FComponentsLib.FInput.FSingleLine
            value={''}
            className={styles.FInput}
            style={{ width: 840 }}
            lengthLimit={60}
            placeholder={FI18n.i18nNext.t('输入资源授权标识')}
            // placeholder={FI18n.i18nNext.t('rqr_input_resourceauthid_hint')}
            onChange={(e) => {

            }}
          />
          {/*{*/}
          {/*  resourceCreatorPage.nameErrorText !== '' && (<>*/}
          {/*    <div style={{ height: 5 }} />*/}
          {/*    <div style={{ color: '#EE4040' }}>{resourceCreatorPage.nameErrorText}</div>*/}
          {/*  </>)*/}
          {/*}*/}

        </div>
      </div>
    </div>

    <div style={{ height: 30 }} />

    <div className={styles.btn}>
      {/*{FI18n.i18nNext.t('rqr_step1_btn_createnow')}*/}
      <FComponentsLib.FRectBtn
        disabled={true}
        type={'primary'}
        onClick={() => {

        }}
      >立即创建</FComponentsLib.FRectBtn>
    </div>
  </>);
}

export default Step1;
