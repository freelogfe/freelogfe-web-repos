import * as React from 'react';
import styles from './index.less';
import FInput from '@/components/FInput';
import {
  AddDepsAction
} from '@/models/resourceVersionCreatorPage';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceDepSelectorModelState, ResourceVersionCreatorPageModelState} from '@/models/connect';
import FResourceList from '@/components/FResourceList';
import FDropdownMenu from '@/components/FDropdownMenu';
import {ChangeAction, FetchResourcesAction} from "@/models/resourceDepSelector";

const selectOptions: { text?: string, value: string }[] = [
  {text: '资源市场', value: '1'},
  {text: '我的资源', value: '2'},
  {text: '我的收藏', value: '3'},
];

interface MarketProps {
  dispatch: Dispatch;
  resourceDepSelector: ResourceDepSelectorModelState;
}

function Market({dispatch, resourceDepSelector}: MarketProps) {

  React.useEffect(() => {
    // handleDataSource(0);
    dispatch<FetchResourcesAction>({
      type: 'resourceDepSelector/fetchResources',
      payload: true,
    });
  }, []);

  function onSelect(value: any) {
    // console.log(value, 'value902jfasdlkf');
    // console.log(i, 'IIIIIIsAAAA');
    dispatch<AddDepsAction>({
      type: 'resourceVersionCreatorPage/addDeps',
      payload: {
        relationships: [{
          id: value.id,
          children: (value.baseUpcastResources as any[]).map<{ id: string }>((up: any) => ({
            id: up.resourceId,
          }))
        }],
      },
    });
  }

  async function onFilterChange(payload: Partial<Pick<ResourceDepSelectorModelState, 'selected' | 'input'>>) {
    await dispatch<ChangeAction>({
      type: 'resourceDepSelector/change',
      payload,
    });
    dispatch<FetchResourcesAction>({
      type: 'resourceDepSelector/fetchResources',
      payload: true,
    });
  }

  return (
    <div className={styles.SelectBucket}>
      <div className={styles.filter}>
        <div className={styles.filterSelect}>
          <FDropdownMenu
            options={selectOptions}
            text={<>{selectOptions.find((i) => i.value === resourceDepSelector.selected)?.text}</>}
            onChange={(value) => {
              onFilterChange({selected: value as '1' | '2' | '3'});
            }}
          />
        </div>

        <FInput
          debounce={300}
          onDebounceChange={(value) => {
            onFilterChange({input: value});
          }}
          value={resourceDepSelector.input}
          className={styles.filterInput}
          theme="dark"
          size="small"
        />
      </div>

      <div style={{height: 17}}/>
      <FResourceList
        resourceObjects={resourceDepSelector.resourceList.map((ro) => ({
          id: ro.resourceId,
          title: ro.resourceName,
          resourceType: ro.resourceType,
          time: ro.updateDate,
          status: ro.status,
          latestVersion: ro.latestVersion,
          baseUpcastResources: ro.baseUpcastResources,
        }))}
        loading={resourceDepSelector.totalItem === -1}
        stillMore={resourceDepSelector.resourceList.length < resourceDepSelector.totalItem}
        onSelect={onSelect}
        onLoadMord={() => {
          dispatch<FetchResourcesAction>({
            type: 'resourceDepSelector/fetchResources',
            payload: false,
          });
        }}
      />
    </div>
  );
}

export default connect(({resourceDepSelector}: ConnectState) => ({
  // resourceVersionCreatorPage,
  resourceDepSelector,
}))(Market);
