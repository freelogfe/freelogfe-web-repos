import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { Space } from 'antd';
import {
  OnChange_BaseProperties_Action,
  OnChange_CustomOptions_Action,
  ResourceVersionCreatorPageModelState,
} from '@/models/resourceVersionCreatorPage';
import {
  ConnectState,
} from '@/models/connect';
import FComponentsLib from '@freelog/components-lib';
import fAddFileBaseProps from '@/components/fAddFileBaseProps';
import fAddCustomOptions from '@/components/fAddCustomOptions';
import FSkeletonNode from '@/components/FSkeletonNode';
import FResourceProperties from '@/components/FResourceProperties';
import fResourcePropertyEditor from '@/components/fResourcePropertyEditor';
import FResourceOptions from '@/components/FResourceOptions';
import fResourceOptionEditor from '@/components/fResourceOptionEditor';

interface CustomOptionsProps {
  dispatch: Dispatch;
  resourceVersionCreatorPage: ResourceVersionCreatorPageModelState;
}

function CustomOptions({ dispatch, resourceVersionCreatorPage }: CustomOptionsProps) {

  // const [customOptionsDataVisible, set_customOptionsDataVisible] = React.useState<boolean>(false);

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
        ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
        ...resourceVersionCreatorPage.baseProperties.map<string>((bp) => bp.key),
        ...resourceVersionCreatorPage.customOptionsData.map<string>((pp) => pp.key),
      ],
      disabledNames: [
        ...resourceVersionCreatorPage.baseProperties.map<string>((bp) => bp.name),
        ...resourceVersionCreatorPage.customOptionsData.map<string>((pp) => pp.name),
      ],
    });

    if (!dataSource) {
      return;
    }

    await dispatch<OnChange_CustomOptions_Action>({
      type: 'resourceVersionCreatorPage/onChange_CustomOptions',
      payload: {
        value: [
          ...resourceVersionCreatorPage.customOptionsData,
          dataSource,
        ],
      },
    });
  }

  async function onClick_importPreVersionOptionBtn() {
    const data: {
      key: string;
      name: string;
      description: string;
      type: 'input' | 'select';
      input: string;
      select: string[];
    }[] | null = await fAddCustomOptions({
      disabledKeys: [
        ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
        ...resourceVersionCreatorPage.baseProperties.map<string>((pp) => pp.key),
        ...resourceVersionCreatorPage.customOptionsData.map<string>((cod) => cod.key),
      ],
      disabledNames: [
        ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.name),
        ...resourceVersionCreatorPage.baseProperties.map<string>((pp) => pp.name),
        ...resourceVersionCreatorPage.customOptionsData.map<string>((cod) => cod.name),
      ],
      defaultData: resourceVersionCreatorPage.preVersionOptionProperties,
    });
    // console.log(data, 'data09weeisojfsdlkfjsldkjflk');
    if (!data) {
      return;
    }

    await dispatch<OnChange_CustomOptions_Action>({
      type: 'resourceVersionCreatorPage/onChange_CustomOptions',
      payload: {
        value: [
          ...resourceVersionCreatorPage.customOptionsData,
          ...data,
        ],
      },
    });
  }

  if (resourceVersionCreatorPage.rawPropertiesState === 'parsing') {
    return (<>
      <div style={{ height: 20 }} />
      <FSkeletonNode width={860} height={38} />
      <div style={{ height: 20 }} />
      <FSkeletonNode width={340} height={38} />
    </>);
  }

  return (<>

    {
      !!resourceVersionCreatorPage.selectedFileInfo && (<>
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
                        ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
                        ...resourceVersionCreatorPage.baseProperties.map<string>((bp) => bp.key),
                        ...resourceVersionCreatorPage.customOptionsData.map<string>((pp) => pp.key),
                      ],
                      disabledNames: [
                        ...resourceVersionCreatorPage.baseProperties.map<string>((bp) => bp.name),
                        ...resourceVersionCreatorPage.customOptionsData.map<string>((pp) => pp.name),
                      ],
                    });
                    // console.log(dataSource, 'dataSource9iojskldjflksdjflk');
                    if (!dataSource) {
                      return;
                    }

                    await dispatch<OnChange_BaseProperties_Action>({
                      type: 'resourceVersionCreatorPage/onChange_BaseProperties',
                      payload: {
                        value: [
                          ...resourceVersionCreatorPage.baseProperties,
                          dataSource,
                        ],
                      },
                    });
                  }}
                >补充属性</FComponentsLib.FTextBtn>
                {
                  resourceVersionCreatorPage.preVersionBaseProperties.length > 0 &&
                  (<FComponentsLib.FTextBtn
                    style={{ fontSize: 12, fontWeight: 600 }}
                    type='primary'
                    onClick={async () => {
                      const dataSource: {
                        key: string;
                        name: string;
                        value: string;
                        description: string;
                      }[] | null = await fAddFileBaseProps({
                        defaultData: resourceVersionCreatorPage.preVersionBaseProperties,
                        disabledKeys: [
                          ...resourceVersionCreatorPage.rawProperties.map((rp) => {
                            return rp.key;
                          }),
                          ...resourceVersionCreatorPage.baseProperties.map((pp) => {
                            return pp.key;
                          }),
                          ...resourceVersionCreatorPage.customOptionsData.map((pp) => {
                            return pp.key;
                          }),
                        ],
                        disabledNames: [
                          ...resourceVersionCreatorPage.rawProperties.map((rp) => {
                            return rp.name;
                          }),
                          ...resourceVersionCreatorPage.baseProperties.map((pp) => {
                            return pp.name;
                          }),
                          ...resourceVersionCreatorPage.customOptionsData.map((pp) => {
                            return pp.name;
                          }),
                        ],
                      });
                      if (!dataSource) {
                        return;
                      }

                      await dispatch<OnChange_BaseProperties_Action>({
                        type: 'resourceVersionCreatorPage/onChange_BaseProperties',
                        payload: {
                          value: [
                            ...resourceVersionCreatorPage.baseProperties,
                            ...dataSource.map<ResourceVersionCreatorPageModelState['baseProperties'][number]>((ds) => {
                              return {
                                key: ds.key,
                                name: ds.name,
                                value: ds.value,
                                description: ds.description,
                              };
                            }),
                          ],
                        },
                      });
                    }}
                  >从上个版本导入</FComponentsLib.FTextBtn>)
                }
              </Space>
            </div>
          </div>

          <div style={{ height: 20 }} />
          {/*<div style={{ height: 10 }} />*/}

          <FResourceProperties
            immutableData={resourceVersionCreatorPage.rawProperties}
            alterableData={resourceVersionCreatorPage.baseProperties}
            onEdit_alterableData={async (value) => {
              const index: number = resourceVersionCreatorPage.baseProperties.findIndex((p) => {
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
                  ...resourceVersionCreatorPage.baseProperties.map<string>((bp) => bp.key),
                  ...resourceVersionCreatorPage.customOptionsData.map<string>((pp) => pp.key),
                ],
                disabledNames: [
                  ...resourceVersionCreatorPage.baseProperties.map<string>((bp) => bp.name),
                  ...resourceVersionCreatorPage.customOptionsData.map<string>((pp) => pp.name),
                ],
                defaultData: value,
              });
              if (!dataSource) {
                return;
              }

              await dispatch<OnChange_BaseProperties_Action>({
                type: 'resourceVersionCreatorPage/onChange_BaseProperties',
                payload: {
                  value: resourceVersionCreatorPage.baseProperties.map((v, i) => {
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
              await dispatch<OnChange_BaseProperties_Action>({
                type: 'resourceVersionCreatorPage/onChange_BaseProperties',
                payload: {
                  value: resourceVersionCreatorPage.baseProperties.filter((v, i) => {
                    return v.key !== value.key && v.name !== value.name;
                  }),
                },
              });
            }}
          />
          <div style={{ height: 15 }} />
        </div>
        {/*{*/}
        {/*  resourceVersionCreatorPage.rawPropertiesState !== 'success' && (<div style={{ backgroundColor: '#F7F8F9' }}>*/}
        {/*    <FLoadingTip height={100} />*/}
        {/*  </div>)*/}
        {/*}*/}

        <div style={{ height: 5 }} />

        {
          resourceVersionCreatorPage.customOptionsData.length === 0
            ? (<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 20 }}>
              <FComponentsLib.FTextBtn
                type={'default'}
                style={{ fontSize: 12 }}
                onClick={() => {
                  onClick_addOptionBtn();
                }}
              >添加可选配置</FComponentsLib.FTextBtn>
              {
                resourceVersionCreatorPage.preVersionOptionProperties.length > 0 && (<FComponentsLib.FTextBtn
                  type={'default'}
                  style={{ fontSize: 12 }}
                  onClick={() => {
                    onClick_importPreVersionOptionBtn();
                  }}
                >从上个版本导入</FComponentsLib.FTextBtn>)
              }

            </div>)
            : (<div className={styles.options}>
              <div style={{ height: 20 }} />
              <div className={styles.optionsHeader}>
                <FComponentsLib.FContentText text={'可选配置'} type={'highlight'} style={{ fontSize: 12 }} />

                <div>
                  <Space size={20}>
                    <FComponentsLib.FTextBtn
                      style={{ fontSize: 12, fontWeight: 600 }}
                      type='primary'
                      onClick={async () => {
                        onClick_addOptionBtn();
                      }}
                    >添加配置</FComponentsLib.FTextBtn>

                    {
                      resourceVersionCreatorPage.preVersionOptionProperties.length > 0 && (<FComponentsLib.FTextBtn
                        type='primary'
                        style={{ fontSize: 12, fontWeight: 600 }}
                        onClick={async () => {
                          onClick_importPreVersionOptionBtn();

                        }}>从上个版本导入</FComponentsLib.FTextBtn>)
                    }
                  </Space>
                </div>
              </div>
              <div style={{ height: 20 }} />

              <FResourceOptions
                // dataSource={resourceVersionCreatorPage.customOptionsData}
                dataSource={resourceVersionCreatorPage.customOptionsData}
                onEdit={async (value) => {
                  const index: number = resourceVersionCreatorPage.customOptionsData.findIndex((p) => {
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
                      ...resourceVersionCreatorPage.baseProperties.map<string>((bp) => bp.key),
                      ...resourceVersionCreatorPage.customOptionsData.map<string>((pp) => pp.key),
                    ],
                    disabledNames: [
                      ...resourceVersionCreatorPage.baseProperties.map<string>((bp) => bp.name),
                      ...resourceVersionCreatorPage.customOptionsData.map<string>((pp) => pp.name),
                    ],
                    defaultData: value,
                  });

                  if (!dataSource) {
                    return;
                  }

                  await dispatch<OnChange_CustomOptions_Action>({
                    type: 'resourceVersionCreatorPage/onChange_CustomOptions',
                    payload: {
                      value: resourceVersionCreatorPage.customOptionsData.map((a, b) => {
                        if (b !== index) {
                          return a;
                        }
                        return dataSource;
                      }),
                    },
                  });
                }}
                onDelete={async (value) => {
                  await dispatch<OnChange_CustomOptions_Action>({
                    type: 'resourceVersionCreatorPage/onChange_CustomOptions',
                    payload: {
                      value: resourceVersionCreatorPage.customOptionsData.filter((a) => {
                        return a.key !== value.key && a.name !== value.name;
                      }),
                    },
                  });
                }}
              />

            </div>)
        }

      </>)
    }

  </>);
}

export default connect(({ resourceVersionCreatorPage }: ConnectState) => ({
  resourceVersionCreatorPage,
}))(CustomOptions);
