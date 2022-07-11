import * as React from 'react';
import styles from './index.less';
import FResourceCover from '@/components/FResourceCover';
import { FCircleBtn } from '@/components/FButton';
import { connect, Dispatch } from 'dva';
import { ConnectState, ResourceInfoModelState } from '@/models/connect';
import { withRouter, router } from 'umi';
import RouterTypes from 'umi/routerTypes';
import { ChangeAction, FetchDataSourceAction, InitModelStatesAction } from '@/models/resourceInfo';
import FLink from '@/components/FLink';
// import FUtil1 from '@/utils';
import { FUtil, FI18n } from '@freelog/tools-lib';
import fMessage from '@/components/fMessage';
import { RouteComponentProps } from 'react-router';
import { Popconfirm, Space } from 'antd';
import { FWarning } from '@/components/FIcons';
import FTooltip from '@/components/FTooltip';

interface SilderProps extends RouteComponentProps<{
  id: string;
  version: string;
}> {
  dispatch: Dispatch;
  resourceInfo: ResourceInfoModelState;
}

function Sider({ resourceInfo, match, dispatch, route }: RouterTypes & SilderProps) {

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
    router.push(FUtil.LinkTo.resourceCreateVersion({
      resourceID: match.params.id,
    }));
  }

  if (!resourceInfo.info) {
    return null;
  }

  return (<div className={styles.Sider}>
    <div style={{ height: 40 }} />
    <div className={styles.header}>
      <FResourceCover
        src={resourceInfo.info?.coverImages.length > 0 ? resourceInfo.info?.coverImages[0] : ''}
        status={(resourceInfo.info?.status & 2) === 2
          ? 'freeze'
          : resourceInfo.info?.status === 1
            ? 'online'
            : !!resourceInfo.info?.latestVersion
              ? 'offline'
              : 'unreleased'}
      />
      <div style={{ height: 15 }} />
      <FLink
        to={FUtil.LinkTo.resourceDetails({
          resourceID: resourceInfo.info?.resourceId || '',
        })}
        className={styles.resourceName}
      >{resourceInfo.info?.resourceName}</FLink>
      <div style={{ height: 10 }} />
      <label className={styles.label}>{resourceInfo.info.resourceType.join(' / ')}</label>
    </div>
    <div style={{ height: 35 }} />
    <div className={styles.radios}>
      <FLink
        className={[resourceInfo.showPage.info ? styles.activatedRadio : '', styles.radio].join(' ')}
        to={FUtil.LinkTo.resourceInfo({
          resourceID: match.params.id,
        })}
      >{FI18n.i18nNext.t('resource_information')}</FLink>
      <FLink
        className={[resourceInfo.showPage.auth ? styles.activatedRadio : '', styles.radio].join(' ')}
        to={FUtil.LinkTo.resourceAuth({
          resourceID: match.params.id,
        })}
      >
        <Space size={10}>
          <span>{FI18n.i18nNext.t('authorization_infomation')}</span>
          {resourceInfo.authProblem && (<FTooltip title={'存在授权问题'}><FWarning style={{ fontSize: 16 }} /></FTooltip>)}
        </Space>
        {resourceInfo.info?.policies.length === 0 && (<div className={styles.redDot} />)}
      </FLink>
      <div className={styles.versionControl}>
        <div className={styles.versionControlTitle}>
          <div style={{ cursor: 'default' }}>{FI18n.i18nNext.t('verions')}</div>

          {
            // match.path === '/resource/:id/$version/creator'
            resourceInfo.showPage.creator
              ? (<FCircleBtn
                type='transparent'
                onClick={() => {
                  fMessage('正在创建版本', 'warning');
                }}
              />)
              : resourceInfo.draftData
                ? (<Popconfirm
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
                ><FCircleBtn type='transparent' />
                </Popconfirm>)
                : (<FCircleBtn onClick={gotoCreator} type='transparent' />)
          }
        </div>

        <div className={styles.versions}>

          {
            resourceInfo.draftData
              ? (<FLink
                className={[styles.version, resourceInfo.showPage.creator ? styles.activatedVersion : ''].join(' ')}
                to={FUtil.LinkTo.resourceCreateVersion({
                  resourceID: match.params.id,
                })}>{resourceInfo.draftData?.version || '未输入版本号'}（草稿）</FLink>)
              : resourceInfo.showPage.creator
                ? (<FLink
                  className={[styles.version, resourceInfo.showPage.creator ? styles.activatedVersion : ''].join(' ')}
                  to={FUtil.LinkTo.resourceCreateVersion({
                    resourceID: match.params.id,
                  })}>{FI18n.i18nNext.t('unnamed_version')}</FLink>)
                : null
          }

          {
            [...resourceInfo.info?.resourceVersions].reverse().map((i) => (
              <FLink
                key={i.versionId}
                to={FUtil.LinkTo.resourceVersion({
                  resourceID: match.params.id,
                  version: i.version,
                })}
                className={[styles.version, (resourceInfo.showPage.version && match.params.version === i.version) ? styles.activatedVersion : ''].join(' ')}
              >{i.version}</FLink>))
          }
        </div>
      </div>
    </div>
    <div style={{ height: 40 }} />
  </div>);
}

export default withRouter(connect(({ resourceInfo, resourceVersionCreatorPage }: ConnectState) => ({
  resourceInfo: resourceInfo,
  resourceVersionCreatorPage: resourceVersionCreatorPage,
}))(Sider));

