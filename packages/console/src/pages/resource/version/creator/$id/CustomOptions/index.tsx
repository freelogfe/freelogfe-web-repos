import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import FBaseProperties from '@/components/FBaseProperties';
import { Space } from 'antd';
import {
  ChangeAction,
  // ImportLastVersionDataAction,
  ResourceVersionCreatorPageModelState,
} from '@/models/resourceVersionCreatorPage';
import FTooltip from '@/components/FTooltip';
import {
  ConnectState,
} from '@/models/connect';
// import FBasePropsEditorDrawer from '@/components/FBasePropsEditorDrawer';
// import FCustomOptionsEditorDrawer from '@/components/FCustomOptionsEditorDrawer';
import FCustomOptionsCards from '@/components/FCustomOptionsCards';
// import FBasePropEditorDrawer from '@/components/FBasePropEditorDrawer';
import FCustomOptionEditorDrawer from '@/components/FCustomOptionEditorDrawer';
import { FI18n } from '@freelog/tools-lib';
import FLoadingTip from '@/components/FLoadingTip';
import FComponentsLib from '@freelog/components-lib';
import fAddFileBaseProps from '@/components/fAddFileBaseProps';
import fEditFileBaseProp from '@/components/fEditFileBaseProp';
import fAddCustomOptions from '@/components/fAddCustomOptions';
import fEditCustomOptions from '@/components/fEditCustomOption';

interface CustomOptionsProps {
  dispatch: Dispatch;
  resourceVersionCreatorPage: ResourceVersionCreatorPageModelState;
}

function CustomOptions({ dispatch, resourceVersionCreatorPage }: CustomOptionsProps) {


  async function onChange(payload: ChangeAction['payload']) {
    await dispatch<ChangeAction>({
      type: 'resourceVersionCreatorPage/change',
      payload,
      caller: '2345324343452==0-=-=-4534%#$%#$%#$%#$#$',
    });
  }

  return (<>
    {
      !!resourceVersionCreatorPage.selectedFileInfo && (<>
        <div style={{ height: 5 }} />
        <FBaseProperties
          basics={resourceVersionCreatorPage.rawProperties}
          additions={resourceVersionCreatorPage.baseProperties}
          onChangeAdditions={(value) => {
            onChange({
              baseProperties: value,
              dataIsDirty: true,
            });
          }}
          rightTop={<Space size={20}>
            <FComponentsLib.FTextBtn
              style={{ fontSize: 12, fontWeight: 600 }}
              type='primary'
              onClick={async () => {
                const dataSource = await fAddFileBaseProps({
                  disabledKeys: [
                    ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
                    ...resourceVersionCreatorPage.baseProperties.map<string>((bp) => bp.key),
                    ...resourceVersionCreatorPage.customOptionsData.map<string>((pp) => pp.key),
                  ],
                });
                // console.log(dataSource, 'dataSource9iojskldjflksdjflk');
                if (!dataSource) {
                  return;
                }
                onChange({
                  dataIsDirty: true,
                  baseProperties: [
                    ...resourceVersionCreatorPage.baseProperties,
                    ...dataSource.map<ResourceVersionCreatorPageModelState['baseProperties'][number]>((ds) => {
                      return {
                        key: ds.key,
                        value: ds.value,
                        description: ds.description,
                      };
                    }),
                  ],
                });
              }}
            >补充属性</FComponentsLib.FTextBtn>
            {
              resourceVersionCreatorPage.preVersionBaseProperties.length > 0
                ? (<FComponentsLib.FTextBtn
                  style={{ fontSize: 12, fontWeight: 600 }}
                  type='primary'
                  onClick={async () => {
                    const dataSource = await fAddFileBaseProps({
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
                    });
                    if (!dataSource) {
                      return;
                    }
                    onChange({
                      dataIsDirty: true,
                      baseProperties: [
                        ...resourceVersionCreatorPage.baseProperties,
                        ...dataSource.map<ResourceVersionCreatorPageModelState['baseProperties'][number]>((ds) => {
                          return {
                            key: ds.key,
                            value: ds.value,
                            description: ds.description,
                          };
                        }),
                      ],
                    });
                  }}
                >从上个版本导入</FComponentsLib.FTextBtn>)
                : undefined
            }
          </Space>}
          onClickEdit={async (theKey) => {
            const ind = resourceVersionCreatorPage.baseProperties.findIndex((bp) => {
              return bp.key === theKey;
            });
            const cur = resourceVersionCreatorPage.baseProperties.find((bp) => {
              return bp.key === theKey;
            });
            if (!cur) {
              return;
            }

            const data = await fEditFileBaseProp({
              disabledKeys: [
                ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => {
                  return rp.key;
                }),
                ...resourceVersionCreatorPage.baseProperties.map((bp) => {
                  return bp.key;
                }),
                ...resourceVersionCreatorPage.customOptionsData.map<string>((pp) => {
                  return pp.key;
                }),
              ],
              defaultData: {
                key: cur.key,
                value: cur.value,
                description: cur.description,
              },
            });

            if (!data) {
              return;
            }

            onChange({
              baseProperties: resourceVersionCreatorPage.baseProperties.map((bp, i) => {
                if (i !== ind) {
                  return bp;
                }
                return {
                  key: data.key,
                  value: data.value,
                  description: data.description,
                };
              }),
            });
          }}
        />
        {
          resourceVersionCreatorPage.rawPropertiesState !== 'success' && (<div style={{ backgroundColor: '#F7F8F9' }}>
            <FLoadingTip height={100} />
          </div>)
        }


        <div style={{ height: 20 }} />

        <Space size={5}>
          <FComponentsLib.FTextBtn
            style={{ fontSize: 12, fontWeight: 600 }}
            type='default'
            onClick={() => {
              onChange({
                customOptionsDataVisible: !resourceVersionCreatorPage.customOptionsDataVisible,
              });
            }}
          >
            <span>自定义选项（高级）</span>
            {resourceVersionCreatorPage.customOptionsDataVisible ? (<FComponentsLib.FIcons.FUp />) : (
              <FComponentsLib.FIcons.FDown />)}
          </FComponentsLib.FTextBtn>
          <FTooltip title={FI18n.i18nNext.t('info_versionoptions')}>
            <div><FComponentsLib.FIcons.FInfo /></div>
          </FTooltip>
        </Space>

        {
          resourceVersionCreatorPage.customOptionsDataVisible && (<>

            <div style={{ height: 20 }} />

            <Space size={40}>
              <FComponentsLib.FTextBtn
                style={{ fontSize: 12, fontWeight: 600 }}
                onClick={async () => {
                  const data = await fAddCustomOptions({
                    disabledKeys: [
                      ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
                      ...resourceVersionCreatorPage.baseProperties.map<string>((pp) => pp.key),
                      ...resourceVersionCreatorPage.customOptionsData.map<string>((cod) => cod.key),
                    ],
                  });
                  // console.log(data, 'data90iowsejflskdfjlsdk');
                  if (!data) {
                    return;
                  }
                  onChange({
                    customOptionsData: [
                      ...resourceVersionCreatorPage.customOptionsData,
                      ...data,
                    ],
                    // customOptionsEditorVisible: false,
                  });
                }}
              >添加选项</FComponentsLib.FTextBtn>
              {
                resourceVersionCreatorPage.preVersionOptionProperties.length > 0 && (<FComponentsLib.FTextBtn
                  style={{ fontSize: 12, fontWeight: 600 }}
                  onClick={async () => {
                    const data = await fAddCustomOptions({
                      disabledKeys: [
                        ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
                        ...resourceVersionCreatorPage.baseProperties.map<string>((pp) => pp.key),
                        ...resourceVersionCreatorPage.customOptionsData.map<string>((cod) => cod.key),
                      ],
                      defaultData: resourceVersionCreatorPage.preVersionOptionProperties,
                    });
                    // console.log(data, 'data09weeisojfsdlkfjsldkjflk');
                    if (!data) {
                      return;
                    }
                    onChange({
                      customOptionsData: [
                        ...resourceVersionCreatorPage.customOptionsData,
                        ...data,
                      ],
                    });
                  }}>从上个版本导入</FComponentsLib.FTextBtn>)
              }

            </Space>

            <div style={{ height: 20 }} />

            {
              resourceVersionCreatorPage.customOptionsData.length > 0
                ? (<FCustomOptionsCards
                  dataSource={resourceVersionCreatorPage.customOptionsData.map((cod) => {
                    return {
                      theKey: cod.key,
                      description: cod.description,
                      type: cod.custom,
                      value: cod.custom === 'select' ? cod.customOption : cod.defaultValue,
                    };
                  })}
                  onDelete={(theKey) => {
                    onChange({
                      customOptionsData: resourceVersionCreatorPage.customOptionsData.filter((cod) => {
                        return cod.key !== theKey;
                      }),
                    });
                  }}
                  onEdit={async (theKey) => {
                    const ind: number = resourceVersionCreatorPage.customOptionsData.findIndex((cod) => {
                      return cod.key === theKey;
                    });
                    const cur = resourceVersionCreatorPage.customOptionsData[ind];

                    if (!cur) {
                      return;
                    }

                    const data = await fEditCustomOptions({
                      defaultData: cur,
                      disabledKeys: [
                        ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => {
                          return rp.key;
                        }),
                        ...resourceVersionCreatorPage.baseProperties.map<string>((pp) => {
                          return pp.key;
                        }),
                        ...resourceVersionCreatorPage.customOptionsData.map((cod) => {
                          return cod.key;
                        }),
                      ],
                    });

                    // console.log(data, 'data09ewiodjfls;kdfjlsdkfjlsdk');
                    if (!data) {
                      return;
                    }

                    onChange({
                      customOptionsData: resourceVersionCreatorPage.customOptionsData.map((cod, i) => {
                        if (ind !== i) {
                          return cod;
                        }
                        return {
                          key: data.key,
                          description: data.description,
                          custom: data.custom,
                          defaultValue: data.defaultValue,
                          customOption: data.customOption,
                        };
                      }),
                    });
                  }}
                />)
                : (<FComponentsLib.FContentText text={'暂无自定义选项…'} type='negative' />)
            }

          </>)
        }

      </>)
    }

  </>);
}

export default connect(({ resourceVersionCreatorPage }: ConnectState) => ({
  resourceVersionCreatorPage,
}))(CustomOptions);
