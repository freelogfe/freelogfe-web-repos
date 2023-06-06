import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import { Progress, Space } from 'antd';
import { RcFile } from 'antd/lib/upload/interface';
import fObjectSelectorDrawer from '@/components/fObjectSelectorDrawer';
import img from '@/assets/file-object.svg';
import FTable from '@/components/FTable';
import img_upload from '@/assets/createVersion_upload.png';
import img_markdown from '@/assets/createVersion_markdown.png';
import fReadLocalFiles from '@/components/fReadLocalFiles';
import icons from './icons.png';
import FDropdownMenu from '@/components/FDropdownMenu';
import * as AHooks from 'ahooks';

// import fComicTool from '@/components/fComicTool';

interface FPublishObjectFileProps {
  // resourceID: string;
  resourceType: {
    code: string;
    names: string[];
  };

  fileInfo: {
    name: string;
    sha1: string;
    from: string;
  } | null;

  showOpenMarkdownEditor?: boolean;
  showOpenCartoonEditor?: boolean;

  showEditBtnAfterSucceed?: boolean;

  onClick_OpenMarkdownBtn?(): void;

  onClick_OpenCartoonBtn?(): void;

  onClick_EditBtn?(): void;

  // onClick_EditCartoonBtn?(): void;

  onSucceed_UploadFile?(file: {
    fileName: string;
    sha1: string;
  }): void;

  onSucceed_ImportObject?(obj: {
    bucketID: string;
    bucketName: string;
    objID: string;
    objName: string;
    sha1: string;
  }): void;

  onClick_DeleteBtn?(): void;
}

interface FPublishObjectFileStates {
  _uploadFileAccept: string;

  fInfo: {
    name: string;
    sha1: string;
    from: string;
  } | null;
  fState: 'unsuccessful' | 'parsing' | 'uploading' | 'succeeded';
  fUploadedError: '' | 'unexpectedSize' | 'selfTakeUp' | 'othersTakeUp';
  fUsedResource: {
    resourceID: string;
    resourceName: string;
    resourceType: string;
    resourceVersion: string;
    url: string;
  }[];
  fUploadingProgress: number;
}

const initStates: FPublishObjectFileStates = {
  _uploadFileAccept: '',
  fInfo: null,
  fState: 'unsuccessful',
  fUploadedError: '',
  fUsedResource: [],
  fUploadingProgress: 0,
};

function FPublishObjectFile(
  // {
  // resourceID,
  // resourceType,
  // fileInfo,
  // onSucceed_ImportObject,
  // onSucceed_UploadFile,
  // onClick_DeleteBtn,
  // showOpenMarkdownEditor = false,
  // showOpenCartoonEditor = false,
  // showEditBtnAfterSucceed = false,
  // onClick_OpenMarkdownBtn,
  // onClick_OpenCartoonBtn,
  // onClick_EditBtn,
  // onClick_EditCartoonBtn,
  // }
  $prop: FPublishObjectFileProps) {
  // const [_uploadFileAccept, set_uploadFileAccept] = React.useState<FPublishObjectFileStates['_uploadFileAccept']>(initStates['_uploadFileAccept']);
  // const [fInfo, set_fInfo] = React.useState<FPublishObjectFileStates['fInfo']>(initStates['fInfo']);
  // const [fState, set_fState] = React.useState<FPublishObjectFileStates['fState']>(initStates['fState']);
  // const [fUploadedError, set_fUploadedError] = React.useState<FPublishObjectFileStates['fUploadedError']>(initStates['fUploadedError']);
  // const [fUsedResource, set_fUsedResource] = React.useState<FPublishObjectFileStates['fUsedResource']>(initStates['fUsedResource']);
  // const [fUploadingProgress, set_fUploadingProgress] = React.useState<FPublishObjectFileStates['fUploadingProgress']>(initStates['fUploadingProgress']);


  const uploadCancelHandler = React.useRef<any>();
  const tempUploadFileInfo = React.useRef<{
    fileName: string;
    sha1: string;
  } | null>(null);
  const tempImportObjectInfo = React.useRef<{
    bucketID: string;
    bucketName: string;
    objID: string;
    objName: string;
    sha1: string;
  } | null>(null);

  const [$state, $setState] = AHooks.useSetState<FPublishObjectFileStates>(initStates);

  React.useEffect(() => {
    handleResourceType();
  }, [$prop.resourceType]);

  async function handleResourceType() {
    // console.log(resourceType, 'resourceTypesdoijfosidjflkjdslk');
    const { data }: {
      data: {
        formats: string[];
      }
    } = await FServiceAPI.Resource.getResourceTypeInfoByCode({
      code: $prop.resourceType.code,
    });
    // console.log(data, 'data9iosdjlkfjlksdjflkjl');
    if (!data) {
      return;
    }
    // set_uploadFileAccept(data.formats.join(','));
    $setState({
      _uploadFileAccept: data.formats.join(','),
    });
    // console.log(data, 'dlikajlsdkfjlksdjlfkjsdlkfjlksdjflkasdjlkfjlk');
  }

  React.useEffect(() => {
    // set_fInfo(null);
    // set_fUploadedError('');
    // set_fUsedResource([]);
    // set_fUploadingProgress(0);
    $setState({
      fInfo: null,
      fUploadedError: '',
      fUsedResource: [],
      fUploadingProgress: 0,
    });
    if (!!$prop.fileInfo) {
      // set_fState('succeeded');
      $setState({
        fState: 'succeeded',
      });
    } else {
      // set_fState('unsuccessful');
      $setState({
        fState: 'unsuccessful',
      });
    }
  }, [$prop.fileInfo]);

  function resetData() {
    // set_fInfo(null);
    // set_fState('unsuccessful');
    // set_fUploadedError('');
    // set_fUsedResource([]);
    // set_fUploadingProgress(0);

    $setState({
      fInfo: null,
      fState: 'unsuccessful',
      fUploadedError: '',
      fUsedResource: [],
      fUploadingProgress: 0,
    });
  }

  async function onUploadFilesLocally(file: RcFile) {
    if (file.size > 200 * 1024 * 1024) {
      // set_fState('unsuccessful');
      // set_fUploadedError('unexpectedSize');
      $setState({
        fState: 'unsuccessful',
        fUploadedError: 'unexpectedSize',
      });
      return;
    }

    // set_fState('parsing');
    // set_fUploadedError('');
    // set_fInfo({
    //   sha1: '',
    //   name: file.name,
    //   from: '本地上传',
    // });
    $setState({
      fState: 'parsing',
      fUploadedError: '',
      fInfo: {
        sha1: '',
        name: file.name,
        from: '本地上传',
      },
    });

    const sha1: string = await FUtil.Tool.getSHA1Hash(file);
    const { data: data_fileIssExists }: any = await FServiceAPI.Storage.fileIsExist({ sha1 });

    if (data_fileIssExists[0].isExisting) {
      const params3: Parameters<typeof FServiceAPI.Resource.getResourceBySha1>[0] = {
        fileSha1: sha1,
      };

      const { data: data_ResourcesBySha1 } = await FServiceAPI.Resource.getResourceBySha1(params3);

      if (data_ResourcesBySha1.length > 0) {
        if (data_ResourcesBySha1[0].userId === FUtil.Tool.getUserIDByCookies()) {
          const usedResources: FPublishObjectFileStates['fUsedResource'] = data_ResourcesBySha1.map((d: any) => {
            return d.resourceVersions.map((v: any) => {
              return {
                resourceId: d.resourceId,
                resourceName: d.resourceName,
                resourceType: d.resourceType,
                resourceVersion: v.version,
                url: FUtil.LinkTo.resourceVersion({
                  resourceID: d.resourceId,
                  version: v.version,
                }),
              };
            });
          }).flat();
          tempUploadFileInfo.current = {
            fileName: file.name,
            sha1: sha1,
          };
          // set_fUsedResource(usedResources);
          // set_fState('unsuccessful');
          // set_fUploadedError('selfTakeUp');

          $setState({
            fUsedResource: usedResources,
            fState: 'unsuccessful',
            fUploadedError: 'selfTakeUp',
          });
        } else {
          const usedResources: FPublishObjectFileStates['fUsedResource'] = data_ResourcesBySha1.map((d: any) => {
            return d.resourceVersions.map((v: any) => {
              return {
                resourceId: d.resourceId,
                resourceName: d.resourceName,
                resourceType: d.resourceType,
                resourceVersion: v.version,
                url: FUtil.LinkTo.resourceDetails({
                  resourceID: d.resourceId,
                  version: v.version,
                }),
              };
            });
          }).flat();
          // set_fUsedResource(usedResources);
          // set_fState('unsuccessful');
          // set_fUploadedError('othersTakeUp');

          $setState({
            fUsedResource: usedResources,
            fState: 'unsuccessful',
            fUploadedError: 'othersTakeUp',
          });
        }
      } else {
        $prop.onSucceed_UploadFile && $prop.onSucceed_UploadFile({
          sha1,
          fileName: file.name,
        });
      }
    } else {
      // set_fState('uploading');
      // set_fUploadedError('');
      // set_fInfo({
      //   sha1: '',
      //   name: file.name,
      //   from: '本地上传',
      // });
      $setState({
        fState: 'uploading',
        fUploadedError: '',
        fInfo: {
          sha1: '',
          name: file.name,
          from: '本地上传',
        },
      });
      const [promise, cancel] = await FServiceAPI.Storage.uploadFile({
        file: file,
        // resourceType: resourceVersionCreatorPage.resourceType,
      }, {
        onUploadProgress(progressEvent: any) {
          // set_fUploadingProgress(Math.floor(progressEvent.loaded / progressEvent.total * 100));
          $setState({
            fUploadingProgress: Math.floor(progressEvent.loaded / progressEvent.total * 100),
          });
        },
      }, true);
      uploadCancelHandler.current = cancel;
      const { data } = await promise;
      uploadCancelHandler.current = null;
      // set_fUploadingProgress(0);
      $setState({
        fUploadingProgress: 0,
      });
      $prop.onSucceed_UploadFile && $prop.onSucceed_UploadFile({
        sha1,
        fileName: file.name,
      });
    }
  }

  async function onImportObject({
                                  bucketID,
                                  bucketName,
                                  objectID,
                                  objectName,
                                  sha1,
                                }: { objectID: string; objectName: string; sha1: string; bucketID: string; bucketName: string; }) {

    const params3: Parameters<typeof FServiceAPI.Resource.getResourceBySha1>[0] = {
      fileSha1: sha1,
    };

    const { data: data_ResourcesBySha1 } = await FServiceAPI.Resource.getResourceBySha1(params3);

    if (data_ResourcesBySha1.length > 0) {
      if (data_ResourcesBySha1[0].userId === FUtil.Tool.getUserIDByCookies()) {
        const usedResources: FPublishObjectFileStates['fUsedResource'] = data_ResourcesBySha1.map((d: any) => {
          return d.resourceVersions.map((v: any) => {
            return {
              resourceId: d.resourceId,
              resourceName: d.resourceName,
              resourceType: d.resourceType,
              resourceVersion: v.version,
              url: FUtil.LinkTo.resourceVersion({
                resourceID: d.resourceId,
                version: v.version,
              }),
            };
          });
        }).flat();
        tempImportObjectInfo.current = {
          bucketID: bucketID,
          bucketName: bucketName,
          objID: objectID,
          objName: objectName,
          sha1: sha1,
        };
        // set_fUsedResource(usedResources);
        // set_fState('unsuccessful');
        // set_fUploadedError('selfTakeUp');

        $setState({
          fUsedResource: usedResources,
          fState: 'unsuccessful',
          fUploadedError: 'selfTakeUp',
        });
      } else {
        const usedResources: FPublishObjectFileStates['fUsedResource'] = data_ResourcesBySha1.map((d: any) => {
          return d.resourceVersions.map((v: any) => {
            return {
              resourceId: d.resourceId,
              resourceName: d.resourceName,
              resourceType: d.resourceType,
              resourceVersion: v.version,
              url: FUtil.LinkTo.resourceDetails({
                resourceID: d.resourceId,
                version: v.version,
              }),
            };
          });
        }).flat();
        // set_fUsedResource(usedResources);
        // set_fState('unsuccessful');
        // set_fUploadedError('othersTakeUp');
        $setState({
          fUsedResource: usedResources,
          fState: 'unsuccessful',
          fUploadedError: 'othersTakeUp',
        });
      }
    } else {
      $prop.onSucceed_ImportObject && $prop.onSucceed_ImportObject({
        bucketID: bucketID,
        bucketName: bucketName,
        sha1,
        objID: objectID,
        objName: objectName,
      });
    }
  }

  if ($state.fState === 'parsing' && $state.fInfo) {
    return ((<div className={styles.styles}>
      <div className={styles.card}>
        <img src={img} className={styles.img} alt='' />
        <div style={{ width: 20 }} />
        <div>
          <FComponentsLib.FContentText
            type='highlight'
            text={$state.fInfo.name}
          />
          <div style={{ height: 18 }} />
          <div className={styles.info}>
            <FComponentsLib.FContentText
              className={styles.infoSize}
              type='additional1'
              text={$state.fInfo.from}
            />
          </div>
        </div>
      </div>
      <FComponentsLib.FContentText
        type={'additional1'}
        // className={styles.delete}
      >正在解析...</FComponentsLib.FContentText>
    </div>));
  }

  if ($state.fState === 'succeeded' && $prop.fileInfo) {
    return ((<div className={styles.styles}>
      <div className={styles.card}>
        <img src={img} className={styles.img} alt='' />
        <div style={{ width: 20 }} />
        <div>
          <FComponentsLib.FContentText
            type='highlight'
            text={$prop.fileInfo.name}
          />
          <div style={{ height: 18 }} />
          <div className={styles.info}>
            <FComponentsLib.FContentText
              className={styles.infoSize}
              type='additional1'
              text={$prop.fileInfo.from}
            />
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {
          $prop.showEditBtnAfterSucceed && (<FComponentsLib.FTextBtn
            type='primary'
            onClick={() => {
              $prop.onClick_EditBtn && $prop.onClick_EditBtn();
            }}
            // className={styles.delete}
          >编辑</FComponentsLib.FTextBtn>)
        }

        {
          $prop.showOpenCartoonEditor
            ? (<FDropdownMenu
              options={[{
                text: 'ZIP格式文件',
                value: 'zip',
              }, {
                text: 'CBZ格式文件',
                value: 'cbz',
              }]}
              onChange={(value) => {
                if (value === 'zip') {

                }
                if (value === 'cbz') {

                }
              }}
            >
              <div>
                <FComponentsLib.FTextBtn
                  type='primary'
                  // onClick={() => {
                  //   self.location.href = FUtil.Format.completeUrlByDomain('qi')
                  //     + `/v2/storages/files/${fileInfo.sha1}/download?attachmentName=${fileInfo.name}`;
                  // }}
                >下载</FComponentsLib.FTextBtn>
              </div>
            </FDropdownMenu>)
            : (<FComponentsLib.FTextBtn
              type='primary'
              onClick={() => {
                self.location.href = FUtil.Format.completeUrlByDomain('qi')
                  + `/v2/storages/files/${$prop.fileInfo?.sha1}/download?attachmentName=${$prop.fileInfo?.name}`;
              }}
            >下载</FComponentsLib.FTextBtn>)
        }


        <FComponentsLib.FTextBtn
          type='danger'
          onClick={() => {
            $prop.onClick_DeleteBtn && $prop.onClick_DeleteBtn();
          }}
          // className={styles.delete}
        >{FI18n.i18nNext.t('remove')}</FComponentsLib.FTextBtn>
      </div>
    </div>));
  }

  if ($state.fState === 'uploading' && $state.fInfo) {
    return ((<div className={styles.styles}>
      <div className={styles.card}>
        <img src={img} className={styles.img} alt='' />
        <div style={{ width: 20 }} />
        <div>
          <FComponentsLib.FContentText
            type='highlight'
            text={$state.fInfo.name}
          />
          <div style={{ height: 18 }} />
          <div className={styles.info}>
            <span style={{ paddingRight: 10 }}>{$state.fUploadingProgress}%</span>
            <Progress
              className={styles.Progress}
              width={100}
              showInfo={false}
              percent={$state.fUploadingProgress}
              size='small'
              trailColor='#EBEBEB'
            />
          </div>
        </div>
      </div>
      <FComponentsLib.FTextBtn
        type='danger'
        onClick={() => {
          uploadCancelHandler.current && uploadCancelHandler.current();
          resetData();
        }}
      >{FI18n.i18nNext.t('cancel_uploading')}</FComponentsLib.FTextBtn>
    </div>));
  }

  return (<Space size={20} direction={'vertical'} style={{ width: '100%' }}>
    <div className={styles.selectObjectCards}>

      {
        $prop.resourceType.names.includes('漫画')
          ? (<div className={styles.cartoonCard}>
            <div style={{ height: 20 }} />
            <FComponentsLib.FRectBtn
              onClick={() => {
                $prop.onClick_OpenCartoonBtn && $prop.onClick_OpenCartoonBtn();
              }}
            >开始制作</FComponentsLib.FRectBtn>
            <div style={{ height: 20 }} />
            <FComponentsLib.FContentText text={'在线上传、排版、一键切图，快速发布漫画'} type={'additional2'} />
            <div style={{ height: 50 }} />
            <img src={icons} style={{ width: 400 }} />
          </div>)
          : (<>
            <div className={styles.selectObjectCard}>

              <img src={img_upload} alt={''} />
              <FComponentsLib.FContentText type={'additional2'} text={'选择本地文件或存储空间对象作为发行对象'} />
              <Space size={15}>
                <FComponentsLib.FHotspotTooltip
                  id={'createResourceVersionPage.uploadFileBtn'}
                  style={{ left: -52, top: 4 }}
                  text={FI18n.i18nNext.t('hotpots_createversion_btn_upload')}
                  zIndex={500}
                  onMount={() => {
                    FComponentsLib.fSetHotspotTooltipVisible('createResourceVersionPage.uploadFileBtn', {
                      value: false,
                      effectiveImmediately: false,
                      onlyNullish: false,
                    });
                  }}
                >
                  <FComponentsLib.FRectBtn
                    type='primary'
                    onClick={async () => {
                      const files = await fReadLocalFiles({
                        accept: $state._uploadFileAccept,
                      });
                      if (!files) {
                        return;
                      }
                      await onUploadFilesLocally(files[0]);
                    }}
                  >{FI18n.i18nNext.t('upload_from_local')}</FComponentsLib.FRectBtn>
                </FComponentsLib.FHotspotTooltip>

                <FComponentsLib.FRectBtn
                  type='primary'
                  onClick={async () => {
                    const obj = await fObjectSelectorDrawer({
                      resourceTypeCode: $prop.resourceType.code,
                    });
                    if (!obj) {
                      return;
                    }
                    await onImportObject({
                      bucketID: obj.bucketID,
                      bucketName: obj.bucketName,
                      objectID: obj.objID,
                      objectName: obj.objName,
                      sha1: obj.sha1,
                    });
                  }}
                >{FI18n.i18nNext.t('choose_from_storage')}</FComponentsLib.FRectBtn>
              </Space>

            </div>
            {
              $prop.showOpenMarkdownEditor && (
                <div className={styles.selectObjectCard} style={{ paddingTop: 50, paddingBottom: 50 }}>
                  <img
                    src={img_markdown}
                    alt={''}
                    style={{ width: 42, height: 48 }}
                  />
                  <FComponentsLib.FContentText
                    type={'highlight'}
                    text={FI18n.i18nNext.t('newversion_tool_posteditor_title')}
                  />
                  <FComponentsLib.FContentText
                    type={'additional2'}
                    // text={'在线新建和编辑文章，无需导出本地，快速生产资源'}
                    text={FI18n.i18nNext.t('newversion_tool_posteditor_subtitle')}
                    style={{ color: 'rgba(0,0,0,.3)', width: 280 }}
                  />

                  <FComponentsLib.FRectBtn
                    type='primary'
                    onClick={() => {
                      $prop.onClick_OpenMarkdownBtn && $prop.onClick_OpenMarkdownBtn();
                    }}
                  >立即体验</FComponentsLib.FRectBtn>
                </div>)
            }
          </>)
      }
    </div>
    <div>

      {
        $state.fUploadedError === 'unexpectedSize' && (<span className={styles.objectErrorInfo}>文件大小不能超过200MB</span>)
      }

      {
        $state.fUploadedError === 'selfTakeUp' && (<Space size={10}>
          <span className={styles.objectErrorInfo}>该文件/对象已经发行过。</span>
          <FComponentsLib.FTextBtn
            onClick={() => {
              if (!!tempUploadFileInfo.current) {
                $prop.onSucceed_UploadFile && $prop.onSucceed_UploadFile(tempUploadFileInfo.current);
              }
              if (!!tempImportObjectInfo.current) {
                $prop.onSucceed_ImportObject && $prop.onSucceed_ImportObject(tempImportObjectInfo.current);
              }

              tempUploadFileInfo.current = null;
              tempImportObjectInfo.current = null;
            }}
          >继续上传/导入</FComponentsLib.FTextBtn>
        </Space>)
      }

      {
        $state.fUploadedError === 'othersTakeUp' && (
          <span className={styles.objectErrorInfo}>{FI18n.i18nNext.t('resource_exist')}</span>)
      }

    </div>

    {
      ($state.fUploadedError === 'selfTakeUp' || $state.fUploadedError === 'othersTakeUp') && $state.fUsedResource.length > 0 && (
        <div className={styles.tableWrap}>
          <FTable
            rowClassName={styles.tableRowClassName}
            scroll={{ y: $state.fUsedResource.length > 5 ? 350 : undefined }}
            columns={[
              {
                title: '资源',
                dataIndex: 'resourceName',
                width: 400,
                render(value: any, record: any, index: number) {
                  return (<FComponentsLib.FContentText
                    text={record.resourceName}
                    style={{ maxWidth: 370 }}
                  />);
                },
              },
              {
                title: '类型',
                dataIndex: 'resourceType',
                width: 100,
                render(value: any, record: any, index: number) {
                  return (<FComponentsLib.FContentText
                    text={record.resourceType.join(' / ')}
                  />);
                },
              },
              {
                title: '版本',
                dataIndex: 'resourceVersion',
                render(value: any, record: any, index: number) {
                  return (<FComponentsLib.FContentText
                    text={record.resourceVersion}
                  />);
                },
              },
              {
                title: '操作',
                dataIndex: 'operation',
                render(value: any, record: any, index: number) {
                  return (<FComponentsLib.FTextBtn onClick={() => {
                    window.open(record.url);
                  }}>查看</FComponentsLib.FTextBtn>);
                },
              },
            ]}
            dataSource={$state.fUsedResource.map((sfur) => {
              return {
                key: sfur.url,
                ...sfur,
              };
            })}
          />
        </div>)
    }
  </Space>);
}

export default FPublishObjectFile;
