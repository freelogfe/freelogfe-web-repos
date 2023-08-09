import * as React from 'react';
import styles from './index.less';
import FContentLayout from '@/layouts/FContentLayout';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ResourceCreatorPageModelState } from '@/models/connect';
import FComponentsLib from '@freelog/components-lib';
import FResourceTypeInput from '@/components/FResourceTypeInput';
import { FI18n } from '@freelog/tools-lib';

interface ResourceCreatorProps {
  dispatch: Dispatch;
  resourceCreatorPage: ResourceCreatorPageModelState;
}

function ResourceCreator({
                           dispatch,
                           resourceCreatorPage,
                         }: ResourceCreatorProps) {

  return (<div className={styles.styles}>
    <div className={styles.left}>
      <div style={{ height: 40 }} />
      <div style={{ paddingLeft: 30 }}>
        <FComponentsLib.FTitleText text={'发行资源'} type={'h1'} />
      </div>
      {/*<FComponentsLib.FTitleText text={'rqr_title'} type={'h1'} />*/}
      <div style={{ height: 40 }} />
      <div className={styles.steps}>
        <a className={[styles.step, styles.stepActivated].join(' ')}>
          <div style={{ width: 30 }}>
            <FComponentsLib.FIcons.FArrowRight className={styles.icon} />
          </div>
          <span className={styles.title}>创建资源授权条目</span>
          {/*<span className={styles.title}>{FI18n.i18nNext.t('rqr_step1')}</span>*/}
        </a>

        <a className={[styles.step, styles.stepActivated].join(' ')}>
          <div style={{ width: 30 }}>
            <FComponentsLib.FIcons.FArrowRight className={styles.icon} />
          </div>
          <span className={styles.title}>上传资源文件</span>
          {/*<span className={styles.title}>{FI18n.i18nNext.t('rqr_step2')}</span>*/}
        </a>

        <a className={[styles.step, styles.stepActivated].join(' ')}>
          <div style={{ width: 30 }}>
            <FComponentsLib.FIcons.FArrowRight className={styles.icon} />
          </div>
          <span className={styles.title}>添加授权策略</span>
          {/*<span className={styles.title}>{FI18n.i18nNext.t('rqr_step3')}</span>*/}
        </a>

        <a className={[styles.step, styles.stepActivated].join(' ')}>
          <div style={{ width: 30 }}>
            <FComponentsLib.FIcons.FArrowRight className={styles.icon} />
          </div>
          <span className={styles.title}>完善资源信息</span>
          {/*<span className={styles.title}>{FI18n.i18nNext.t('rqr_step4')}</span>*/}
        </a>
      </div>
    </div>
    <div className={styles.right}>
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
              style={{ width: 610 }}
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
    </div>
  </div>);
}

export default connect(({ resourceCreatorPage }: ConnectState) => ({
  resourceCreatorPage: resourceCreatorPage,
}))(ResourceCreator);
