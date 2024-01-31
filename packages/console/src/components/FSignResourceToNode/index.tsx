import * as React from 'react';
import styles from './index.less';
import { Select, Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import FDrawer from '@/components/FDrawer';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import FTooltip from '@/components/FTooltip';
import FCoverImage from '@/components/FCoverImage';

interface FSignResourceToNodeProps {
  resourceIDs: string[];
}

function FSignResourceToNode({ resourceIDs }: FSignResourceToNodeProps) {

  const [$selectNodeID, set$selectNodeID, get$selectNodeID] = FUtil.Hook.useGetState<number | null>(null);
  const [$nodeOptions, set$nodeOptions, get$nodeOptions] = FUtil.Hook.useGetState<{
    value: number;
    label: string;
  }[]>([]);

  const [$goodResources, set$goodResources, get$goodResources] = FUtil.Hook.useGetState<{
    resourceID: string;
    resourceName: string;
    resourceTitle: string;
    cover: string;
    resourceType: string[];
    updateTime: string;
  }[]>([]);
  const [$badResources, set$badResources, get$badResources] = FUtil.Hook.useGetState<{
    resourceID: string;
    resourceName: string;
    resourceTitle: string;
    cover: string;
    resourceType: string[];
    updateTime: string;
  }[]>([]);

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
    const { data } = await FServiceAPI.Resource.batchInfo({
      resourceIds: resourceIDs.join(','),
    });


    console.log(data, 'datawsedfjsldkjflksdjflkjlk');
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
  >
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
  </FDrawer>);
}

export default FSignResourceToNode;
