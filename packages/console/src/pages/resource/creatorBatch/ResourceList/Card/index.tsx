import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import FCoverImage from '@/components/FCoverImage';
import FResourceNameInput from '@/components/FResourceNameInput';
import FResourceLabelEditor2 from '@/components/FResourceLabelEditor2';
import { Space } from 'antd';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import FTooltip from '@/components/FTooltip';
import fResourcePropertyEditor from '@/components/fResourcePropertyEditor';
import FResourceProperties from '@/components/FResourceProperties';
import fResourceOptionEditor from '@/components/fResourceOptionEditor';
import FResourceOptions from '@/components/FResourceOptions';
import fAddDependencies from '@/components/fAddDependencies';
import * as AHooks from 'ahooks';
import FResourceAuthorizationProcessor_Simple, { getProcessor_simple } from '@/components/FResourceAuthorizationProcessor_Simple';
import fMessage from '@/components/fMessage';
import FUploadCover from '@/components/FUploadCover';
import fPolicyBuilder from '@/components/fPolicyBuilder';
import { ChangeAction } from '@/models/resourceCreatorPage';
import { MicroApp } from '@@/plugin-qiankun/MicroApp';

interface CardProps {
  order: number;
  username: string;
  resourceType: string[];
  info: {
    fileUID: string;
    fileName: string;
    sha1: string;
    cover: string;
    resourceName: string;
    resourceNameError: string;
    resourceTitle: string;
    resourceTitleError: string;
    resourceLabels: string[];
    resourcePolicies: {
      title: string;
      text: string;
    }[];
    showMore: boolean;
    rawProperties: {
      key: string;
      name: string;
      value: string;
      description: string;
    }[];
    additionalProperties: {
      key: string;
      name: string;
      value: string;
      description: string;
    }[];
    customProperties: {
      key: string;
      name: string;
      value: string;
      description: string;
    }[];
    customConfigurations: {
      key: string;
      name: string;
      description: string;
      type: 'input' | 'select';
      input: string;
      select: string[];
    }[];
    directDependencies: {
      id: string;
      name: string;
      type: 'resource' | 'object';
      versionRange?: string;
    }[];
    baseUpcastResources: {
      resourceID: string;
      resourceName: string;
    }[];
    resolveResources: {
      resourceId: string;
      contracts: {
        policyId: string;
      }[];
    }[];
    isCompleteAuthorization: boolean;
  };

  onChange?(value: CardProps['info']): void;

  onDelete?(): void;

  onClickApplyLabels?(): void;

  onClickApplyPolicies?(): void;
}

function Card({
                order,
                username,
                info,
                resourceType,
                onChange,
                onDelete,
                onClickApplyLabels,
                onClickApplyPolicies,
              }: CardProps) {
  const ref = React.useRef(null);
  const size = AHooks.useSize(ref);
  const [$showMore, set$showMore, get$showMore] = FUtil.Hook.useGetState<boolean>(false);

  AHooks.useDebounceEffect(() => {
    onVerifyResourceName();
  }, [info.resourceName], {
    wait: 300,
  });

  async function onVerifyResourceName() {
    let nameErrorText: string = '';
    if (info.resourceName === '') {
      nameErrorText = '请输入资源授权标识';
    } else if (info.resourceName.length > 60) {
      nameErrorText = '不多于60个字符';
    } else if (!FUtil.Regexp.RESOURCE_NAME.test(info.resourceName)) {
      // nameErrorText = `不符合正则 ${FUtil.Regexp.RESOURCE_NAME}`;
      nameErrorText = FI18n.i18nNext.t('naming_convention_resource_name');
    } else {
      const params1: Parameters<typeof FServiceAPI.Resource.info>[0] = {
        resourceIdOrName: encodeURIComponent(`${username}/${info.resourceName}`),
      };
      const { data: data_info } = await FServiceAPI.Resource.info(params1);
      if (!!data_info) {
        nameErrorText = '资源授权标识已存在';
      }
    }

    onChange && onChange({
      ...info,
      resourceNameError: nameErrorText,
    });
  }

  return (<div className={styles.resourceContainer}>
    <div className={styles.resourceOrder}>
      <FComponentsLib.FContentText
        // text={`资源${order}`}
        text={FI18n.i18nNext.t('brr_resourcelisting_item_no', {
          ResourceNO: order,
        })}
        type={'highlight'}
        style={{ fontSize: 12 }}
      />
      <FComponentsLib.FTextBtn
        style={{ fontSize: 12 }}
        type={'danger'}
        onClick={() => {
          onDelete && onDelete();
        }}
      >
        <FComponentsLib.FIcons.FDelete style={{ fontSize: 12 }} />
        &nbsp;{FI18n.i18nNext.t('brr_resourcelisting_item_btn_deleteitem')}
      </FComponentsLib.FTextBtn>
    </div>
    <div style={{ height: 5 }} />
    <div className={styles.whiteCard}>
      <div className={styles.whiteCardLeft}>
        <FCoverImage
          src={info.cover}
          width={240}
          style={{ display: 'block' }}
        />
        <div style={{ height: 10 }} />
        <FUploadCover
          onUploadSuccess={(url) => {
            onChange && onChange({
              ...info,
              cover: url,
            });
          }}
          onError={(err) => {
            fMessage(err, 'error');
          }}
        >
          <FComponentsLib.FTextBtn
            type={'primary'}>{FI18n.i18nNext.t('brr_resourcelisting_item_btn_uplaodimage')}</FComponentsLib.FTextBtn>
        </FUploadCover>
      </div>
      <div className={styles.whiteCardRight}>
        <div className={styles.whiteCardRightRow}>
          <FComponentsLib.FContentText
            text={FI18n.i18nNext.t('brr_resourcelisting_item_filename')}
            type={'negative'}
          />
          <FComponentsLib.FContentText
            text={info.fileName}
            type={'normal'}
            style={{ width: 540, wordBreak: 'break-all' }}
          />
        </div>
        <div style={{ height: 15 }} />
        <div className={styles.whiteCardRightRow}>
          <FComponentsLib.FContentText
            text={FI18n.i18nNext.t('brr_resourcelisting_item_authid')}
            type={'negative'}
          />
          <FResourceNameInput
            userName={username}
            value={info.resourceName}
            onChange={(value) => {
              onChange && onChange({
                ...info,
                resourceName: value,
              });
            }}
          />
        </div>
        {
          info.resourceNameError !== '' && info.resourceNameError !== '###***' && (<>
            <div style={{ height: 5 }} />
            <div style={{ color: '#EE4040', fontSize: 12 }}>{info.resourceNameError}</div>
          </>)
        }
        <div style={{ height: 15 }} />

        <div className={styles.whiteCardRightRow}>
          <FComponentsLib.FContentText
            text={FI18n.i18nNext.t('brr_resourcelisting_item_title')}
            type={'negative'}
          />
          <FComponentsLib.FInput.FSingleLine
            lengthLimit={-1}
            value={info.resourceTitle}
            style={{
              height: 38,
              borderRadius: 4,
              border: '1px solid #D4D4D4',
              width: 540,
            }}
            onChange={(e) => {
              const value: string = e.target.value;
              onChange && onChange({
                ...info,
                resourceTitle: value,
                resourceTitleError: value.length > 100 ? '不超过100个字符' : '',
              });
            }}
            placeholder={info.resourceName}
          />
        </div>

        {
          info.resourceTitleError !== '' && (<>
            <div style={{ height: 5 }} />
            <div style={{ color: '#EE4040', fontSize: 12 }}>{info.resourceTitleError}</div>
          </>)
        }

        <div style={{ height: 15 }} />

        <div className={styles.whiteCardRightRow} style={{ alignItems: 'flex-start' }}>
          <FComponentsLib.FContentText
            text={FI18n.i18nNext.t('brr_resourcelisting_item_tag')}
            type={'negative'}
            style={{
              transform: 'translateY(8px)',
            }}
          />
          <FResourceLabelEditor2
            value={info.resourceLabels}
            onChange={(value) => {
              onChange && onChange({
                ...info,
                resourceLabels: value,
              });
            }}
            onClickApply={onClickApplyLabels}
          />
        </div>


        <div style={{ height: 15 }} />

        <div className={styles.whiteCardRightRow} style={{ alignItems: 'flex-start' }}>
          <FComponentsLib.FContentText
            text={FI18n.i18nNext.t('brr_resourcelisting_item_authplan')}
            type={'negative'}
          />
          <div style={{ width: 540 }}>
            <Space size={15}>
              <Space
                size={5}
                onClick={async () => {
                  // onAddPolicy && onAddPolicy();

                  const result: null | { title: string; text: string; } = await fPolicyBuilder({
                    targetType: 'resource',
                    alreadyUsedTexts: info.resourcePolicies.map((p) => {
                      return p.text;
                    }),
                    alreadyUsedTitles: info.resourcePolicies.map((p) => {
                      return p.title;
                    }),
                  });
                  if (!result) {
                    return;
                  }
                  onChange && onChange({
                    ...info,
                    resourcePolicies: [
                      ...info.resourcePolicies,
                      result,
                    ],
                  });
                }}
              >
                <FComponentsLib.FTextBtn><FComponentsLib.FIcons.FCreate /></FComponentsLib.FTextBtn>
                <FComponentsLib.FTextBtn>{FI18n.i18nNext.t('brr_resourcelisting_item_btn_addauthplan')}</FComponentsLib.FTextBtn>
              </Space>
              {
                onClickApplyPolicies && (<FComponentsLib.FTextBtn
                  style={{ fontSize: 12 }}
                  type={'primary'}
                  onClick={() => {
                    onClickApplyPolicies();
                  }}
                >应用于所有资源</FComponentsLib.FTextBtn>)
              }
            </Space>
            {
              info.resourcePolicies.length > 0 && (<>
                <div style={{ height: 15 }} />
                <div className={styles.policies}>
                  {
                    info.resourcePolicies.map((p) => {
                      return (<label className={styles.policy} key={p.title}>
                        <span>{p.title}</span>
                        <a onClick={() => {
                          // onChange && onChange();
                          // console.log(p, 'sdoifsdlkfjlk');
                          onChange && onChange({
                            ...info,
                            resourcePolicies: info.resourcePolicies.filter((l) => {
                              return l.title !== p.title;
                            }),
                          });
                        }}><FComponentsLib.FIcons.FClose style={{ fontSize: 8 }} /></a>
                      </label>);
                    })
                  }
                </div>
              </>)
            }

          </div>
        </div>
      </div>
    </div>

    <div style={{ height: 10 }} />
    <Space size={10}>
      <FComponentsLib.FTextBtn
        style={{ fontSize: 12 }}
        onClick={() => {
          set$showMore(!get$showMore());
        }}
      >{$showMore
        ? FI18n.i18nNext.t('brr_resourcelisting_item_btn_showlesssetting')
        : FI18n.i18nNext.t('brr_resourcelisting_item_btn_moresetting')}</FComponentsLib.FTextBtn>
      <FComponentsLib.FContentText
        text={FI18n.i18nNext.t('brr_resourcelisting_item_btn_moresetting_msg')}
        type={'negative'}
        style={{ fontSize: 12 }}
      />
    </Space>

    {
      $showMore && (<>
        <div style={{ height: 5 }} />
        <div className={styles.block}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FComponentsLib.FContentText text={'基础属性'} type={'highlight'} />
            {
              info.customProperties.length < 30 && (
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
                            ...info.rawProperties.map<string>((rp) => rp.key),
                            ...info.additionalProperties.map<string>((rp) => rp.key),
                            ...info.customProperties.map<string>((bp) => bp.key),
                            ...info.customConfigurations.map<string>((pp) => pp.key),
                          ],
                          disabledNames: [
                            ...info.rawProperties.map<string>((rp) => rp.name),
                            ...info.additionalProperties.map<string>((rp) => rp.name),
                            ...info.customProperties.map<string>((bp) => bp.name),
                            ...info.customConfigurations.map<string>((pp) => pp.name),
                          ],
                        });
                        if (!dataSource) {
                          return;
                        }
                        onChange && onChange({
                          ...info,
                          customProperties: [
                            ...info.customProperties,
                            dataSource,
                          ],
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
            immutableData={info.rawProperties}
            onlyEditValueData={info.additionalProperties}
            alterableData={info.customProperties}
            onEdit_onlyEditValueData={async (value) => {
              // console.log(value, 'value sidjfoikjo sd value sdiofjlkj');
              const index: number = info.additionalProperties.findIndex((p) => {
                return p === value;
              });
              const dataSource: {
                key: string;
                name: string;
                value: string;
                description: string;
              } | null = await fResourcePropertyEditor({
                disabledKeys: [
                  ...info.rawProperties.map<string>((rp) => rp.key),
                  ...info.additionalProperties.map<string>((rp) => rp.key),
                  ...info.customProperties.map<string>((bp) => bp.key),
                  ...info.customConfigurations.map<string>((pp) => pp.key),
                ],
                disabledNames: [
                  ...info.rawProperties.map<string>((rp) => rp.name),
                  ...info.additionalProperties.map<string>((rp) => rp.name),
                  ...info.customProperties.map<string>((bp) => bp.name),
                  ...info.customConfigurations.map<string>((pp) => pp.name),
                ],
                defaultData: value,
                noneEditableFields: ['key', 'description', 'name'],
                valueAcceptNull: true,
              });
              if (!dataSource) {
                return;
              }
              // await dispatch<OnChange_step2_additionalProperties_Action>({
              //   type: 'resourceCreatorPage/onChange_step2_additionalProperties',
              //   payload: {
              //     value: resourceCreatorPage.step2_additionalProperties.map((v, i) => {
              //       if (i !== index) {
              //         return v;
              //       }
              //       return dataSource;
              //     }),
              //   },
              // });
              onChange && onChange({
                ...info,
                additionalProperties: info.additionalProperties.map((v, i) => {
                  if (i !== index) {
                    return v;
                  }
                  return dataSource;
                }),
              });
            }}
            onEdit_alterableData={async (value) => {
              const index: number = info.customProperties.findIndex((p) => {
                return p === value;
              });
              const dataSource: {
                key: string;
                name: string;
                value: string;
                description: string;
              } | null = await fResourcePropertyEditor({
                disabledKeys: [
                  ...info.rawProperties.map<string>((rp) => rp.key),
                  ...info.additionalProperties.map<string>((rp) => rp.key),
                  ...info.customProperties.map<string>((bp) => bp.key),
                  ...info.customConfigurations.map<string>((pp) => pp.key),
                ],
                disabledNames: [
                  ...info.rawProperties.map<string>((rp) => rp.name),
                  ...info.additionalProperties.map<string>((rp) => rp.name),
                  ...info.customProperties.map<string>((bp) => bp.name),
                  ...info.customConfigurations.map<string>((pp) => pp.name),
                ],
                defaultData: value,
              });
              if (!dataSource) {
                return;
              }

              onChange && onChange({
                ...info,
                customProperties: info.customProperties.map((v, i) => {
                  if (i !== index) {
                    return v;
                  }
                  return dataSource;
                }),
              });
            }}
            onDelete_alterableData={async (value) => {
              onChange && onChange({
                ...info,
                customProperties: info.customProperties.filter((v, i) => {
                  return v.key !== value.key && v.name !== value.name;
                }),
              });
            }}
          />
        </div>

        {
          (resourceType.includes('插件') || resourceType.includes('主题'))
          && (<>
            <div style={{ height: 5 }} />
            <div className={styles.block}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FComponentsLib.FContentText text={FI18n.i18nNext.t('resourceoptions_title')} type={'highlight'} />
                {
                  info.customConfigurations.length < 30 && (
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
                                ...info.rawProperties.map<string>((rp) => rp.key),
                                ...info.additionalProperties.map<string>((rp) => rp.key),
                                ...info.customProperties.map<string>((bp) => bp.key),
                                ...info.customConfigurations.map<string>((pp) => pp.key),
                              ],
                              disabledNames: [
                                ...info.rawProperties.map<string>((rp) => rp.name),
                                ...info.additionalProperties.map<string>((rp) => rp.name),
                                ...info.customProperties.map<string>((bp) => bp.name),
                                ...info.customConfigurations.map<string>((pp) => pp.name),
                              ],
                            });

                            if (!dataSource) {
                              return;
                            }

                            onChange && onChange({
                              ...info,
                              customConfigurations: [
                                ...info.customConfigurations,
                                dataSource,
                              ],
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
                info.customConfigurations.length === 0 && (<>
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
                info.customConfigurations.length > 0 && (<>
                  <div style={{ height: 20 }} />
                  <FResourceOptions
                    theme={'dark'}
                    // dataSource={resourceVersionCreatorPage.customOptionsData}
                    dataSource={info.customConfigurations}
                    onEdit={async (value) => {
                      const index: number = info.customConfigurations.findIndex((p) => {
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
                          ...info.rawProperties.map<string>((rp) => rp.key),
                          ...info.additionalProperties.map<string>((rp) => rp.key),
                          ...info.customProperties.map<string>((bp) => bp.key),
                          ...info.customConfigurations.map<string>((pp) => pp.key),
                        ],
                        disabledNames: [
                          ...info.rawProperties.map<string>((rp) => rp.name),
                          ...info.additionalProperties.map<string>((rp) => rp.name),
                          ...info.customProperties.map<string>((bp) => bp.name),
                          ...info.customConfigurations.map<string>((pp) => pp.name),
                        ],
                        defaultData: value,
                      });

                      if (!dataSource) {
                        return;
                      }

                      onChange && onChange({
                        ...info,
                        customConfigurations: info.customConfigurations.map((a, b) => {
                          if (b !== index) {
                            return a;
                          }
                          return dataSource;
                        }),
                      });
                    }}
                    onDelete={async (value) => {
                      onChange && onChange({
                        ...info,
                        customConfigurations: info.customConfigurations.filter((a) => {
                          return a.key !== value.key && a.name !== value.name;
                        }),
                      });
                    }}
                  />
                </>)
              }
            </div>
          </>)
        }
        <div style={{ height: 5 }} />
      </>)
    }

    {/*<div style={{height: 5}}/>*/}

    <div className={styles.block} style={{ display: $showMore ? 'block' : 'none' }}>

      <MicroApp
        name={'Authorization'}
        licenseeId={''}
        mainAppType={'resourceInBatchPublish'}
        depList={[]}
        upcastList={[]}
        update={(data: any) => {
          onChange && onChange({
            ...info,
            directDependencies: data.depList,
            resolveResources: data.resolveResources,
            baseUpcastResources: data.upcastList,
            isCompleteAuthorization: true,
          });
        }}
      />
      {/*<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>*/}
      {/*  <FComponentsLib.FContentText text={FI18n.i18nNext.t('claim_rely_title')} type={'highlight'} />*/}
      {/*  <FTooltip title={FI18n.i18nNext.t('info_versionrely')}>*/}
      {/*    <div>*/}
      {/*      <FComponentsLib.FTextBtn*/}
      {/*        style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}*/}
      {/*        type='primary'*/}
      {/*        onClick={async () => {*/}
      {/*          const p = await getProcessor_simple(info.fileUID);*/}
      {/*          const baseUpcastResources: Awaited<ReturnType<typeof p.getBaseUpcastResources>> = await p.getBaseUpcastResources();*/}
      {/*          await fAddDependencies({*/}
      {/*            existingResources: (await p.getAllTargets()).map((t) => {*/}
      {/*              return {*/}
      {/*                resourceID: t.id,*/}
      {/*                resourceNme: t.name,*/}
      {/*              };*/}
      {/*            }),*/}
      {/*            baseUpcastResources: baseUpcastResources,*/}
      {/*            async onSelect_Resource({ resourceID, resourceName }) {*/}
      {/*              await p.addTargets([{*/}
      {/*                id: resourceID,*/}
      {/*                name: resourceName,*/}
      {/*                type: 'resource',*/}
      {/*              }]);*/}
      {/*            },*/}
      {/*            async onDeselect_Resource({ resourceID, resourceName }) {*/}
      {/*              // const p = await getProcessor('resourceCreatorStep2');*/}
      {/*              await p.removeTarget({*/}
      {/*                id: resourceID,*/}
      {/*                name: resourceName,*/}
      {/*                type: 'resource',*/}
      {/*              });*/}
      {/*            },*/}
      {/*          });*/}
      {/*        }}*/}
      {/*      >*/}
      {/*        <FComponentsLib.FIcons.FConfiguration style={{ fontSize: 14 }} />*/}
      {/*        <span>{FI18n.i18nNext.t('claim_rely_add_btn')}</span>*/}
      {/*      </FComponentsLib.FTextBtn>*/}
      {/*    </div>*/}
      {/*  </FTooltip>*/}
      {/*</div>*/}

      {/*{*/}
      {/*  size && size.height === 0 && (<>*/}
      {/*    <div style={{ height: 10 }} />*/}
      {/*    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>*/}
      {/*      {*/}
      {/*        FI18n.i18nNext.t('claim_rely_list_empty').split('\n').map((i, j) => {*/}
      {/*          return (<FComponentsLib.FContentText key={j} text={i} type={'additional2'} />);*/}
      {/*        })*/}
      {/*      }*/}
      {/*    </div>*/}
      {/*    <div style={{ height: 20 }} />*/}
      {/*  </>)*/}
      {/*}*/}

      {/*<>*/}
      {/*  {*/}
      {/*    size && size.height > 0 && (<div style={{ height: 20 }} />)*/}
      {/*  }*/}
      {/*  <div ref={ref}>*/}
      {/*    <FResourceAuthorizationProcessor_Simple*/}
      {/*      width={860}*/}
      {/*      height={600}*/}
      {/*      // resourceID={'655f068d5ecea7002f400b59'}*/}
      {/*      processorIdentifier={info.fileUID}*/}
      {/*      onChanged={() => {*/}
      {/*      }}*/}
      {/*    />*/}
      {/*  </div>*/}
      {/*</>*/}
    </div>
  </div>);
}

export default Card;
