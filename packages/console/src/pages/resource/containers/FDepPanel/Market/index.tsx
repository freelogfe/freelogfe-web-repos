import * as React from 'react';
import styles from './index.less';
import FDropdown from '@/components/FDropdown';
import FInput from '@/components/FInput';
import {
  // AddADepByIDAction,
  AddDepsAction
} from '@/models/resourceVersionCreatorPage';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceVersionCreatorPageModelState} from '@/models/connect';
import {list, ListParamsType} from '@/services/resources';
import moment from 'moment';
import FResourceList from '@/components/FResourceList';
import FDropdownMenu from '@/components/FDropdownMenu';

interface MarketProps {
  dispatch: Dispatch;
  creator: ResourceVersionCreatorPageModelState;
}

interface MarketStatus {
  selected: '1' | '2' | '3';
  // page: number;
  totalItem: number;
  input: string;
  resourceObjects: {
    id: string;
    title: string;
    resourceType: string;
    time: string;
    status: 0 | 1;
    latestVersion: string;
  }[];
}

const selectOptions: { text?: string, value: string }[] = [
  {text: '资源市场', value: '1'},
  {text: '我的资源', value: '2'},
  {text: '我的收藏', value: '3'},
];

// let page: MarketStatus['page'] = 1;
let input: MarketStatus['input'] = '';

function Market({creator: {depRelationship, dependencies}, dispatch}: MarketProps) {

  const [selected, setSelected] = React.useState<MarketStatus['selected']>('1');
  const [totalItem, setTotalItem] = React.useState<MarketStatus['totalItem']>(-1);
  const [resourceObjects, setResourceObjects] = React.useState<MarketStatus['resourceObjects']>([]);

  React.useEffect(() => {
    handleDataSource(0);
  }, []);

  async function handleDataSource(isSelf: 0 | 1 = 0) {
    const params: ListParamsType = {
      isSelf: isSelf,
      // pageSize: 20,
      // page: page,
      status: isSelf === 1 ? 2 : 1,
      keywords: window.encodeURIComponent(input),
    };
    // console.log(params, '324wdsparams');
    const {data} = await list(params);
    const resources: MarketStatus['resourceObjects'] = (data.dataList as any[]).map<MarketStatus['resourceObjects'][number]>((i: any) => ({
      id: i.resourceId,
      title: i.resourceName,
      resourceType: i.resourceType,
      time: moment(i.updateDate).format('YYYY-MM-DD HH:mm'),
      status: i.status,
      baseUpcastResources: i.baseUpcastResources,
      latestVersion: i.latestVersion,
    }));
    setTotalItem(data.totalItem);
    // if (page === 1) {
    //   setResourceObjects(resources);
    // } else {
    //   setResourceObjects([
    //     ...resourceObjects,
    //     ...resources,
    //   ]);
    // }
  }

  function onSelect(i: any) {
    // console.log(i, 'IIIIIIsAAAA');
    dispatch<AddDepsAction>({
      type: 'resourceVersionCreatorPage/addDeps',
      payload: {
        relationships: [{
          id: i.id,
          children: (i.baseUpcastResources as any[]).map<{ id: string }>((up: any) => ({
            id: up.resourceId,
          }))
        }],
      },
    });
  }

  // function onChangeSelected(selected: MarketStatus['selected']) {
  //   // console.log(selected, 'selectedp988nklwe4fds');
  //   setSelected(selected as MarketStatus['selected']);
  //   page = 1;
  //   setTimeout(() => handleDataSource(selected === '1' ? 0 : 1));
  // }

  // function onChangePage() {
  //   // console.log(page, 'page35erdf');
  //   page += 1;
  //   setTimeout(() => handleDataSource(selected === '1' ? 0 : 1));
  // }

  // function onChangeInput(value: string) {
  //   input = value;
  //   page = 1;
  //   setTimeout(() => handleDataSource(selected === '1' ? 0 : 1));
  // }

  return (
    <div className={styles.SelectBucket}>
      <div className={styles.filter}>
        <div className={styles.filterSelect}>
          <FDropdownMenu
            options={selectOptions}
            text={<>{selectOptions.find((i) => i.value === selected)?.text}</>}
            // onChange={onChangeSelected as any}
          />
        </div>

        <FInput
          debounce={300}
          // onDebounceChange={onChangeInput}
          value={input}
          className={styles.filterInput}
          theme="dark"
          size="small"
        />
      </div>

      <div style={{height: 17}}/>
      <FResourceList
        resourceObjects={resourceObjects}
        loading={totalItem === -1}
        // stillMore={totalItem > page * 20}
        stillMore={true}
        onSelect={onSelect}
        // onLoadMord={onChangePage}
      />
    </div>
  );
}

export default connect(({resourceVersionCreatorPage}: ConnectState) => ({
  creator: resourceVersionCreatorPage,
}))(Market);
