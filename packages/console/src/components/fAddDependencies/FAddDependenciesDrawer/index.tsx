import * as React from 'react';
import styles from './index.less';
import FDrawer from '@/components/FDrawer';
import Market from '@/pages/resource/version/creator/$id/FDepPanel/Market';
import FDropdownMenu from '@/components/FDropdownMenu';
import FInput from '@/components/FInput';
import FComponentsLib from '@freelog/components-lib';
import FResourceStatusBadge from '@/components/FResourceStatusBadge';
import { FServiceAPI, FUtil } from '../../../../../@freelog/tools-lib';
import { ResourceDepSelectorModelState } from '@/models/resourceDepSelector';
import * as AHooks from 'ahooks';

interface FAddDependenciesDrawerProps {
  existingResourceIDs: string[];
  baseUpcastResourceIDs: string[];

  onSelect_Resource?(value: {
    resourceID: string;
    resourceNme: string;
  }): void;

  onDeselect_Resource?(value: {
    resourceID: string;
    resourceNme: string;
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
    status: 'online' | 'offline';
    latestVersion: string;
  }[];
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
};

function FAddDependenciesDrawer({
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

  AHooks.useMount(() => {
    set_selectedResourceIDs(existingResourceIDs);
  });

  React.useEffect(() => {
    fetchResourceList();
  }, [resourceFrom, searchInput]);

  async function fetchResourceList() {
    let resourceList: FAddDependenciesDrawerStates['resourceList'] = [];
    // if (!payload) {
    //   resourceList = resourceDepSelector.resourceList;
    // }
    // let dataSource: any;
    if (resourceFrom === 'favorite') {
      const params: Parameters<typeof FServiceAPI.Collection.collectionResources>[0] = {
        skip: resourceList.length,
        limit: FUtil.Predefined.pageSize,
        keywords: searchInput,
      };
      const { data: data_favoriteResources }: {
        data: {
          dataList: {
            resourceId: string;
            resourceName: string;
            resourceType: string[];
            updateDate: string;
            status: 0 | 1;
            latestVersion: 0 | 1;
          }[];
        };
      } = await FServiceAPI.Collection.collectionResources(params);
      resourceList = [
        ...resourceList,
        ...data_favoriteResources.dataList.map<FAddDependenciesDrawerStates['resourceList'][number]>((r: any) => {
          // console.log(r, 'r20893u4oi23');
          return {
            resourceID: r.resourceId,
            resourceName: r.resourceName,
            resourceType: r.resourceType,
            updateDate: FUtil.Format.formatDateTime(r.resourceUpdateDate, true),
            status: r.resourceStatus === 1 ? 'online' : 'offline',
            latestVersion: r.latestVersion,
          };
        }),
      ];
    } else {
      const params: Parameters<typeof FServiceAPI.Resource.list>[0] = {
        skip: resourceList.length,
        limit: FUtil.Predefined.pageSize,
        keywords: searchInput,
        status: resourceFrom === 'my' ? undefined : 1,
        isSelf: resourceFrom === 'my' ? 1 : undefined,
      };
      const { data: data_list }: {
        data: {
          dataList: {
            resourceId: string;
            resourceName: string;
            resourceType: string[];
            updateDate: string;
            status: 0 | 1;
            latestVersion: string;
          }[];
        };
      } = await FServiceAPI.Resource.list(params);
      resourceList = [
        ...resourceList,
        ...data_list.dataList.map<FAddDependenciesDrawerStates['resourceList'][number]>((r) => {
          return {
            resourceID: r.resourceId,
            resourceName: r.resourceName,
            resourceType: r.resourceType,
            updateDate: FUtil.Format.formatDateTime(r.updateDate, true),
            status: r.status === 1 ? 'online' : 'offline',
            latestVersion: r.latestVersion,
          };
        }),
      ];
    }
    set_resourceList(resourceList);
  }

  return (<FDrawer
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
              text={<>{resourceFromOptions.find((i) => {
                return i.value === resourceFrom;
              })?.text}</>}
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

        {
          resourceList.map((resource) => {
            return (<div className={styles.bucket}>
              <div>
                <div className={styles.title}>
                  <div>
                    <FComponentsLib.FContentText
                      singleRow={true}
                      text={resource.resourceName}
                    />
                  </div>
                  <div style={{ width: 5 }} />
                  {resource.status === 'offline' &&
                  <FResourceStatusBadge status={resource.latestVersion === '' ? 'unreleased' : 'offline'} />}
                </div>
                <div style={{ height: 2 }} />
                <FComponentsLib.FContentText
                  type={'additional2'}
                  text={(resource.resourceType.length > 0 ? `资源类型 ${FUtil.Format.resourceTypeKeyArrToResourceType(resource.resourceType)}` : '未设置类型') + ` | 更新时间 ${resource.updateDate}`}
                />
              </div>
              {
                (!selectedResourceIDs.includes(resource.resourceID))
                  ? (<FComponentsLib.FRectBtn
                    type='secondary'
                    size='small'
                    onClick={() => {
                    }}
                    // disabled={!resource.latestVersion || disabledIDsOrNames?.includes(i.title) || disabledIDsOrNames?.includes(i.id)}
                  >选择</FComponentsLib.FRectBtn>)
                  : (<FComponentsLib.FRectBtn
                    type='danger2'
                    size='small'
                    onClick={() => {

                    }}
                    disabled={selectedResourceIDs.includes(resource.resourceID)}
                  >移除</FComponentsLib.FRectBtn>)
              }
            </div>);
          })
        }
      </div>
    </FDrawer>
  );
}

export default FAddDependenciesDrawer;
