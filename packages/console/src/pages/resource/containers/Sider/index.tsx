import * as React from 'react';
import styles from './index.less';
import FResourceCover from '@/components/FResourceCover';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ResourceInfoModelState } from '@/models/connect';
import { withRouter, history } from 'umi';
import { ChangeAction, FetchDataSourceAction, InitModelStatesAction } from '@/models/resourceInfo';
import { ChangeAction as ResourceAuthPage_ChangeAction } from '@/models/resourceAuthPage';
import FLink from '@/components/FLink';
import { FUtil, FI18n } from '@freelog/tools-lib';
import fMessage from '@/components/fMessage';
import { RouteComponentProps } from 'react-router';
import { Checkbox, Popconfirm, Space } from 'antd';
import { FWarning } from '@/components/FIcons';
import FTooltip from '@/components/FTooltip';
import FSwitch from '@/components/FSwitch';
import { FDialog } from '@/components/FDialog';
import FPolicyBuilderDrawer from '@/components/FPolicyBuilderDrawer';
import { FPolicyOperaterDrawer } from '@/components/FPolicyOperaterDrawer';
import { FetchResourceInfoAction, UpdatePoliciesAction } from '@/models/resourceAuthPage';
import { LoadingOutlined } from '@ant-design/icons';
import * as AHooks from 'ahooks';
import FComponentsLib from '@freelog/components-lib';

interface SilderProps
  extends RouteComponentProps<{
    id: string;
    version: string;
  }> {
  dispatch: Dispatch;
  resourceInfo: ResourceInfoModelState;
}

function Sider({ resourceInfo, match, dispatch }:SilderProps) {
  const [activeDialogShow, setActiveDialogShow] = React.useState(false);
  const [inactiveDialogShow, setInactiveDialogShow] = React.useState(false);
  const [resultPopupType, setResultPopupType] = React.useState<null | 0 | 1>(null);
  const [loading, setLoading] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const [noLonger, setNoLonger] = React.useState(false);

  AHooks.useMount(() => {
    dispatch<ResourceAuthPage_ChangeAction>({
      type: 'resourceAuthPage/change',
      payload: {
        resourceID: match.params.id,
      },
    });

  });

  React.useEffect(() => {
    if (match.path === '/resource/info/:id') {
      onChange({
        showPage: {
          info: true,
        },
      });
    } else if (match.path === '/resource/auth/:id') {
      onChange({
        showPage: {
          auth: true,
        },
      });
    } else if (match.path === '/resource/version/creator/:id') {
      onChange({
        showPage: {
          creator: true,
        },
      });
    } else if (match.path === '/resource/version/info/:id/:version') {
      onChange({
        showPage: {
          version: match.params.version,
        },
      });
    }
  }, [match]);

  React.useEffect(() => {
    onChangeMatchParamsId();

    return () => {
      dispatch<InitModelStatesAction>({
        type: 'resourceInfo/initModelStates',
      });
    };
  }, [match.params.id]);

  React.useEffect(() => {
    setActive(resourceInfo.info?.status === 1);
  }, [resourceInfo.info?.status]);

  async function onChange(payload: Partial<ResourceInfoModelState>) {
    await dispatch<ChangeAction>({
      type: 'resourceInfo/change',
      payload,
    });
  }

  async function onChangeMatchParamsId() {
    await dispatch<ChangeAction>({
      type: 'resourceInfo/change',
      payload: {
        resourceID: match.params.id,
      },
    });
    dispatch<FetchDataSourceAction>({
      type: 'resourceInfo/fetchDataSource',
      payload: match.params.id,
    });
  }

  function gotoCreator() {
    // router.push(`/resource/${match.params.id}/$version/creator`);
    history.push(
      FUtil.LinkTo.resourceCreateVersion({
        resourceID: match.params.id,
      }),
    );
  }

  if (!resourceInfo.info) {
    return null;
  }

  /** 上下架 */
  const changeStatus = (value: boolean) => {
    if (value) {
      // 上架
      const { policies, info } = resourceInfo;
      if (!info?.latestVersion) {
        fMessage('资源上架之前，需要先发行一个版本', 'error');
      } else if (policies.length === 0) {
        setActiveDialogShow(true);
      } else if (policies.filter((item) => item.status === 1).length === 0) {
        resourceInfo.policies.forEach((item: any) => {
          item.checked = false;
        });
        dispatch<ChangeAction>({
          type: 'resourceInfo/change',
          payload: {
            policyOperaterVisible: true,
          },
        });
      } else {
        const data = { status: 1 };
        operateResource(data);
      }
    } else {
      // 下架
      const resourceNoTip = localStorage.getItem('resourceNoTip') || false;
      if (resourceNoTip) {
        inactiveResource();
      } else {
        setNoLonger(false);
        setInactiveDialogShow(true);
      }
    }
  };

  /** 打开添加策略弹窗 */
  const openPolicyBuilder = () => {
    dispatch<ChangeAction>({
      type: 'resourceInfo/change',
      payload: {
        policyEditorVisible: true,
      },
    });
    setActiveDialogShow(false);
  };

  /** 上架 */
  const activeResource = () => {
    const updatePolicies = resourceInfo.policies
      .filter((item: any) => item.checked)
      .map((item) => {
        return { policyId: item.policyId, status: 1 };
      });
    const data = { status: 1, updatePolicies };
    operateResource(data);
  };

  /** 下架 */
  const inactiveResource = () => {
    if (inactiveDialogShow && noLonger) localStorage.setItem('resourceNoTip', 'true');

    const data = { status: 0 };
    operateResource(data);
  };

  /** 资源上下架 */
  const operateResource = async (data: any) => {
    setActiveDialogShow(false);
    setInactiveDialogShow(false);
    setLoading(true);
    setResultPopupType(data.status);

    const result = await FUtil.Request({
      method: 'PUT',
      url: `/v2/resources/${match.params.id}`,
      data,
    });
    if (result.errCode === 0) {
      setTimeout(() => {
        setLoading(false);
        setTimeout(() => {
          setResultPopupType(null);
        }, 1000);
      }, 1000);
      dispatch<FetchDataSourceAction>({
        type: 'resourceInfo/fetchDataSource',
        payload: match.params.id,
      });
      dispatch<FetchResourceInfoAction>({
        type: 'resourceAuthPage/fetchResourceInfo',
      });

      if (data.updatePolicies) {
        dispatch<ChangeAction>({
          type: 'resourceInfo/change',
          payload: {
            policyOperaterVisible: false,
          },
        });
      }
    } else {
      fMessage(result.msg, 'error');
      setLoading(false);
      setResultPopupType(null);
    }
  };

  return (
    <div className={styles.Sider}>
      <div style={{ height: 30 }} />
      <div className={styles.switcher}>
        <div className={styles['switcher-label']}>{FI18n.i18nNext.t('switch_set_resource_avaliable')}</div>
        <FSwitch onClick={changeStatus} checked={active} loading={loading} />
      </div>
      <div style={{ height: 30 }} />
      <div className={styles.header}>
        <FResourceCover
          src={resourceInfo.info?.coverImages.length > 0 ? resourceInfo.info?.coverImages[0] : ''}
          status={
            (resourceInfo.info?.status & 2) === 2
              ? 'freeze'
              : resourceInfo.info?.status === 1
              ? 'online'
              : !!resourceInfo.info?.latestVersion
              ? 'offline'
              : 'unreleased'
          }
        />
        <div style={{ height: 15 }} />
        <FLink
          to={FUtil.LinkTo.resourceDetails({
            resourceID: resourceInfo.info?.resourceId || '',
          })}
          className={styles.resourceName}
        >
          {resourceInfo.info?.resourceName}
        </FLink>
        <div style={{ height: 10 }} />
        <label className={styles.label}>{resourceInfo.info.resourceType.join(' / ')}</label>
      </div>
      <div style={{ height: 35 }} />
      <div className={styles.radios}>
        <FLink
          className={[resourceInfo.showPage.info ? styles.activatedRadio : '', styles.radio].join(
            ' ',
          )}
          to={FUtil.LinkTo.resourceInfo({
            resourceID: match.params.id,
          })}
        >
          {FI18n.i18nNext.t('resource_information')}
        </FLink>
        <FLink
          className={[resourceInfo.showPage.auth ? styles.activatedRadio : '', styles.radio].join(
            ' ',
          )}
          to={FUtil.LinkTo.resourceAuth({
            resourceID: match.params.id,
          })}
        >
          <Space size={10}>
            <span>{FI18n.i18nNext.t('authorization_infomation')}</span>
            {resourceInfo.authProblem && (
              <FTooltip title={'存在授权问题'}>
                <FComponentsLib.FIcons.FWarning style={{ fontSize: 16 }} />
              </FTooltip>
            )}
          </Space>
          {resourceInfo.info?.policies.length === 0 && <div className={styles.redDot} />}
        </FLink>
        <div className={styles.versionControl}>
          <div className={styles.versionControlTitle}>
            <div style={{ cursor: 'default' }}>{FI18n.i18nNext.t('verions')}</div>

            {
              // match.path === '/resource/:id/$version/creator'
              resourceInfo.showPage.creator ? (
                <FComponentsLib.FCircleBtn
                  type="transparent"
                  onClick={() => {
                    fMessage('正在创建版本', 'warning');
                  }}
                />
              ) : resourceInfo.draftData ? (
                <Popconfirm
                  title={FI18n.i18nNext.t('error_unreleasedverionexisted')}
                  // icon={<FInfo/>}
                  onConfirm={() => {
                    gotoCreator();
                  }}
                  cancelButtonProps={{
                    style: {
                      display: 'none',
                    },
                  }}
                  okText={FI18n.i18nNext.t('btn_check')}
                >
                  <FComponentsLib.FCircleBtn type="transparent" />
                </Popconfirm>
              ) : (
                <FComponentsLib.FCircleBtn onClick={gotoCreator} type="transparent" />
              )
            }
          </div>

          <div className={styles.versions}>
            {resourceInfo.draftData ? (
              <FLink
                className={[
                  styles.version,
                  resourceInfo.showPage.creator ? styles.activatedVersion : '',
                ].join(' ')}
                to={FUtil.LinkTo.resourceCreateVersion({
                  resourceID: match.params.id,
                })}
              >
                {resourceInfo.draftData?.version || '未输入版本号'}（草稿）
              </FLink>
            ) : resourceInfo.showPage.creator ? (
              <FLink
                className={[
                  styles.version,
                  resourceInfo.showPage.creator ? styles.activatedVersion : '',
                ].join(' ')}
                to={FUtil.LinkTo.resourceCreateVersion({
                  resourceID: match.params.id,
                })}
              >
                {FI18n.i18nNext.t('unnamed_version')}
              </FLink>
            ) : null}

            {[...resourceInfo.info?.resourceVersions].reverse().map((i) => (
              <FLink
                key={i.versionId}
                to={FUtil.LinkTo.resourceVersion({
                  resourceID: match.params.id,
                  version: i.version,
                })}
                className={[
                  styles.version,
                  resourceInfo.showPage.version && match.params.version === i.version
                    ? styles.activatedVersion
                    : '',
                ].join(' ')}
              >
                {i.version}
              </FLink>
            ))}
          </div>
        </div>
      </div>
      <div style={{ height: 40 }} />

      <FDialog
        show={activeDialogShow}
        title="提醒"
        desc="请先为资源添加一个授权策略，再进行上架操作"
        sureText="添加策略"
        cancel={() => {
          setActiveDialogShow(false);
        }}
        sure={openPolicyBuilder}
        loading={loading}
      ></FDialog>

      <FDialog
        show={inactiveDialogShow}
        title="提醒"
        desc="下架后其它用户将无法签约该资源，确认要下架吗？"
        sureText="下架资源"
        cancel={() => {
          setInactiveDialogShow(false);
        }}
        sure={inactiveResource}
        loading={loading}
        footer={
          <Checkbox
            className={styles['no-longer']}
            checked={noLonger}
            onChange={(e) => setNoLonger(e.target.checked)}
          >
            不再提醒
          </Checkbox>
        }
      ></FDialog>

      <FPolicyBuilderDrawer
        visible={resourceInfo.policyEditorVisible}
        alreadyUsedTexts={resourceInfo.policies.map<string>((ip) => {
          return ip.policyText;
        })}
        alreadyUsedTitles={resourceInfo.policies.map((ip) => {
          return ip.policyName;
        })}
        targetType="resource"
        onCancel={() => {
          dispatch<ChangeAction>({
            type: 'resourceInfo/change',
            payload: {
              policyEditorVisible: false,
            },
          });
        }}
        onConfirm={({ title, text }) => {
          dispatch<UpdatePoliciesAction>({
            type: 'resourceAuthPage/updatePolicies',
            payload: {
              addPolicies: [
                {
                  policyName: title,
                  policyText: window.encodeURIComponent(text),
                },
              ],
            },
          });
          dispatch<ChangeAction>({
            type: 'resourceInfo/change',
            payload: {
              policyEditorVisible: false,
            },
          });
        }}
      />

      <FPolicyOperaterDrawer
        visible={resourceInfo.policyOperaterVisible}
        type="resource"
        policiesList={resourceInfo.policies}
        onCancel={() => {
          dispatch<ChangeAction>({
            type: 'resourceInfo/change',
            payload: {
              policyOperaterVisible: false,
            },
          });
        }}
        onConfirm={activeResource}
        onNewPolicy={openPolicyBuilder}
      />

      {resultPopupType !== null && (
        <div className={styles['result-modal']}>
          <div className={styles['result-popup']}>
            {loading ? (
              <div className={styles['loader']}>
                <LoadingOutlined className={styles['loader-icon']} />
                <div className={styles['loader-text']}>
                  正在{resultPopupType === 1 ? '上架' : '下架'}
                </div>
              </div>
            ) : (
              <div className={styles['result']}>
                <i
                  className={`freelog fl-icon-shangpao ${styles['result-icon']} ${
                    styles[resultPopupType === 1 ? 'up' : 'down']
                  }`}
                ></i>
                <div className={styles['result-text']}>
                  已{resultPopupType === 1 ? '上架' : '下架'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default withRouter(
  connect(({ resourceInfo, resourceVersionCreatorPage }: ConnectState) => ({
    resourceInfo: resourceInfo,
    resourceVersionCreatorPage: resourceVersionCreatorPage,
  }))(Sider),
);
