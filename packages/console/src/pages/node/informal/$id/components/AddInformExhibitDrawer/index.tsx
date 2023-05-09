import * as React from 'react';
import { Space } from 'antd';
import styles from './index.less';
import FInput from '@/components/FInput';
import FCheckbox from '@/components/FCheckbox';
import FResourceStatusBadge from '@/components/FResourceStatusBadge';
import FDrawer from '@/components/FDrawer';
import FTooltip from '@/components/FTooltip';
import FListFooter, { listStateAndListMore } from '@/components/FListFooter';
import { FServiceAPI, FUtil, FI18n } from '@freelog/tools-lib';
import FNoDataTip from '@/components/FNoDataTip';
import FLoadingTip from '@/components/FLoadingTip';
import FDropdownMenu from '@/components/FDropdownMenu';
import FComponentsLib from '@freelog/components-lib';

interface FAddInformExhibitDrawerProps {
  visible: boolean;
  isTheme: boolean;
  nodeID: number;

  onConfirmResources?(resourceNames: string[]): void;

  onConfirmObjects?(objectNames: string[]): void;

  onCancel?(): void;
}

interface FAddInformExhibitDrawerStates {
  activatedTab: 'market' | 'resource' | 'collection' | 'object';

  bucketOptions: { value: string; text: string }[];
  selectedBucket: string;

  inputValue: string;
  list: {
    id: string;
    disabled: boolean;
    disabledReason: string;
    checked: boolean;
    name: string;
    identity: 'resource' | 'object';
    type: string[];
    updateTime: string;
    status: 'online' | 'offline' | 'unreleased' | '';
  }[];
  list_State: 'loading' | 'noData' | 'noSearchResult' | 'loaded';
  list_More: 'loading' | 'andMore' | 'noMore';
}

const initStates: FAddInformExhibitDrawerStates = {
  activatedTab: 'market',

  bucketOptions: [],
  selectedBucket: '',
  inputValue: '',
  list: [],
  list_State: 'loading',
  list_More: 'loading',
};

function FAddInformExhibitDrawer({
                                   visible,
                                   isTheme,
                                   nodeID,
                                   // usedResourceNames,
                                   // usedObjectNames,
                                   onCancel,
                                   onConfirmResources,
                                   onConfirmObjects,
                                 }: FAddInformExhibitDrawerProps) {

  const containerRef = React.useRef<any>(null);

  const [activatedTab, setActivatedTab] = React.useState<FAddInformExhibitDrawerStates['activatedTab']>(initStates['activatedTab']);
  const [bucketOptions, setBucketOptions] = React.useState<FAddInformExhibitDrawerStates['bucketOptions']>(initStates['bucketOptions']);
  const [selectedBucket, setSelectedBucket] = React.useState<FAddInformExhibitDrawerStates['selectedBucket']>(initStates['selectedBucket']);
  const [inputValue, setInputValue] = React.useState<FAddInformExhibitDrawerStates['inputValue']>(initStates['inputValue']);
  const [list, setList] = React.useState<FAddInformExhibitDrawerStates['list']>(initStates['list']);
  const [list_State, setList_State] = React.useState<FAddInformExhibitDrawerStates['list_State']>(initStates['list_State']);
  const [list_More, setList_More] = React.useState<FAddInformExhibitDrawerStates['list_More']>(initStates['list_More']);

  async function fetchList(payload: {
    origin?: FAddInformExhibitDrawerStates['activatedTab'],
    bucket?: FAddInformExhibitDrawerStates['selectedBucket'],
    keywords?: FAddInformExhibitDrawerStates['inputValue'],
    loadMore: boolean;
  }) {
    let formerList: FAddInformExhibitDrawerStates['list'] = [];
    if (!payload.loadMore) {
      setList_State('loading');
    } else {
      formerList = list;
      setList_More('loading');
    }
    const params: HandleListParams = {
      isTheme: isTheme,
      nodeID: nodeID,
      origin: activatedTab,
      bucket: selectedBucket,
      keywords: inputValue,
      skip: formerList.length,
      ...payload,
    };

    const { list: resultList, totalItem } = await handleList(params);
    const finalList: FAddInformExhibitDrawerStates['list'] = [
      ...formerList,
      ...resultList,
    ];
    setList(finalList);
    // console.log(finalList, 'finalListfinalList0923u4po');
    const { more: list_More, state: list_State } = listStateAndListMore({
      has_FilterCriteria: params.origin === 'object' || params.keywords !== '',
      list_Length: finalList.length,
      total_Length: totalItem,
    });
    setList_State(list_State);
    setList_More(list_More);
  }

  async function fetchBucket() {
    const params: Parameters<typeof FServiceAPI.Storage.bucketList>[0] = {
      bucketType: 1,
    };

    const { data } = await FServiceAPI.Storage.bucketList(params);
    // console.log(data, 'data0923j4kljl');
    if (data.length === 0) {
      setBucketOptions([]);
    } else {
      setBucketOptions((data as any[]).map<FAddInformExhibitDrawerStates['bucketOptions'][number]>((d: any) => {
        return {
          value: d.bucketName,
          text: d.bucketName,
        };
      }));
      setSelectedBucket(data[0].bucketName);
    }

  }

  function onChange_DrawerVisible(visible: boolean) {
    if (!visible) {
      // setTabsOptions(initStates['tabsOptions']);
      setActivatedTab(initStates['activatedTab']);
      setBucketOptions(initStates['bucketOptions']);
      setSelectedBucket(initStates['selectedBucket']);
      setInputValue(initStates['inputValue']);
      setList(initStates['list']);
      setList_State(initStates['list_State']);
      setList_More(initStates['list_More']);
    } else {
      fetchList({
        loadMore: false,
      });
      fetchBucket();
    }
  }

  function onConfirm_Drawer() {
    if (activatedTab === 'object') {
      onConfirmObjects && onConfirmObjects(list.filter((l) => l.checked).map((l) => l.name));
    } else {
      onConfirmResources && onConfirmResources(list.filter((l) => l.checked).map((l) => l.name));
    }
  }

  function onChange_Tabs(value: FAddInformExhibitDrawerStates['activatedTab']) {
    setInputValue('');
    setActivatedTab(value);
    setSelectedBucket(bucketOptions.length > 0 ? bucketOptions[0].value : '');

    if (value === 'object' && bucketOptions.length === 0) {
      setList([]);
      setList_State('noData');
      setList_More('noMore');
    } else {
      fetchList({
        origin: value,
        loadMore: false,
        keywords: '',
      });
    }

  }

  function onChange_Input(value: string) {
    setInputValue(value);
    fetchList({
      loadMore: false,
      keywords: value,
    });
  }

  function onChange_BucketSelect(value: string) {
    fetchList({
      bucket: value,
      loadMore: false,
    });
  }

  function onChange_ListChecked(name: string, checked: boolean) {
    setList(list.map((l) => {
      if (name !== l.name) {
        return l;
      }
      return {
        ...l,
        checked,
      };
    }));
  }

  return (<FDrawer
    title={isTheme ? FI18n.i18nNext.t('import_test_theme') : '添加测试展品'}
    open={visible}
    topRight={<Space size={30}>
      <FComponentsLib.FTextBtn
        type='default'
        onClick={() => {

          onCancel && onCancel();
        }}
      >取消</FComponentsLib.FTextBtn>
      <FComponentsLib.FRectBtn
        disabled={!list.some((l) => l.checked)}
        onClick={onConfirm_Drawer}
        type='primary'
      >添加</FComponentsLib.FRectBtn>
    </Space>}
    afterOpenChange={onChange_DrawerVisible}
  >
    <div ref={containerRef} className={styles.container}>
      <div className={styles.tabs}>
        <a
          className={activatedTab === 'market' ? styles.active : ''}
          onClick={() => {
            onChange_Tabs('market');
          }}
        >资源市场</a>
        <div style={{ width: 30 }} />
        <a
          className={activatedTab === 'resource' ? styles.active : ''}
          onClick={() => {
            onChange_Tabs('resource');
          }}
        >我的资源</a>
        <div style={{ width: 30 }} />
        <a
          className={activatedTab === 'collection' ? styles.active : ''}
          onClick={() => {
            onChange_Tabs('collection');
          }}
        >我的收藏</a>
        {
          bucketOptions.length > 0 && (<>
            <div style={{ width: 30 }} />
            <a
              className={activatedTab === 'object' ? styles.active : ''}
              onClick={() => {
                onChange_Tabs('object');
              }}
            >存储空间</a>
          </>)
        }

      </div>
      {
        list_State === 'noData'
          ? (<FNoDataTip
            height={'calc(100vh - 150px)'}
            tipText={'无数据'}
          />)
          : (<>
            <div style={{ height: 20 }} />
            {
              activatedTab === 'object'
                ? (<div className={styles.filter}>
                  <div>
                    <FDropdownMenu
                      options={bucketOptions}
                      text={selectedBucket}
                      onChange={(value) => {
                        onChange_BucketSelect(value);
                      }}
                    />
                  </div>
                  <FInput
                    value={inputValue}
                    debounce={300}
                    onDebounceChange={onChange_Input}
                    theme='dark'
                    className={styles.filterInput}
                    wrapClassName={styles.filterInput}
                  />
                </div>)
                : (<div className={styles.filter}>
                  <FInput
                    value={inputValue}
                    debounce={300}
                    onDebounceChange={onChange_Input}
                    theme='dark'
                    className={styles.filterInput1}
                    wrapClassName={styles.filterInput1}
                  />
                </div>)
            }

            <div style={{ height: 15 }} />
            {
              list_State === 'noSearchResult' && (<FNoDataTip
                height={'calc(100vh - 210px)'}
                tipText={'无搜索结果'}
              />)
            }

            {
              list_State === 'loading' && (<FLoadingTip height={'calc(100vh - 300px)'} />)
            }

            {
              list_State === 'loaded' && (<>
                <div className={styles.list}>
                  {
                    list.map((l, i, arr) => {
                      return (<div key={l.id} className={styles.item}>
                        <FTooltip
                          title={l.disabledReason}
                          getPopupContainer={() => containerRef.current}
                          trigger='hover'
                          open={l.disabled ? undefined : false}
                        >
                          <div>
                            <FCheckbox
                              checked={l.checked}
                              disabled={l.disabled}
                              onChange={(e) => {
                                onChange_ListChecked(l.name, e.target.checked);
                              }}
                            />
                          </div>
                        </FTooltip>

                        <div style={{ width: 15 }} />
                        <div className={styles.itemContent}>
                          <div className={styles.itemName}>
                            <FComponentsLib.FContentText
                              singleRow
                              text={l.name}
                            />
                            <div style={{ width: 5 }} />
                            {!l.disabledReason && l.status && <FResourceStatusBadge status={l.status} />}
                            {l.disabledReason && <label className={styles.itemNameLabel}>{l.disabledReason}</label>}
                          </div>
                          <div style={{ height: 2 }} />
                          <FComponentsLib.FContentText
                            text={(l.type.length > 0 ? `资源类型 ${FUtil.Format.resourceTypeKeyArrToResourceType(l.type)}` : '未设置类型') + ` | 更新时间 ${l.updateTime}`}
                            type='additional2'
                          />
                        </div>
                      </div>);
                    })
                  }
                </div>

                <FListFooter
                  state={list_More}
                  onClickLoadMore={() => {
                    fetchList({ loadMore: true });
                  }}
                />
              </>)
            }

          </>)
      }
    </div>
  </FDrawer>);
}

export default FAddInformExhibitDrawer;

interface HandleListParams {
  isTheme: boolean;
  nodeID: number;
  origin: FAddInformExhibitDrawerStates['activatedTab'];
  bucket: string;
  keywords: string;
  skip: number;
}

async function handleList(payload: HandleListParams): Promise<{
  list: FAddInformExhibitDrawerStates['list'];
  totalItem: number;
}> {

  let list: FAddInformExhibitDrawerStates['list'] = [];
  let totalItem: number = 0;
  if (payload.origin === 'market') {
    const params: Parameters<typeof FServiceAPI.Resource.list>[0] = {
      skip: payload.skip,
      limit: FUtil.Predefined.pageSize,
      omitResourceType: payload.isTheme ? undefined : '主题',
      resourceType: payload.isTheme ? '主题' : undefined,
      keywords: payload.keywords,
      status: 1,
    };
    // console.log(params, 'paramsparams1234');
    const { data }: { data: any } = await FServiceAPI.Resource.list(params);
    // console.log(data, 'data!~!@#$@!#$@#!411111');

    const params1: Parameters<typeof getUsedTargetIDs>[0] = {
      nodeID: payload.nodeID,
      entityType: 'resource',
      entityIDs: data.dataList.map((dl: any) => {
        return dl.resourceId;
      }),
    };

    const usedResourceIDs: string[] = await getUsedTargetIDs(params1);

    // console.log(usedResourceID, 'usedResourceID!!!!@@@222222222');

    totalItem = data.totalItem;
    list = (data.dataList as any[])
      // .filter((rs) => {
      //   return !inherentIDs.includes(rs.resourceId);
      // })
      .map<FAddInformExhibitDrawerStates['list'][number]>((rs) => {
        // console.log(rs, 'rs!!!!@#$23423423423');

        let disabled: boolean = false;
        let disabledReason: string = '';

        if (usedResourceIDs.includes(rs.resourceId)) {
          disabled = true;
          disabledReason = FI18n.i18nNext.t('tag_added');
        }

        return {
          id: rs.resourceId,
          disabled,
          disabledReason,
          checked: false,
          identity: 'resource',
          name: rs.resourceName,
          type: rs.resourceType,
          updateTime: FUtil.Format.formatDateTime(rs.updateDate),
          status: rs.status === 1 ? '' : (rs.latestVersion ? 'offline' : 'unreleased'),
        };
      });

  } else if (payload.origin === 'resource') {

    const params: Parameters<typeof FServiceAPI.Resource.list>[0] = {
      skip: payload.skip,
      limit: FUtil.Predefined.pageSize,
      isSelf: 1,
      omitResourceType: payload.isTheme ? undefined : '主题',
      resourceType: payload.isTheme ? '主题' : undefined,
      keywords: payload.keywords,
    };
    // console.log(params, 'paramsparams1234');
    const { data }: { data: any } = await FServiceAPI.Resource.list(params);
    // console.log(data, 'data13453');

    const params1: Parameters<typeof getUsedTargetIDs>[0] = {
      nodeID: payload.nodeID,
      entityType: 'resource',
      entityIDs: data.dataList.map((dl: any) => {
        return dl.resourceId;
      }),
    };
    //
    const usedResourceIDs: string[] = await getUsedTargetIDs(params1);
    totalItem = data.totalItem;
    list = (data.dataList as any[])
      // .filter((rs) => {
      //   return !inherentIDs.includes(rs.resourceId);
      // })
      .map<FAddInformExhibitDrawerStates['list'][number]>((rs) => {
        let disabled: boolean = false;
        let disabledReason: string = '';

        if (usedResourceIDs.includes(rs.resourceId)) {
          disabled = true;
          // disabledReason = '已被使用';
          disabledReason = FI18n.i18nNext.t('tag_added');
        } else if (rs.latestVersion === '') {
          disabled = true;
          disabledReason = FI18n.i18nNext.t('alarm_resource_unreleased ');
        }
        return {
          id: rs.resourceId,
          disabled,
          disabledReason,
          checked: false,
          identity: 'resource',
          name: rs.resourceName,
          type: rs.resourceType,
          updateTime: FUtil.Format.formatDateTime(rs.updateDate),
          status: rs.status === 1 ? '' : (rs.latestVersion ? 'offline' : 'unreleased'),
        };
      });

  } else if (payload.origin === 'collection') {

    const params: Parameters<typeof FServiceAPI.Collection.collectionResources>[0] = {
      skip: payload.skip,
      limit: FUtil.Predefined.pageSize,
      keywords: payload.keywords,
      omitResourceType: payload.isTheme ? undefined : '主题',
      resourceType: payload.isTheme ? '主题' : undefined,
    };

    const { data } = await FServiceAPI.Collection.collectionResources(params);
    // console.log(data, '@@@@@@ASEDFSADF');

    const params1: Parameters<typeof getUsedTargetIDs>[0] = {
      nodeID: payload.nodeID,
      entityType: 'resource',
      entityIDs: data.dataList.map((dl: any) => {
        return dl.resourceId;
      }),
    };
    //
    const usedResourceIDs: string[] = await getUsedTargetIDs(params1);
    totalItem = data.totalItem;
    list = (data.dataList as any[])
      // .filter((rs) => {
      //   return !inherentIDs.includes(rs.resourceId);
      // })
      .map<FAddInformExhibitDrawerStates['list'][number]>((rs) => {

        let disabled: boolean = false;
        let disabledReason: string = '';

        if (usedResourceIDs.includes(rs.resourceId)) {
          disabled = true;
          // disabledReason = '已被使用';
          disabledReason = FI18n.i18nNext.t('tag_added');
        } else if (rs.latestVersion === '') {
          disabled = true;
          disabledReason = FI18n.i18nNext.t('alarm_resource_unreleased ');
        }

        return {
          id: rs.resourceId,
          disabled,
          disabledReason,
          checked: false,
          identity: 'resource',
          name: rs.resourceName,
          type: rs.resourceType,
          updateTime: FUtil.Format.formatDateTime(rs.updateDate),
          status: rs.resourceStatus === 1 ? '' : (rs.latestVersion ? 'offline' : 'unreleased'),
        };
      });

  } else {

    const params: Parameters<typeof FServiceAPI.Storage.objectList>[0] = {
      skip: payload.skip,
      limit: FUtil.Predefined.pageSize,
      bucketName: payload.bucket,
      keywords: payload.keywords,
      isLoadingTypeless: 0,
      omitResourceType: payload.isTheme ? undefined : '主题',
      resourceType: payload.isTheme ? '主题' : undefined,
    };

    const { data } = await FServiceAPI.Storage.objectList(params);

    const params1: Parameters<typeof getUsedTargetIDs>[0] = {
      nodeID: payload.nodeID,
      entityType: 'object',
      entityIDs: data.dataList.map((dl: any) => {
        return dl.objectId;
      }),
    };

    const usedObjectIDs: string[] = await getUsedTargetIDs(params1);

    // console.log(data, 'dat903jlskdfjlka@#$#');
    if (!data) {
      totalItem = 0;
      list = [];
    } else {
      totalItem = data.totalItem;
      list = (data.dataList as any[])
        // .filter((ob) => {
        //   return !inherentIDs.includes(ob.objectId);
        // })
        .map<FAddInformExhibitDrawerStates['list'][number]>((ob) => {
          // console.log(ob, 'ob!!@#$@#$@#$!@#$21342134');
          const objectName: string = ob.bucketName + '/' + ob.objectName;
          // console.log(objectName, addInformExhibitDrawer.disabledObjectNames, '##7908-2-34jokdsafhkl#-=##');
          let disabled: boolean = false;
          let disabledReason: string = '';

          if (usedObjectIDs.includes(ob.objectId)) {
            disabled = true;
            // disabledReason = '已被使用';
            disabledReason = FI18n.i18nNext.t('tag_added');
          } else if (ob.resourceType.length === 0) {
            disabled = true;
            disabledReason = FI18n.i18nNext.t('msg_set_resource_type');
          }

          return {
            id: ob.objectId,
            disabled,
            disabledReason,
            checked: false,
            identity: 'object',
            name: objectName,
            type: ob.resourceType,
            updateTime: FUtil.Format.formatDateTime(ob.updateDate),
            status: '',
          };
        });
    }

  }

  return {
    list,
    totalItem,
  };
}

interface GetUsedTargetIDsParams {
  nodeID: number;
  entityType: 'resource' | 'object';
  entityIDs: string[];
}

async function getUsedTargetIDs({ nodeID, entityType, entityIDs }: GetUsedTargetIDsParams): Promise<string[]> {
  // console.log(entityNames, 'entityNames24234234234');
  if (entityIDs.length === 0) {
    return [];
  }

  // console.log(entityNames.length, 'entityNames9023j4lk23qjlk');

  const params1: Parameters<typeof FServiceAPI.InformalNode.batchTestResources>[0] = {
    nodeId: nodeID,
    entityType: entityType,
    entityIds: entityIDs.join(),
  };

  const { data } = await FServiceAPI.InformalNode.batchTestResources(params1);

  // console.log(data, 'data98jhksjkdaf13453########');
  return (data as any[]).map<string>((d1: any) => {
    return d1.originInfo.id;
  });
}



