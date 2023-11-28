import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import { connect } from 'dva';
import { ConnectState, ResourceCreatorBatchPageState } from '@/models/connect';
import Card from './Card';
import { Dispatch } from 'redux';
import { ChangeAction } from '@/models/resourceCreatorBatchPage';
import fPolicyBuilder from '@/components/fPolicyBuilder';
// import fConfirmModal from '@/components/fConfirmModal';
import fPromiseModalConfirm from '@/components/fPromiseModalConfirm';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import { getProcessor } from '@/components/FResourceAuthorizationProcessor';
import { getProcessor_simple } from '@/components/FResourceAuthorizationProcessor_Simple';
import fMessage from '@/components/fMessage';

interface ResourceListProps {
  dispatch: Dispatch;
  resourceCreatorBatchPage: ResourceCreatorBatchPageState;
}

function ResourceList({ dispatch, resourceCreatorBatchPage }: ResourceListProps) {

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
      // @ts-ignore
      createResourceObjects: createResourceObjects,
    };
    const { data } = await FServiceAPI.Resource.createBatch(params);
    console.log(data, 'data isdjflksjdlkfjslkdjflkjsolikfjewsoijlkj');
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
    console.log(list, 'sdiofj;sldkjflksdjfolijsdolfjlksdjlkj');
    dispatch<ChangeAction>({
      type: 'resourceCreatorBatchPage/change',
      payload: {
        showPage: 'finish',
        resultList: list,
      },
    });
  }

  return (<>
    <div className={styles.container3}>
      <div style={{ width: 920 }}>
        <div style={{ height: 35 }} />
        <div className={styles.nav}>
          <div className={styles.left}>批量发行资源</div>
          <div style={{ width: 10 }} />
          <div className={styles.other}>{'>'}</div>
          <div style={{ width: 7 }} />
          <div className={styles.other}>完善资源信息</div>
        </div>
        <div style={{ height: 35 }} />
        <div className={styles.header}>
          <Space size={10}>
            <FComponentsLib.FContentText text={'资源类型'} type={'additional2'} />
            <FComponentsLib.FContentText
              text={resourceCreatorBatchPage.selectedResourceType?.labels.join('/')}
              type={'highlight'}
              style={{ fontSize: 12 }}
            />
          </Space>

          <FComponentsLib.FContentText
            text={`共 ${resourceCreatorBatchPage.resourceListInfo.length} 个资源`}
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
                  dispatch<ChangeAction>({
                    type: 'resourceCreatorBatchPage/change',
                    payload: {
                      resourceListInfo: resourceCreatorBatchPage.resourceListInfo.map((rli) => {
                        if (value.fileUID !== rli.fileUID) {
                          return rli;
                        }
                        return value;
                      }),
                    },
                  });
                }}
                onDelete={() => {
                  dispatch<ChangeAction>({
                    type: 'resourceCreatorBatchPage/change',
                    payload: {
                      resourceListInfo: resourceCreatorBatchPage.resourceListInfo.filter((rli) => {
                        return rli.fileUID !== r.fileUID;
                      }),
                    },
                  });
                }}
                onAddPolicy={async () => {
                  // const parmas: Parameters<typeof fPolicyBuilder>[0] = {
                  //   targetType: 'resource',
                  //   alreadyUsedTexts: resourceCreatorPage.step3_policies.map<string>((ip) => {
                  //     return ip.policyText;
                  //   }),
                  //   alreadyUsedTitles: resourceCreatorPage.step3_policies.map((ip) => {
                  //     return ip.policyName;
                  //   }),
                  //   defaultValue: payload.defaultValue,
                  // };
                  const result: null | { title: string; text: string; } = await fPolicyBuilder({
                    targetType: 'resource',
                  });
                  if (!result) {
                    return;
                  }
                  const confirm: boolean = await fPromiseModalConfirm({
                    title: '提示',
                    description: '是否将本次修改应用于此处发行的所有资源？',
                    cancelText: '不，仅应用于当前资源',
                    okText: '是，应用于所有资源',
                  });
                  console.log(confirm, 'confirm sdifjlsdkjflkjlkj');
                  // fConfirmModal({
                  //   message: '是否将本次修改应用于此处发行的所有资源？',
                  //   cancelText: '不，仅应用于当前资源',
                  //   okText: '是，应用于所有资源',
                  // });
                  if (confirm) {
                    dispatch<ChangeAction>({
                      type: 'resourceCreatorBatchPage/change',
                      payload: {
                        resourceListInfo: resourceCreatorBatchPage.resourceListInfo.map((rli) => {
                          // if (r.fileUID !== rli.fileUID) {
                          //   return rli;
                          // }
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
          &nbsp;已添加授权策略的资源将会自动上架
        </div>
        <Space size={20}>
          <FComponentsLib.FRectBtn>继续添加</FComponentsLib.FRectBtn>
          <FComponentsLib.FRectBtn
            onClick={() => {
              onClickRelease();
            }}
          >现在发行</FComponentsLib.FRectBtn>
        </Space>

      </div>
    </div>
  </>);
}

export default connect(({ resourceCreatorBatchPage }: ConnectState) => ({
  resourceCreatorBatchPage: resourceCreatorBatchPage,
}))(ResourceList);
