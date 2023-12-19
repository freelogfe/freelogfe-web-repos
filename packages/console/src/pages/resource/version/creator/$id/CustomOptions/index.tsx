// import * as React from 'react';
// import styles from './index.less';
// import { connect } from 'dva';
// import { Dispatch } from 'redux';
// import { Space } from 'antd';
// import {
//   OnChange_CustomProperties_Action,
//   OnChange_CustomConfigurations_Action,
//   ResourceVersionCreatorPageModelState, OnChange_AdditionalProperties_Action,
// } from '@/models/resourceVersionCreatorPage';
// import {
//   ConnectState,
// } from '@/models/connect';
// import FComponentsLib from '@freelog/components-lib';
// import fAddFileBaseProps from '@/components/fAddFileBaseProps';
// import fAddCustomOptions from '@/components/fAddCustomOptions';
// import FSkeletonNode from '@/components/FSkeletonNode';
// import FResourceProperties from '@/components/FResourceProperties';
// import fResourcePropertyEditor from '@/components/fResourcePropertyEditor';
// import FResourceOptions from '@/components/FResourceOptions';
// import fResourceOptionEditor from '@/components/fResourceOptionEditor';
// import { FI18n } from '@freelog/tools-lib';
// import FTooltip from '@/components/FTooltip';
//
// interface CustomOptionsProps {
//   dispatch: Dispatch;
//   resourceVersionCreatorPage: ResourceVersionCreatorPageModelState;
// }
//
// function CustomOptions({ dispatch, resourceVersionCreatorPage }: CustomOptionsProps) {
//
//   // const [customOptionsDataVisible, set_customOptionsDataVisible] = React.useState<boolean>(false);
//
//   async function onClick_addOptionBtn() {
//     const dataSource: {
//       key: string;
//       name: string;
//       type: 'input' | 'select';
//       input: string;
//       select: string[];
//       description: string;
//     } | null = await fResourceOptionEditor({
//       disabledKeys: [
//         ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
//         ...resourceVersionCreatorPage.additionalProperties.map<string>((rp) => rp.key),
//         ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.key),
//         ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.key),
//       ],
//       disabledNames: [
//         ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.name),
//         ...resourceVersionCreatorPage.additionalProperties.map<string>((rp) => rp.name),
//         ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.name),
//         ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.name),
//       ],
//     });
//
//     if (!dataSource) {
//       return;
//     }
//
//     await dispatch<OnChange_CustomConfigurations_Action>({
//       type: 'resourceVersionCreatorPage/onChange_CustomConfigurations',
//       payload: {
//         value: [
//           ...resourceVersionCreatorPage.customConfigurations,
//           dataSource,
//         ],
//       },
//     });
//   }
//
//   async function onClick_importPreVersionOptionBtn() {
//     const data: {
//       key: string;
//       name: string;
//       description: string;
//       type: 'input' | 'select';
//       input: string;
//       select: string[];
//     }[] | null = await fAddCustomOptions({
//       disabledKeys: [
//         ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
//         ...resourceVersionCreatorPage.additionalProperties.map<string>((pp) => pp.key),
//         ...resourceVersionCreatorPage.customProperties.map<string>((pp) => pp.key),
//         ...resourceVersionCreatorPage.customConfigurations.map<string>((cod) => cod.key),
//       ],
//       disabledNames: [
//         ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.name),
//         ...resourceVersionCreatorPage.additionalProperties.map<string>((rp) => rp.name),
//         ...resourceVersionCreatorPage.customProperties.map<string>((pp) => pp.name),
//         ...resourceVersionCreatorPage.customConfigurations.map<string>((cod) => cod.name),
//       ],
//       defaultData: resourceVersionCreatorPage.preVersion_customConfigurations,
//     });
//     // console.log(data, 'data09weeisojfsdlkfjsldkjflk');
//     if (!data) {
//       return;
//     }
//
//     await dispatch<OnChange_CustomConfigurations_Action>({
//       type: 'resourceVersionCreatorPage/onChange_CustomConfigurations',
//       payload: {
//         value: [
//           ...resourceVersionCreatorPage.customConfigurations,
//           ...data,
//         ],
//       },
//     });
//   }
//
//   if (resourceVersionCreatorPage.rawPropertiesState === 'parsing' && !!resourceVersionCreatorPage.selectedFileInfo) {
//     return (<>
//       <div style={{ height: 20 }} />
//       <FSkeletonNode width={860} height={38} />
//       <div style={{ height: 20 }} />
//       <FSkeletonNode width={340} height={38} />
//     </>);
//   }
//
//   return (<>
//
//     {
//       !!resourceVersionCreatorPage.selectedFileInfo && (<>
//         <div style={{ height: 5 }} />
//
//         <div className={styles.attributes}>
//           <div style={{ height: 20 }} />
//           <div className={styles.attributesHeader}>
//             {/*<span>基础属性</span>*/}
//             <FComponentsLib.FContentText
//               text={'基础属性'}
//               type={'highlight'}
//               style={{ fontSize: 12 }}
//             />
//             {
//               resourceVersionCreatorPage.customProperties.length < 30 && (<div>
//                 <Space size={20}>
//                   <FTooltip title={FI18n.i18nNext.t('resourceinfo_add_btn_info')}>
//                     <div>
//                       <FComponentsLib.FTextBtn
//                         style={{ fontSize: 12, fontWeight: 600 }}
//                         type='primary'
//                         onClick={async () => {
//                           const dataSource: {
//                             key: string;
//                             name: string;
//                             value: string;
//                             description: string;
//                           } | null = await fResourcePropertyEditor({
//                             disabledKeys: [
//                               ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
//                               ...resourceVersionCreatorPage.additionalProperties.map<string>((bp) => bp.key),
//                               ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.key),
//                               ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.key),
//                             ],
//                             disabledNames: [
//                               ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.name),
//                               ...resourceVersionCreatorPage.additionalProperties.map<string>((rp) => rp.name),
//                               ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.name),
//                               ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.name),
//                             ],
//                           });
//                           // console.log(dataSource, 'dataSource9iojskldjflksdjflk');
//                           if (!dataSource) {
//                             return;
//                           }
//
//                           await dispatch<OnChange_CustomProperties_Action>({
//                             type: 'resourceVersionCreatorPage/onChange_CustomProperties',
//                             payload: {
//                               value: [
//                                 ...resourceVersionCreatorPage.customProperties,
//                                 dataSource,
//                               ],
//                             },
//                           });
//                         }}
//                       >补充属性</FComponentsLib.FTextBtn>
//                     </div>
//                   </FTooltip>
//
//                   {
//                     (resourceVersionCreatorPage.preVersion_additionalProperties.length > 0
//                       || resourceVersionCreatorPage.preVersion_customProperties.length > 0) &&
//                     (<FComponentsLib.FTextBtn
//                       style={{ fontSize: 12, fontWeight: 600 }}
//                       type='primary'
//                       onClick={async () => {
//                         if (resourceVersionCreatorPage.preVersion_additionalProperties.length > 0) {
//                           const dataSource_additionalProperties: {
//                             key: string;
//                             name: string;
//                             value: string;
//                             description: string;
//                           }[] = resourceVersionCreatorPage.additionalProperties.map((ap) => {
//                             const ap1 = resourceVersionCreatorPage.preVersion_additionalProperties.find((a) => {
//                               return a.key === ap.key;
//                             });
//
//                             if (!ap1) {
//                               return ap;
//                             }
//
//                             return {
//                               ...ap,
//                               value: ap1.value,
//                             };
//                           });
//
//                           await dispatch<OnChange_AdditionalProperties_Action>({
//                             type: 'resourceVersionCreatorPage/onChange_AdditionalProperties',
//                             payload: {
//                               value: dataSource_additionalProperties,
//                             },
//                           });
//                         }
//
//                         if (resourceVersionCreatorPage.preVersion_customProperties.length > 0) {
//                           const dataSource: {
//                             key: string;
//                             name: string;
//                             value: string;
//                             description: string;
//                           }[] | null = await fAddFileBaseProps({
//                             defaultData: resourceVersionCreatorPage.preVersion_customProperties,
//                             disabledKeys: [
//                               ...resourceVersionCreatorPage.rawProperties.map((rp) => {
//                                 return rp.key;
//                               }),
//                               ...resourceVersionCreatorPage.additionalProperties.map((rp) => {
//                                 return rp.key;
//                               }),
//                               ...resourceVersionCreatorPage.customProperties.map((pp) => {
//                                 return pp.key;
//                               }),
//                               ...resourceVersionCreatorPage.customConfigurations.map((pp) => {
//                                 return pp.key;
//                               }),
//                             ],
//                             disabledNames: [
//                               ...resourceVersionCreatorPage.rawProperties.map((rp) => {
//                                 return rp.name;
//                               }),
//                               ...resourceVersionCreatorPage.additionalProperties.map((rp) => {
//                                 return rp.name;
//                               }),
//                               ...resourceVersionCreatorPage.customProperties.map((pp) => {
//                                 return pp.name;
//                               }),
//                               ...resourceVersionCreatorPage.customConfigurations.map((pp) => {
//                                 return pp.name;
//                               }),
//                             ],
//                           });
//                           if (!dataSource) {
//                             return;
//                           }
//
//                           await dispatch<OnChange_CustomProperties_Action>({
//                             type: 'resourceVersionCreatorPage/onChange_CustomProperties',
//                             payload: {
//                               value: [
//                                 ...resourceVersionCreatorPage.customProperties,
//                                 ...dataSource.map<ResourceVersionCreatorPageModelState['customProperties'][number]>((ds) => {
//                                   return {
//                                     key: ds.key,
//                                     name: ds.name,
//                                     value: ds.value,
//                                     description: ds.description,
//                                   };
//                                 }),
//                               ],
//                             },
//                           });
//                         }
//
//                       }}
//                     >从上个版本导入</FComponentsLib.FTextBtn>)
//                   }
//                 </Space>
//               </div>)
//             }
//
//           </div>
//
//           <div style={{ height: 20 }} />
//           {/*<div style={{ height: 10 }} />*/}
//
//           <FResourceProperties
//             immutableData={resourceVersionCreatorPage.rawProperties}
//             onlyEditValueData={resourceVersionCreatorPage.additionalProperties}
//             alterableData={resourceVersionCreatorPage.customProperties}
//             onEdit_onlyEditValueData={async (value) => {
//               // console.log(value, 'value sidjfoikjo sd value sdiofjlkj');
//               const index: number = resourceVersionCreatorPage.additionalProperties.findIndex((p) => {
//                 return p === value;
//               });
//               const dataSource: {
//                 key: string;
//                 name: string;
//                 value: string;
//                 description: string;
//               } | null = await fResourcePropertyEditor({
//                 disabledKeys: [
//                   ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
//                   ...resourceVersionCreatorPage.additionalProperties.map<string>((rp) => rp.key),
//                   ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.key),
//                   ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.key),
//                 ],
//                 disabledNames: [
//                   ...resourceVersionCreatorPage.rawProperties.map<string>((bp) => bp.name),
//                   ...resourceVersionCreatorPage.additionalProperties.map<string>((bp) => bp.name),
//                   ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.name),
//                   ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.name),
//                 ],
//                 defaultData: value,
//                 noneEditableFields: ['key', 'description', 'name'],
//                 valueAcceptNull: true,
//               });
//               if (!dataSource) {
//                 return;
//               }
//
//               await dispatch<OnChange_AdditionalProperties_Action>({
//                 type: 'resourceVersionCreatorPage/onChange_AdditionalProperties',
//                 payload: {
//                   value: resourceVersionCreatorPage.additionalProperties.map((v, i) => {
//                     if (i !== index) {
//                       return v;
//                     }
//                     return dataSource;
//                   }),
//                 },
//               });
//             }}
//             onEdit_alterableData={async (value) => {
//               const index: number = resourceVersionCreatorPage.customProperties.findIndex((p) => {
//                 return p === value;
//               });
//               const dataSource: {
//                 key: string;
//                 name: string;
//                 value: string;
//                 description: string;
//               } | null = await fResourcePropertyEditor({
//                 disabledKeys: [
//                   ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
//                   ...resourceVersionCreatorPage.additionalProperties.map<string>((rp) => rp.key),
//                   ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.key),
//                   ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.key),
//                 ],
//                 disabledNames: [
//                   ...resourceVersionCreatorPage.rawProperties.map<string>((bp) => bp.name),
//                   ...resourceVersionCreatorPage.additionalProperties.map<string>((bp) => bp.name),
//                   ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.name),
//                   ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.name),
//                 ],
//                 defaultData: value,
//               });
//               if (!dataSource) {
//                 return;
//               }
//
//               await dispatch<OnChange_CustomProperties_Action>({
//                 type: 'resourceVersionCreatorPage/onChange_CustomProperties',
//                 payload: {
//                   value: resourceVersionCreatorPage.customProperties.map((v, i) => {
//                     if (i !== index) {
//                       return v;
//                     }
//                     return dataSource;
//                   }),
//                 },
//               });
//             }}
//             onDelete_alterableData={async (value) => {
//               // console.log(value, 'AAAAAAsdofijsdflksdjfldsjlkj');
//               await dispatch<OnChange_CustomProperties_Action>({
//                 type: 'resourceVersionCreatorPage/onChange_CustomProperties',
//                 payload: {
//                   value: resourceVersionCreatorPage.customProperties.filter((v, i) => {
//                     return v.key !== value.key && v.name !== value.name;
//                   }),
//                 },
//               });
//             }}
//           />
//           <div style={{ height: 15 }} />
//         </div>
//
//         <div style={{ height: 5 }} />
//
//         {
//           resourceVersionCreatorPage.customConfigurations.length === 0
//             ? (<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 20 }}>
//               <FTooltip title={FI18n.i18nNext.t('info_versionoptions')}>
//                 <div>
//                   <FComponentsLib.FTextBtn
//                     type={'default'}
//                     style={{ fontSize: 12 }}
//                     onClick={() => {
//                       onClick_addOptionBtn();
//                     }}
//                   >添加可选配置</FComponentsLib.FTextBtn>
//                 </div>
//               </FTooltip>
//               {
//                 resourceVersionCreatorPage.preVersion_customConfigurations.length > 0 && (<FComponentsLib.FTextBtn
//                   type={'default'}
//                   style={{ fontSize: 12 }}
//                   onClick={() => {
//                     onClick_importPreVersionOptionBtn();
//                   }}
//                 >从上个版本导入</FComponentsLib.FTextBtn>)
//               }
//
//             </div>)
//             : (<div className={styles.options}>
//               <div style={{ height: 20 }} />
//               <div className={styles.optionsHeader}>
//                 <FComponentsLib.FContentText
//                   text={'可选配置'}
//                   type={'highlight'}
//                   style={{ fontSize: 12 }}
//                 />
//
//                 {
//                   resourceVersionCreatorPage.customConfigurations.length < 30 && (<div>
//                     <Space size={20}>
//                       <FComponentsLib.FTextBtn
//                         style={{ fontSize: 12, fontWeight: 600 }}
//                         type='primary'
//                         onClick={async () => {
//                           onClick_addOptionBtn();
//                         }}
//                       >添加配置</FComponentsLib.FTextBtn>
//
//                       {
//                         resourceVersionCreatorPage.preVersion_customConfigurations.length > 0 && (<FComponentsLib.FTextBtn
//                           type='primary'
//                           style={{ fontSize: 12, fontWeight: 600 }}
//                           onClick={async () => {
//                             onClick_importPreVersionOptionBtn();
//
//                           }}>从上个版本导入</FComponentsLib.FTextBtn>)
//                       }
//                     </Space>
//                   </div>)
//                 }
//
//               </div>
//               <div style={{ height: 20 }} />
//
//               <FResourceOptions
//                 // dataSource={resourceVersionCreatorPage.customOptionsData}
//                 dataSource={resourceVersionCreatorPage.customConfigurations}
//                 onEdit={async (value) => {
//                   const index: number = resourceVersionCreatorPage.customConfigurations.findIndex((p) => {
//                     return p === value;
//                   });
//
//                   const dataSource: {
//                     key: string;
//                     name: string;
//                     type: 'input' | 'select';
//                     input: string;
//                     select: string[];
//                     description: string;
//                   } | null = await fResourceOptionEditor({
//                     disabledKeys: [
//                       ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
//                       ...resourceVersionCreatorPage.additionalProperties.map<string>((rp) => rp.key),
//                       ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.key),
//                       ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.key),
//                     ],
//                     disabledNames: [
//                       ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.name),
//                       ...resourceVersionCreatorPage.additionalProperties.map<string>((rp) => rp.name),
//                       ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.name),
//                       ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.name),
//                     ],
//                     defaultData: value,
//                   });
//
//                   if (!dataSource) {
//                     return;
//                   }
//
//                   await dispatch<OnChange_CustomConfigurations_Action>({
//                     type: 'resourceVersionCreatorPage/onChange_CustomConfigurations',
//                     payload: {
//                       value: resourceVersionCreatorPage.customConfigurations.map((a, b) => {
//                         if (b !== index) {
//                           return a;
//                         }
//                         return dataSource;
//                       }),
//                     },
//                   });
//                 }}
//                 onDelete={async (value) => {
//                   await dispatch<OnChange_CustomConfigurations_Action>({
//                     type: 'resourceVersionCreatorPage/onChange_CustomConfigurations',
//                     payload: {
//                       value: resourceVersionCreatorPage.customConfigurations.filter((a) => {
//                         return a.key !== value.key && a.name !== value.name;
//                       }),
//                     },
//                   });
//                 }}
//               />
//             </div>)
//         }
//
//       </>)
//     }
//
//   </>);
// }
//
// export default connect(({ resourceVersionCreatorPage }: ConnectState) => ({
//   resourceVersionCreatorPage,
// }))(CustomOptions);
