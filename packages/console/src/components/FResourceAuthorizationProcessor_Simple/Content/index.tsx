// import * as React from 'react';
// import styles from './index.less';
// import { PolicyFullInfo_Type } from '@/type/contractTypes';
// import FComponentsLib from '@freelog/components-lib';
// import { FI18n } from '@freelog/tools-lib';
// import { Checkbox, Radio, Space } from 'antd';
// import FTooltip from '@/components/FTooltip';
// import FContractDisplay from '@/components/FContractDisplay';
// import FDivider from '@/components/FDivider';
// import FPolicyDisplay from '@/components/FPolicyDisplay';
// import { IActivatedTarget, IBaseUpcastResource, ITargetInfo } from '../types';
// import fViewTerminatedContracts from '@/components/fViewTerminatedContracts';
//
// interface ContentProps {
//   targetInfos: ITargetInfo[];
//
//   activatedTarget: IActivatedTarget | null;
//
//   baseUpcastResources: IBaseUpcastResource[];
//   baseUpcastDisabled: boolean;
//
//   checkedPolicies: { [resourceID: string]: { policyID: string; policyName: string }[] };
//
//   onChange_TargetInfos?(value: ITargetInfo[]): void;
//
//   onChange_baseUpcastResources?(value: IBaseUpcastResource[]): void;
//
//   onChange_checkedPolicies?(value: ContentProps['checkedPolicies']): void;
// }
//
// function Content({
//                    targetInfos,
//                    activatedTarget,
//                    baseUpcastResources,
//                    baseUpcastDisabled,
//                    checkedPolicies,
//                    onChange_TargetInfos,
//                    onChange_baseUpcastResources,
//                    onChange_checkedPolicies,
//                  }: ContentProps) {
//
//   if (!activatedTarget) {
//     return null;
//   }
//
//   const info: ITargetInfo | undefined = targetInfos.find((i) => {
//     return activatedTarget.id === i.targetID && activatedTarget.name === i.targetName && activatedTarget.type === i.targetType;
//   });
//
//   function onChange(v: Partial<ITargetInfo>) {
//     onChange_TargetInfos && onChange_TargetInfos(targetInfos.map((t) => {
//       if (t.targetID !== activatedTarget?.id) {
//         return t;
//       }
//       return {
//         ...t,
//         ...v,
//       };
//     }));
//   }
//
//   if (!info) {
//     return null;
//   }
//
//   if (info.error === 'unreleased' && info.contracts.length === 0) {
//     return (
//       <div className={styles.errorBox}>
//         <FComponentsLib.FIcons.FForbid className={styles.errorIcon} />
//         <FComponentsLib.FTipText
//           // text={FI18n.i18nNext.t('authorization_issue_offline_resource')}
//           text={'该资源未发行，无法签约。'}
//           type='second'
//         />
//       </div>);
//   }
//
//   if (info.error === 'offline' && info.contracts.length === 0) {
//     return (
//       <div className={styles.errorBox}>
//         <FComponentsLib.FIcons.FForbid className={styles.errorIcon} />
//         <FComponentsLib.FTipText
//           text={FI18n.i18nNext.t('authorization_issue_offline_resource')}
//           type='second'
//         />
//       </div>);
//   }
//
//   if (info.error === 'cyclicDependency') {
//     return (<div className={styles.errorBox}>
//       <FComponentsLib.FIcons.FForbid className={styles.errorIcon} />
//       <FComponentsLib.FTipText
//         text={FI18n.i18nNext.t('authorization_issue_circular_reply')}
//         type='second'
//       />
//     </div>);
//   }
//
//   if (info.error === 'storageObject') {
//     return (<div className={styles.errorBox}>
//       <FComponentsLib.FIcons.FForbid className={styles.errorIcon} />
//       <FComponentsLib.FTipText text={'该依赖是存储空间对象，无法获取授权。'} type='second' />
//     </div>);
//   }
//
//   if (info.error === 'upThrow') {
//     return (<div className={styles.errorBox}>
//       <FComponentsLib.FIcons.FUpcast className={styles.errorIcon} />
//       <FComponentsLib.FTipText text={'此依赖为当前资源的基础上抛'} type='second' />
//     </div>);
//   }
//
//   if (info.error === 'freeze') {
//     return (<div className={styles.errorBox}>
//       <FComponentsLib.FIcons.FForbid className={styles.errorIcon} />
//       <FComponentsLib.FTipText text={'此资源因违规无法授权'} type='second' />
//     </div>);
//   }
//
//   // if (info.warning === 'authException') {
//   //   return (<div className={styles.warningBox}>
//   //     <FComponentsLib.FIcons.FWarning className={styles.warningIcon} />
//   //     <span style={{ fontSize: 14, color: '#C78D12' }}>该资源授权链异常，请谨慎签约。</span>
//   //   </div>);
//   // }
//   //
//   // if (info.warning === 'ownerFreeze') {
//   //   return (<div className={styles.warningBox}>
//   //     <FComponentsLib.FIcons.FWarning className={styles.warningIcon} />
//   //     <span style={{ fontSize: 14, color: '#C78D12' }}>该资源发行方账号因违规已被冻结，请谨慎处理授权。</span>
//   //   </div>);
//   // }
//
//   // if (info.upThrow) {
//   //   return (<div className={styles.errorBox}>
//   //     <FComponentsLib.FIcons.FUpcast className={styles.errorIcon} />
//   //     <FComponentsLib.FTipText text={'已选择上抛'} type='second' />
//   //   </div>);
//   // }
//
//   return (<>
//
//     {
//       info.targetType === 'resource' && baseUpcastResources.some((r) => {
//         return r.resourceID === info?.targetID && r.resourceName === info.targetName;
//       }) && (<div className={styles.errorBox} style={{ flexDirection: 'column' }}>
//         <FComponentsLib.FIcons.FUpcast className={styles.errorIcon} style={{ fontSize: 48 }} />
//         <div style={{ height: 20 }} />
//         <FComponentsLib.FTipText text={'已选择上抛'} type='second' />
//         <div style={{ height: 40 }} />
//         {
//           !baseUpcastDisabled && (<FComponentsLib.FRectBtn
//             type={'secondary'}
//             onClick={() => {
//               // onChange({ upThrow: false });
//               // console.log(baseUpcastResources, 'baseUpcastResources sidfjlsdkfjlkdsjflkjdslfkj');
//               onChange_baseUpcastResources && onChange_baseUpcastResources(baseUpcastResources.filter((r) => {
//                 return r.resourceID !== info?.targetID && r.resourceName !== info?.targetName;
//               }));
//             }}
//           >重新选择授权方案</FComponentsLib.FRectBtn>)
//         }
//
//       </div>)
//     }
//
//     {
//       info.warning === 'authException' && (<div className={styles.warningBox}>
//         <FComponentsLib.FIcons.FWarning className={styles.warningIcon} />
//         <span style={{ fontSize: 14, color: '#C78D12' }}>该资源授权链异常，请谨慎签约。</span>
//       </div>)
//     }
//
//     {
//       info.warning === 'ownerFreeze' && (<div className={styles.warningBox}>
//         <FComponentsLib.FIcons.FWarning className={styles.warningIcon} />
//         <span style={{ fontSize: 14, color: '#C78D12' }}>该资源发行方账号因违规已被冻结，请谨慎处理授权。</span>
//       </div>)
//     }
//
//
//     {
//       (info.targetType !== 'resource' || !baseUpcastResources.some((r) => {
//         return r.resourceID === info?.targetID && r.resourceName === info.targetName;
//       })) && (<div className={styles.contractAndPolicyList}>
//
//         {
//           !baseUpcastDisabled && (<FComponentsLib.FTextBtn
//             type={'danger'}
//             style={{ position: 'absolute', right: 20, top: 15, fontSize: 12 }}
//             onClick={() => {
//               // onChange({ upThrow: true });
//               onChange_baseUpcastResources && onChange_baseUpcastResources([
//                 ...baseUpcastResources,
//                 {
//                   resourceID: info?.targetID,
//                   resourceName: info?.targetName,
//                 },
//               ]);
//             }}
//           >
//             <FComponentsLib.FIcons.FUpcast style={{ fontSize: 12 }} />将资源上抛
//           </FComponentsLib.FTextBtn>)
//         }
//
//         {
//           info.contracts.length > 0 && (<Space size={15} style={{ width: '100%' }} direction='vertical'>
//             {/*<FComponentsLib.FContentText type='additional2' text={FI18n.i18nNext.t('reusable_contract')} />*/}
//             <FComponentsLib.FContentText type='additional2' text={'当前合约'} />
//             {
//               info.contracts
//                 .map((k) => (<div key={k.contractID} className={styles.Policy}>
//
//                   <div style={{ height: 15 }} />
//                   <div className={styles.PolicyGrammarName}>
//                     <Space size={10}>
//                       <span>{k.title}</span>
//                     </Space>
//                   </div>
//
//                   <div style={{ height: 10 }} />
//
//                   <div style={{ padding: '0 20px' }}>
//                     <FContractDisplay
//                       contractID={k.contractID}
//                     />
//                   </div>
//
//                   <div style={{ height: 10 }} />
//
//                   <Space style={{ padding: '0 20px' }} size={2}>
//                     <FComponentsLib.FContentText
//                       type='additional2'
//                       text={FI18n.i18nNext.t('contract_id') + '：' + k.contractID}
//                     />
//                     <FDivider style={{ fontSize: 14 }} />
//                     <FComponentsLib.FContentText
//                       type='additional2'
//                       text={FI18n.i18nNext.t('contract_signed_time') + '：' + k.date}
//                     />
//                   </Space>
//
//                   <div style={{ height: 10 }} />
//                 </div>))
//             }
//           </Space>)
//         }
//
//         {
//           info.terminatedContractIDs.length > 0 && (<div>
//             <div style={{ display: 'flex', alignItems: 'center' }}>
//               {/*<FContentText text={'查看已终止的合约请移至'} type='negative' />*/}
//               <FComponentsLib.FTextBtn
//                 onClick={async () => {
//                   await fViewTerminatedContracts({
//                     terminatedContractIDs: info.terminatedContractIDs,
//                   });
//                 }}>查看已终止合约</FComponentsLib.FTextBtn>
//               {/*<div style={{ height: 5 }} />*/}
//             </div>
//           </div>)
//         }
//
//         {
//           info.enabledPolicies.length > 0 && (<Space
//             size={15}
//             style={{ width: '100%' }}
//             direction='vertical'
//           >
//
//             <FComponentsLib.FContentText
//               type='additional2'
//               text={FI18n.i18nNext.t('getauth_title_authplanavailable')}
//             />
//             {
//               info.enabledPolicies.map((i) => (
//                 <div key={i.policyFullInfo.policyId} className={styles.Policy}>
//                   <div style={{ height: 15 }} />
//                   <div className={styles.PolicyName}>
//                     <span>{i.policyFullInfo.policyName}</span>
//                     <Checkbox
//                       checked={(checkedPolicies[activatedTarget.id] || []).some((p) => {
//                         return p.policyID === i.policyFullInfo.policyId;
//                       })}
//                       onChange={(e) => {
//                         const policies: {
//                           [resourceID: string]: {
//                             policyID: string;
//                             policyName: string;
//                           }[];
//                         } = { ...checkedPolicies };
//                         if (e.target.checked) {
//                           policies[activatedTarget.id] = [
//                             ...(policies[activatedTarget.id] || []),
//                             {
//                               policyID: i.policyFullInfo.policyId,
//                               policyName: i.policyFullInfo.policyName,
//                             },
//                           ];
//                         } else {
//                           policies[activatedTarget.id] = (policies[activatedTarget.id] || []).filter((p) => {
//                             return p.policyID !== i.policyFullInfo.policyId;
//                           });
//                         }
//                         onChange_checkedPolicies && onChange_checkedPolicies(policies);
//                         // const enabledPolicies = info.enabledPolicies.map((p) => {
//                         //   if (i.policyFullInfo.policyId !== p.policyFullInfo.policyId) {
//                         //     return p;
//                         //   }
//                         //   return {
//                         //     ...p,
//                         //     checked: e.target.checked,
//                         //   };
//                         // });
//                         // onChange({ enabledPolicies: enabledPolicies });
//                       }}
//                     />
//                   </div>
//                   <div style={{ height: 10 }} />
//                   <div style={{ padding: '0 20px' }}>
//                     <FPolicyDisplay fullInfo={i.policyFullInfo} />
//                   </div>
//                 </div>
//               ))
//             }
//           </Space>)
//         }
//
//       </div>)
//     }
//
//
//   </>);
// }
//
// export default Content;
//
// // {
// //   // (resource?.status === 1
// //   (resource?.error === ''
// //     // || (resource?.status === 0
// //     || (resource?.error === 'offline'
// //       && (resource?.enableReuseContracts.length !== 0 || resource.enabledPolicies.length !== 0)))
// //   && (<Space
// //     style={{ width: '100%' }}
// //     size={25}
// //     direction='vertical'
// //   >
// //
// //     {
// //       // resource.authProblem && (<Space size={10}>
// //       resource.warning === 'ownerFreeze' &&
// //     }
// //
// //     return (
// //     <div>
// //
// //     </div>
// //     );
// //     }
//
//
