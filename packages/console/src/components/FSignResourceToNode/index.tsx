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

interface FSignResourceToNodeProps {
  resourceIDs: string[];
}

interface FSignResourceToNodeStates {
  goodResources: {
    resourceID: string;
    resourceName: string;
    resourceTitle: string;
    cover: string;
    resourceType: string[];
    updateTime: string;
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

function FSignResourceToNode({ resourceIDs }: FSignResourceToNodeProps) {

  const [$selectNodeID, set$selectNodeID, get$selectNodeID] = FUtil.Hook.useGetState<number | null>(null);
  const [$nodeOptions, set$nodeOptions, get$nodeOptions] = FUtil.Hook.useGetState<{
    value: number;
    label: string;
  }[]>([]);

  const [$goodResources, set$goodResources, get$goodResources] = FUtil.Hook.useGetState<FSignResourceToNodeStates['goodResources']>([]);
  const [$badResources, set$badResources, get$badResources] = FUtil.Hook.useGetState<FSignResourceToNodeStates['badResources']>([]);

  AHooks.useMount(async () => {
    const { data }: {
      data: {
        dataList: {
          nodeDomain: string;
          nodeId: number;
          nodeName: string;
        }[];
      }
    } = await FServiceAPI.Node.nodes({ limit: 100 });
    // console.log(data, 'data sdifj;lsdkjflksdjflkjsdlkjf');
    set$nodeOptions(data.dataList.map((d) => {
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
    const goodResources: FSignResourceToNodeStates['goodResources'] = [];
    const badResources: FSignResourceToNodeStates['badResources'] = [];
    for (const d of data_batchInfo) {
      const resource: FSignResourceToNodeStates['goodResources'][number] = {
        resourceID: d.resourceId,
        resourceName: d.resourceName,
        resourceTitle: d.resourceTitle,
        cover: d.coverImages[0] || '',
        resourceType: d.resourceType,
        updateTime: moment(d.updateDate).format('YYYY-MM-DD'),
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

  }

  return (<FDrawer
    title={'添加至节点'}
    open={true}
    topRight={<Space size={30}>
      <FComponentsLib.FTextBtn
        type='default'
        onClick={() => {
          // onCancel_VersionsDrawer();
        }}
      >取消</FComponentsLib.FTextBtn>

      <FComponentsLib.FRectBtn
        type='primary'
        onClick={() => {
        }}
      >确定</FComponentsLib.FRectBtn>
    </Space>}
    // bodyStyle={{ position: 'relative' }}
  >
    <div style={{position: 'relative'}}>
      {/*<FComponentsLib.FTitleText text={'选择节点'} type={'h3'} />*/}
      <FComponentsLib.FTitleText text={FI18n.i18nNext.t('addresourcetonode_addtonode_selectnode')} type={'h3'} />
      <div style={{ height: 10 }} />
      <Select
        value={$selectNodeID}
        placeholder={'选择签约的节点'}
        style={{ width: '100%', height: 38, borderRadius: 4 }}
        onChange={(value) => {
          set$selectNodeID(value);
        }}
        options={$nodeOptions}
      />
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
        <div className={styles.resourceItem}>
          <FCoverImage
            src={''}
            width={104}
            style={{ borderRadius: 4 }}
          />
          <div>
            <FComponentsLib.FTitleText type={'h3'} text={'jsdesign/如何根据用户行为做预测'} />
            <div style={{ height: 7 }} />
            <FComponentsLib.FContentText type={'additional2'} text={`资源类型xxx｜更新时间xxx`} />
            <div style={{ height: 7 }} />
            <label className={styles.policyLabel}>
              <FComponentsLib.FIcons.FPolicy style={{ fontSize: 12 }} />
              <span>永久免费</span>
            </label>
          </div>
        </div>
        <div className={styles.resourceItem}>
          <FCoverImage
            src={''}
            width={104}
            style={{ borderRadius: 4 }}
          />
          <div>
            <FComponentsLib.FTitleText type={'h3'} text={'jsdesign/如何根据用户行为做预测'} />
            <div style={{ height: 7 }} />
            <FComponentsLib.FContentText type={'additional2'} text={`资源类型xxx｜更新时间xxx`} />
            <div style={{ height: 7 }} />
            <label className={styles.policyLabel}>
              <FComponentsLib.FIcons.FPolicy style={{ fontSize: 12 }} />
              <span>永久免费</span>
            </label>
          </div>
        </div>
      </Space>
      <div style={{ height: 30 }} />
      <FComponentsLib.FTitleText text={FI18n.i18nNext.t('addresourcetonode_addtonode_list_error')} type={'h3'} />
      <div style={{ height: 10 }} />
      <Space size={10} direction={'vertical'} style={{ width: '100%' }}>
        <div className={styles.resourceItem}>
          <FCoverImage
            src={''}
            width={104}
            style={{ borderRadius: 4 }}
          />
          <div style={{ width: 350 }}>
            <FComponentsLib.FTitleText
              type={'h3'}
              text={'jsdesign/如何根据用户行为做预测'}
              style={{ maxWidth: 350 }}
              singleRow={true}
            />
            <div style={{ height: 10 }} />
            <FComponentsLib.FContentText type={'additional2'} text={`资源类型xxx｜更新时间xxx`} />
          </div>
          <div className={styles.resourceItemError}>暂不支持包含依赖的资源</div>
        </div>
        <div className={styles.resourceItem}>
          <FCoverImage
            src={''}
            width={104}
            style={{ borderRadius: 4 }}
          />
          <div style={{ width: 350 }}>
            <FComponentsLib.FTitleText
              type={'h3'}
              text={'jsdesign/如何根据用户行为做预测'}
              style={{ maxWidth: 350 }}
              singleRow={true}
            />
            <div style={{ height: 10 }} />
            <FComponentsLib.FContentText type={'additional2'} text={`资源类型xxx｜更新时间xxx`} />
          </div>
          <div className={styles.resourceItemError}>暂不支持包含依赖的资源</div>
        </div>
      </Space>


      <div className={styles.tip}>

      </div>
    </div>
  </FDrawer>);
}

export default FSignResourceToNode;
