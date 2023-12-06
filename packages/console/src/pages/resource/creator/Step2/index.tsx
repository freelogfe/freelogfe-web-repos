import * as React from 'react';
import styles from './index.less';
import img from '@/assets/file-object.svg';
import FComponentsLib from '@freelog/components-lib';
import { connect } from 'dva';
import { ConnectState, ResourceCreatorPageModelState } from '@/models/connect';
import { Dispatch } from 'redux';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import fResourcePropertyEditor from '@/components/fResourcePropertyEditor';
import FTooltip from '@/components/FTooltip';
import {
  OnChange_step2_additionalProperties_Action,
  OnChange_step2_customConfigurations_Action,
  OnChange_step2_customProperties_Action, OnClick_step2_editCartoonBtn_Action,
  OnClick_step2_editMarkdownBtn_Action,
  OnClick_step2_submitBtn_Action, OnClose_step2_editMarkdown,
  OnRemove_step2_file_Action,
  OnSucceed_step2_localUpload_Action,
  OnSucceed_step2_storageSpace_Action, OnTrigger_step2_SaveDraft_Action,
} from '@/models/resourceCreatorPage';
import FResourceProperties from '@/components/FResourceProperties';
import { history } from 'umi';
import LocalUpload from './LocalUpload';
import StorageSpace from './StorageSpace';
import MarkdownEditor from './MarkdownEditor';
import CartoonEditor from './CartoonEditor';
import { Progress, Space } from 'antd';
import { useGetState } from '@/utils/hooks';
import fResourceOptionEditor from '@/components/fResourceOptionEditor';
import FResourceOptions from '@/components/FResourceOptions';
import FResourceAuthorizationProcessor, { getProcessor } from '@/components/FResourceAuthorizationProcessor';
import fAddDependencies from '@/components/fAddDependencies';
import * as AHooks from 'ahooks';
import FSkeletonNode from '@/components/FSkeletonNode';
import FMicroApp_MarkdownEditorDrawer from '@/components/FMicroApp_MarkdownEditorDrawer';
import fMessage from '@/components/fMessage';
import { getFilesSha1Info } from '@/utils/service';

interface Step2Props {
  dispatch: Dispatch;
  resourceCreatorPage: ResourceCreatorPageModelState;
}

function Step2({ dispatch, resourceCreatorPage }: Step2Props) {

  const ref = React.useRef(null);
  const size = AHooks.useSize(ref);

  const [$showMore, set$ShowMore, get$ShowMore] = useGetState<boolean>(false);
  const [$uploadingInfo, set$uploadingInfo, get$uploadingInfo] = useGetState<null | {
    name: string;
    percent: number;
    cancelHandler: any;
  }>(null);

  AHooks.useDebounceEffect(() => {
    // console.log(resourceCreatorPage.step2_dataIsDirty_count, 'resourceCreatorPage.step2_dataIsDirty_count wieosfjlskdjflk');
    if (resourceCreatorPage.step2_dataIsDirty_count === 0) {
      return;
    }
    dispatch<OnTrigger_step2_SaveDraft_Action>({
      type: 'resourceCreatorPage/onTrigger_step2_SaveDraft',
    });
  }, [resourceCreatorPage.step2_dataIsDirty_count], {
    wait: 300,
  });

  const isCartoon = resourceCreatorPage.step1_createdResourceInfo?.resourceType[0] === '阅读'
    && resourceCreatorPage.step1_createdResourceInfo?.resourceType[1] === '漫画'
    && (resourceCreatorPage.step1_createdResourceInfo?.resourceType[2] === '条漫'
      || resourceCreatorPage.step1_createdResourceInfo?.resourceType[2] === '页漫');

  return (<>
    <div style={{ display: !resourceCreatorPage.step2_fileInfo && !!$uploadingInfo ? 'block' : 'none' }}>
      <div style={{ height: 40 }} />
      <div className={styles.fileInfo}>
        <div className={styles.card}>
          <img src={img} className={styles.img} alt='' />
          <div style={{ width: 20 }} />
          <div>
            <FComponentsLib.FContentText
              type='highlight'
              text={$uploadingInfo?.name || ''}
              style={{ maxWidth: 600 }}
              singleRow
            />
            <div style={{ height: 18 }} />
            <div className={styles.info}>
              <FComponentsLib.FContentText
                className={styles.infoSize}
                type='additional1'
                text={'本地上传'}
              />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', width: 270 }}>
          <FComponentsLib.FContentText
            text={`${$uploadingInfo?.percent || 0}%`}
            type={'additional1'}
            style={{ color: '#222' }}
          />
          <div style={{ width: 10 }} />
          <Progress
            percent={$uploadingInfo?.percent || 0}
            showInfo={false}
            style={{ width: 140 }}
          />
          <div style={{ width: 20 }} />
          {
            $uploadingInfo?.percent === 100
              ? (<FComponentsLib.FTextBtn
                style={{ fontSize: 12 }}
                type={'primary'}
              >正在解析</FComponentsLib.FTextBtn>)
              : (<FComponentsLib.FTextBtn
                style={{ fontSize: 12 }}
                type={'danger'}
                onClick={() => {
                  const uploadingInfo = get$uploadingInfo();
                  uploadingInfo && uploadingInfo.cancelHandler();
                  set$uploadingInfo(null);
                }}
              >取消上传</FComponentsLib.FTextBtn>)
          }

        </div>
      </div>
    </div>

    <div style={{ display: !resourceCreatorPage.step2_fileInfo && !$uploadingInfo ? 'block' : 'none' }}>
      <div style={{ height: 40 }} />
      <div className={styles.styles}>
        {
          !isCartoon && (<LocalUpload
            style={{ width: '100%', flexGrow: 1 }}
            resourceTypeCode={resourceCreatorPage.step1_createdResourceInfo?.resourceTypeCode || ''}
            resourceType={resourceCreatorPage.step1_createdResourceInfo?.resourceType || []}
            onSucceed={(value) => {
              dispatch<OnSucceed_step2_localUpload_Action>({
                type: 'resourceCreatorPage/onSucceed_step2_localUpload',
                payload: {
                  fileName: value.fileName,
                  sha1: value.sha1,
                },
              });
            }}
            onChange_uploadingInfo={(value) => {
              set$uploadingInfo(value);
            }}
          />)
        }

        {
          !isCartoon && (<StorageSpace
            style={{ width: '100%', flexGrow: 1 }}
            resourceTypeCode={resourceCreatorPage.step1_createdResourceInfo?.resourceTypeCode || ''}
            onSucceed={(value) => {
              dispatch<OnSucceed_step2_storageSpace_Action>({
                type: 'resourceCreatorPage/onSucceed_step2_storageSpace',
                payload: value,
              });
            }}
          />)
        }

        {
          !isCartoon && resourceCreatorPage.step1_createdResourceInfo?.resourceType[0] === '阅读'
          && resourceCreatorPage.step1_createdResourceInfo?.resourceType[1] === '文章'
          && (<MarkdownEditor
            style={{ width: '100%', flexGrow: 1 }}
            onClickBtn={() => {
              dispatch<OnClick_step2_editMarkdownBtn_Action>({
                type: 'resourceCreatorPage/onClick_step2_editMarkdownBtn',
              });
            }}
          />)
        }

        {
          isCartoon && (<CartoonEditor
            style={{ width: '100%', flexGrow: 1 }}
            onClickBtn={() => {
              dispatch<OnClick_step2_editCartoonBtn_Action>({
                type: 'resourceCreatorPage/onClick_step2_editCartoonBtn',
              });
            }}
          />)
        }

      </div>

      <div style={{ height: 30 }} />

      <div className={styles.btn}>

        {/*{FI18n.i18nNext.t('rqr_step3_btn_later')}*/}
        <FComponentsLib.FTextBtn
          type={'default'}
          onClick={() => {
            history.push(FUtil.LinkTo.resourceVersionInfo({
              resourceID: resourceCreatorPage.step1_createdResourceInfo?.resourceID || '',
            }));
            // history.push(FUtil.LinkTo.myResources());
          }}
        >{FI18n.i18nNext.t('rqr_step2_btn_later')}</FComponentsLib.FTextBtn>

        {/*{FI18n.i18nNext.t('rqr_step3_btn_next')}*/}
        <FComponentsLib.FRectBtn
          disabled={!resourceCreatorPage.step2_fileInfo}
          type={'primary'}
          onClick={() => {
            dispatch<OnClick_step2_submitBtn_Action>({
              type: 'resourceCreatorPage/onClick_step2_submitBtn',
            });
          }}
        >{FI18n.i18nNext.t('rqr_step2_btn_next')}</FComponentsLib.FRectBtn>
      </div>

      <div style={{ height: 100 }} />


    </div>
    <div style={{ display: resourceCreatorPage.step2_fileInfo ? 'block' : 'none' }}>
      <div style={{ height: 40 }} />

      <div className={styles.fileInfo}>
        <div className={styles.card}>
          <img src={img} className={styles.img} alt='' />
          <div style={{ width: 20 }} />
          <div>
            <FComponentsLib.FContentText
              type='highlight'
              text={resourceCreatorPage.step2_fileInfo?.name || ''}
              style={{ maxWidth: 600 }}
              singleRow
            />
            <div style={{ height: 18 }} />
            <div className={styles.info}>
              <FComponentsLib.FContentText
                className={styles.infoSize}
                type='additional1'
                text={resourceCreatorPage.step2_fileInfo?.from || ''}
              />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

          {
            resourceCreatorPage.step1_createdResourceInfo?.resourceType[0] === '阅读'
            && resourceCreatorPage.step1_createdResourceInfo?.resourceType[1] === '文章' && (<>
              <FComponentsLib.FTextBtn
                style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}
                disabled={resourceCreatorPage.step2_rawPropertiesState === 'parsing'}
                type='primary'
                onClick={async () => {

                  const { result } = await getFilesSha1Info({
                    sha1: [resourceCreatorPage.step2_fileInfo?.sha1 || ''],
                    resourceTypeCode: '',
                  });

                  if (result[0].fileSize > 2 * 1024 * 1024) {
                    fMessage(FI18n.i18nNext.t('mdeditor_import_error_lengthlimitation'), 'error');
                    return;
                  }

                  // $prop.onClick_EditBtn && $prop.onClick_EditBtn();
                  dispatch<OnClick_step2_editMarkdownBtn_Action>({
                    type: 'resourceCreatorPage/onClick_step2_editMarkdownBtn',
                  });
                }}
              >
                <FComponentsLib.FIcons.FEdit style={{ fontSize: 12 }} />
                <span>编辑</span>
              </FComponentsLib.FTextBtn>

              <FComponentsLib.FTextBtn
                style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}
                type='primary'
                disabled={resourceCreatorPage.step2_rawPropertiesState === 'parsing'}
                onClick={() => {
                  // self.location.href = FUtil.Format.completeUrlByDomain('qi')
                  //   + `/v2/storages/files/${$prop.fileInfo?.sha1}/download?attachmentName=${$prop.fileInfo?.name}`;
                  if (!resourceCreatorPage.step2_fileInfo) {
                    return;
                  }
                  // console.log(type, '98ieowjfkldjflksdjflksjdflkjsdlfkjsdlkj');
                  self.location.href = FUtil.Format.completeUrlByDomain('api')
                    + `/v2/storages/files/${resourceCreatorPage.step2_fileInfo?.sha1 || ''}/download?attachmentName=${resourceCreatorPage.step2_fileInfo?.name || 'download'}`;
                }}
              >
                <FComponentsLib.FIcons.FDownload style={{ fontSize: 12 }} />
                <span>下载</span>
              </FComponentsLib.FTextBtn>
            </>)
          }

          {
            resourceCreatorPage.step1_createdResourceInfo?.resourceType[1] === '漫画'
            && (resourceCreatorPage.step1_createdResourceInfo?.resourceType[2] === '条漫'
              || resourceCreatorPage.step1_createdResourceInfo?.resourceType[2] === '页漫') && (<FComponentsLib.FTextBtn
              disabled={resourceCreatorPage.step2_rawPropertiesState === 'parsing'}
              type='primary'
              style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}
              onClick={() => {
                // $prop.onClick_EditBtn && $prop.onClick_EditBtn();
                dispatch<OnClick_step2_editCartoonBtn_Action>({
                  type: 'resourceCreatorPage/onClick_step2_editCartoonBtn',
                });
              }}
            >
              <FComponentsLib.FIcons.FEdit style={{ fontSize: 12 }} />
              <span>编辑</span>
            </FComponentsLib.FTextBtn>)
          }

          <FComponentsLib.FTextBtn
            type='danger'
            style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}
            // disabled={$prop.disabledOperations?.includes('remove')}
            onClick={async () => {
              // $prop.onClick_DeleteBtn && $prop.onClick_DeleteBtn();
              dispatch<OnRemove_step2_file_Action>({
                type: 'resourceCreatorPage/onRemove_step2_file',
              });
            }}
            // className={styles.delete}
          >
            <FComponentsLib.FIcons.FDelete style={{ fontSize: 12 }} />
            <span>{FI18n.i18nNext.t('remove')}</span>
          </FComponentsLib.FTextBtn>
        </div>
      </div>

      <div style={{ height: 5 }} />

      {
        resourceCreatorPage.step2_rawPropertiesState === 'parsing' && (<>
          <div style={{ height: 20 }} />
          <FSkeletonNode width={920} height={38} />
          <div style={{ height: 20 }} />
          <FSkeletonNode width={340} height={38} />
        </>)
      }

      {
        resourceCreatorPage.step2_rawPropertiesState === 'success' && (<>
          <div className={styles.block}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FComponentsLib.FContentText text={'基础属性'} type={'highlight'} />
              {/*<FComponentsLib.FContentText text={''} type={'highlight'}/>*/}

              {
                resourceCreatorPage.step2_customProperties.length < 30 && (
                  <FTooltip title={FI18n.i18nNext.t('resourceinfo_add_btn_info')}>
                    <div>
                      <FComponentsLib.FTextBtn
                        style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}
                        type='primary'
                        onClick={async () => {
                          const dataSource: {
                            key: string;
                            name: string;
                            value: string;
                            description: string;
                          } | null = await fResourcePropertyEditor({
                            disabledKeys: [
                              ...resourceCreatorPage.step2_rawProperties.map<string>((rp) => rp.key),
                              ...resourceCreatorPage.step2_additionalProperties.map<string>((rp) => rp.key),
                              ...resourceCreatorPage.step2_customProperties.map<string>((bp) => bp.key),
                              ...resourceCreatorPage.step2_customConfigurations.map<string>((pp) => pp.key),
                            ],
                            disabledNames: [
                              ...resourceCreatorPage.step2_rawProperties.map<string>((rp) => rp.name),
                              ...resourceCreatorPage.step2_additionalProperties.map<string>((rp) => rp.name),
                              ...resourceCreatorPage.step2_customProperties.map<string>((bp) => bp.name),
                              ...resourceCreatorPage.step2_customConfigurations.map<string>((pp) => pp.name),
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
                                ...resourceCreatorPage.step2_customProperties,
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
                  </FTooltip>)
              }

            </div>
            <div style={{ height: 20 }} />

            <FResourceProperties
              immutableData={resourceCreatorPage.step2_rawProperties}
              onlyEditValueData={resourceCreatorPage.step2_additionalProperties}
              alterableData={resourceCreatorPage.step2_customProperties}
              onEdit_onlyEditValueData={async (value) => {
                // console.log(value, 'value sidjfoikjo sd value sdiofjlkj');
                const index: number = resourceCreatorPage.step2_additionalProperties.findIndex((p) => {
                  return p === value;
                });
                const dataSource: {
                  key: string;
                  name: string;
                  value: string;
                  description: string;
                } | null = await fResourcePropertyEditor({
                  disabledKeys: [
                    ...resourceCreatorPage.step2_rawProperties.map<string>((rp) => rp.key),
                    ...resourceCreatorPage.step2_additionalProperties.map<string>((rp) => rp.key),
                    ...resourceCreatorPage.step2_customProperties.map<string>((bp) => bp.key),
                    ...resourceCreatorPage.step2_customConfigurations.map<string>((pp) => pp.key),
                  ],
                  disabledNames: [
                    ...resourceCreatorPage.step2_rawProperties.map<string>((rp) => rp.name),
                    ...resourceCreatorPage.step2_additionalProperties.map<string>((rp) => rp.name),
                    ...resourceCreatorPage.step2_customProperties.map<string>((bp) => bp.name),
                    ...resourceCreatorPage.step2_customConfigurations.map<string>((pp) => pp.name),
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
                    value: resourceCreatorPage.step2_additionalProperties.map((v, i) => {
                      if (i !== index) {
                        return v;
                      }
                      return dataSource;
                    }),
                  },
                });
              }}
              onEdit_alterableData={async (value) => {
                const index: number = resourceCreatorPage.step2_customProperties.findIndex((p) => {
                  return p === value;
                });
                const dataSource: {
                  key: string;
                  name: string;
                  value: string;
                  description: string;
                } | null = await fResourcePropertyEditor({
                  disabledKeys: [
                    ...resourceCreatorPage.step2_rawProperties.map<string>((rp) => rp.key),
                    ...resourceCreatorPage.step2_additionalProperties.map<string>((rp) => rp.key),
                    ...resourceCreatorPage.step2_customProperties.map<string>((bp) => bp.key),
                    ...resourceCreatorPage.step2_customConfigurations.map<string>((pp) => pp.key),
                  ],
                  disabledNames: [
                    ...resourceCreatorPage.step2_rawProperties.map<string>((rp) => rp.name),
                    ...resourceCreatorPage.step2_additionalProperties.map<string>((rp) => rp.name),
                    ...resourceCreatorPage.step2_customProperties.map<string>((bp) => bp.name),
                    ...resourceCreatorPage.step2_customConfigurations.map<string>((pp) => pp.name),
                  ],
                  defaultData: value,
                });
                if (!dataSource) {
                  return;
                }

                await dispatch<OnChange_step2_customProperties_Action>({
                  type: 'resourceCreatorPage/onChange_step2_customProperties',
                  payload: {
                    value: resourceCreatorPage.step2_customProperties.map((v, i) => {
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
                    value: resourceCreatorPage.step2_customProperties.filter((v, i) => {
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
                {/*<FComponentsLib.FContentText text={'可以为资源文件添加可选配置，或进行依赖资源的声明'} type={'additional2'} />*/}
                <FComponentsLib.FContentText
                  text={FI18n.i18nNext.t('create_new_version_btn_moresetting_help')}
                  type={'additional2'}
                />
              </Space>)
          }
        </>)
      }


      <div style={{ display: $showMore ? 'block' : 'none' }}>
        <div style={{ height: 10 }} />

        {
          (resourceCreatorPage.step1_createdResourceInfo?.resourceType.includes('插件')
            || resourceCreatorPage.step1_createdResourceInfo?.resourceType.includes('主题'))
          && (<>
            <div className={styles.block}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FComponentsLib.FContentText text={FI18n.i18nNext.t('resourceoptions_title')} type={'highlight'} />
                {
                  resourceCreatorPage.step2_customConfigurations.length < 30 && (
                    // <FTooltip title={FI18n.i18nNext.t('resourceinfo_add_btn_info')}>
                    <FTooltip title={FI18n.i18nNext.t('info_versionoptions')}>
                      <div>
                        <FComponentsLib.FTextBtn
                          style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}
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
                                ...resourceCreatorPage.step2_rawProperties.map<string>((rp) => rp.key),
                                ...resourceCreatorPage.step2_additionalProperties.map<string>((rp) => rp.key),
                                ...resourceCreatorPage.step2_customProperties.map<string>((bp) => bp.key),
                                ...resourceCreatorPage.step2_customConfigurations.map<string>((pp) => pp.key),
                              ],
                              disabledNames: [
                                ...resourceCreatorPage.step2_rawProperties.map<string>((rp) => rp.name),
                                ...resourceCreatorPage.step2_additionalProperties.map<string>((rp) => rp.name),
                                ...resourceCreatorPage.step2_customProperties.map<string>((bp) => bp.name),
                                ...resourceCreatorPage.step2_customConfigurations.map<string>((pp) => pp.name),
                              ],
                            });

                            if (!dataSource) {
                              return;
                            }

                            await dispatch<OnChange_step2_customConfigurations_Action>({
                              type: 'resourceCreatorPage/onChange_step2_customConfigurations',
                              payload: {
                                value: [
                                  ...resourceCreatorPage.step2_customConfigurations,
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
                    </FTooltip>)
                }

              </div>

              {
                resourceCreatorPage.step2_customConfigurations.length === 0 && (<>
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
                resourceCreatorPage.step2_customConfigurations.length > 0 && (<>
                  <div style={{ height: 20 }} />
                  <FResourceOptions
                    theme={'dark'}
                    // dataSource={resourceVersionCreatorPage.customOptionsData}
                    dataSource={resourceCreatorPage.step2_customConfigurations}
                    onEdit={async (value) => {
                      const index: number = resourceCreatorPage.step2_customConfigurations.findIndex((p) => {
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
                          ...resourceCreatorPage.step2_rawProperties.map<string>((rp) => rp.key),
                          ...resourceCreatorPage.step2_additionalProperties.map<string>((rp) => rp.key),
                          ...resourceCreatorPage.step2_customProperties.map<string>((bp) => bp.key),
                          ...resourceCreatorPage.step2_customConfigurations.map<string>((pp) => pp.key),
                        ],
                        disabledNames: [
                          ...resourceCreatorPage.step2_rawProperties.map<string>((rp) => rp.name),
                          ...resourceCreatorPage.step2_additionalProperties.map<string>((rp) => rp.name),
                          ...resourceCreatorPage.step2_customProperties.map<string>((bp) => bp.name),
                          ...resourceCreatorPage.step2_customConfigurations.map<string>((pp) => pp.name),
                        ],
                        defaultData: value,
                      });

                      if (!dataSource) {
                        return;
                      }

                      await dispatch<OnChange_step2_customConfigurations_Action>({
                        type: 'resourceCreatorPage/onChange_step2_customConfigurations',
                        payload: {
                          value: resourceCreatorPage.step2_customConfigurations.map((a, b) => {
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
                          value: resourceCreatorPage.step2_customConfigurations.filter((a) => {
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
          </>)
        }


        <div className={styles.block}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FComponentsLib.FContentText text={FI18n.i18nNext.t('claim_rely_title')} type={'highlight'} />
            <FTooltip title={FI18n.i18nNext.t('info_versionrely')}>
              <div>
                <FComponentsLib.FTextBtn
                  style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}
                  type='primary'
                  onClick={async () => {
                    const p = await getProcessor('resourceCreatorStep2');
                    const baseUpcastResources: Awaited<ReturnType<typeof p.getBaseUpcastResources>> = await p.getBaseUpcastResources();
                    await fAddDependencies({
                      existingResources: (await p.getAllTargets()).map((t) => {
                        return {
                          resourceID: t.id,
                          resourceNme: t.name,
                        };
                      }),
                      baseUpcastResources: baseUpcastResources,
                      async onSelect_Resource({ resourceID, resourceName }) {
                        await p.addTargets([{
                          id: resourceID,
                          name: resourceName,
                          type: 'resource',
                        }]);
                      },
                      async onDeselect_Resource({ resourceID, resourceName }) {
                        // const p = await getProcessor('resourceCreatorStep2');
                        await p.removeTarget({
                          id: resourceID,
                          name: resourceName,
                          type: 'resource',
                        });
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
                resourceID={resourceCreatorPage.step1_createdResourceInfo?.resourceID || ''}
                processorIdentifier={'resourceCreatorStep2'}
                onChanged={() => {
                }}
              />
            </div>
          </>
        </div>
      </div>


      <div style={{ height: 30 }} />

      <div className={styles.btn}>

        <FComponentsLib.FTextBtn
          type={'default'}
          onClick={() => {
            history.push(FUtil.LinkTo.resourceVersionInfo({
              resourceID: resourceCreatorPage.step1_createdResourceInfo?.resourceID || '',
            }));
          }}
        >{FI18n.i18nNext.t('rqr_step2_btn_later')}</FComponentsLib.FTextBtn>

        <FComponentsLib.FRectBtn
          disabled={!resourceCreatorPage.step2_fileInfo}
          type={'primary'}
          onClick={() => {
            dispatch<OnClick_step2_submitBtn_Action>({
              type: 'resourceCreatorPage/onClick_step2_submitBtn',
            });
          }}
        >{FI18n.i18nNext.t('rqr_step2_btn_next')}</FComponentsLib.FRectBtn>
      </div>

      <div style={{ height: 100 }} />

      <FMicroApp_MarkdownEditorDrawer
        open={resourceCreatorPage.step2_isOpenMarkdown}
        resourceID={resourceCreatorPage.step1_createdResourceInfo?.resourceID || ''}
        onChange_Saved={(saved) => {
          // dispatch<ChangeAction>({
          //   type: 'resourceVersionCreatorPage/change',
          //   payload: {
          //     isDirtyMarkdownEditor: !saved,
          //   },
          // });
        }}
        onClose={() => {
          dispatch<OnClose_step2_editMarkdown>({
            type: 'resourceCreatorPage/onClose_step2_editMarkdown',
          });
        }}
      />
    </div>
  </>);
}

export default connect(({ resourceCreatorPage }: ConnectState) => ({
  resourceCreatorPage: resourceCreatorPage,
}))(Step2);


