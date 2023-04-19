import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import SelectDeps from '@/pages/storage/Content/SelectDeps';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ResourceVersionCreatorPageModelState, StorageObjectEditorModelState } from '@/models/connect';
import {
  ChangeAction,
  OnChangeTypeAction, OnClick_SaveBtn_Action,
} from '@/models/storageObjectEditor';
import DepsCards from './DepsCards';
import FBaseProperties from '@/components/FBaseProperties';
import FBasePropsEditorDrawer from '@/components/FBasePropsEditorDrawer';
import FFormLayout from '@/components/FFormLayout';
import FDrawer from '@/components/FDrawer';
import FCustomOptionsEditorDrawer from '@/components/FCustomOptionsEditorDrawer';
import { history } from 'umi';
import FTooltip from '@/components/FTooltip';
import { FUtil, FServiceAPI, FI18n } from '@freelog/tools-lib';
import FCustomOptionsCards from '@/components/FCustomOptionsCards';
import FBasePropEditorDrawer from '@/components/FBasePropEditorDrawer';
import FCustomOptionEditorDrawer from '@/components/FCustomOptionEditorDrawer';
import FResourceTypeInput from '@/components/FResourceTypeInput';
import FComponentsLib from '@freelog/components-lib';
import FResourceProperties from '@/components/FResourceProperties';
import fResourcePropertyEditor from '@/components/fResourcePropertyEditor';
import { OnChange_BaseProperties_Action, OnChange_CustomOptions_Action } from '@/models/resourceVersionCreatorPage';
import FResourceOptions from '@/components/FResourceOptions';
import fResourceOptionEditor from '@/components/fResourceOptionEditor';
import fAddFileBaseProps from '@/components/fAddFileBaseProps';

interface DetailsProps {
  dispatch: Dispatch;
  storageObjectEditor: StorageObjectEditorModelState;
}

function Details({ storageObjectEditor, dispatch }: DetailsProps) {

  const [depInfoVisible, setDepInfoVisible] = React.useState<boolean>(false);

  async function onChange(payload: ChangeAction['payload']) {
    await dispatch<ChangeAction>({
      type: 'storageObjectEditor/change',
      payload,
    });
  }

  async function onClick_addOptionBtn() {
    const dataSource: {
      key: string;
      name: string;
      type: 'input' | 'select';
      input: string;
      select: string[];
      description: string;
    } | null = await fResourceOptionEditor({
      disabledKeys: [
        ...storageObjectEditor.rawProperties.map<string>((rp) => rp.key),
        ...storageObjectEditor.baseProperties.map<string>((bp) => bp.key),
        ...storageObjectEditor.customOptionsData.map<string>((pp) => pp.key),
      ],
      disabledNames: [
        ...storageObjectEditor.baseProperties.map<string>((bp) => bp.name),
        ...storageObjectEditor.customOptionsData.map<string>((pp) => pp.name),
      ],
    });

    if (!dataSource) {
      return;
    }

    await onChange({
      customOptionsData: [
        ...storageObjectEditor.customOptionsData,
        dataSource,
      ],
    });
  }

  return (<FDrawer
    title={'编辑对象信息'}
    open={!!storageObjectEditor.objectId}
    width={720}
    topRight={<Space size={30}>
      <FComponentsLib.FTextBtn
        onClick={() => {
          // onChange({
          //   customOptionsDataVisible: false,
          // });
          history.replace(FUtil.LinkTo.storageSpace({ bucketName: storageObjectEditor.bucketName }));
        }}
        type='default'
      >取消</FComponentsLib.FTextBtn>
      <FComponentsLib.FRectBtn
        // disabled={hasError}
        onClick={async () => {
          dispatch<OnClick_SaveBtn_Action>({
            type: 'storageObjectEditor/onClick_SaveBtn',
          });
        }}
      >保存</FComponentsLib.FRectBtn>
    </Space>}
    onClose={() => {
      // onChange({
      //   customOptionsDataVisible: false,
      // });
      history.replace(FUtil.LinkTo.storageSpace({
        bucketName: storageObjectEditor.bucketName,
      }));
    }}
  >
    <div className={styles.divContainer}>

      <FFormLayout>
        <FFormLayout.FBlock title={'对象'}>
          <div className={styles.Header}>
            <Space size={10}>
              <FComponentsLib.FContentText
                text={`${storageObjectEditor.bucketName}/${storageObjectEditor.objectName}`}
                type='highlight'
                className={styles.objectName}
                singleRow
              />
            </Space>
            <Space size={15}>
              <FComponentsLib.FCopyToClipboard
                iconStyle={{ fontSize: 14 }}
                text={`${storageObjectEditor.bucketName}/${storageObjectEditor.objectName}`}
                title={FI18n.i18nNext.t('copy_object_name')}
              />
              <FTooltip title={FI18n.i18nNext.t('tip_download_object')}>
                <div>
                  <FComponentsLib.FTextBtn
                    type='primary'
                    onClick={() => {
                      FServiceAPI.Storage.downloadObject({
                        objectIdOrName: encodeURIComponent(`${storageObjectEditor.bucketName}/${storageObjectEditor.objectName}`),
                      });
                    }}
                  ><FComponentsLib.FIcons.FDownload style={{ fontSize: 14 }} /></FComponentsLib.FTextBtn>
                </div>
              </FTooltip>
            </Space>
          </div>
          <div style={{ height: 5 }} />

          <div className={styles.attributes}>
            <div style={{ height: 20 }} />
            <div className={styles.attributesHeader}>
              {/*<span>基础属性</span>*/}
              <FComponentsLib.FContentText text={'基础属性'} type={'highlight'} style={{ fontSize: 12 }} />
              <div>
                <Space size={20}>
                  <FComponentsLib.FTextBtn
                    style={{ fontSize: 12, fontWeight: 600 }}
                    type='primary'
                    onClick={async () => {
                      const dataSource: {
                        key: string;
                        name: string;
                        value: string;
                        description: string;
                      } | null = await fResourcePropertyEditor({
                        disabledKeys: [
                          ...storageObjectEditor.rawProperties.map<string>((rp) => rp.key),
                          ...storageObjectEditor.baseProperties.map<string>((bp) => bp.key),
                          ...storageObjectEditor.customOptionsData.map<string>((pp) => pp.key),
                        ],
                        disabledNames: [
                          ...storageObjectEditor.baseProperties.map<string>((bp) => bp.name),
                          ...storageObjectEditor.customOptionsData.map<string>((pp) => pp.name),
                        ],
                      });
                      // console.log(dataSource, 'dataSource9iojskldjflksdjflk');
                      if (!dataSource) {
                        return;
                      }

                      onChange({
                        baseProperties: [
                          ...storageObjectEditor.baseProperties,
                          dataSource,
                        ],
                      });
                    }}
                  >补充属性</FComponentsLib.FTextBtn>
                </Space>
              </div>
            </div>

            <div style={{ height: 20 }} />

            <FResourceProperties
              immutableData={storageObjectEditor.rawProperties}
              alterableData={storageObjectEditor.baseProperties}
            />
            <div style={{ height: 15 }} />
          </div>

          {/*<div className={styles.attributes}>*/}
          {/*  <div className={styles.attributesHeader}>*/}
          {/*    <span>基础属性</span>*/}
          {/*    <Space size={20}>*/}
          {/*      <FComponentsLib.FTextBtn*/}
          {/*        style={{ fontSize: 12, fontWeight: 600 }}*/}
          {/*        type='primary'*/}
          {/*        onClick={async () => {*/}
          {/*          // onChange({*/}
          {/*          //   // basePropertiesEditorVisible: true,*/}
          {/*          //   basePropertiesEditorData: [{*/}
          {/*          //     key: '',*/}
          {/*          //     keyError: '',*/}
          {/*          //     value: '',*/}
          {/*          //     valueError: '',*/}
          {/*          //     description: '',*/}
          {/*          //     descriptionError: '',*/}
          {/*          //   }],*/}
          {/*          // });*/}

          {/*const dataSource: {*/}
          {/*  key: string;*/}
          {/*  name: string;*/}
          {/*  value: string;*/}
          {/*  description: string;*/}
          {/*} | null = await fResourcePropertyEditor({*/}
          {/*  disabledKeys: [*/}
          {/*    ...storageObjectEditor.rawProperties.map<string>((rp) => rp.key),*/}
          {/*    ...storageObjectEditor.baseProperties.map<string>((bp) => bp.key),*/}
          {/*    ...storageObjectEditor.customOptionsData.map<string>((pp) => pp.key),*/}
          {/*  ],*/}
          {/*  disabledNames: [*/}
          {/*    ...storageObjectEditor.baseProperties.map<string>((bp) => bp.name),*/}
          {/*    ...storageObjectEditor.customOptionsData.map<string>((pp) => pp.name),*/}
          {/*  ],*/}
          {/*});*/}
          {/*// console.log(dataSource, 'dataSource9iojskldjflksdjflk');*/}
          {/*if (!dataSource) {*/}
          {/*  return;*/}
          {/*}*/}

          {/*onChange({*/}
          {/*  baseProperties: [*/}
          {/*    ...storageObjectEditor.baseProperties,*/}
          {/*    dataSource,*/}
          {/*  ],*/}
          {/*});*/}
          {/*        }}*/}
          {/*      >补充属性</FComponentsLib.FTextBtn>*/}
          {/*    </Space>*/}
          {/*  </div>*/}
          {/*  <div style={{ height: 5 }} />*/}
          {/*  <FResourceProperties*/}
          {/*    immutableData={storageObjectEditor.rawProperties}*/}
          {/*    alterableData={storageObjectEditor.baseProperties}*/}
          {/*  />*/}
          {/*  <div style={{ height: 10 }} />*/}

          {/*</div>*/}

          <div style={{ height: 5 }} />

          {
            storageObjectEditor.customOptionsData.length === 0
              ? (<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 20 }}>
                <FComponentsLib.FTextBtn
                  type={'default'}
                  style={{ fontSize: 12 }}
                  onClick={() => {
                    onClick_addOptionBtn();
                  }}
                >添加可选配置</FComponentsLib.FTextBtn>

              </div>)
              : (<div className={styles.options}>
                <div style={{ height: 20 }} />
                <div className={styles.optionsHeader}>
                  <FComponentsLib.FContentText text={'可选配置'} type={'highlight'} style={{ fontSize: 12 }} />

                  <FComponentsLib.FTextBtn
                    style={{ fontSize: 12, fontWeight: 600 }}
                    type='primary'
                    onClick={async () => {
                      onClick_addOptionBtn();
                    }}
                  >添加配置</FComponentsLib.FTextBtn>
                </div>
                <div style={{ height: 20 }} />

                <FResourceOptions
                  // dataSource={resourceVersionCreatorPage.customOptionsData}
                  dataSource={storageObjectEditor.customOptionsData}
                  onEdit={async (value) => {
                    const index: number = storageObjectEditor.customOptionsData.findIndex((p) => {
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
                        ...storageObjectEditor.rawProperties.map<string>((rp) => rp.key),
                        ...storageObjectEditor.baseProperties.map<string>((bp) => bp.key),
                        ...storageObjectEditor.customOptionsData.map<string>((pp) => pp.key),
                      ],
                      disabledNames: [
                        ...storageObjectEditor.baseProperties.map<string>((bp) => bp.name),
                        ...storageObjectEditor.customOptionsData.map<string>((pp) => pp.name),
                      ],
                      defaultData: value,
                    });

                    if (!dataSource) {
                      return;
                    }

                    await onChange({
                      customOptionsData: storageObjectEditor.customOptionsData.map((a, b) => {
                        if (b !== index) {
                          return a;
                        }
                        return dataSource;
                      }),
                    });

                    // await dispatch<OnChange_CustomOptions_Action>({
                    //   type: 'resourceVersionCreatorPage/onChange_CustomOptions',
                    //   payload: {
                    //     value: storageObjectEditor.customOptionsData.map((a, b) => {
                    //       if (b !== index) {
                    //         return a;
                    //       }
                    //       return dataSource;
                    //     }),
                    //   },
                    // });
                  }}
                  onDelete={async (value) => {
                    await onChange({
                      customOptionsData: storageObjectEditor.customOptionsData.filter((a) => {
                        return a.key !== value.key && a.name !== value.name;
                      }),
                    });
                    // await dispatch<OnChange_CustomOptions_Action>({
                    //   type: 'resourceVersionCreatorPage/onChange_CustomOptions',
                    //   payload: {
                    //     value: storageObjectEditor.customOptionsData.filter((a) => {
                    //       return a.key !== value.key && a.name !== value.name;
                    //     }),
                    //   },
                    // });
                  }}
                />

              </div>)
          }


          {/*<FBaseProperties*/}
          {/*  basics={storageObjectEditor.rawProperties}*/}
          {/*  additions={storageObjectEditor.baseProperties}*/}
          {/*  onChangeAdditions={(value) => {*/}
          {/*    onChange({ baseProperties: value });*/}
          {/*  }}*/}
          {/*  onClickEdit={(theKey: string) => {*/}
          {/*    const index: number = storageObjectEditor.baseProperties.findIndex((bp) => {*/}
          {/*      return bp.key === theKey;*/}
          {/*    });*/}
          {/*    onChange({*/}
          {/*      basePropertyEditorIndex: index,*/}
          {/*      basePropertyEditorData: {*/}
          {/*        ...storageObjectEditor.baseProperties[index],*/}
          {/*        keyError: '',*/}
          {/*        valueError: '',*/}
          {/*        descriptionError: '',*/}
          {/*      },*/}
          {/*    });*/}
          {/*  }}*/}
          {/*  rightTop={<Space size={20}>*/}
          {/*    <FComponentsLib.FTextBtn*/}
          {/*      style={{ fontSize: 12, fontWeight: 600 }}*/}
          {/*      type='primary'*/}
          {/*      onClick={() => {*/}
          {/*        onChange({*/}
          {/*          basePropertiesEditorVisible: true,*/}
          {/*          basePropertiesEditorData: [{*/}
          {/*            key: '',*/}
          {/*            keyError: '',*/}
          {/*            value: '',*/}
          {/*            valueError: '',*/}
          {/*            description: '',*/}
          {/*            descriptionError: '',*/}
          {/*          }],*/}
          {/*        });*/}
          {/*      }}*/}
          {/*    >补充属性</FComponentsLib.FTextBtn>*/}
          {/*  </Space>}*/}
          {/*/>*/}

          {/*<div style={{ height: 20 }} />*/}

          {/*<Space>*/}
          {/*  <FComponentsLib.FTextBtn*/}
          {/*    onClick={() => {*/}
          {/*      onChange({*/}
          {/*        customOptionsDataVisible: !storageObjectEditor.customOptionsDataVisible,*/}
          {/*      });*/}
          {/*    }}*/}
          {/*    type='default'*/}
          {/*    style={{ fontSize: 12, fontWeight: 600 }}*/}
          {/*  >*/}
          {/*    <span>自定义选项（高级）</span>*/}
          {/*    {storageObjectEditor.customOptionsDataVisible ? (<FComponentsLib.FIcons.FUp />) : (*/}
          {/*      <FComponentsLib.FIcons.FDown />)}*/}
          {/*  </FComponentsLib.FTextBtn>*/}
          {/*  <FTooltip title={'自定义选项'}>*/}
          {/*    <div>*/}
          {/*      <FComponentsLib.FIcons.FInfo />*/}
          {/*    </div>*/}
          {/*  </FTooltip>*/}
          {/*</Space>*/}

          {/*{*/}
          {/*  storageObjectEditor.customOptionsDataVisible && (<>*/}

          {/*    <div style={{ height: 20 }} />*/}

          {/*    <Space size={40}>*/}
          {/*      <FComponentsLib.FTextBtn*/}
          {/*        onClick={() => {*/}
          {/*          dispatch<ChangeAction>({*/}
          {/*            type: 'storageObjectEditor/change',*/}
          {/*            payload: {*/}
          {/*              customOptionsEditorVisible: true,*/}
          {/*              customOptionsEditorDataSource: [{*/}
          {/*                key: '',*/}
          {/*                keyError: '',*/}
          {/*                description: '',*/}
          {/*                descriptionError: '',*/}
          {/*                custom: 'input',*/}
          {/*                defaultValue: '',*/}
          {/*                defaultValueError: '',*/}
          {/*                customOption: '',*/}
          {/*                customOptionError: '',*/}
          {/*              }],*/}
          {/*            },*/}
          {/*          });*/}
          {/*        }}*/}
          {/*        type='primary'*/}
          {/*        style={{ fontSize: 12, fontWeight: 600 }}*/}
          {/*      >添加选项</FComponentsLib.FTextBtn>*/}

          {/*    </Space>*/}

          {/*    <div style={{ height: 20 }} />*/}
          {/*    {*/}
          {/*      storageObjectEditor.customOptionsData.length > 0 ? (<FCustomOptionsCards*/}
          {/*          dataSource={storageObjectEditor.customOptionsData.map((cod) => {*/}
          {/*            return {*/}
          {/*              theKey: cod.key,*/}
          {/*              description: cod.description,*/}
          {/*              type: cod.custom,*/}
          {/*              value: cod.custom === 'select' ? cod.customOption : cod.defaultValue,*/}
          {/*            };*/}
          {/*          })}*/}
          {/*          onDelete={(theKey) => {*/}
          {/*            dispatch<ChangeAction>({*/}
          {/*              type: 'storageObjectEditor/change',*/}
          {/*              payload: {*/}
          {/*                customOptionsData: storageObjectEditor.customOptionsData.filter((cod) => {*/}
          {/*                  return cod.key !== theKey;*/}
          {/*                }),*/}
          {/*              },*/}
          {/*            });*/}
          {/*          }}*/}
          {/*          onEdit={(theKey) => {*/}
          {/*            const index: number = storageObjectEditor.customOptionsData.findIndex((cod) => {*/}
          {/*              return cod.key === theKey;*/}
          {/*            });*/}
          {/*            const customOption = storageObjectEditor.customOptionsData[index];*/}
          {/*            onChange({*/}
          {/*              customOptionIndex: index,*/}
          {/*              customOptionEditorData: customOption ? {*/}
          {/*                key: customOption.key,*/}
          {/*                keyError: '',*/}
          {/*                description: customOption.description,*/}
          {/*                descriptionError: '',*/}
          {/*                custom: customOption.custom,*/}
          {/*                defaultValue: customOption.defaultValue,*/}
          {/*                defaultValueError: '',*/}
          {/*                customOption: customOption.customOption,*/}
          {/*                customOptionError: '',*/}
          {/*              } : null,*/}
          {/*            });*/}
          {/*          }}*/}
          {/*        />)*/}
          {/*        : (<FComponentsLib.FContentText text={'暂无自定义选项…'} type='negative' />)*/}
          {/*    }*/}
          {/*  </>)*/}
          {/*}*/}

        </FFormLayout.FBlock>
        <FFormLayout.FBlock title={'资源类型'}>
          <FResourceTypeInput
            // useKey={'name'}
            value={storageObjectEditor.resourceTypeValue}
            onChange={(value) => {
              dispatch<OnChangeTypeAction>({
                type: 'storageObjectEditor/onChangeType',
                payload: {
                  value: value,
                  // names: selectedOptions.map((so) => {
                  //   return so.label;
                  // }),
                },
              });
            }}
          />
        </FFormLayout.FBlock>
        <FFormLayout.FBlock title={'依赖'}>
          <Space size={10}>
            <FComponentsLib.FRectBtn
              type='default'
              onClick={() => setDepInfoVisible(true)}
            >添加依赖</FComponentsLib.FRectBtn>
          </Space>
          {
            storageObjectEditor.depRs.length > 0 && (<DepsCards
              title={'资源'}
              dataSource={storageObjectEditor.depRs}
              onChange={(value) => {
                // console.log(value, 'value2903jafdslkfa');
                dispatch<ChangeAction>({
                  type: 'storageObjectEditor/change',
                  payload: {
                    depRs: value as StorageObjectEditorModelState['depRs'],
                  },
                });
              }}
            />)
          }

          {
            storageObjectEditor.depOs.length > 0 && (<DepsCards
              title={'对象'}
              dataSource={storageObjectEditor.depOs}
              onChange={(value) => {
                dispatch<ChangeAction>({
                  type: 'storageObjectEditor/change',
                  payload: {
                    depOs: value as StorageObjectEditorModelState['depOs'],
                  },
                });
              }}
            />)
          }

        </FFormLayout.FBlock>
      </FFormLayout>

      <FDrawer
        title='添加依赖'
        width={640}
        open={depInfoVisible}
        onClose={() => setDepInfoVisible(false)}
        destroyOnClose
      >
        <SelectDeps />
      </FDrawer>
    </div>

    {/*<FBasePropsEditorDrawer*/}
    {/*  visible={storageObjectEditor.basePropertiesEditorVisible}*/}
    {/*  dataSource={storageObjectEditor.basePropertiesEditorData}*/}
    {/*  disabledKeys={[*/}
    {/*    ...storageObjectEditor.rawProperties.map<string>((rp) => rp.key),*/}
    {/*    ...storageObjectEditor.baseProperties.map<string>((bp) => bp.key),*/}
    {/*    ...storageObjectEditor.customOptionsData.map<string>((pp) => pp.key),*/}
    {/*  ]}*/}
    {/*  onChange={(value) => {*/}
    {/*    onChange({*/}
    {/*      basePropertiesEditorData: value,*/}
    {/*    });*/}
    {/*  }}*/}
    {/*  onCancel={() => {*/}
    {/*    onChange({*/}
    {/*      basePropertiesEditorData: [],*/}
    {/*      basePropertiesEditorVisible: false,*/}
    {/*    });*/}
    {/*  }}*/}
    {/*  onConfirm={() => {*/}
    {/*    onChange({*/}
    {/*      basePropertiesEditorData: [],*/}
    {/*      basePropertiesEditorVisible: false,*/}
    {/*      baseProperties: [*/}
    {/*        ...storageObjectEditor.baseProperties,*/}
    {/*        ...storageObjectEditor.basePropertiesEditorData.map<ResourceVersionCreatorPageModelState['baseProperties'][number]>((bped) => {*/}
    {/*          return {*/}
    {/*            key: bped.key,*/}
    {/*            value: bped.value,*/}
    {/*            description: bped.description,*/}
    {/*          };*/}
    {/*        }),*/}
    {/*      ],*/}
    {/*    });*/}
    {/*  }}*/}
    {/*/>*/}

    {/*<FBasePropEditorDrawer*/}
    {/*  usedKeys={[*/}
    {/*    ...storageObjectEditor.rawProperties.map<string>((rp) => rp.key),*/}
    {/*    ...storageObjectEditor.baseProperties.filter((bp, ind) => ind !== storageObjectEditor.basePropertyEditorIndex).map((bp) => {*/}
    {/*      return bp.key;*/}
    {/*    }),*/}
    {/*    ...storageObjectEditor.customOptionsData.map<string>((pp) => pp.key),*/}
    {/*  ]}*/}
    {/*  visible={storageObjectEditor.basePropertyEditorIndex > -1}*/}
    {/*  keyInput={storageObjectEditor.basePropertyEditorData?.key || ''}*/}
    {/*  keyInputError={storageObjectEditor.basePropertyEditorData?.keyError || ''}*/}
    {/*  valueInput={storageObjectEditor.basePropertyEditorData?.value || ''}*/}
    {/*  valueInputError={storageObjectEditor.basePropertyEditorData?.valueError || ''}*/}
    {/*  descriptionInput={storageObjectEditor.basePropertyEditorData?.description || ''}*/}
    {/*  descriptionInputError={storageObjectEditor.basePropertyEditorData?.descriptionError || ''}*/}
    {/*  onCancel={() => {*/}
    {/*    onChange({*/}
    {/*      basePropertyEditorIndex: -1,*/}
    {/*      basePropertyEditorData: null,*/}
    {/*    });*/}
    {/*  }}*/}
    {/*  onConfirm={() => {*/}
    {/*    onChange({*/}
    {/*      baseProperties: storageObjectEditor.baseProperties.map((bp, ind) => {*/}
    {/*        if (ind !== storageObjectEditor.basePropertyEditorIndex) {*/}
    {/*          return bp;*/}
    {/*        }*/}
    {/*        return {*/}
    {/*          key: storageObjectEditor.basePropertyEditorData?.key || '',*/}
    {/*          value: storageObjectEditor.basePropertyEditorData?.value || '',*/}
    {/*          description: storageObjectEditor.basePropertyEditorData?.description || '',*/}
    {/*        };*/}
    {/*      }),*/}
    {/*      basePropertyEditorIndex: -1,*/}
    {/*      basePropertyEditorData: null,*/}
    {/*    });*/}
    {/*  }}*/}
    {/*  onKeyInputChange={(value) => {*/}
    {/*    onChange({*/}
    {/*      basePropertyEditorData: storageObjectEditor.basePropertyEditorData ? {*/}
    {/*        ...storageObjectEditor.basePropertyEditorData,*/}
    {/*        key: value.value,*/}
    {/*        keyError: value.errorText,*/}
    {/*      } : null,*/}
    {/*    });*/}
    {/*  }}*/}
    {/*  onValueInputChange={(value) => {*/}
    {/*    onChange({*/}
    {/*      basePropertyEditorData: storageObjectEditor.basePropertyEditorData ? {*/}
    {/*        ...storageObjectEditor.basePropertyEditorData,*/}
    {/*        value: value.value,*/}
    {/*        valueError: value.errorText,*/}
    {/*      } : null,*/}
    {/*    });*/}
    {/*  }}*/}
    {/*  onDescriptionInputChange={(value) => {*/}
    {/*    onChange({*/}
    {/*      basePropertyEditorData: storageObjectEditor.basePropertyEditorData ? {*/}
    {/*        ...storageObjectEditor.basePropertyEditorData,*/}
    {/*        description: value.value,*/}
    {/*        descriptionError: value.errorText,*/}
    {/*      } : null,*/}
    {/*    });*/}
    {/*  }}*/}
    {/*/>*/}

    {/*<FCustomOptionsEditorDrawer*/}
    {/*  visible={storageObjectEditor.customOptionsEditorVisible}*/}
    {/*  onCancel={() => {*/}
    {/*    dispatch<ChangeAction>({*/}
    {/*      type: 'storageObjectEditor/change',*/}
    {/*      payload: {*/}
    {/*        customOptionsEditorVisible: false,*/}
    {/*        customOptionsEditorDataSource: [],*/}
    {/*      },*/}
    {/*    });*/}
    {/*  }}*/}
    {/*  disabledKeys={[*/}
    {/*    ...storageObjectEditor.rawProperties.map<string>((rp) => rp.key),*/}
    {/*    ...storageObjectEditor.baseProperties.map<string>((pp) => pp.key),*/}
    {/*    ...storageObjectEditor.customOptionsData.map<string>((cod) => cod.key),*/}
    {/*  ]}*/}
    {/*  onConfirm={(value) => {*/}
    {/*    dispatch<ChangeAction>({*/}
    {/*      type: 'storageObjectEditor/change',*/}
    {/*      payload: {*/}
    {/*        customOptionsData: [*/}
    {/*          ...storageObjectEditor.customOptionsData,*/}
    {/*          ...value,*/}
    {/*        ],*/}
    {/*        customOptionsEditorVisible: false,*/}
    {/*      },*/}
    {/*    });*/}
    {/*  }}*/}
    {/*/>*/}

    {/*<FCustomOptionEditorDrawer*/}
    {/*  visible={storageObjectEditor.customOptionIndex !== -1}*/}
    {/*  dataSource={{*/}
    {/*    key: storageObjectEditor.customOptionEditorData?.key || '',*/}
    {/*    value: (storageObjectEditor.customOptionEditorData?.custom === 'input' ? storageObjectEditor.customOptionEditorData?.defaultValue : storageObjectEditor.customOptionEditorData?.customOption) || '',*/}
    {/*    description: storageObjectEditor.customOptionEditorData?.description || '',*/}
    {/*    valueType: storageObjectEditor.customOptionEditorData?.custom || 'input',*/}
    {/*  }}*/}
    {/*  disabledKeys={[*/}
    {/*    ...storageObjectEditor.rawProperties.map<string>((rp) => rp.key),*/}
    {/*    ...storageObjectEditor.baseProperties.map<string>((pp) => pp.key),*/}
    {/*    ...storageObjectEditor.customOptionsData.filter((cod, ind) => {*/}
    {/*      return ind !== storageObjectEditor.customOptionIndex;*/}
    {/*    }).map((cod) => {*/}
    {/*      return cod.key;*/}
    {/*    }),*/}
    {/*  ]}*/}
    {/*  onCancel={() => {*/}
    {/*    onChange({*/}
    {/*      customOptionIndex: -1,*/}
    {/*      customOptionEditorData: null,*/}
    {/*    });*/}
    {/*  }}*/}
    {/*  onConfirm={(value) => {*/}
    {/*    onChange({*/}
    {/*      customOptionsData: storageObjectEditor.customOptionsData.map((cod, ind) => {*/}
    {/*        if (ind !== storageObjectEditor.customOptionIndex) {*/}
    {/*          return cod;*/}
    {/*        }*/}
    {/*        return {*/}
    {/*          key: value.key,*/}
    {/*          description: value.description,*/}
    {/*          custom: value.valueType,*/}
    {/*          defaultValue: value.value,*/}
    {/*          customOption: value.value,*/}
    {/*        };*/}
    {/*      }),*/}
    {/*      customOptionIndex: -1,*/}
    {/*      customOptionEditorData: null,*/}
    {/*    });*/}
    {/*  }}*/}
    {/*/>*/}
  </FDrawer>);
}

export default connect(({ storageObjectEditor }: ConnectState) => ({
  storageObjectEditor: storageObjectEditor,
}))(Details);
