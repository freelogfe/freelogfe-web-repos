import * as React from 'react';
import styles from './index.less';
import LocalUpload from '@/pages/resource/creator/Step2/LocalUpload';
import {
  OnChange_step2_additionalProperties_Action,
  OnChange_step2_customConfigurations_Action,
  OnChange_step2_customProperties_Action,
  OnClick_step2_editCartoonBtn_Action,
  OnClick_step2_editMarkdownBtn_Action,
  OnClick_step2_submitBtn_Action,
  OnRemove_step2_file_Action,
  OnSucceed_step2_localUpload_Action,
  OnSucceed_step2_storageSpace_Action,
} from '@/models/resourceCreatorPage';
import StorageSpace from '@/pages/resource/creator/Step2/StorageSpace';
import MarkdownEditor from '@/pages/resource/creator/Step2/MarkdownEditor';
import CartoonEditor from '@/pages/resource/creator/Step2/CartoonEditor';
import FComponentsLib from '@freelog/components-lib';
import { history } from 'umi';
import { FI18n, FUtil } from '@freelog/tools-lib';
import img from '@/assets/file-object.svg';
import FTooltip from '@/components/FTooltip';
import fResourcePropertyEditor from '@/components/fResourcePropertyEditor';
import FResourceProperties from '@/components/FResourceProperties';
import { Space } from 'antd';
import fResourceOptionEditor from '@/components/fResourceOptionEditor';
import FResourceOptions from '@/components/FResourceOptions';
import FResourceAuthorizationProcessor, { getProcessor } from '@/components/FResourceAuthorizationProcessor';
import fAddDependencies from '@/components/fAddDependencies';
import { connect } from 'dva';
import { ConnectState, ResourceVersionCreatorPageModelState } from '@/models/connect';
import { Dispatch } from 'redux';
import { RouteComponentProps } from 'react-router/index';
import { useGetState } from '@/utils/hooks';
import * as AHooks from 'ahooks';
import FCoverImage from '@/components/FCoverImage';
import { OnMountPageAction, OnUnmountPageAction } from '@/models/resourceVersionCreatorPage';

interface VersionCreatorProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
  resourceVersionCreatorPage: ResourceVersionCreatorPageModelState;
}

function VersionCreator({ match, dispatch, resourceVersionCreatorPage }: VersionCreatorProps) {

  const ref = React.useRef(null);
  const size = AHooks.useSize(ref);
  // console.log(size, 'size ws90eiofjsdlkfjldskjl');

  const [$showMore, set$ShowMore, get$ShowMore] = useGetState<boolean>(false);

  AHooks.useMount(() => {
    dispatch<OnMountPageAction>({
      type: 'resourceVersionCreatorPage/onMountPage',
      payload: {
        resourceID: match.params.id,
      },
    });
  });

  AHooks.useUnmount(() => {
    // set_isMarkdownEditorDirty(false);
    dispatch<OnUnmountPageAction>({
      type: 'resourceVersionCreatorPage/onUnmountPage',
    });
  });

  const isCartoon = resourceVersionCreatorPage.resourceInfo?.resourceType[0] === '阅读'
    && resourceVersionCreatorPage.resourceInfo?.resourceType[1] === '漫画'
    && (resourceVersionCreatorPage.resourceInfo?.resourceType[2] === '条漫'
      || resourceVersionCreatorPage.resourceInfo?.resourceType[2] === '页漫');

  if (!resourceVersionCreatorPage.selectedFileInfo) {
    return (<div className={styles.noSelectedFileInfo}>
      <div style={{ height: 40 }} />
      <div style={{ display: 'flex', alignItems: 'center', width: 920 }}>
        <FCoverImage src={''} width={36} />
        <div style={{ width: 10 }} />
        <FComponentsLib.FContentText
          text={resourceVersionCreatorPage.resourceInfo?.resourceName || ''}
          type={'highlight'}
        />
        <div style={{ width: 5 }} />
        <label style={{
          backgroundColor: '#E4E7EB',
          borderRadius: 4,
          fontSize: 12,
          color: '#666',
          padding: 5,
          lineHeight: '18px',
          display: 'inline-block',
        }}>{resourceVersionCreatorPage.resourceInfo?.resourceType.join('/')}</label>
        <div style={{ width: 10 }} />
        <FComponentsLib.FTitleText text={'/'} type={'h1'} />
        <div style={{ width: 10 }} />
        <FComponentsLib.FTitleText text={'新建版本'} type={'h1'} />
      </div>
      <div style={{ height: 100 }} />
      <div className={styles.styles}>
        {
          !isCartoon && (<LocalUpload
            resourceTypeCode={resourceVersionCreatorPage.resourceInfo?.resourceTypeCode || ''}
            onSucceed={(value) => {
              dispatch<OnSucceed_step2_localUpload_Action>({
                type: 'resourceCreatorPage/onSucceed_step2_localUpload',
                payload: {
                  fileName: value.fileName,
                  sha1: value.sha1,
                },
              });
            }}
          />)
        }

        {
          !isCartoon && (<StorageSpace
            resourceTypeCode={resourceVersionCreatorPage.resourceInfo?.resourceTypeCode || ''}
            onSucceed={(value) => {
              dispatch<OnSucceed_step2_storageSpace_Action>({
                type: 'resourceCreatorPage/onSucceed_step2_storageSpace',
                payload: value,
              });
            }}
          />)
        }


        {
          !isCartoon && resourceVersionCreatorPage.resourceInfo?.resourceType[0] === '阅读'
          && resourceVersionCreatorPage.resourceInfo?.resourceType[1] === '文章'
          && (<MarkdownEditor
            onClickBtn={() => {
              dispatch<OnClick_step2_editMarkdownBtn_Action>({
                type: 'resourceCreatorPage/onClick_step2_editMarkdownBtn',
              });
            }}
          />)
        }

        {
          isCartoon && (<CartoonEditor
            onClickBtn={() => {
              dispatch<OnClick_step2_editCartoonBtn_Action>({
                type: 'resourceCreatorPage/onClick_step2_editCartoonBtn',
              });
            }}
          />)
        }

      </div>

      {/*<div style={{ height: 30 }} />*/}

      {/*<div className={styles.btn}>*/}

      {/*  /!*{FI18n.i18nNext.t('rqr_step3_btn_later')}*!/*/}
      {/*  <FComponentsLib.FTextBtn*/}
      {/*    type={'default'}*/}
      {/*    onClick={() => {*/}
      {/*      // history.push(FUtil.LinkTo.resourceVersionInfo({*/}
      {/*      //   resourceID: resourceVersionCreatorPage.resourceInfo?.resourceID || '',*/}
      {/*      //   version: '1.0.0',*/}
      {/*      // }));*/}
      {/*      // history.push(FUtil.LinkTo.myResources());*/}
      {/*    }}*/}
      {/*  >{FI18n.i18nNext.t('rqr_step2_btn_later')}</FComponentsLib.FTextBtn>*/}

      {/*  /!*{FI18n.i18nNext.t('rqr_step3_btn_next')}*!/*/}
      {/*  <FComponentsLib.FRectBtn*/}
      {/*    disabled={!resourceVersionCreatorPage.selectedFileInfo}*/}
      {/*    type={'primary'}*/}
      {/*    onClick={() => {*/}
      {/*      dispatch<OnClick_step2_submitBtn_Action>({*/}
      {/*        type: 'resourceCreatorPage/onClick_step2_submitBtn',*/}
      {/*      });*/}
      {/*    }}*/}
      {/*  >{FI18n.i18nNext.t('rqr_step3_btn_next')}</FComponentsLib.FRectBtn>*/}
      {/*</div>*/}

      <div style={{ height: 100 }} />
    </div>);
  }

  return (<>
    <div style={{ height: 40 }} />

    <div className={styles.fileInfo}>
      <div className={styles.card}>
        <img src={img} className={styles.img} alt='' />
        <div style={{ width: 20 }} />
        <div>
          <FComponentsLib.FContentText
            type='highlight'
            text={resourceVersionCreatorPage.selectedFileInfo.name}
            style={{ maxWidth: 600 }}
            singleRow
          />
          <div style={{ height: 18 }} />
          <div className={styles.info}>
            <FComponentsLib.FContentText
              className={styles.infoSize}
              type='additional1'
              text={resourceVersionCreatorPage.selectedFileInfo.from}
            />
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/*{*/}
        {/*  $prop.showEditBtnAfterSucceed && (<FComponentsLib.FTextBtn*/}
        {/*    disabled={$prop.disabledOperations?.includes('edit')}*/}
        {/*    type='primary'*/}
        {/*    onClick={() => {*/}
        {/*      $prop.onClick_EditBtn && $prop.onClick_EditBtn();*/}
        {/*    }}*/}
        {/*    // className={styles.delete}*/}
        {/*  >编辑</FComponentsLib.FTextBtn>)*/}
        {/*}*/}

        {/*{*/}
        {/*  $prop.showDownloadBtnAfterSucceed && (<FComponentsLib.FTextBtn*/}
        {/*    type='primary'*/}
        {/*    disabled={$prop.disabledOperations?.includes('download')}*/}
        {/*    onClick={() => {*/}
        {/*      // self.location.href = FUtil.Format.completeUrlByDomain('qi')*/}
        {/*      //   + `/v2/storages/files/${$prop.fileInfo?.sha1}/download?attachmentName=${$prop.fileInfo?.name}`;*/}
        {/*      $prop.onClick_DownloadBtn && $prop.onClick_DownloadBtn();*/}
        {/*    }}*/}
        {/*  >下载</FComponentsLib.FTextBtn>)*/}
        {/*}*/}


        <FComponentsLib.FTextBtn
          type='danger'
          // disabled={$prop.disabledOperations?.includes('remove')}
          onClick={async () => {
            // $prop.onClick_DeleteBtn && $prop.onClick_DeleteBtn();
            dispatch<OnRemove_step2_file_Action>({
              type: 'resourceCreatorPage/onRemove_step2_file',
            });
          }}
          // className={styles.delete}
        >{FI18n.i18nNext.t('remove')}</FComponentsLib.FTextBtn>
      </div>
    </div>

    <div style={{ height: 5 }} />

    <div className={styles.block}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <FComponentsLib.FContentText text={'基础属性'} type={'highlight'} />
        {/*<FComponentsLib.FContentText text={''} type={'highlight'}/>*/}

        <FTooltip title={FI18n.i18nNext.t('resourceinfo_add_btn_info')}>
          <div>
            <FComponentsLib.FTextBtn
              style={{ fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}
              type='primary'
              onClick={async () => {
                const dataSource: {
                  key: string;
                  name: string;
                  value: string;
                  description: string;
                } | null = await fResourcePropertyEditor({
                  disabledKeys: [
                    ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
                    ...resourceVersionCreatorPage.additionalProperties.map<string>((rp) => rp.key),
                    ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.key),
                    ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.key),
                  ],
                  disabledNames: [
                    ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.name),
                    ...resourceVersionCreatorPage.additionalProperties.map<string>((rp) => rp.name),
                    ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.name),
                    ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.name),
                  ],
                });
                // console.log(dataSource, 'dataSource9iojskldjflksdjflk');
                if (!dataSource) {
                  return;
                }

                await dispatch<OnChange_step2_customProperties_Action>({
                  type: 'resourceCreatorPage/onChange_step2_customProperties',
                  payload: {
                    value: [
                      ...resourceVersionCreatorPage.customProperties,
                      dataSource,
                    ],
                  },
                });
              }}
            >
              <FComponentsLib.FIcons.FProperty style={{ fontSize: 14 }} />
              <span>补充属性</span>
            </FComponentsLib.FTextBtn>
          </div>
        </FTooltip>
      </div>
      <div style={{ height: 20 }} />

      <FResourceProperties
        immutableData={resourceVersionCreatorPage.rawProperties}
        onlyEditValueData={resourceVersionCreatorPage.additionalProperties}
        alterableData={resourceVersionCreatorPage.customProperties}
        onEdit_onlyEditValueData={async (value) => {
          // console.log(value, 'value sidjfoikjo sd value sdiofjlkj');
          const index: number = resourceVersionCreatorPage.additionalProperties.findIndex((p) => {
            return p === value;
          });
          const dataSource: {
            key: string;
            name: string;
            value: string;
            description: string;
          } | null = await fResourcePropertyEditor({
            disabledKeys: [
              ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
              ...resourceVersionCreatorPage.additionalProperties.map<string>((rp) => rp.key),
              ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.key),
              ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.key),
            ],
            disabledNames: [
              ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.name),
              ...resourceVersionCreatorPage.additionalProperties.map<string>((rp) => rp.name),
              ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.name),
              ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.name),
            ],
            defaultData: value,
            noneEditableFields: ['key', 'description', 'name'],
            valueAcceptNull: true,
          });
          if (!dataSource) {
            return;
          }

          await dispatch<OnChange_step2_additionalProperties_Action>({
            type: 'resourceCreatorPage/onChange_step2_additionalProperties',
            payload: {
              value: resourceVersionCreatorPage.additionalProperties.map((v, i) => {
                if (i !== index) {
                  return v;
                }
                return dataSource;
              }),
            },
          });
        }}
        onEdit_alterableData={async (value) => {
          const index: number = resourceVersionCreatorPage.customProperties.findIndex((p) => {
            return p === value;
          });
          const dataSource: {
            key: string;
            name: string;
            value: string;
            description: string;
          } | null = await fResourcePropertyEditor({
            disabledKeys: [
              ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
              ...resourceVersionCreatorPage.additionalProperties.map<string>((rp) => rp.key),
              ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.key),
              ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.key),
            ],
            disabledNames: [
              ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.name),
              ...resourceVersionCreatorPage.additionalProperties.map<string>((rp) => rp.name),
              ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.name),
              ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.name),
            ],
            defaultData: value,
          });
          if (!dataSource) {
            return;
          }

          await dispatch<OnChange_step2_customProperties_Action>({
            type: 'resourceCreatorPage/onChange_step2_customProperties',
            payload: {
              value: resourceVersionCreatorPage.customProperties.map((v, i) => {
                if (i !== index) {
                  return v;
                }
                return dataSource;
              }),
            },
          });
        }}
        onDelete_alterableData={async (value) => {
          // console.log(value, 'AAAAAAsdofijsdflksdjfldsjlkj');
          await dispatch<OnChange_step2_customProperties_Action>({
            type: 'resourceCreatorPage/onChange_step2_customProperties',
            payload: {
              value: resourceVersionCreatorPage.customProperties.filter((v, i) => {
                return v.key !== value.key && v.name !== value.name;
              }),
            },
          });
        }}
      />
    </div>

    <div style={{ height: 15 }} />

    {
      $showMore
        ? (<FComponentsLib.FTextBtn
          style={{ fontSize: 12 }}
          type={'primary'}
          onClick={() => {
            set$ShowMore(false);
          }}
        >{FI18n.i18nNext.t('create_new_version_btn_showless')}</FComponentsLib.FTextBtn>)
        : (<Space size={10}>
          {/*{FI18n.i18nNext.t('create_new_version_btn_moresetting')}*/}
          <FComponentsLib.FTextBtn
            style={{ fontSize: 12 }}
            type={'primary'}
            onClick={() => {
              set$ShowMore(true);
            }}
          >更多设置</FComponentsLib.FTextBtn>
          {FI18n.i18nNext.t('create_new_version_btn_moresetting_help')}
          {/*<FComponentsLib.FContentText text={'可以为资源文件添加可选配置，或进行依赖资源的声明'} type={'additional2'} />*/}
        </Space>)
    }

    {
      $showMore && (<>
        <div style={{ height: 10 }} />

        <div className={styles.block}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {FI18n.i18nNext.t('resourceoptions_title')}
            {/*<FComponentsLib.FContentText text={'可选配置'} type={'highlight'} />*/}

            <FTooltip title={FI18n.i18nNext.t('resourceinfo_add_btn_info')}>
              <div>
                <FComponentsLib.FTextBtn
                  style={{ fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}
                  type='primary'
                  onClick={async () => {
                    const dataSource: {
                      key: string;
                      name: string;
                      type: 'input' | 'select';
                      input: string;
                      select: string[];
                      description: string;
                    } | null = await fResourceOptionEditor({
                      disabledKeys: [
                        ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
                        ...resourceVersionCreatorPage.additionalProperties.map<string>((rp) => rp.key),
                        ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.key),
                        ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.key),
                      ],
                      disabledNames: [
                        ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.name),
                        ...resourceVersionCreatorPage.additionalProperties.map<string>((rp) => rp.name),
                        ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.name),
                        ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.name),
                      ],
                    });

                    if (!dataSource) {
                      return;
                    }

                    await dispatch<OnChange_step2_customConfigurations_Action>({
                      type: 'resourceCreatorPage/onChange_step2_customConfigurations',
                      payload: {
                        value: [
                          ...resourceVersionCreatorPage.customConfigurations,
                          dataSource,
                        ],
                      },
                    });
                  }}
                >
                  <FComponentsLib.FIcons.FConfiguration style={{ fontSize: 14 }} />
                  <span>{FI18n.i18nNext.t('resourceoptions_add_btn')}</span>
                </FComponentsLib.FTextBtn>
              </div>
            </FTooltip>
          </div>

          {
            resourceVersionCreatorPage.customConfigurations.length === 0 && (<>
              <div style={{ height: 10 }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/*<span>{FI18n.i18nNext.t('resourceoptions_list_empty')}</span>*/}
                <FComponentsLib.FContentText
                  text={FI18n.i18nNext.t('resourceoptions_list_empty')}
                  type={'additional2'}
                />
              </div>
              <div style={{ height: 20 }} />
            </>)
          }

          {
            resourceVersionCreatorPage.customConfigurations.length > 0 && (<>
              <div style={{ height: 20 }} />
              <FResourceOptions
                theme={'dark'}
                // dataSource={resourceVersionCreatorPage.customOptionsData}
                dataSource={resourceVersionCreatorPage.customConfigurations}
                onEdit={async (value) => {
                  const index: number = resourceVersionCreatorPage.customConfigurations.findIndex((p) => {
                    return p === value;
                  });

                  const dataSource: {
                    key: string;
                    name: string;
                    type: 'input' | 'select';
                    input: string;
                    select: string[];
                    description: string;
                  } | null = await fResourceOptionEditor({
                    disabledKeys: [
                      ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
                      ...resourceVersionCreatorPage.additionalProperties.map<string>((rp) => rp.key),
                      ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.key),
                      ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.key),
                    ],
                    disabledNames: [
                      ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.name),
                      ...resourceVersionCreatorPage.additionalProperties.map<string>((rp) => rp.name),
                      ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.name),
                      ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.name),
                    ],
                    defaultData: value,
                  });

                  if (!dataSource) {
                    return;
                  }

                  await dispatch<OnChange_step2_customConfigurations_Action>({
                    type: 'resourceCreatorPage/onChange_step2_customConfigurations',
                    payload: {
                      value: resourceVersionCreatorPage.customConfigurations.map((a, b) => {
                        if (b !== index) {
                          return a;
                        }
                        return dataSource;
                      }),
                    },
                  });
                }}
                onDelete={async (value) => {
                  await dispatch<OnChange_step2_customConfigurations_Action>({
                    type: 'resourceCreatorPage/onChange_step2_customConfigurations',
                    payload: {
                      value: resourceVersionCreatorPage.customConfigurations.filter((a) => {
                        return a.key !== value.key && a.name !== value.name;
                      }),
                    },
                  });
                }}
              />
            </>)
          }

        </div>

        <div style={{ height: 5 }} />

        <div className={styles.block}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/*{FI18n.i18nNext.t('claim_rely_title')}*/}
            <FComponentsLib.FContentText text={FI18n.i18nNext.t('claim_rely_title')} type={'highlight'} />
            <FTooltip title={FI18n.i18nNext.t('resourceinfo_add_btn_info')}>
              <div>
                <FComponentsLib.FTextBtn
                  style={{ fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}
                  type='primary'
                  onClick={async () => {
                    const p = await getProcessor('resourceCreatorStep2');
                    const baseUpcastResources: Awaited<ReturnType<typeof p.getBaseUpcastResources>> = await p.getBaseUpcastResources();
                    await fAddDependencies({
                      // resourceTypeCode: resourceVersionCreatorPage.resourceInfo?.resourceTypeCode || '',
                      existingResources: (await p.getAllTargets()).map((t) => {
                        return {
                          resourceID: t.id,
                          resourceNme: t.name,
                        };
                      }),
                      baseUpcastResources: baseUpcastResources,
                      async onSelect_Resource({ resourceID, resourceName }) {
                        // console.log('8***********8sdflksdjlkj');
                        // const p = await getProcessor('resourceCreatorStep2');
                        await p.addTargets([{
                          id: resourceID,
                          name: resourceName,
                          type: 'resource',
                          // versionRange: '^0.1.0',
                        }]);
                        // await dispatch<OnChange_DataIsDirty_Action>({
                        //   type: 'resourceVersionCreatorPage/onChange_DataIsDirty',
                        //   payload: {
                        //     value: true,
                        //   },
                        // });
                      },
                      async onDeselect_Resource({ resourceID, resourceName }) {
                        // const p = await getProcessor('resourceCreatorStep2');
                        await p.removeTarget({
                          id: resourceID,
                          name: resourceName,
                          type: 'resource',
                        });
                        // await dispatch<OnChange_DataIsDirty_Action>({
                        //   type: 'resourceVersionCreatorPage/onChange_DataIsDirty',
                        //   payload: {
                        //     value: true,
                        //   },
                        // });
                      },
                    });
                  }}
                >
                  <FComponentsLib.FIcons.FConfiguration style={{ fontSize: 14 }} />
                  <span>{FI18n.i18nNext.t('claim_rely_add_btn')}</span>
                </FComponentsLib.FTextBtn>
              </div>
            </FTooltip>
          </div>

          {
            size && size.height === 0 && (<>
              <div style={{ height: 10 }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                {
                  FI18n.i18nNext.t('claim_rely_list_empty').split('\n').map((i, j) => {
                    return (<FComponentsLib.FContentText key={j} text={i} type={'additional2'} />);
                  })
                }
              </div>
              <div style={{ height: 20 }} />
            </>)
          }

          <>
            {
              size && size.height > 0 && (<div style={{ height: 20 }} />)
            }
            <div ref={ref}>
              <FResourceAuthorizationProcessor
                width={860}
                height={600}
                resourceID={resourceVersionCreatorPage.resourceInfo?.resourceID || ''}
                processorIdentifier={'resourceCreatorStep2'}
                onChanged={() => {
                  // dispatch<OnChange_DataIsDirty_Action>({
                  //   type: 'resourceVersionCreatorPage/onChange_DataIsDirty',
                  //   payload: {
                  //     value: true,
                  //   },
                  // });
                  // console.log('****** w0e98iofjsdlk ***((((((((');
                }}
              />
            </div>
          </>
        </div>
      </>)
    }


    <div style={{ height: 30 }} />

    <div className={styles.btn}>

      {/*{FI18n.i18nNext.t('rqr_step3_btn_later')}*/}
      <FComponentsLib.FTextBtn
        type={'default'}
        onClick={() => {
          // history.push(FUtil.LinkTo.resourceVersion({
          //   resourceID: resourceCreatorPage.step1_createdResourceInfo?.resourceID || '',
          //   version: '1.0.0',
          // }));
          history.push(FUtil.LinkTo.myResources());

        }}
      >{FI18n.i18nNext.t('rqr_step3_btn_later')}</FComponentsLib.FTextBtn>

      {/*{FI18n.i18nNext.t('rqr_step3_btn_next')}*/}
      <FComponentsLib.FRectBtn
        disabled={!resourceVersionCreatorPage.selectedFileInfo}
        type={'primary'}
        onClick={() => {
          dispatch<OnClick_step2_submitBtn_Action>({
            type: 'resourceCreatorPage/onClick_step2_submitBtn',
          });
        }}
      >{FI18n.i18nNext.t('rqr_step3_btn_next')}</FComponentsLib.FRectBtn>
    </div>

    <div style={{ height: 100 }} />
  </>);
}

// export default VersionCreator;

export default connect(({ resourceVersionCreatorPage }: ConnectState) => ({
  resourceVersionCreatorPage: resourceVersionCreatorPage,
}))(VersionCreator);
