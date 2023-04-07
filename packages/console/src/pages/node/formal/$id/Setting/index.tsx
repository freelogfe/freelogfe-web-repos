import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { ConnectState, NodeManagerModelState } from '@/models/connect';
import { Helmet } from 'react-helmet';
import { Dispatch } from 'redux';
import Sider from '@/pages/node/formal/$id/Sider';
import FSiderContentLayout from '@/layouts/FSiderContentLayout';
import FComponentsLib from '@freelog/components-lib';
import { Radio, Space } from 'antd';
import { FI18n } from '@freelog/tools-lib';
import FInput from '@/components/FInput';
import FIntroductionEditor from '@/pages/resource/components/FIntroductionEditor';
import * as AHooks from 'ahooks';
import {
  OnChange_Setting_Cover_Action,
  OnChange_Setting_Introduction_Action,
  OnChange_Setting_Limitation_Action,
  OnChange_Setting_NodeLimitationMessage_Action,
  OnChange_Setting_Title_Action,
  OnClick_Setting_CancelEditBtn_Action,
  OnClick_Setting_EditBtn_Action,
  OnClick_Setting_SaveEditBtn_Action,
  OnMount_SettingPage_Action,
} from '@/models/nodeManagerPage';
import fMessage from '@/components/fMessage';
import FUploadNodeCover from '@/components/FUploadNodeCover';
import * as imgSrc from '@/assets/default-node-cover.png';

interface SettingProps {
  dispatch: Dispatch;
  nodeManagerPage: NodeManagerModelState;
}

function Setting({ dispatch, nodeManagerPage }: SettingProps) {

  AHooks.useMount(() => {
    dispatch<OnMount_SettingPage_Action>({
      type: 'nodeManagerPage/onMount_SettingPage',
    });
  });

  AHooks.useUnmount(() => {

  });

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
          <FComponentsLib.FTitleText
            type={'h1'}
            text={FI18n.i18nNext.t('nodemgnt_nodesetting_page_title')}
          />
          <Space size={30}>
            <Space size={5}>
              <FComponentsLib.FContentText
                text={FI18n.i18nNext.t('nodemgnt_nodesetting_nodeaddress')}
                type={'additional2'}
              />
              <FComponentsLib.FContentText
                text={nodeManagerPage.setting_nodeUrl}
                type={'additional2'}
              />
              <FComponentsLib.FCopyToClipboard
                text={nodeManagerPage.setting_nodeUrl}
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
                text={String(nodeManagerPage.setting_nodeID)}
                type={'additional2'}
              />
              <FComponentsLib.FCopyToClipboard
                text={String(nodeManagerPage.setting_nodeID)}
                iconStyle={{ fontSize: 14 }}
                title={'复制'}
              />
            </Space>
          </Space>
        </div>
        <div className={styles.panel}>
          <FComponentsLib.FTitleText
            type={'h3'}
            text={FI18n.i18nNext.t('nodemgnt_nodesetting_nodelogo')}
          />
          <div style={{ height: 20 }} />
          <FUploadNodeCover
            onUploadSuccess={(url) => {
              // console.log(url, 'sdoifjsdlkfj **(******');
              dispatch<OnChange_Setting_Cover_Action>({
                type: 'nodeManagerPage/onChange_Setting_Cover',
                payload: {
                  value: url,
                },
              });
            }}
            onError={(err) => {
              fMessage(err, 'error');
            }}
          >
            <div className={styles.nodeCover}>
              <img
                style={{ height: 72, width: 72, borderRadius: '50%' }}
                src={nodeManagerPage.setting_nodeInfo.cover || imgSrc}
                alt=''
              />
              <div className={styles.nodeCoverMask}>
                <span>更换</span>
              </div>
            </div>
          </FUploadNodeCover>
          <div style={{ height: 40 }} />

          <FComponentsLib.FTitleText type={'h3'} text={FI18n.i18nNext.t('nodemgnt_nodesetting_nodetitle')} />
          <div style={{ height: 20 }} />
          {
            nodeManagerPage.setting_state === 'normal'
              ? (<div className={styles.nodeName}>
                {
                  nodeManagerPage.setting_nodeInfo.title
                    ? (<FComponentsLib.FContentText
                      text={nodeManagerPage.setting_nodeInfo.title}
                      type={'normal'}
                    />)
                    : (<i style={{ color: '#999' }}>暂无无内容...</i>)
                }

              </div>)
              : (<div className={styles.nodeName1}>
                <FInput
                  value={nodeManagerPage.setting_nodeTitle}
                  onChange={(e) => {
                    dispatch<OnChange_Setting_Title_Action>({
                      type: 'nodeManagerPage/onChange_Setting_Title',
                      payload: {
                        value: e.target.value,
                      },
                    });
                  }}
                  lengthLimit={100}
                  size='middle'
                  style={{ width: 380 }}
                  // placeholder={FI18n.i18nNext.t('form_input_singlelinetxt_error_length')}
                />
                <FComponentsLib.FContentText
                  text={'限制字符数量100'}
                  type={'additional2'}
                />
              </div>)
          }


          <div style={{ height: 40 }} />

          <FComponentsLib.FTitleText type={'h3'} text={FI18n.i18nNext.t('nodemgnt_nodesetting_nodeshortdesc')} />
          <div style={{ height: 20 }} />
          {
            nodeManagerPage.setting_state === 'normal'
              ? (<div className={styles.introduction}>
                {
                  nodeManagerPage.setting_nodeInfo.introduction
                    ? (<FComponentsLib.FContentText
                      text={nodeManagerPage.setting_nodeInfo.introduction}
                      type={'normal'}
                    />)
                    : (<i style={{ color: '#999' }}>暂无无内容...</i>)
                }

              </div>)
              : (<div className={styles.introduction1}>
                <FIntroductionEditor
                  // placeholder={FI18n.i18nNext.t('form_input_multiplelinetxt_error_length')}
                  value={nodeManagerPage.setting_nodeIntroduction}
                  onChange={(e) => {
                    dispatch<OnChange_Setting_Introduction_Action>({
                      type: 'nodeManagerPage/onChange_Setting_Introduction',
                      payload: {
                        value: e.target.value,
                      },
                    });
                  }}
                />
              </div>)
          }

          <div style={{ height: 40 }} />

          <FComponentsLib.FTitleText
            type={'h3'}
            text={FI18n.i18nNext.t('nodemgnt_nodesetting_visibility')}
          />
          <div style={{ height: 20 }} />
          <div className={styles.permission}>
            <div>
              {
                nodeManagerPage.setting_state === 'normal'
                  ? (<Radio
                    checked={nodeManagerPage.setting_nodeInfo.limitation === 'public'}
                    disabled={true}
                    style={{ margin: 0 }}
                  />)
                  : (<Radio
                    checked={nodeManagerPage.setting_nodeLimitation === 'public'}
                    onChange={(e) => {
                      if (e.target.checked) {
                        dispatch<OnChange_Setting_Limitation_Action>({
                          type: 'nodeManagerPage/onChange_Setting_Limitation',
                          payload: {
                            value: 'public',
                          },
                        });
                      }

                    }}
                    disabled={false}
                    style={{ margin: 0 }}
                  />)
              }

            </div>
            <div>
              <FComponentsLib.FContentText
                text={FI18n.i18nNext.t('nodemgnt_nodesetting_visibility_public')}
                type={'normal'}
              />
            </div>
            <div>
              <FComponentsLib.FContentText
                text={FI18n.i18nNext.t('nodemgnt_nodesetting_visibility_public_info')}
                type={'additional2'}
                style={{ lineHeight: '20px' }}
              />
            </div>

            <div>
              {
                nodeManagerPage.setting_state === 'normal'
                  ? (<Radio
                    checked={nodeManagerPage.setting_nodeInfo.limitation === 'private'}
                    disabled={true}
                    style={{ margin: 0 }}
                  />)
                  : (<Radio
                    checked={nodeManagerPage.setting_nodeLimitation === 'private'}
                    onChange={(e) => {
                      if (e.target.checked) {
                        dispatch<OnChange_Setting_Limitation_Action>({
                          type: 'nodeManagerPage/onChange_Setting_Limitation',
                          payload: {
                            value: 'private',
                          },
                        });
                      }
                    }}
                    disabled={false}
                    style={{ margin: 0 }}
                  />)
              }

            </div>
            <div>
              <FComponentsLib.FContentText
                text={FI18n.i18nNext.t('nodemgnt_nodesetting_visibility_private')}
                type={'normal'}
              />
            </div>
            <div>
              <FComponentsLib.FContentText
                text={FI18n.i18nNext.t('nodemgnt_nodesetting_visibility_private_info')}
                type={'additional2'}
                style={{ lineHeight: '20px' }}
              />
            </div>

            <div>
              {
                nodeManagerPage.setting_state === 'normal'
                  ? (<Radio
                    checked={nodeManagerPage.setting_nodeInfo.limitation === 'pause'}
                    disabled={true}
                    style={{ margin: 0 }}
                  />)
                  : (<Radio
                    checked={nodeManagerPage.setting_nodeLimitation === 'pause'}
                    onChange={(e) => {
                      if (e.target.checked) {
                        dispatch<OnChange_Setting_Limitation_Action>({
                          type: 'nodeManagerPage/onChange_Setting_Limitation',
                          payload: {
                            value: 'pause',
                          },
                        });
                      }
                    }}
                    disabled={false}
                    style={{ margin: 0 }}
                  />)
              }

            </div>
            <div>
              <FComponentsLib.FContentText
                text={FI18n.i18nNext.t('nodemgnt_nodesetting_visibility_hidefromvisitor')}
                type={'normal'}
              />
            </div>
            <div>
              <FComponentsLib.FContentText
                text={FI18n.i18nNext.t('nodemgnt_nodesetting_visibility_hidefromvisitor_info')}
                type={'additional2'}
                style={{ lineHeight: '20px' }}
              />
              {
                nodeManagerPage.setting_state === 'editing' && nodeManagerPage.setting_nodeLimitation === 'pause' && (<>
                  <div style={{ height: 15 }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <FComponentsLib.FContentText
                      text={FI18n.i18nNext.t('nodemgnt_nodesetting_changenotice_title')}
                      type={'additional2'}
                    />
                    <FComponentsLib.FTextBtn
                      type={'primary'}
                      style={{ fontSize: 12 }}
                      onClick={() => {
                        self.open('/nodePausePreview?tip=' + (nodeManagerPage.setting_nodeLimitationMessage || FI18n.i18nNext.t('nodemgnt_nodesetting_changenotice_default')));
                      }}
                    >
                      预览
                    </FComponentsLib.FTextBtn>
                  </div>
                  <div style={{ height: 15 }} />
                  <FInput
                    value={nodeManagerPage.setting_nodeLimitationMessage}
                    onChange={(e) => {
                      dispatch<OnChange_Setting_NodeLimitationMessage_Action>({
                        type: 'nodeManagerPage/onChange_Setting_NodeLimitationMessage',
                        payload: {
                          value: e.target.value,
                        },
                      });
                    }}
                    lengthLimit={100}
                    style={{ width: 740 }}
                    placeholder={FI18n.i18nNext.t('nodemgnt_nodesetting_changenotice_default')}
                  />
                </>)
              }

            </div>
          </div>
          <div style={{ height: 40 }} />

          <div className={styles.editBtn}>

            {
              nodeManagerPage.setting_state === 'normal' && (<FComponentsLib.FRectBtn
                type={'primary'}
                onClick={() => {
                  dispatch<OnClick_Setting_EditBtn_Action>({
                    type: 'nodeManagerPage/onClick_Setting_EditBtn',
                  });
                }}
              >{FI18n.i18nNext.t('nodemgnt_nodesetting_btn_edit')}</FComponentsLib.FRectBtn>)
            }

            {
              nodeManagerPage.setting_state === 'editing' && (<>
                <FComponentsLib.FTextBtn
                  type={'default'}
                  onClick={() => {
                    dispatch<OnClick_Setting_CancelEditBtn_Action>({
                      type: 'nodeManagerPage/onClick_Setting_CancelEditBtn',
                    });
                  }}
                >取消</FComponentsLib.FTextBtn>
                <FComponentsLib.FRectBtn
                  type={'primary'}
                  onClick={() => {
                    dispatch<OnClick_Setting_SaveEditBtn_Action>({
                      type: 'nodeManagerPage/onClick_Setting_SaveEditBtn',
                    });
                  }}
                  disabled={nodeManagerPage.setting_nodeTitle.length > 100 || nodeManagerPage.setting_nodeIntroduction.length > 1000 || (nodeManagerPage.setting_nodeLimitation === 'pause' && nodeManagerPage.setting_nodeLimitationMessage.length > 100)}
                >确定</FComponentsLib.FRectBtn>
              </>)
            }

          </div>
        </div>
        <div style={{ height: 100, flexShrink: 0 }} />
      </div>

    </FSiderContentLayout>
  </>);
}

export default connect(({ nodeManagerPage }: ConnectState) => ({
  nodeManagerPage,
}))(Setting);
