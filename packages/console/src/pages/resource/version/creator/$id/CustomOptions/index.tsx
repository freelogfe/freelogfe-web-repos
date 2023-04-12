import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Dispatch } from 'redux';
// import FBaseProperties from '@/components/FBaseProperties';
import { Space } from 'antd';
import {
  OnChange_BaseProperties_Action,
  OnChange_CustomOptions_Action,
  ResourceVersionCreatorPageModelState,
} from '@/models/resourceVersionCreatorPage';
import FTooltip from '@/components/FTooltip';
import {
  ConnectState,
} from '@/models/connect';
import FCustomOptionsCards from '@/components/FCustomOptionsCards';
import { FI18n } from '@freelog/tools-lib';
// import FLoadingTip from '@/components/FLoadingTip';
import FComponentsLib from '@freelog/components-lib';
import fAddFileBaseProps from '@/components/fAddFileBaseProps';
// import fEditFileBaseProp from '@/components/fEditFileBaseProp';
import fAddCustomOptions from '@/components/fAddCustomOptions';
import fEditCustomOptions from '@/components/fEditCustomOption';
import FSkeletonNode from '@/components/FSkeletonNode';
import FResourceProperties from '@/components/FResourceProperties';
import fResourcePropertyEditor from '@/components/fResourcePropertyEditor';
import FResourceOptions from '@/components/FResourceOptions';
import fResourceOptionEditor from '@/components/fResourceOptionEditor';

// import FBasePropertiesCards from '@/components/FBasePropertiesCards';

interface CustomOptionsProps {
  dispatch: Dispatch;
  resourceVersionCreatorPage: ResourceVersionCreatorPageModelState;
}

function CustomOptions({ dispatch, resourceVersionCreatorPage }: CustomOptionsProps) {

  const [customOptionsDataVisible, set_customOptionsDataVisible] = React.useState<boolean>(false);

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

        <div className={styles.options}>
          <div style={{ height: 20 }} />
          <div className={styles.optionsHeader}>
            <FComponentsLib.FContentText text={'可选配置'} type={'highlight'} style={{ fontSize: 12 }} />

            <div>
              <Space size={20}>
                <FComponentsLib.FTextBtn
                  style={{ fontSize: 12, fontWeight: 600 }}
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
                  }}
                >添加配置</FComponentsLib.FTextBtn>

                {
                  resourceVersionCreatorPage.preVersionOptionProperties.length > 0 && (<FComponentsLib.FTextBtn
                    type='primary'
                    style={{ fontSize: 12, fontWeight: 600 }}
                    onClick={async () => {
                      const data = await fAddCustomOptions({
                        disabledKeys: [
                          ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
                          ...resourceVersionCreatorPage.baseProperties.map<string>((pp) => pp.key),
                          ...resourceVersionCreatorPage.customOptionsData.map<string>((cod) => cod.key),
                        ],
                        // defaultData: resourceVersionCreatorPage.preVersionOptionProperties,
                      });
                      // console.log(data, 'data09weeisojfsdlkfjsldkjflk');
                      if (!data) {
                        return;
                      }


                    }}>从上个版本导入</FComponentsLib.FTextBtn>)
                }
              </Space>
            </div>
          </div>
          <div style={{ height: 20 }} />

          <FResourceOptions
            // dataSource={resourceVersionCreatorPage.customOptionsData}
            dataSource={resourceVersionCreatorPage.customOptionsData}
          />

        </div>

        {/*<Space size={5}>*/}
        {/*  <FComponentsLib.FTextBtn*/}
        {/*    style={{ fontSize: 12, fontWeight: 600 }}*/}
        {/*    type='default'*/}
        {/*    onClick={async () => {*/}
        {/*      set_customOptionsDataVisible(!customOptionsDataVisible);*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    <div style={{ display: 'flex', alignItems: 'center' }}>*/}
        {/*      <div style={{ translate: '0 -1px' }}>自定义选项（高级）</div>*/}
        {/*      <FTooltip title={FI18n.i18nNext.t('info_versionoptions')}>*/}
        {/*        <div><FComponentsLib.FIcons.FInfo style={{ fontSize: 14, fontWeight: 400 }} /></div>*/}
        {/*      </FTooltip>*/}
        {/*      <div style={{ width: 5 }} />*/}
        {/*      {*/}
        {/*        customOptionsDataVisible*/}
        {/*          ? (<FComponentsLib.FIcons.FUp style={{ fontSize: 12 }} />)*/}
        {/*          : (<FComponentsLib.FIcons.FDown style={{ fontSize: 12 }} />)*/}
        {/*      }*/}
        {/*    </div>*/}
        {/*  </FComponentsLib.FTextBtn>*/}

        {/*</Space>*/}

        {
          // customOptionsDataVisible && (<>
          //
          //   <div style={{ height: 20 }} />
          //
          //   <Space size={40}>
          //     <FComponentsLib.FTextBtn
          //       style={{ fontSize: 12, fontWeight: 600 }}
          //       onClick={async () => {
          //         const data = await fAddCustomOptions({
          //           disabledKeys: [
          //             ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
          //             ...resourceVersionCreatorPage.baseProperties.map<string>((pp) => pp.key),
          //             ...resourceVersionCreatorPage.customOptionsData.map<string>((cod) => cod.key),
          //           ],
          //         });
          //         // console.log(data, 'data90iowsejflskdfjlsdk');
          //         if (!data) {
          //           return;
          //         }
          //
          //         await dispatch<OnChange_CustomOptions_Action>({
          //           type: 'resourceVersionCreatorPage/onChange_CustomOptions',
          //           payload: {
          //             value: [
          //               ...resourceVersionCreatorPage.customOptionsData,
          //               ...data,
          //             ],
          //           },
          //         });
          //       }}
          //     >添加选项</FComponentsLib.FTextBtn>
          //     {
          //       resourceVersionCreatorPage.preVersionOptionProperties.length > 0 && (<FComponentsLib.FTextBtn
          //         style={{ fontSize: 12, fontWeight: 600 }}
          //         onClick={async () => {
          //           const data = await fAddCustomOptions({
          //             disabledKeys: [
          //               ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
          //               ...resourceVersionCreatorPage.baseProperties.map<string>((pp) => pp.key),
          //               ...resourceVersionCreatorPage.customOptionsData.map<string>((cod) => cod.key),
          //             ],
          //             defaultData: resourceVersionCreatorPage.preVersionOptionProperties,
          //           });
          //           // console.log(data, 'data09weeisojfsdlkfjsldkjflk');
          //           if (!data) {
          //             return;
          //           }
          //
          //           await dispatch<OnChange_CustomOptions_Action>({
          //             type: 'resourceVersionCreatorPage/onChange_CustomOptions',
          //             payload: {
          //               value: [
          //                 ...resourceVersionCreatorPage.customOptionsData,
          //                 ...data,
          //               ],
          //             },
          //           });
          //         }}>从上个版本导入</FComponentsLib.FTextBtn>)
          //     }
          //
          //   </Space>
          //
          //   <div style={{ height: 20 }} />
          //
          //   {
          //     resourceVersionCreatorPage.customOptionsData.length > 0
          //       ? (<FCustomOptionsCards
          //         dataSource={resourceVersionCreatorPage.customOptionsData.map((cod) => {
          //           return {
          //             theKey: cod.key,
          //             description: cod.description,
          //             type: cod.custom,
          //             value: cod.custom === 'select' ? cod.customOption : cod.defaultValue,
          //           };
          //         })}
          //         onDelete={async (theKey) => {
          //           await dispatch<OnChange_CustomOptions_Action>({
          //             type: 'resourceVersionCreatorPage/onChange_CustomOptions',
          //             payload: {
          //               value: resourceVersionCreatorPage.customOptionsData.filter((cod) => {
          //                 return cod.key !== theKey;
          //               }),
          //             },
          //           } as const);
          //         }}
          //         onEdit={async (theKey) => {
          //           const ind: number = resourceVersionCreatorPage.customOptionsData.findIndex((cod) => {
          //             return cod.key === theKey;
          //           });
          //           const cur = resourceVersionCreatorPage.customOptionsData[ind];
          //
          //           if (!cur) {
          //             return;
          //           }
          //
          //           const data = await fEditCustomOptions({
          //             defaultData: cur,
          //             disabledKeys: [
          //               ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => {
          //                 return rp.key;
          //               }),
          //               ...resourceVersionCreatorPage.baseProperties.map<string>((pp) => {
          //                 return pp.key;
          //               }),
          //               ...resourceVersionCreatorPage.customOptionsData.map((cod) => {
          //                 return cod.key;
          //               }),
          //             ],
          //           });
          //
          //           if (!data) {
          //             return;
          //           }
          //
          //           // await dispatch<OnChange_CustomOptions_Action>({
          //           //   type: 'resourceVersionCreatorPage/onChange_CustomOptions',
          //           //   payload: {
          //           //     value: resourceVersionCreatorPage.customOptionsData.map((cod, i) => {
          //           //       if (ind !== i) {
          //           //         return cod;
          //           //       }
          //           //       return {
          //           //         key: data.key,
          //           //         description: data.description,
          //           //         custom: data.custom,
          //           //         defaultValue: data.defaultValue,
          //           //         customOption: data.customOption,
          //           //       };
          //           //     }),
          //           //   },
          //           // } as const);
          //         }}
          //       />)
          //       : (<FComponentsLib.FContentText text={'暂无自定义选项…'} type='negative' />)
          //   }
          //
          // </>)
        }

      </>)
    }

  </>);
}

export default connect(({ resourceVersionCreatorPage }: ConnectState) => ({
  resourceVersionCreatorPage,
}))(CustomOptions);
