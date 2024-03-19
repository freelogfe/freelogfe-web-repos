import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import SelectDeps from '@/pages/storage/Content/SelectDeps';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import {
  ConnectState,
  StorageObjectEditorModelState,
} from '@/models/connect';
import {
  ChangeAction,
  OnChangeTypeAction, OnClick_SaveBtn_Action,
} from '@/models/storageObjectEditor';
import DepsCards from './DepsCards';
import FFormLayout from '@/components/FFormLayout';
import FDrawer from '@/components/FDrawer';
import { history } from 'umi';
import FTooltip from '@/components/FTooltip';
import { FUtil, FServiceAPI, FI18n } from '@freelog/tools-lib';
import FResourceTypeInput from '@/components/FResourceTypeInput';
import FComponentsLib from '@freelog/components-lib';
import FResourceProperties from '@/components/FResourceProperties';
import fResourcePropertyEditor from '@/components/fResourcePropertyEditor';
import FResourceOptions from '@/components/FResourceOptions';
import fResourceOptionEditor from '@/components/fResourceOptionEditor';
import {
  OnChange_AdditionalProperties_Action,
  OnChange_CustomProperties_Action,
} from '@/models/resourceVersionCreatorPage';

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
        ...storageObjectEditor.additionalProperties.map<string>((bp) => bp.key),
        ...storageObjectEditor.customProperties.map<string>((pp) => pp.key),
        ...storageObjectEditor.customConfigurations.map<string>((pp) => pp.key),
      ],
      disabledNames: [
        ...storageObjectEditor.rawProperties.map<string>((rp) => rp.name),
        ...storageObjectEditor.additionalProperties.map<string>((bp) => bp.name),
        ...storageObjectEditor.customProperties.map<string>((pp) => pp.name),
        ...storageObjectEditor.customConfigurations.map<string>((pp) => pp.name),
      ],
    });

    if (!dataSource) {
      return;
    }

    await onChange({
      customConfigurations: [
        ...storageObjectEditor.customConfigurations,
        dataSource,
      ],
    });
  }

  return (<FDrawer
    destroyOnClose={true}
    title={'编辑对象信息'}
    open={storageObjectEditor.objectId !== ''}
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
    getContainer={() => {
      return self.document.body;
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
              <FComponentsLib.FContentText
                text={'基础属性'}
                type={'highlight'}
                style={{ fontSize: 12 }}
              />
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
                          ...storageObjectEditor.additionalProperties.map<string>((bp) => bp.key),
                          ...storageObjectEditor.customProperties.map<string>((pp) => pp.key),
                          ...storageObjectEditor.customConfigurations.map<string>((pp) => pp.key),
                        ],
                        disabledNames: [
                          ...storageObjectEditor.rawProperties.map<string>((rp) => rp.name),
                          ...storageObjectEditor.additionalProperties.map<string>((bp) => bp.name),
                          ...storageObjectEditor.customProperties.map<string>((pp) => pp.name),
                          ...storageObjectEditor.customConfigurations.map<string>((pp) => pp.name),
                        ],
                      });
                      // console.log(dataSource, 'dataSource9iojskldjflksdjflk');
                      if (!dataSource) {
                        return;
                      }

                      onChange({
                        customProperties: [
                          ...storageObjectEditor.customProperties,
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
              onlyEditValueData={storageObjectEditor.additionalProperties}
              alterableData={storageObjectEditor.customProperties}
              onEdit_onlyEditValueData={async (value) => {
                const index: number = storageObjectEditor.additionalProperties.findIndex((p) => {
                  return p === value;
                });
                const dataSource: {
                  key: string;
                  name: string;
                  value: string;
                  description: string;
                } | null = await fResourcePropertyEditor({
                  disabledKeys: [
                    ...storageObjectEditor.rawProperties.map<string>((rp) => rp.key),
                    ...storageObjectEditor.additionalProperties.map<string>((rp) => rp.key),
                    ...storageObjectEditor.customProperties.map<string>((bp) => bp.key),
                    ...storageObjectEditor.customConfigurations.map<string>((pp) => pp.key),
                  ],
                  disabledNames: [
                    ...storageObjectEditor.rawProperties.map<string>((bp) => bp.name),
                    ...storageObjectEditor.additionalProperties.map<string>((bp) => bp.name),
                    ...storageObjectEditor.customProperties.map<string>((bp) => bp.name),
                    ...storageObjectEditor.customConfigurations.map<string>((pp) => pp.name),
                  ],
                  defaultData: value,
                  noneEditableFields: ['key', 'description', 'name'],
                  valueAcceptNull: true,
                });
                if (!dataSource) {
                  return;
                }

                // await dispatch<OnChange_AdditionalProperties_Action>({
                //   type: 'resourceVersionCreatorPage/onChange_AdditionalProperties',
                //   payload: {
                //     value: storageObjectEditor.additionalProperties.map((v, i) => {
                //       if (i !== index) {
                //         return v;
                //       }
                //       return dataSource;
                //     }),
                //   },
                // });

                await onChange({
                  additionalProperties: storageObjectEditor.additionalProperties.map((v, i) => {
                    if (i !== index) {
                      return v;
                    }
                    return dataSource;
                  }),
                });
              }}
              onEdit_alterableData={async (value) => {
                const index: number = storageObjectEditor.customProperties.findIndex((p) => {
                  return p === value;
                });
                const dataSource: {
                  key: string;
                  name: string;
                  value: string;
                  description: string;
                } | null = await fResourcePropertyEditor({
                  disabledKeys: [
                    ...storageObjectEditor.rawProperties.map<string>((rp) => rp.key),
                    ...storageObjectEditor.additionalProperties.map<string>((rp) => rp.key),
                    ...storageObjectEditor.customProperties.map<string>((bp) => bp.key),
                    ...storageObjectEditor.customConfigurations.map<string>((pp) => pp.key),
                  ],
                  disabledNames: [
                    ...storageObjectEditor.rawProperties.map<string>((bp) => bp.name),
                    ...storageObjectEditor.additionalProperties.map<string>((bp) => bp.name),
                    ...storageObjectEditor.customProperties.map<string>((bp) => bp.name),
                    ...storageObjectEditor.customConfigurations.map<string>((pp) => pp.name),
                  ],
                  defaultData: value,
                });
                if (!dataSource) {
                  return;
                }

                // await dispatch<OnChange_CustomProperties_Action>({
                //   type: 'resourceVersionCreatorPage/onChange_CustomProperties',
                //   payload: {
                //     value: storageObjectEditor.customProperties.map((v, i) => {
                //       if (i !== index) {
                //         return v;
                //       }
                //       return dataSource;
                //     }),
                //   },
                // });
                await onChange({
                  customProperties: storageObjectEditor.customProperties.map((v, i) => {
                    if (i !== index) {
                      return v;
                    }
                    return dataSource;
                  }),
                });
              }}
              onDelete_alterableData={async (value) => {
                // console.log(value, 'AAAAAAsdofijsdflksdjfldsjlkj');
                // await dispatch<OnChange_CustomProperties_Action>({
                //   type: 'resourceVersionCreatorPage/onChange_CustomProperties',
                //   payload: {
                //     value: resourceVersionCreatorPage.customProperties.filter((v, i) => {
                //       return v.key !== value.key && v.name !== value.name;
                //     }),
                //   },
                // });
                await onChange({
                  customProperties: storageObjectEditor.customProperties.filter((v) => {
                    return v.key !== value.key && v.name !== value.name;
                  }),
                });
              }}
            />
            <div style={{ height: 15 }} />
          </div>

          <div style={{ height: 5 }} />

          {
            storageObjectEditor.customConfigurations.length === 0
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
                  dataSource={storageObjectEditor.customConfigurations}
                  onEdit={async (value) => {
                    const index: number = storageObjectEditor.customConfigurations.findIndex((p) => {
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
                        ...storageObjectEditor.additionalProperties.map<string>((bp) => bp.key),
                        ...storageObjectEditor.customProperties.map<string>((pp) => pp.key),
                        ...storageObjectEditor.customConfigurations.map<string>((pp) => pp.key),
                      ],
                      disabledNames: [
                        ...storageObjectEditor.rawProperties.map<string>((rp) => rp.name),
                        ...storageObjectEditor.additionalProperties.map<string>((bp) => bp.name),
                        ...storageObjectEditor.customProperties.map<string>((pp) => pp.name),
                        ...storageObjectEditor.customConfigurations.map<string>((pp) => pp.name),
                      ],
                      defaultData: value,
                    });

                    if (!dataSource) {
                      return;
                    }

                    await onChange({
                      customConfigurations: storageObjectEditor.customConfigurations.map((a, b) => {
                        if (b !== index) {
                          return a;
                        }
                        return dataSource;
                      }),
                    });
                  }}
                  onDelete={async (value) => {
                    await onChange({
                      customConfigurations: storageObjectEditor.customConfigurations.filter((a) => {
                        return a.key !== value.key && a.name !== value.name;
                      }),
                    });
                  }}
                />
              </div>)
          }

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
  </FDrawer>);
}

export default connect(({ storageObjectEditor }: ConnectState) => ({
  storageObjectEditor: storageObjectEditor,
}))(Details);
