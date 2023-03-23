import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { ConnectState, NodeManagerModelState } from '@/models/connect';
import { Helmet } from 'react-helmet';
import { Dispatch } from 'redux';
import Sider from '@/pages/node/formal/$id/Sider';
import FLeftSiderLayout from '@/layouts/FLeftSiderLayout';
import FSiderContentLayout from '@/layouts/FSiderContentLayout';
import FComponentsLib from '@freelog/components-lib';
import { Space } from 'antd';
import { FI18n } from '@freelog/tools-lib';

interface SettingProps {
  dispatch: Dispatch;
  nodeManagerPage: NodeManagerModelState;
}

function Setting({ nodeManagerPage }: SettingProps) {
  return (<>
    <Helmet>
      <title>{`节点设置 · ${nodeManagerPage.nodeName} - Freelog`}</title>
    </Helmet>

    <FSiderContentLayout
      // header={''}
      sider={<Sider />}
      // type='empty'
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <FComponentsLib.FTitleText type={'h1'} text={FI18n.i18nNext.t('nodemgnt_nodesetting_page_title')} />
          <Space size={30}>
            <Space size={5}>
              <FComponentsLib.FContentText
                text={FI18n.i18nNext.t('nodemgnt_nodesetting_nodeaddress')}
                type={'additional2'}
              />
              <FComponentsLib.FContentText
                text={'nodename.freelog.com'}
                type={'additional2'}
              />
              <FComponentsLib.FCopyToClipboard
                text={'nodename.freelog.com'}
                iconStyle={{ fontSize: 14 }}
                title={FI18n.i18nNext.t('tip_copy_node_domain')}
              />
            </Space>
            <Space size={5}>
              <FComponentsLib.FContentText
                text={FI18n.i18nNext.t('nodemgnt_nodesetting_nodeid')}
                type={'additional2'}
              />
              <FComponentsLib.FContentText
                text={'5342302'}
                type={'additional2'}
              />
              <FComponentsLib.FCopyToClipboard
                text={'5342302'}
                iconStyle={{ fontSize: 14 }}
                title={'复制'}
              />
            </Space>
          </Space>
        </div>
        <div className={styles.panel}>
          <FComponentsLib.FTitleText type={'h3'} text={FI18n.i18nNext.t('nodemgnt_nodesetting_nodelogo')} />
          <div style={{ height: 20 }} />
          <img style={{ height: 72, width: 72 }} src={'https://image.freelog.com/headImage/50028'} alt='' />
          <div style={{ height: 40 }} />

          <FComponentsLib.FTitleText type={'h3'} text={FI18n.i18nNext.t('nodemgnt_nodesetting_nodetitle')} />
          <div style={{ height: 20 }} />
          <div className={styles.nodeName}>
            <FComponentsLib.FContentText text={'black'} type={'normal'} />
          </div>
          <div style={{ height: 40 }} />

          <FComponentsLib.FTitleText type={'h3'} text={FI18n.i18nNext.t('nodemgnt_nodesetting_nodeshortdesc')} />
          <div style={{ height: 20 }} />
          <div className={styles.introduction}>
            <FComponentsLib.FContentText text={'这是我的音乐节点'} type={'normal'} />
          </div>
          <div style={{ height: 40 }} />

          <FComponentsLib.FTitleText type={'h3'} text={FI18n.i18nNext.t('nodemgnt_nodesetting_visibility')} />
          <div style={{ height: 20 }} />
          <div className={styles.introduction}>
            <FComponentsLib.FContentText text={'这是我的音乐节点'} type={'normal'} />
          </div>
          <div style={{ height: 40 }} />

          <div className={styles.editBtn}>
            <FComponentsLib.FRectBtn>编辑</FComponentsLib.FRectBtn>
          </div>
        </div>
      </div>
    </FSiderContentLayout>
  </>);
}

export default connect(({ nodeManagerPage }: ConnectState) => ({
  nodeManagerPage,
}))(Setting);
