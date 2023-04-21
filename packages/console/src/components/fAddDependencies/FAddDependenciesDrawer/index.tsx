import * as React from 'react';
import styles from './index.less';
import FDrawer from '@/components/FDrawer';
import FDropdownMenu from '@/components/FDropdownMenu';
import FInput from '@/components/FInput';
import FComponentsLib from '@freelog/components-lib';
import FResourceStatusBadge from '@/components/FResourceStatusBadge';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import FListFooter, { listStateAndListMore } from '@/components/FListFooter';
import FLoadingTip from '@/components/FLoadingTip';
import FNoDataTip from '@/components/FNoDataTip';

interface FAddDependenciesDrawerProps {
  resourceTypeCode: string;
  existingResourceIDs: string[];
  baseUpcastResourceIDs: string[];

  onSelect_Resource?(value: { resourceID: string; resourceName: string }): void;

  onDeselect_Resource?(value: {
    resourceID: string;
    resourceName: string;
  }): void;

  onClose?(): void;
}

interface FAddDependenciesDrawerStates {
  visible: boolean;
  selectedResourceIDs: string[];
  resourceFromOptions: {
    text: string;
    value: string;
  }[];
  resourceFrom: 'market' | 'my' | 'favorite';
  searchInput: string;
  resourceList: {
    resourceID: string;
    resourceName: string;
    resourceType: string[];
    updateDate: string;
    state: '' | 'offline' | 'unreleased' | 'freeze';
    waring: '' | 'upcast';
    latestVersion: string;
  }[];
  resourceListState: 'loading' | 'noData' | 'noSearchResult' | 'loaded';
  resourceListMore: 'loading' | 'andMore' | 'noMore';
}

const initStates: FAddDependenciesDrawerStates = {
  visible: true,
  selectedResourceIDs: [],
  resourceFromOptions: [
    { text: '资源市场', value: 'market' },
    { text: '我的资源', value: 'my' },
    { text: '我的收藏', value: 'favorite' },
  ],
  resourceFrom: 'market',
  searchInput: '',
  resourceList: [],
  resourceListState: 'loading',
  resourceListMore: 'loading',
};

function FAddDependenciesDrawer({
                                  resourceTypeCode,
                                  existingResourceIDs,
                                  baseUpcastResourceIDs,
                                  onSelect_Resource,
                                  onDeselect_Resource,
                                  onClose,
                                }: FAddDependenciesDrawerProps) {
  const [visible, set_visible] = React.useState<FAddDependenciesDrawerStates['visible']>(initStates['visible']);
  const [selectedResourceIDs, set_selectedResourceIDs] = React.useState<FAddDependenciesDrawerStates['selectedResourceIDs']>(initStates['selectedResourceIDs']);
  const [resourceFromOptions, set_resourceFromOptions] = React.useState<FAddDependenciesDrawerStates['resourceFromOptions']>(initStates['resourceFromOptions']);
  const [resourceFrom, set_resourceFrom] = React.useState<FAddDependenciesDrawerStates['resourceFrom']>(initStates['resourceFrom']);
  const [searchInput, set_searchInput] = React.useState<FAddDependenciesDrawerStates['searchInput']>(initStates['searchInput']);
  const [resourceList, set_resourceList] = React.useState<FAddDependenciesDrawerStates['resourceList']>(initStates['resourceList']);
  const [resourceListState, set_resourceListState] = React.useState<FAddDependenciesDrawerStates['resourceListState']>(initStates['resourceListState']);
  const [resourceListMore, set_resourceListMore] = React.useState<FAddDependenciesDrawerStates['resourceListMore']>(initStates['resourceListMore']);

  AHooks.useMount(() => {
    set_selectedResourceIDs(existingResourceIDs);
  });

  React.useEffect(() => {
    fetchResourceList(true);
  }, [resourceFrom, searchInput]);

  async function fetchResourceList(restart: boolean = false) {
    let resourceListResult: FAddDependenciesDrawerStates['resourceList'] = [];
    if (!restart) {
      resourceListResult = [...resourceList];
    } else {
      set_resourceListState('loading');
    }
    set_resourceListMore('loading');
    // let dataSource: any;
    if (resourceFrom === 'favorite') {
      const params: Parameters<typeof FServiceAPI.Collection.collectionResources>[0] = {
        skip: resourceListResult.length,
        limit: FUtil.Predefined.pageSize,
        keywords: searchInput,
        resourceTypeCode: resourceTypeCode,
      };
      const {
        data: data_favoriteResources,
      }: {
        data: {
          dataList: {
            resourceId: string;
            resourceName: string;
            resourceType: string[];
            resourceUpdateDate: string;
            resourceStatus: 0 | 1 | 2 | 4;
            latestVersion: string;
          }[];
          totalItem: number;
        };
      } = await FServiceAPI.Collection.collectionResources(params);
      resourceListResult = [
        ...resourceListResult,
        ...data_favoriteResources.dataList.map<FAddDependenciesDrawerStates['resourceList'][number]>((r) => {
          return {
            resourceID: r.resourceId,
            resourceName: r.resourceName,
            resourceType: r.resourceType,
            updateDate: FUtil.Format.formatDateTime(r.resourceUpdateDate, true),
            state: r.resourceStatus === 0
              ? 'unreleased'
              : r.resourceStatus === 2
                ? 'freeze'
                : r.resourceStatus === 4
                  ? 'offline'
                  : '',
            waring: baseUpcastResourceIDs.includes(r.resourceId) ? 'upcast' : '',
            latestVersion: r.latestVersion,
          };
        }),
      ];
      const { state, more } = listStateAndListMore({
        list_Length: resourceListResult.length,
        total_Length: data_favoriteResources.totalItem,
        has_FilterCriteria: searchInput !== '',
      });
      set_resourceList(resourceListResult);
      set_resourceListState(state);
      set_resourceListMore(more);
    } else {
      const params: Parameters<typeof FServiceAPI.Resource.list>[0] = {
        skip: resourceListResult.length,
        limit: FUtil.Predefined.pageSize,
        keywords: searchInput,
        status: resourceFrom === 'my' ? undefined : 1,
        isSelf: resourceFrom === 'my' ? 1 : undefined,
        resourceTypeCode: resourceTypeCode,
      };
      const {
        data: data_list,
      }: {
        data: {
          dataList: {
            resourceId: string;
            resourceName: string;
            resourceType: string[];
            updateDate: string;
            status: 0 | 1 | 2 | 4;
            latestVersion: string;
          }[];
          totalItem: number;
        };
      } = await FServiceAPI.Resource.list(params);
      // console.log(data_list, 'data_listiosjdlfkjsdlfkjsdlkfjlkj###########');
      resourceListResult = [
        ...resourceListResult,
        ...data_list.dataList.map<FAddDependenciesDrawerStates['resourceList'][number]>((r) => {
          // let waring: FAddDependenciesDrawerStates['resourceList'][number]['waring'] = '';
          // if (baseUpcastResourceIDs.includes(r.resourceId)) {
          //   waring = 'upcast';
          // } else if (r.status === 0) {
          //   if (r.latestVersion === '') {
          //     waring = 'unreleased';
          //   } else {
          //     waring = 'offline';
          //   }
          // }
          return {
            resourceID: r.resourceId,
            resourceName: r.resourceName,
            resourceType: r.resourceType,
            updateDate: FUtil.Format.formatDateTime(r.updateDate, true),
            state: r.status === 0
              ? 'unreleased'
              : r.status === 2
                ? 'freeze'
                : r.status === 4
                  ? 'offline'
                  : '',
            waring: baseUpcastResourceIDs.includes(r.resourceId) ? 'upcast' : '',
            latestVersion: r.latestVersion,
          };
        }),
      ];
      const { state, more } = listStateAndListMore({
        list_Length: resourceListResult.length,
        total_Length: data_list.totalItem,
        has_FilterCriteria: searchInput !== '',
      });
      set_resourceList(resourceListResult);
      set_resourceListState(state);
      set_resourceListMore(more);
    }
  }

  console.log(resourceList, 'resourceList98iosedjflksdjflkjsdl');

  return (
    <FDrawer
      open={visible}
      // title={FUtil.I18n.message('add_rely_resource')}
      title={'添加依赖'}
      onClose={() => {
        set_visible(false);
      }}
      afterOpenChange={(o) => {
        if (o) {
        } else {
          onClose && onClose();
        }
      }}
      width={820}
    >
      <div>
        <div className={styles.filter}>
          <div className={styles.filterSelect}>
            <FDropdownMenu
              options={resourceFromOptions}
              text={
                <>
                  {
                    resourceFromOptions.find((i) => {
                      return i.value === resourceFrom;
                    })?.text
                  }
                </>
              }
              onChange={(value) => {
                set_resourceFrom(value as 'my');
              }}
            />
          </div>

          <FInput
            debounce={300}
            onDebounceChange={(value) => {
              set_searchInput(value);
            }}
            value={searchInput}
            className={styles.filterInput}
            theme='dark'
            size='small'
          />
        </div>

        <div style={{ height: 17 }} />
        {resourceListState === 'loading' && <FLoadingTip height={600} />}

        {resourceListState === 'noData' && (
          <FNoDataTip height={600} tipText={'无数据'} />
        )}

        {resourceListState === 'noSearchResult' && (
          <FNoDataTip height={600} tipText={'无搜索结果'} />
        )}
        {/*{console.log(resourceList, 'resourceListiosdjflksdjflkj')}*/}
        {resourceListState === 'loaded' &&
        resourceList.map((resource) => {
          return (
            <div className={styles.bucket} key={resource.resourceID}>
              <div>
                <div className={styles.title}>
                  <div>
                    <FComponentsLib.FContentText
                      singleRow={true}
                      text={resource.resourceName}
                    />
                  </div>
                  {
                    resource.state === 'offline' && (<FResourceStatusBadge
                      status={'offline'}
                    />)
                  }
                  {
                    resource.state === 'unreleased' && (<FResourceStatusBadge
                      status={'unreleased'}
                    />)
                  }
                  {
                    resource.state === 'freeze' && (<FResourceStatusBadge
                      status={'freeze'}
                    />)
                  }
                  {
                    resource.waring === 'upcast' && (<label
                      style={{
                        color: '#EE4040',
                        backgroundColor: '#FDEBEC',
                        // border: '1px solid #F2C9CC',
                        fontSize: 12,
                        fontWeight: 600,
                        lineHeight: '17px',
                        padding: '3px 5px',
                        borderRadius: 4,
                      }}
                    >{FI18n.i18nNext.t('addrely_label_basicupcast')}</label>)
                  }
                </div>
                <div style={{ height: 2 }} />
                <FComponentsLib.FContentText
                  type={'additional2'}
                  text={
                    (resource.resourceType.length > 0
                      ? `资源类型 ${FUtil.Format.resourceTypeKeyArrToResourceType(
                        resource.resourceType,
                      )}`
                      : '未设置类型') + ` | 更新时间 ${resource.updateDate}`
                  }
                />
              </div>
              {!selectedResourceIDs.includes(resource.resourceID) ? (
                <FComponentsLib.FRectBtn
                  type='secondary'
                  size='small'
                  onClick={() => {
                    onSelect_Resource &&
                    onSelect_Resource({
                      resourceID: resource.resourceID,
                      resourceName: resource.resourceName,
                    });
                    set_selectedResourceIDs([
                      ...selectedResourceIDs,
                      resource.resourceID,
                    ]);
                  }}
                  // disabled={!resource.latestVersion || disabledIDsOrNames?.includes(i.title) || disabledIDsOrNames?.includes(i.id)}
                >
                  选择
                </FComponentsLib.FRectBtn>
              ) : (
                <FComponentsLib.FRectBtn
                  type='danger2'
                  size='small'
                  onClick={() => {
                    onDeselect_Resource &&
                    onDeselect_Resource({
                      resourceID: resource.resourceID,
                      resourceName: resource.resourceName,
                    });
                    set_selectedResourceIDs(
                      selectedResourceIDs.filter((rid) => {
                        return rid !== resource.resourceID;
                      }),
                    );
                  }}
                  // disabled={selectedResourceIDs.includes(resource.resourceID)}
                >
                  移除
                </FComponentsLib.FRectBtn>
              )}
            </div>
          );
        })}
      </div>
      <FListFooter
        state={resourceListMore}
        onClickLoadMore={async () => {
          await fetchResourceList(false);
        }}
      />
    </FDrawer>
  );
}

export default FAddDependenciesDrawer;
