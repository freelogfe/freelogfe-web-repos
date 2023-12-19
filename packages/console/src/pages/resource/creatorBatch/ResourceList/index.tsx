import * as React from 'react';
import styles from './index.less';
import { Popover, Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import { connect } from 'dva';
import { ConnectState, ResourceCreatorBatchPageState, ResourceVersionCreatorPageModelState } from '@/models/connect';
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
import FResourceBatchUpload from '@/components/FResourceBatchUpload';
import { getFilesSha1Info } from '@/utils/service';

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
          // showPage: 'uploadFile',
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
        coverImages: item.cover === '' ? [] : [item.cover],
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

  async function localUploadGotoList(successFiles: {
    uid: string;
    name: string;
    sha1: string;
  }[]) {
    const namesMap: Map<string, number> = new Map<string, number>();

    for (const resource of resourceCreatorBatchPage.resourceListInfo) {
      if (resource.resourceName === '') {
        continue;
      }
      namesMap.set(resource.resourceName, (namesMap.get(resource.resourceName) || 0) + 1);
    }

    for (const resource of successFiles) {
      if (resource.name === '') {
        continue;
      }
      const name: string = getARightName(resource.name);
      namesMap.set(name, (namesMap.get(name) || 0) + 1);
    }

    const { data: data_ResourceNames }: {
      data: {
        [k: string]: {
          resourceNewNames: string[];
          status: 1 | 2;
        };
      }
    } = await FServiceAPI.Resource.generateResourceNames({
      data: Array.from(namesMap.entries()).map(([key, value]) => {
        return {
          name: key,
          num: value,
        };
      }),
    });

    const copyData_ResourceNames: {
      [k: string]: {
        resourceNewNames: string[];
        status: 1 | 2;
      }
    } = JSON.parse(JSON.stringify(data_ResourceNames));

    // console.log(copyData_ResourceNames, 'copyData_ResourceNames sdifjokwejlfjlwjflsdj');

    const { result } = await getFilesSha1Info({
      sha1: successFiles.map((f) => {
        return f.sha1;
      }),
      resourceTypeCode: resourceCreatorBatchPage.selectedResourceType?.value || '',
    });

    // console.log(result, 'result sdifj;lsdkjfljl');
    let resourceListInfo = [
      ...resourceCreatorBatchPage.resourceListInfo.map((resource) => {
        const resourceName = copyData_ResourceNames[resource.resourceName].resourceNewNames.shift() || '';
        return {
          ...resource,
          resourceName,
        };
      }),
      ...successFiles.map((f) => {
        let resourceName: string = '';
        const key: string = getARightName(f.name);
        if (key !== '') {
          resourceName = copyData_ResourceNames[getARightName(f.name)].resourceNewNames.shift() || '';
        }
        const resourceTitle: string = f.name.replace(new RegExp(/\.[\w-]+$/), '').substring(0, 100);
        // console.log(f.name, 'f.name sidfjlksdjflkjsdlkjl');
        // console.log(name, 'name sidfjlksdjflkjsdlkjl');
        const successFile = result.find((file) => {
          return f.sha1 === file.sha1;
        });
        return {
          fileUID: f.uid,
          fileName: f.name,
          sha1: f.sha1,
          cover: '',
          resourceName: resourceName,
          resourceNameError: resourceName === '' ? '请输入资源授权标识' : '',
          resourceTitle: resourceTitle,
          resourceTitleError: '',
          resourceLabels: [],
          resourcePolicies: [],
          showMore: false,
          rawProperties: (successFile?.info || [])
            .filter((i) => {
              return i.insertMode === 1;
            })
            .map<ResourceVersionCreatorPageModelState['rawProperties'][number]>((i) => {
              return {
                key: i.key,
                name: i.name,
                value: i.valueDisplay,
                description: i.remark,
              };
            }),
          additionalProperties: (successFile?.info || [])
            .filter((i) => {
              return i.insertMode === 2;
            })
            .map<ResourceVersionCreatorPageModelState['additionalProperties'][number]>((i) => {
              return {
                key: i.key,
                name: i.name,
                value: i.valueDisplay,
                description: i.remark,
              };
            }),
          customProperties: [],
          customConfigurations: [],
          directDependencies: [],
          baseUpcastResources: [],
        };
      }),
    ];

    if (resourceListInfo.length > 20) {
      fMessage('上传不能超过20个文件', 'warning');
      resourceListInfo = resourceListInfo.slice(0, 20);
    }
    dispatch<ChangeAction>({
      type: 'resourceCreatorBatchPage/change',
      payload: {
        // showPage: 'resourceList',
        resourceListInfo: resourceListInfo,
      },
    });

    // set$files([]);
    // set$successFiles([]);
    // set$failFiles([]);

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
            text={FI18n.i18nNext.t('brr_resourcelisting_label_resourceqty', {
              ResourceQty: resourceCreatorBatchPage.resourceListInfo.length,
            })}
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
                }}
                // onAddPolicy={async () => {
                //
                // }}
                onClickApplyPolicies={(resourceCreatorBatchPage.resourceListInfo.length <= 1 || r.resourcePolicies.length === 0) ? undefined : async () => {

                  let confirm: boolean = await fPromiseModalConfirm({
                    // title: FI18n.i18nNext.t('brr_resourcelisting_confirmation_bulkaddtags_title'),
                    title: '添加策略到其它资源',
                    description: FI18n.i18nNext.t('是否将策略应用于此处发行的所有资源？'),
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
                        // const resourceLabels: string[] = Array.from(new Set([...rli.resourceLabels, ...r.resourceLabels])).slice(0, 20);
                        const usedText: string[] = rli.resourcePolicies.map((p) => {
                          return p.text;
                        });
                        const usedTile: string[] = rli.resourcePolicies.map((p) => {
                          return p.title;
                        });
                        const policies: {
                          title: string;
                          text: string;
                        }[] = r.resourcePolicies.filter((p) => {
                          return !usedText.includes(p.text) && !usedTile.includes(p.title);
                        });
                        // console.log(policies, 'policiesisdlfkjasdlkfjlkj');
                        return {
                          ...rli,
                          resourcePolicies: [
                            ...rli.resourcePolicies,
                            ...policies,
                          ],
                        };
                      }),
                    },
                  });
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

        <FResourceBatchUpload
          resourceTypeCode={resourceCreatorBatchPage.selectedResourceType?.value || ''}
          onSuccess={localUploadGotoList}
        />
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
          {
            resourceCreatorBatchPage.resourceListInfo.length < 20 && (<FPopover
              // open={true}
              title={null}
              overlayInnerStyle={{ padding: 0 }}
              overlayStyle={{ padding: 0 }}
              style={{ padding: 0 }}
              content={<div className={styles.continue}>
                <div onClick={onLocalUpload}>
                  <FComponentsLib.FIcons.FLocalUpload />
                  <div>{FI18n.i18nNext.t('brr_submitresource_btn_uploadfromlocal')}
                  </div>
                </div>
                <div onClick={onImportStorage}>
                  <FComponentsLib.FIcons.FStorageSpace />
                  <div>{FI18n.i18nNext.t('brr_submitresource_btn_importfromstorage')}
                  </div>
                </div>
              </div>}
            >
              <div>
                <FComponentsLib.FRectBtn
                >{FI18n.i18nNext.t('brr_resourcelisting_btn_moretoupload')}</FComponentsLib.FRectBtn></div>
            </FPopover>)
          }

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

function getARightName(name: string) {
  const newName: string = name.replace(new RegExp(/\.[\w-]+$/), '')
    .substring(0, 50)
    .replace(new RegExp(/[\\|\/|:|\*|\?|"|<|>|\||\s|@|\$|#]/g), '_');
  return newName;
}
