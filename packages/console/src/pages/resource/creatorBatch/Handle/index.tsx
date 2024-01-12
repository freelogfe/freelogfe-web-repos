import * as React from 'react';
import styles from './index.less';
import { Dispatch } from 'redux';
import { ChangeAction, ResourceCreatorBatchPageState } from '@/models/resourceCreatorBatchPage';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { RcFile } from 'antd/lib/upload/interface';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import { history } from '@@/core/history';
import FPrompt from '@/components/FPrompt';
import { Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import fPromiseModalConfirm from '@/components/fPromiseModalConfirm';
import FPopover from '@/components/FPopover';
import { getFilesSha1Info } from '@/utils/service';
import fMessage from '@/components/fMessage';
import fObjectsSelectorDrawer from '@/components/fObjectsSelectorDrawer';
import UploadFile from './NoDate';
import Card from './Card';
import ErrorCard from './ErrorCard';
import Task from './Task';

interface HandleProps {
  dispatch: Dispatch;
  resourceCreatorBatchPage: ResourceCreatorBatchPageState;
}

interface HandleStates {
  dataSource: {
    uid: string;
    state: 'localUpload' | 'list' | 'error';
    localUploadInfo: {
      uid: string;
      file: RcFile;
    } | null;
    listInfo: {
      uid: string;
      fileName: string;
      sha1: string;
      cover: string;
      resourceName: string;
      resourceNameError: string;
      resourceTitle: string;
      resourceTitleError: string;
      resourceLabels: string[];
      resourcePolicies: {
        title: string;
        text: string;
      }[];
      showMore: boolean;
      rawProperties: {
        key: string;
        name: string;
        value: string;
        description: string;
      }[];
      additionalProperties: {
        key: string;
        name: string;
        value: string;
        description: string;
      }[];
      customProperties: {
        key: string;
        name: string;
        value: string;
        description: string;
      }[];
      customConfigurations: {
        key: string;
        name: string;
        description: string;
        type: 'input' | 'select';
        input: string;
        select: string[];
      }[];
      directDependencies: {
        id: string;
        name: string;
        type: 'resource' | 'object';
        versionRange?: string;
      }[];
      baseUpcastResources: {
        resourceID: string;
        resourceName: string;
      }[];
      resolveResources: {
        resourceId: string;
        contracts: {
          policyId: string;
        }[];
      }[];
      isCompleteAuthorization: boolean;
    } | null;
    errorInfo: {
      uid: string;
      file: RcFile | null;
      fileName: string;
      from: string;
      errorText: string;
    } | null;
  }[];
}

const initStates: HandleStates = {
  dataSource: [],
};

function Handle({ dispatch, resourceCreatorBatchPage }: HandleProps) {
  const [$dataSource, set$dataSource, get$dataSource] = FUtil.Hook.useGetState<HandleStates['dataSource']>(initStates['dataSource']);

  function onLocalUpload() {

  }

  async function onImportStorage() {

    const objIDs: string[] | null = await fObjectsSelectorDrawer({
      resourceTypeCode: resourceCreatorBatchPage.selectedResourceType?.value || '',
    });
    // console.log(objIDs, 'objIDs');
    if (!objIDs) {
      return;
    }

    const { data: data_objs }: {
      data: {
        customProperty: any;
        customPropertyDescriptors: any[]
        dependencies: [],
        objectId: string;
        objectName: string;
        sha1: string;
      }[];
    } = await FServiceAPI.Storage.batchObjectList({
      objectIds: objIDs.join(','),
    });

    const namesMap: Map<string, number> = new Map<string, number>();

    for (const resource of get$dataSource()) {
      if (!resource.listInfo || resource.listInfo.resourceName === '') {
        continue;
      }
      namesMap.set(resource.listInfo.resourceName, (namesMap.get(resource.listInfo.resourceName) || 0) + 1);
    }

    for (const obj of data_objs) {
      const name = getARightName(obj.objectName);
      if (name === '') {
        continue;
      }
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

    const { result } = await getFilesSha1Info({
      sha1: data_objs.map((f) => {
        return f.sha1;
      }),
      resourceTypeCode: resourceCreatorBatchPage.selectedResourceType?.value || '',
    });

    let covers: string[] = [];
    if (resourceCreatorBatchPage.selectedResourceType?.labels.includes('图片')) {
      // console.error(info, 'info 89weijufoliksjdlfkjsdlkfjlkdsjflksdjlfkj');
      const coverPromise = data_objs.map((o) => {
        return FServiceAPI.Storage.handleImage({
          sha1: o.sha1,
        });
      });
      const res: { ret: number, errCode: number, data: { url: string } }[] = await Promise.all(coverPromise);

      // console.error(res, 'res sdflksdjflksjdlkfjlksdjflsdjlfjlskdjlk');
      covers = res.map(({ ret, errCode, data }) => {
        if (ret === 0 && errCode === 0) {
          return data.url || '';
        }
        return '';
      });
    }

    const data_isOccupied: { [sha1: string]: boolean } = await isOccupied(data_objs.map((o) => {
      return o.sha1;
    }));
    let dataSource: HandleStates['dataSource'] = [
      ...get$dataSource().map((resource) => {
        if (!resource.listInfo) {
          return resource;
        }
        const resourceName = copyData_ResourceNames[resource.listInfo.resourceName].resourceNewNames.shift() || '';
        return {
          ...resource,
          resourceName,
        };
      }),
      ...data_objs.map((obj, obj_index) => {
        const uid: string = String(Math.random());
        if (data_isOccupied[obj.sha1]) {
          const errorInfo: NonNullable<HandleStates['dataSource'][number]> = {
            uid: uid,
            state: 'error',
            errorInfo: {
              uid: uid,
              file: null,
              fileName: obj.objectName,
              from: '存储空间',
              errorText: '资源被他人占用',
            },
            listInfo: null,
            localUploadInfo: null,
          };
          return errorInfo;
        }

        let resourceName: string = '';
        const key: string = getARightName(obj.objectName);
        if (key !== '') {
          resourceName = copyData_ResourceNames[key].resourceNewNames.shift() || '';
        }
        const resourceTitle: string = obj.objectName.replace(new RegExp(/\.[\w-]+$/), '').substring(0, 100);
        const successFile = result.find((file) => {
          return obj.sha1 === file.sha1;
        });


        const listInfo: NonNullable<HandleStates['dataSource'][number]> = {
          uid: uid,
          state: 'list',
          listInfo: {
            uid: uid,
            fileName: obj.objectName,
            sha1: obj.sha1,
            cover: covers[obj_index] || '',
            resourceName: resourceName,
            resourceNameError: '',
            resourceTitle: resourceTitle,
            resourceTitleError: '',
            resourceLabels: [],
            resourcePolicies: [],
            showMore: false,
            rawProperties: (successFile?.info || [])
              .filter((i) => {
                return i.insertMode === 1;
              })
              .map<NonNullable<HandleStates['dataSource'][number]['listInfo']>['rawProperties'][number]>((i) => {
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
              .map<NonNullable<HandleStates['dataSource'][number]['listInfo']>['additionalProperties'][number]>((i) => {
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
            resolveResources: [],
            isCompleteAuthorization: true,
          },
          localUploadInfo: null,
          errorInfo: null,
        };
        return listInfo;
      }),
    ];
    if (dataSource.length > 20) {
      fMessage('上传不能超过20个文件', 'warning');
      dataSource = dataSource.slice(0, 20);
    }
    set$dataSource(dataSource);
    // dispatch<ChangeAction>({
    //   type: 'resourceCreatorBatchPage/change',
    //   payload: {
    //     showPage: 'resourceList',
    //     resourceListInfo: resourceListInfo,
    //     latestListIndex: resourceListInfo[resourceListInfo.length - 1].order,
    //   },
    // });
  }

  if ($dataSource.length === 0) {
    return (<UploadFile
      onLocalUpload={onLocalUpload}
      onImportStorage={onImportStorage}
    />);
  }

  return (<>
    <FPrompt
      watch={$dataSource.length > 0}
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
              ResourceQty: $dataSource.length,
            })}
            type={'additional2'}
          />

        </div>
        {
          $dataSource.map((r, ri) => {

            return (<React.Fragment key={r.listInfo?.uid || ri}>
              <div style={{ height: 40 }} />
              {
                r.state === 'localUpload' && r.localUploadInfo && (<Task
                  order={ri + 1}
                  file={r.localUploadInfo.file}
                  resourceTypeCode={resourceCreatorBatchPage.selectedResourceType?.value || ''}
                  resourceType={resourceCreatorBatchPage.selectedResourceType?.labels || []}
                />)
              }
              {
                r.state === 'list' && !!r.listInfo && (<Card
                  resourceType={resourceCreatorBatchPage.selectedResourceType?.labels || []}
                  order={ri + 1}
                  username={'$username'}
                  info={r.listInfo}
                  onChange={(value) => {
                    const resourceListInfo = get$dataSource()
                      .filter((rli) => {
                        return rli.state === 'list' && rli.listInfo;
                      })
                      .map((rli) => {
                        return rli.listInfo;
                      });
                    const map: Map<string, number> = new Map<string, number>();
                    for (const info of resourceListInfo) {
                      if (info) {
                        map.set(info.resourceName, (map.get(info.resourceName) || 0) + 1);
                      }
                    }

                    const dataSource = get$dataSource().map((info) => {
                      if (info.state === 'list' && info.listInfo) {
                        return {
                          ...info,
                          listInfo: {
                            ...info.listInfo,
                            resourceNameError: (info.listInfo.resourceNameError !== '' && info.listInfo.resourceNameError !== '不能重复')
                              ? info.listInfo.resourceNameError
                              : ((map.get(info.listInfo.resourceName) || 0) > 1 ? '不能重复' : ''),
                          },
                        };
                      }
                      return info;
                    });
                    set$dataSource(dataSource);
                  }}
                  onDelete={() => {
                    let dataSource: HandleStates['dataSource'] = get$dataSource()
                      .filter((rli) => {
                        return rli.uid !== r.uid;
                      });
                    // .filter((rli) => {
                    //   return rli.state === 'list' && rli.listInfo;
                    // })
                    // .map((rli) => {
                    //   return rli.listInfo;
                    // });

                    const map: Map<string, number> = new Map<string, number>();
                    for (const info of dataSource) {
                      if (info.state === 'list' && info.listInfo) {
                        map.set(info.listInfo.resourceName, (map.get(info.listInfo.resourceName) || 0) + 1);
                      }
                    }

                    dataSource = dataSource.map((info) => {
                      if (info.state === 'list' && info.listInfo) {
                        return {
                          ...info,
                          listInfo: {
                            ...info.listInfo,
                            resourceNameError: (info.listInfo.resourceNameError !== '' && info.listInfo.resourceNameError !== '不能重复')
                              ? info.listInfo.resourceNameError
                              : ((map.get(info.listInfo.resourceName) || 0) > 1 ? '不能重复' : ''),
                          },
                        };
                      }
                      return info;
                    });
                    set$dataSource(dataSource);
                  }}
                  onClickApplyPolicies={(resourceCreatorBatchPage.resourceListInfo.length <= 1 || r.listInfo.resourcePolicies.length === 0) ? undefined : async () => {

                    let confirm: boolean = await fPromiseModalConfirm({
                      title: '添加策略到其它资源',
                      description: FI18n.i18nNext.t('是否将策略应用于此处发行的所有资源？'),
                      cancelText: FI18n.i18nNext.t('brr_resourcelisting_confirmation_bulkaddtags_btn_no'),
                      okText: FI18n.i18nNext.t('brr_resourcelisting_confirmation_bulkaddtags_btn_yes'),
                    });

                    if (!confirm) {
                      return;
                    }

                    const dataSource: HandleStates['dataSource'] = get$dataSource().map((rli) => {
                      if (r.uid === rli.uid || !rli.listInfo || !r.listInfo) {
                        return rli;
                      }
                      const usedText: string[] = rli.listInfo.resourcePolicies.map((p) => {
                        return p.text;
                      });
                      const usedTile: string[] = rli.listInfo.resourcePolicies.map((p) => {
                        return p.title;
                      });
                      const policies: {
                        title: string;
                        text: string;
                      }[] = r.listInfo.resourcePolicies.filter((p) => {
                        return !usedText.includes(p.text) && !usedTile.includes(p.title);
                      });
                      return {
                        ...rli,
                        listInfo: {
                          ...rli.listInfo,
                          resourcePolicies: [
                            ...rli.listInfo.resourcePolicies,
                            ...policies,
                          ],
                        },
                      };
                    });

                    set$dataSource(dataSource);
                  }}
                  onClickApplyLabels={(resourceCreatorBatchPage.resourceListInfo.length <= 1 || r.listInfo.resourceLabels.length === 0) ? undefined : async () => {
                    let confirm: boolean = await fPromiseModalConfirm({
                      title: FI18n.i18nNext.t('brr_resourcelisting_confirmation_bulkaddtags_title'),
                      description: FI18n.i18nNext.t('是否将标签应用于此处发行的所有资源？'),
                      cancelText: FI18n.i18nNext.t('brr_resourcelisting_confirmation_bulkaddtags_btn_no'),
                      okText: FI18n.i18nNext.t('brr_resourcelisting_confirmation_bulkaddtags_btn_yes'),
                    });

                    if (!confirm) {
                      return;
                    }

                    const dataSource: HandleStates['dataSource'] = get$dataSource().map((rli) => {
                      if (r.uid === rli.uid || !rli.listInfo || !r.listInfo) {
                        return rli;
                      }
                      const resourceLabels: string[] = Array.from(new Set([...rli.listInfo.resourceLabels, ...r.listInfo.resourceLabels])).slice(0, 20);
                      return {
                        ...rli,
                        listInfo: {
                          ...rli.listInfo,
                          resourceLabels: resourceLabels,
                        },
                      };
                    });
                    set$dataSource(dataSource);
                  }}
                />)
              }

              {
                r.state === 'error' && !!r.errorInfo && (<ErrorCard
                  order={ri + 1}
                  errorInfo={r.errorInfo}
                  onDelete={() => {
                    const dataSource: HandleStates['dataSource'] = get$dataSource()
                      .filter((rli) => {
                        return rli.uid !== r.uid;
                      });
                    set$dataSource(dataSource);
                  }}
                />)
              }

            </React.Fragment>);

            // if (r.state === 'error' && !!r.errorInfo) {
            //   return (<React.Fragment key={r.listInfo?.uid || ri}>
            //     <div style={{ height: 40 }} />
            //
            //   </React.Fragment>);
            //   // return (<div className={styles.resourceContainer}>
            //   //   <div className={styles.resourceOrder}>
            //   //     <FComponentsLib.FContentText
            //   //       text={FI18n.i18nNext.t('brr_resourcelisting_item_no', {
            //   //         ResourceNO: ri + 1,
            //   //       })}
            //   //       type={'highlight'}
            //   //       style={{ fontSize: 12 }}
            //   //     />
            //   //     <FComponentsLib.FTextBtn
            //   //       style={{ fontSize: 12 }}
            //   //       type={'danger'}
            //   //       onClick={() => {
            //   //         const dataSource: HandleStates['dataSource'] = get$dataSource()
            //   //           .filter((rli) => {
            //   //             return rli.uid !== r.uid;
            //   //           });
            //   //         set$dataSource(dataSource);
            //   //       }}
            //   //     >
            //   //       <FComponentsLib.FIcons.FDelete style={{ fontSize: 12 }} />
            //   //       &nbsp;{FI18n.i18nNext.t('brr_resourcelisting_item_btn_deleteitem')}
            //   //     </FComponentsLib.FTextBtn>
            //   //   </div>
            //   //   <div style={{ height: 5 }} />
            //   //   <div className={styles.fileInfo}>
            //   //     <div className={styles.card}>
            //   //       <img src={img} className={styles.img} alt='' />
            //   //       <div style={{ width: 20 }} />
            //   //       <div>
            //   //         <FComponentsLib.FContentText
            //   //           type='highlight'
            //   //           text={r.errorInfo.fileName}
            //   //           style={{ maxWidth: 600 }}
            //   //           singleRow
            //   //         />
            //   //         <div style={{ height: 18 }} />
            //   //         <div className={styles.info}>
            //   //           <FComponentsLib.FContentText
            //   //             className={styles.infoSize}
            //   //             type='additional1'
            //   //             text={r.errorInfo.from}
            //   //           />
            //   //         </div>
            //   //       </div>
            //   //     </div>
            //   //     <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            //   //       <FComponentsLib.FTextBtn
            //   //         type='danger'
            //   //         style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}
            //   //       >{r.errorInfo.errorText}</FComponentsLib.FTextBtn>
            //   //     </div>
            //   //   </div>
            //   // </div>);
            // }
            //
            // return (<div />);

          })
        }

        {/*<FResourceBatchUpload*/}
        {/*  resourceTypeCode={resourceCreatorBatchPage.selectedResourceType?.value || ''}*/}
        {/*  resourceType={resourceCreatorBatchPage.selectedResourceType?.labels || []}*/}
        {/*  onFinish={localUploadGotoList}*/}
        {/*/>*/}
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
                <div onClick={() => {
                  onLocalUpload();
                }}>
                  <FComponentsLib.FIcons.FLocalUpload />
                  <div>{FI18n.i18nNext.t('brr_submitresource_btn_uploadfromlocal')}
                  </div>
                </div>
                <div onClick={() => {
                  onImportStorage();
                }}>
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
            disabled={resourceCreatorBatchPage.resourceListInfo
              .filter((r) => {
                return r.error === '';
              }).length === 0
            || resourceCreatorBatchPage.resourceListInfo
              .filter((r) => {
                return r.error === '';
              })
              .some((r) => {
                return r.resourceNameError !== '' || r.resourceTitleError !== '' || !r.isCompleteAuthorization;
              })}
            onClick={() => {
              // onClickRelease();
            }}
          >{FI18n.i18nNext.t('brr_resourcelisting_btn_completerelease')}</FComponentsLib.FRectBtn>
        </Space>

      </div>
    </div>
  </>);
}

export default connect(({ resourceCreatorBatchPage }: ConnectState) => ({
  resourceCreatorBatchPage: resourceCreatorBatchPage,
}))(Handle);

function getARightName(name: string) {
  const newName: string = name.replace(new RegExp(/\.[\w-]+$/), '')
    .substring(0, 50)
    .replace(new RegExp(/[\\|\/|:|\*|\?|"|<|>|\||\s|@|\$|#]/g), '_');
  return newName;
}

async function isOccupied(sha1s: string[]): Promise<{ [sha1: string]: boolean }> {
  const result: { [k: string]: boolean } = {};
  for (const sha1 of sha1s) {
    const params3: Parameters<typeof FServiceAPI.Resource.getResourceBySha1>[0] = {
      fileSha1: sha1,
    };

    const { data: data_ResourcesBySha1 }: {
      data: {
        userId: number;
        resourceId: string;
        resourceName: string;
        resourceType: string[];
        version: string;
        resourceVersions: {
          version: string;
        }[];
      }[];
    } = await FServiceAPI.Resource.getResourceBySha1(params3);

    result[sha1] = data_ResourcesBySha1.length > 0 && data_ResourcesBySha1[0].userId !== FUtil.Tool.getUserIDByCookies();
  }

  return result;
}
