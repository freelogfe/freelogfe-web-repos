import * as React from 'react';
import styles from './index.less';
import { Select, Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import FDrawer from '@/components/FDrawer';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import FTooltip from '@/components/FTooltip';
import FCoverImage from '@/components/FCoverImage';
import moment from 'moment';
import fCenterMessage from '@/components/fCenterMessage';
import FPolicyDisplay from '@/components/FPolicyDisplay';
import { PolicyFullInfo_Type } from '@/type/contractTypes';
import fPolicyBuilder from '@/components/fPolicyBuilder';
import fMessage from '@/components/fMessage';

interface FSignResourceToNodeDrawerProps {
  resourceIDs: string[];

  onOk?(value: {
    nodeID: number;
    allIsTheme: boolean;
  }): void;

  onClose?(): void;
}

interface FSignResourceToNodeDrawerStates {
  goodResources: {
    resourceID: string;
    resourceName: string;
    resourceTitle: string;
    cover: string;
    resourceType: string[];
    updateTime: string;
    selectedPolicy: {
      policyID: string;
      policyName: string;
    } | null;
  }[];
  badResources: {
    resourceID: string;
    resourceName: string;
    resourceTitle: string;
    cover: string;
    resourceType: string[];
    updateTime: string;
    errorReason: string;
  }[];
}

function FSignResourceToNodeDrawer({ resourceIDs, onClose, onOk }: FSignResourceToNodeDrawerProps) {

  const [$open, set$open, get$open] = FUtil.Hook.useGetState<boolean>(true);
  const [$selectNodeID, set$selectNodeID, get$selectNodeID] = FUtil.Hook.useGetState<number | null>(null);
  const [$nodeOptions, set$nodeOptions, get$nodeOptions] = FUtil.Hook.useGetState<{
    value: number;
    label: string;
  }[]>([]);
  const [$goodResources, set$goodResources, get$goodResources] = FUtil.Hook.useGetState<FSignResourceToNodeDrawerStates['goodResources']>([]);
  const [$badResources, set$badResources, get$badResources] = FUtil.Hook.useGetState<FSignResourceToNodeDrawerStates['badResources']>([]);
  const [$selectingPolicyResourceID, set$selectingPolicyResourceID, get$selectingPolicyResourceID] = FUtil.Hook.useGetState<string>('');

  AHooks.useMount(async () => {
    const { data }: {
      data: {
        dataList: {
          nodeDomain: string;
          nodeId: number;
          nodeName: string;
          status: number;
        }[];
      }
    } = await FServiceAPI.Node.nodes({ limit: 100 });
    // console.log(data, 'data sdifj;lsdkjflksdjflkjsdlkjf');
    set$nodeOptions(data.dataList
      .filter((d) => {
        return d.status !== 4 && d.status !== 5;
      })
      .map((d) => {
        return {
          value: d.nodeId,
          label: d.nodeName,
        };
      }));
  });

  AHooks.useMount(() => {
    handleResource();
  });

  async function handleResource() {
    const { data: data_batchInfo } = await FServiceAPI.Resource.batchInfo({
      resourceIds: resourceIDs.join(','),
    });
    const goodResources: FSignResourceToNodeDrawerStates['goodResources'] = [];
    const badResources: FSignResourceToNodeDrawerStates['badResources'] = [];
    for (const d of data_batchInfo) {
      const resource: FSignResourceToNodeDrawerStates['goodResources'][number] = get$goodResources().find((gr) => {
        return gr.resourceID === d.resourceId;
      }) || {
        resourceID: d.resourceId,
        resourceName: d.resourceName,
        resourceTitle: d.resourceTitle,
        cover: d.coverImages[0] || '',
        resourceType: d.resourceType,
        updateTime: moment(d.updateDate).format('YYYY-MM-DD'),
        selectedPolicy: null,
        // addPolicy: null,
      };
      if (d.status === 0) {
        badResources.push({
          ...resource,
          errorReason: '未发行',
        });
        continue;
      }
      if (d.status === 2) {
        badResources.push({
          ...resource,
          errorReason: '已封禁',
        });
        continue;
      }
      if (d.status === 4) {
        badResources.push({
          ...resource,
          errorReason: '未上架',
        });
        continue;
      }
      if (d.baseUpcastResources.length > 0) {
        badResources.push({
          ...resource,
          errorReason: '暂不支持包含依赖的资源',
        });
        continue;
      }

      // console.log(data_batchInfo, 'datawsedfjsldkjflksdjflkjlk');

      const { data: data_versionList }: {
        data: {
          dependencies: any[];
        }[];
      } = await FServiceAPI.Resource.getVersionList({
        versionIds: d.resourceVersions[d.resourceVersions.length - 1].versionId,
      });

      // console.log(data_versionList, 'data_versionList sdifj;lsdkjflkdsjlkfjlksdj');

      if (data_versionList[0].dependencies.length > 0) {
        badResources.push({
          ...resource,
          errorReason: '暂不支持包含依赖的资源',
        });
        continue;
      }

      if (get$selectNodeID()) {
        const { data: data_exhibit }: {
          data: number | {};
        } = await FServiceAPI.Exhibit.presentableDetails({
          resourceId: d.resourceId,
          nodeId: get$selectNodeID() || -1,
        });

        if (data_exhibit) {
          badResources.push({
            ...resource,
            errorReason: '已签约',
          });
          continue;
        }
      }
      goodResources.push(resource);
    }

    set$goodResources(goodResources);
    set$badResources(badResources);
  }

  return (<FDrawer
    title={'添加至节点'}
    open={$open}
    topRight={<Space size={30}>
      <FComponentsLib.FTextBtn
        type='default'
        onClick={() => {
          set$open(false);
        }}
      >取消</FComponentsLib.FTextBtn>

      <FComponentsLib.FRectBtn
        disabled={!$selectNodeID || $goodResources.length === 0}
        type='primary'
        onClick={async () => {
          const { ret, errCode, data, msg }: {
            ret: number;
            errCode: number;
            data: {
              [resourceID: string]: {
                status: 1 | 2, data: string;
              }
            };
            msg: string;
          } = await FServiceAPI.Exhibit.batchCreatePresentable({
            nodeId: get$selectNodeID() || -1,
            // @ts-ignore
            resources: get$goodResources().map((r) => {
              return {
                resourceId: r.resourceID,
                policyId: !!r.selectedPolicy ? r.selectedPolicy.policyID : undefined,
              };
            }),
          });

          if (ret !== 0 || errCode !== 0) {
            fCenterMessage({ message: msg });
            set$open(false);
            return;
          }

          // console.log(data, 'data sdifj;sldkfjlksdjfljiowejflksdjflkjsdlfkjl');
          onOk && onOk({
            nodeID: get$selectNodeID() || -1,
            allIsTheme: get$goodResources().every((r) => {
              return r.resourceType.includes('主题');
            }),
          });

          if (Object.values(data).some((v) => {
            return v.status === 2;
          })) {
            fCenterMessage({ message: '资源状态异常，无法添加' });
          }

          set$open(false);
        }}
      >确定</FComponentsLib.FRectBtn>
    </Space>}
    afterOpenChange={(v) => {
      if (!v) {
        onClose && onClose();
      }
    }}
  >
    <div style={{ position: 'relative' }}>
      {/*<FComponentsLib.FTitleText text={'选择节点'} type={'h3'} />*/}
      <FComponentsLib.FTitleText
        text={FI18n.i18nNext.t('addresourcetonode_addtonode_selectnode')}
        type={'h3'}
      />
      <div style={{ height: 10 }} />
      {
        $nodeOptions.length === 0
          ? (<div className={styles.nodeSelector}>
            <Space size={10}>
              <span className={styles.nodeSelectorLabel}>您还没有创建节点</span>
              <FComponentsLib.FTextBtn
                type='primary'
                onClick={() => {
                  self.open(FUtil.LinkTo.nodeCreator());
                }}>创建节点</FComponentsLib.FTextBtn>
            </Space>
          </div>)
          : (<Select
            value={$selectNodeID}
            placeholder={'选择签约的节点'}
            style={{ width: '100%', height: 38, borderRadius: 4 }}
            onChange={(value) => {
              set$selectNodeID(value);
              handleResource();
            }}
            options={$nodeOptions}
            dropdownRender={(menu) => (
              <>
                {menu}
                {/*<Divider style={{ margin: '8px 0' }} />*/}
                <a
                  href={FUtil.LinkTo.nodeCreator()}
                  className={styles.newButton}
                  target={'_blank'}
                >
                  <Space size={10}>
                    <FComponentsLib.FIcons.FPlus style={{ fontSize: 14 }} />
                    <span>创建节点</span>
                  </Space>
                </a>
              </>
            )}
          />)
      }

      {
        $goodResources.length > 0 && (<>
          <div style={{ height: 30 }} />
          <Space size={5}>
            {/*<FComponentsLib.FTitleText text={'确认资源及策略'} type={'h3'} />*/}
            <FComponentsLib.FTitleText text={FI18n.i18nNext.t('addresourcetonode_addtonode_resources')} type={'h3'} />

            <FTooltip title={FI18n.i18nNext.tJSXElement('addresourcetonode_addtonode_resources_info')}>
              <div style={{ cursor: 'pointer' }}>
                <FComponentsLib.FIcons.FInfo style={{ fontSize: 14 }} />
              </div>
            </FTooltip>
          </Space>
          <div style={{ height: 10 }} />
          <Space size={10} direction={'vertical'} style={{ width: '100%' }}>
            {
              $goodResources.map((r) => {
                return (<div className={styles.resourceItem} key={r.resourceID}>
                  <FCoverImage
                    src={r.cover}
                    width={104}
                    style={{ borderRadius: 4 }}
                  />
                  <div>
                    <FComponentsLib.FTitleText
                      type={'h3'}
                      text={r.resourceTitle || r.resourceName}
                    />
                    <div style={{ height: 7 }} />
                    <FComponentsLib.FContentText
                      type={'additional2'}
                      text={`资源类型 ${r.resourceType.join('/')}｜更新时间 ${r.updateTime}`}
                    />
                    <div style={{ height: 7 }} />
                    <Space size={20}>
                      <label className={styles.policyLabel}>
                        <FComponentsLib.FIcons.FPolicy style={{ fontSize: 12 }} />
                        {
                          r.selectedPolicy && (<span>{r.selectedPolicy.policyName}</span>)
                        }
                        {/*{*/}
                        {/*  r.addPolicy && (<span>{r.addPolicy.title}</span>)*/}
                        {/*}*/}
                        {
                          !r.selectedPolicy && (<span>永久免费</span>)
                        }

                      </label>
                      <FComponentsLib.FTextBtn
                        type={'primary'}
                        style={{ fontSize: 12 }}
                        onClick={() => {
                          set$selectingPolicyResourceID(r.resourceID);
                        }}
                      >更换授权策略</FComponentsLib.FTextBtn>
                    </Space>

                  </div>
                </div>);
              })
            }
          </Space>
        </>)
      }

      {
        $badResources.length > 0 && (<>
          <div style={{ height: 30 }} />
          <FComponentsLib.FTitleText
            text={FI18n.i18nNext.t('addresourcetonode_addtonode_list_error')}
            type={'h3'}
          />
          <div style={{ height: 10 }} />
          <Space size={10} direction={'vertical'} style={{ width: '100%' }}>
            {
              $badResources.map((r) => {
                return (<div className={styles.resourceItem} key={r.resourceID}>
                  <FCoverImage
                    src={r.cover}
                    width={104}
                    style={{ borderRadius: 4 }}
                  />
                  <div style={{ width: 350 }}>
                    <FComponentsLib.FTitleText
                      type={'h3'}
                      text={r.resourceTitle || r.resourceName}
                      style={{ maxWidth: 350 }}
                      singleRow={true}
                    />
                    <div style={{ height: 10 }} />
                    <FComponentsLib.FContentText
                      type={'additional2'}
                      text={`资源类型 ${r.resourceType.join('/')}｜更新时间 ${r.updateTime}`}
                    />
                  </div>
                  <div className={styles.resourceItemError}>{r.errorReason}</div>
                </div>);
              })
            }
          </Space>
        </>)
      }

      <div style={{ height: 100 }} />

      {
        $badResources.length > 0 && (<div className={styles.tip}>
          <FComponentsLib.FIcons.FExclamation
            style={{
              fontSize: 16,
              color: '#E9A923',
            }}
          />
          <span>已选择的资源中，部分资源无法自动签约，但不影响其他资源签约</span>
        </div>)
      }

    </div>

    <SelectPolicyDrawer
      resourceID={$selectingPolicyResourceID}
      onCancel={() => {
        set$selectingPolicyResourceID('');
      }}
      onSelected={(value) => {
        set$goodResources(get$goodResources().map((resource) => {
          if (get$selectingPolicyResourceID() !== resource.resourceID) {
            return resource;
          }
          return {
            ...resource,
            selectedPolicy: value,
            addPolicy: null,
          };
        }));
        set$selectingPolicyResourceID('');
      }}
    />
  </FDrawer>);
}

export default FSignResourceToNodeDrawer;

interface SelectPolicyDrawerProps {
  resourceID: string;

  onSelected?(value: {
    policyID: string;
    policyName: string;
  }): void;

  onCancel?(): void;
}

function SelectPolicyDrawer({ resourceID, onSelected, onCancel }: SelectPolicyDrawerProps) {

  const [$policyFullInfo, set$policyFullInfo, get$policyFullInfo] = FUtil.Hook.useGetState<PolicyFullInfo_Type[]>([]);

  async function handleData() {
    const { data } = await FServiceAPI.Resource.info({
      resourceIdOrName: resourceID,
      isLoadPolicyInfo: 1,
      isTranslate: 1,
    });
    // console.log(data, 'data sdifjl;sdkjfl;ksjdal;kfjsdfikjweo;ikfjlksadjflkj');
    set$policyFullInfo(data.policies as PolicyFullInfo_Type[]);
  }

  async function onAddPolicy() {
    const result = await fPolicyBuilder({
      alreadyUsedTexts: get$policyFullInfo().map((p) => {
        return p.policyText;
      }),
      alreadyUsedTitles: get$policyFullInfo().map((p) => {
        return p.policyName;
      }),
      targetType: 'resource',
    });
    if (!result) {
      return;
    }
    // onAdd && onAdd(result);
    const { ret, errCode, msg, data }: {
      ret: number;
      errCode: number;
      msg: string;
      data: {
        policies: {
          policyId: string;
          policyName: string;
          status: 0 | 1;
        }[];
      }
    } = await FServiceAPI.Resource.update({
      resourceId: resourceID,
      addPolicies: [{
        policyName: result.title,
        policyText: result.text,
        status: 1,
      }],
    });

    if (ret !== 0 || errCode !== 0) {
      fMessage(msg, 'error');
      return;
    }

    const policy = data.policies.find((p) => {
      return p.policyName === result.title;
    });

    if (!policy) {
      return;
    }
    onSelected && onSelected({
      policyID: policy.policyId,
      policyName: policy.policyName,
    });
  }

  return (<FDrawer
    open={resourceID !== ''}
    title={FI18n.i18nNext.t('addresourcetonode_changeauthplan_title')}
    topRight={(<FComponentsLib.FRectBtn
      type={'default'}
      onClick={() => {
        onCancel && onCancel();
      }}
    >取消</FComponentsLib.FRectBtn>)}
    afterOpenChange={(o) => {
      if (o) {
        handleData();
      }
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Space size={5}>
        <FComponentsLib.FIcons.FPolicy style={{ fontSize: 14, color: '#222' }} />
        <FComponentsLib.FContentText type={'additional2'} text={'选择策略'} style={{ color: '#222' }} />
      </Space>
      <Space size={5}>
        <FComponentsLib.FCircleBtn
          type={'primary'}
          size={'small'}
          onClick={() => {
            onAddPolicy();
          }}
        />
        <FComponentsLib.FTextBtn
          type={'primary'}
          onClick={() => {
            onAddPolicy();
          }}
        >新建授权策略</FComponentsLib.FTextBtn>
      </Space>
    </div>
    <div style={{ height: 10 }} />
    <Space size={10} direction={'vertical'} style={{ width: '100%' }}>
      {
        $policyFullInfo.map((p) => {
          return (<div className={styles.policyCard} key={p.policyId}>
            <div className={styles.policyCardTitle}>
              <FComponentsLib.FContentText
                text={p.policyName}
                type={'highlight'}
              />
              <FComponentsLib.FRectBtn
                onClick={() => {
                  onSelected && onSelected({
                    policyID: p.policyId,
                    policyName: p.policyName,
                  });
                }}
              >{FI18n.i18nNext.t('addresourcetonode_changeauthplan_btn_select')}</FComponentsLib.FRectBtn>
            </div>
            <div style={{ height: 25 }} />
            <FPolicyDisplay fullInfo={p} />
          </div>);
        })
      }

    </Space>

  </FDrawer>);
}
