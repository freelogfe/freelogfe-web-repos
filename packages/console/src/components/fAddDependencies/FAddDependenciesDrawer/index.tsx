import * as React from 'react';
import styles from './index.less';
import FDrawer from '@/components/FDrawer';
import Market from '@/pages/resource/version/creator/$id/FDepPanel/Market';
import FDropdownMenu from '@/components/FDropdownMenu';
import FInput from '@/components/FInput';

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

  React.useEffect(() => {
    fetchResourceList();
  }, [resourceFrom, searchInput]);

  async function fetchResourceList() {

  }

  return (<FDrawer
      open={visible}
      // title={FUtil.I18n.message('add_rely_resource')}
      title={'添加依赖'}
      afterOpenChange={(o) => {
        if (o) {

        } else {
          onClose && onClose();
        }
      }}
      width={820}
    >
      {/*<Market />*/}

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
      </div>
    </FDrawer>
  );
}

export default FAddDependenciesDrawer;
