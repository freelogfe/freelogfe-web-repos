import * as React from 'react';
import styles from './index.less';
import { Popover, Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import { connect } from 'dva';
import { ConnectState, ResourceCreatorBatchPageState } from '@/models/connect';
import Card from './Card';
import { Dispatch } from 'redux';
import { ChangeAction } from '@/models/resourceCreatorBatchPage';
import fPolicyBuilder from '@/components/fPolicyBuilder';
import fPromiseModalConfirm from '@/components/fPromiseModalConfirm';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import { getProcessor_simple } from '@/components/FResourceAuthorizationProcessor_Simple';
import fMessage from '@/components/fMessage';
import { history } from '@@/core/history';
import FPrompt from '@/components/FPrompt';
import FPopover from '@/components/FPopover';

interface ResourceListProps {
  dispatch: Dispatch;
  resourceCreatorBatchPage: ResourceCreatorBatchPageState;

  onLocalUpload?(): void;

  onImportStorage?(): void;
}

function ResourceList({ dispatch, resourceCreatorBatchPage, onLocalUpload, onImportStorage }: ResourceListProps) {

  const [$username, set$username, get$username] = FUtil.Hook.useGetState<string>('');

  AHooks.useMount(async () => {
    const { data }: {
      data: {
        username: string;
      };
    } = await FServiceAPI.User.currentUserInfo();
    // console.log(data, 'data sdifjals;dkfjl;ksdjlfkjlskdjflkjl');
    set$username(data.username);
  });

  React.useEffect(() => {
    if (resourceCreatorBatchPage.resourceListInfo.length === 0) {
      dispatch<ChangeAction>({
        type: 'resourceCreatorBatchPage/change',
        payload: {
          showPage: 'uploadFile',
        },
      });
    }
  }, [resourceCreatorBatchPage.resourceListInfo.length]);

  // function very() {
  //   const map: Map<string, number> = new Map<string, number>();
  //
  //   // console.log(resourceCreatorBatchPage.resourceListInfo, 'resourceCreatorBatchPage.resourceListInfo sdiofjlsdkjlk');
  //   for (const info of resourceCreatorBatchPage.resourceListInfo) {
  //     map.set(info.resourceName, (map.get(info.resourceName) || 0) + 1);
  //   }
  //
  //   dispatch<ChangeAction>({
  //     type: 'resourceCreatorBatchPage/change',
  //     payload: {
  //       resourceListInfo: resourceCreatorBatchPage.resourceListInfo.map((info) => {
  //         return {
  //           ...info,
  //           resourceNameError: (info.resourceNameError !== '' && info.resourceNameError !== '不能重复')
  //             ? info.resourceNameError
  //             : ((map.get(info.resourceName) || 0) > 1 ? '不能重复' : ''),
  //         };
  //       }),
  //     },
  //   });
  // }

  async function onClickRelease() {
    const createResourceObjects: {
      name: string;
      resourceTitle?: string;
      policies?: {
        policyName: string;
        policyText: string;
        status?: 1 | 0;
      }[];
      coverImages?: string[];
      intro?: string;
      tags?: string[];

      version: string;
      fileSha1: string;
      filename: string;
      description?: string;
      dependencies?: {
        resourceId: string;
        versionRange: string;
      }[];
      customPropertyDescriptors?: {
        key: string;
        name: string;
        defaultValue: string;
        type: 'editableText' | 'readonlyText' | 'radio' | 'checkbox' | 'select';
        candidateItems?: string[];
        remark?: string;
      }[];
      baseUpcastResources?: {
        resourceId: string;
      }[];
      resolveResources: {
        resourceId: string;
        contracts: {
          policyId: string;
        }[];
      }[];
      inputAttrs?: {
        key: string;
        value: string;
      }[];
    }[] = [];

    for (const item of resourceCreatorBatchPage.resourceListInfo) {
      const p: {
        getAllTargets(): Promise<{
          id: string;
          name: string;
          type: 'resource' | 'object';
          versionRange?: string;
        }[]>;
        getAllResourcesWithPolicies(): Promise<{
          resourceID: string;
          resourceName: string;
          policyIDs: string[];
        }[]>;
        isCompleteAuthorization(): Promise<boolean>;
        getBaseUpcastResources(): Promise<{ resourceID: string; resourceName: string; }[]>;
      } = await getProcessor_simple(item.fileUID);
      // console.log(p, 'sdifsldkflsdkfjlkdsjlkjflksdjl');

      const isCompleteAuthorization: boolean = await p.isCompleteAuthorization();

      // console.log(isCompleteAuthorization, 'isCompleteAuthorization sdijf;lksdjflkjsdlkfjlkj');
      // console.log(await p.getAllResourcesWithPolicies(), 'getAllResourcesWithPolicies sdijf;getAllResourcesWithPolicies');

      if (!isCompleteAuthorization) {
        fMessage('依赖中存在未获取授权的资源', 'error');
        return;
      }

      const dependentAllResourcesWithPolicies: {
        resourceID: string;
        resourceName: string;
        policyIDs: string[];
      }[] = await p.getAllResourcesWithPolicies();

      const dependentAllTargets: {
        id: string;
        name: string;
        type: 'resource' | 'object';
        versionRange?: string;
      }[] = await p.getAllTargets();
      const baseUpcastResources: {
        resourceID: string;
        resourceName: string;
      }[] = await p.getBaseUpcastResources();

      const resolveResources: {
        resourceId: string;
        contracts: {
          policyId: string;
        }[];
      }[] = dependentAllResourcesWithPolicies
        .filter((r) => {
          return r.policyIDs.length > 0 && baseUpcastResources.every((b) => {
            return b.resourceID !== r.resourceID;
          });
        })
        .map((r) => {
          return {
            resourceId: r.resourceID,
            contracts: r.policyIDs.map((policyID) => {
              return {
                policyId: policyID,
              };
            }),
          };
        });

      createResourceObjects.push({
        name: item.resourceName,
        resourceTitle: item.resourceTitle,
        policies: item.resourcePolicies.map((p) => {
          return {
            policyName: p.title,
            policyText: p.text,
            status: 1,
          };
        }),
        coverImages: [item.cover],
        intro: '',
        tags: item.resourceLabels,
        version: '1.0.0',
        fileSha1: item.sha1,
        filename: item.fileName,
        description: '',
        dependencies: dependentAllTargets
          .map((r) => {
            return {
              resourceId: r.id,
              versionRange: r.versionRange || '',
            };
          }),
        customPropertyDescriptors: [
          ...item.customProperties
            .map<NonNullable<Parameters<typeof FServiceAPI.Resource.createVersion>[0]['customPropertyDescriptors']>[number]>
            ((i) => {
              return {
                type: 'readonlyText',
                key: i.key,
                name: i.name,
                remark: i.description,
                defaultValue: i.value,
              };
            }),
          ...item.customConfigurations
            .map<NonNullable<Parameters<typeof FServiceAPI.Resource.createVersion>[0]['customPropertyDescriptors']>[number]>((i) => {
              const isInput: boolean = i.type === 'input';
              const options: string[] = i.select;
              return {
                type: isInput ? 'editableText' : 'select',
                key: i.key,
                name: i.name,
                remark: i.description,
                defaultValue: isInput ? i.input : options[0],
                // defaultValue: isInput ? i.input : '',
                candidateItems: isInput ? undefined : options,
              };
            }),
        ],
        baseUpcastResources: baseUpcastResources.map((r) => {
          return { resourceId: r.resourceID };
        }),
        resolveResources: resolveResources,
        inputAttrs: item.additionalProperties
          .filter((ap) => {
            return ap.value !== '';
          })
          .map((ap) => {
            return {
              key: ap.key,
              value: ap.value,
            };
          }),
      });
    }

    const params: Parameters<typeof FServiceAPI.Resource.createBatch>[0] = {
      resourceTypeCode: resourceCreatorBatchPage.selectedResourceType?.value || '',
      createResourceObjects: createResourceObjects,
    };
    const { data } = await FServiceAPI.Resource.createBatch(params);
    // console.log(data, 'data isdjflksjdlkfjslkdjflkjsolikfjewsoijlkj');
    const list: {
      resourceID: string;
      resourceName: string;
      resourceTitle: string;
      cover: string;
      status: 'online' | 'offline' | 'unreleased' | 'freeze';
      policies: string[];
      failReason: string;
    }[] = Object.values(data).map((d: any) => {
      const data = d.data;
      return {
        resourceID: data.resourceId,
        resourceName: data.resourceName,
        resourceTitle: data.resourceTitle,
        cover: data.coverImages,
        status: data.status === 2
          ? 'freeze'
          : data.status === 1
            ? 'online'
            : data.status === 0
              ? 'unreleased'
              : 'offline',
        policies: data.policies.map((p: any) => {
          return p.policyName;
        }),
        failReason: d.message || '',
      };
    });
    // console.log(list, 'sdiofj;sldkjflksdjfolijsdolfjlksdjlkj');
    dispatch<ChangeAction>({
      type: 'resourceCreatorBatchPage/change',
      payload: {
        showPage: 'finish',
        resultList: list,
      },
    });
  }

  return (<>

    <FPrompt
      watch={resourceCreatorBatchPage.resourceListInfo.length > 0}
      messageText={'还没有保存，现在离开会导致信息丢失'}
      onOk={(locationHref) => {
        history.push(locationHref);
      }}
    />

    <div className={styles.container3}>
      <div style={{ width: 920 }}>
        <div style={{ height: 35 }} />
        <div className={styles.nav}>
          <div className={styles.left}>{FI18n.i18nNext.t('brr_title_bulkreleaseresource')}</div>
          <div style={{ width: 10 }} />
          <div className={styles.other}>{'>'}</div>
          <div style={{ width: 7 }} />
          <div className={styles.other}>{FI18n.i18nNext.t('brr_resourcelisting_title')}</div>
        </div>
        <div style={{ height: 35 }} />
        <div className={styles.header}>
          <Space size={10}>
            <FComponentsLib.FContentText
              text={FI18n.i18nNext.t('brr_resourcelisting_label_resourcetype')}
              type={'additional2'}
            />
            <FComponentsLib.FContentText
              text={resourceCreatorBatchPage.selectedResourceType?.labels.join('/')}
              type={'highlight'}
              style={{ fontSize: 12 }}
            />
          </Space>

          <FComponentsLib.FContentText
            // text={`共 ${resourceCreatorBatchPage.resourceListInfo.length} 个资源`}
            text={FI18n.i18nNext.t('brr_resourcelisting_label_resourceqty')}
            type={'additional2'}
          />

        </div>

        {
          resourceCreatorBatchPage.resourceListInfo.map((r, ri) => {
            return (<React.Fragment key={r.fileUID}>
              <div style={{ height: 40 }} />
              <Card
                resourceType={resourceCreatorBatchPage.selectedResourceType?.labels || []}
                order={ri + 1}
                username={$username}
                info={r}
                onChange={(value) => {
                  const resourceListInfo = resourceCreatorBatchPage.resourceListInfo.map((rli) => {
                    if (value.fileUID !== rli.fileUID) {
                      return rli;
                    }
                    return value;
                  });
                  const map: Map<string, number> = new Map<string, number>();

                  // console.log(resourceCreatorBatchPage.resourceListInfo, 'resourceCreatorBatchPage.resourceListInfo sdiofjlsdkjlk');
                  for (const info of resourceListInfo) {
                    map.set(info.resourceName, (map.get(info.resourceName) || 0) + 1);
                  }

                  dispatch<ChangeAction>({
                    type: 'resourceCreatorBatchPage/change',
                    payload: {
                      resourceListInfo: resourceListInfo.map((info) => {
                        return {
                          ...info,
                          resourceNameError: (info.resourceNameError !== '' && info.resourceNameError !== '不能重复')
                            ? info.resourceNameError
                            : ((map.get(info.resourceName) || 0) > 1 ? '不能重复' : ''),
                        };
                      }),
                    },
                  });
                  // dispatch<ChangeAction>({
                  //   type: 'resourceCreatorBatchPage/change',
                  //   payload: {
                  //
                  //   },
                  // });
                }}
                onDelete={() => {
                  const resourceListInfo = resourceCreatorBatchPage.resourceListInfo.filter((rli) => {
                    return rli.fileUID !== r.fileUID;
                  });

                  const map: Map<string, number> = new Map<string, number>();

                  // console.log(resourceCreatorBatchPage.resourceListInfo, 'resourceCreatorBatchPage.resourceListInfo sdiofjlsdkjlk');
                  for (const info of resourceListInfo) {
                    map.set(info.resourceName, (map.get(info.resourceName) || 0) + 1);
                  }

                  dispatch<ChangeAction>({
                    type: 'resourceCreatorBatchPage/change',
                    payload: {
                      resourceListInfo: resourceListInfo.map((info) => {
                        return {
                          ...info,
                          resourceNameError: (info.resourceNameError !== '' && info.resourceNameError !== '不能重复')
                            ? info.resourceNameError
                            : ((map.get(info.resourceName) || 0) > 1 ? '不能重复' : ''),
                        };
                      }),
                    },
                  });

                  // dispatch<ChangeAction>({
                  //   type: 'resourceCreatorBatchPage/change',
                  //   payload: {
                  //
                  //   },
                  // });
                }}
                onAddPolicy={async () => {
                  const result: null | { title: string; text: string; } = await fPolicyBuilder({
                    targetType: 'resource',
                  });
                  if (!result) {
                    return;
                  }

                  let confirm: boolean = false;

                  if (resourceCreatorBatchPage.resourceListInfo.length > 1) {
                    confirm = await fPromiseModalConfirm({
                      title: FI18n.i18nNext.t('brr_resourcelisting_confirmation_bulkaddauthplan_title'),
                      description: FI18n.i18nNext.t('是否将本次修改应用于此处发行的所有资源？'),
                      cancelText: FI18n.i18nNext.t('brr_resourcelisting_confirmation_bulkaddauthplan_btn_no'),
                      okText: FI18n.i18nNext.t('brr_resourcelisting_confirmation_bulkaddauthplan_yes'),
                    });
                  }

                  if (confirm) {
                    dispatch<ChangeAction>({
                      type: 'resourceCreatorBatchPage/change',
                      payload: {
                        resourceListInfo: resourceCreatorBatchPage.resourceListInfo.map((rli) => {
                          if (rli.resourcePolicies.some((p) => {
                            return p.text === result.text || p.title === result.title;
                          })) {
                            return rli;
                          }
                          return {
                            ...rli,
                            resourcePolicies: [
                              ...rli.resourcePolicies,
                              {
                                title: result.title,
                                text: result.text,
                              },
                            ],
                          };
                        }),
                      },
                    });
                  } else {
                    dispatch<ChangeAction>({
                      type: 'resourceCreatorBatchPage/change',
                      payload: {
                        resourceListInfo: resourceCreatorBatchPage.resourceListInfo.map((rli) => {
                          if (r.fileUID !== rli.fileUID) {
                            return rli;
                          }
                          if (rli.resourcePolicies.some((p) => {
                            return p.text === result.text || p.title === result.title;
                          })) {
                            return rli;
                          }
                          return {
                            ...rli,
                            resourcePolicies: [
                              ...rli.resourcePolicies,
                              {
                                title: result.title,
                                text: result.text,
                              },
                            ],
                          };
                        }),
                      },
                    });
                  }
                }}
                onClickApplyLabels={(resourceCreatorBatchPage.resourceListInfo.length <= 1 || r.resourceLabels.length === 0) ? undefined : async () => {

                  let confirm: boolean = await fPromiseModalConfirm({
                    title: FI18n.i18nNext.t('brr_resourcelisting_confirmation_bulkaddtags_title'),
                    description: FI18n.i18nNext.t('是否将标签应用于此处发行的所有资源？'),
                    cancelText: FI18n.i18nNext.t('brr_resourcelisting_confirmation_bulkaddtags_btn_no'),
                    okText: FI18n.i18nNext.t('brr_resourcelisting_confirmation_bulkaddtags_btn_yes'),
                  });

                  if (!confirm) {
                    return;
                  }

                  dispatch<ChangeAction>({
                    type: 'resourceCreatorBatchPage/change',
                    payload: {
                      resourceListInfo: resourceCreatorBatchPage.resourceListInfo.map((rli) => {
                        if (r.fileUID === rli.fileUID) {
                          return rli;
                        }
                        const resourceLabels: string[] = Array.from(new Set([...rli.resourceLabels, ...r.resourceLabels])).slice(0, 20);
                        return {
                          ...rli,
                          resourceLabels: resourceLabels,
                        };
                      }),
                    },
                  });
                }}
              />
            </React.Fragment>);
          })
        }

        <div style={{ height: 100 }} />
      </div>

    </div>

    <div className={styles.submit}>
      <div>
        <div>
          <FComponentsLib.FIcons.FInfo style={{ fontSize: 12 }} />
          &nbsp;{FI18n.i18nNext.t('brr_resourcelisting_toggles_availabletoauth')}
        </div>
        <Space size={20}>
          <FPopover
            // open={true}
            title={null}
            overlayInnerStyle={{ padding: 0 }}
            overlayStyle={{ padding: 0 }}
            style={{ padding: 0 }}
            content={<div style={{ padding: '3px 0', display: 'flex', alignItems: 'center', gap: 15 }}>
              <div
                style={{
                  width: 120,
                  height: 106,

                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#FAFBFC',
                  borderRadius: 6,
                }}
                onClick={onLocalUpload}
              >
                <FComponentsLib.FIcons.FLocalUpload style={{ fontSize: 48, color: '#666' }} />
                <div style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#666',
                  lineHeight: '18px',
                }}>{FI18n.i18nNext.t('brr_submitresource_btn_uploadfromlocal')}
                </div>
              </div>
              <div
                style={{
                  width: 120,
                  height: 106,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#EDF6FF',
                  borderRadius: 6,
                }}
                onClick={onImportStorage}
              >
                <FComponentsLib.FIcons.FStorageSpace style={{ fontSize: 48, color: '#2784FF' }} />
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#2784FF',
                    lineHeight: '18px',
                  }}
                >{FI18n.i18nNext.t('brr_submitresource_btn_importfromstorage')}
                </div>
              </div>
            </div>}
          >
            <div>
              <FComponentsLib.FRectBtn
              disabled={resourceCreatorBatchPage.resourceListInfo.length >= 20}
            >{FI18n.i18nNext.t('brr_resourcelisting_btn_moretoupload')}</FComponentsLib.FRectBtn></div>
          </FPopover>
          <FComponentsLib.FRectBtn
            disabled={resourceCreatorBatchPage.resourceListInfo.some((r) => {
              return r.resourceNameError !== '' || r.resourceTitleError !== '';
            })}
            onClick={() => {
              onClickRelease();
            }}
          >{FI18n.i18nNext.t('brr_resourcelisting_btn_completerelease')}</FComponentsLib.FRectBtn>
        </Space>

      </div>
    </div>
  </>);
}

export default connect(({ resourceCreatorBatchPage }: ConnectState) => ({
  resourceCreatorBatchPage: resourceCreatorBatchPage,
}))(ResourceList);
