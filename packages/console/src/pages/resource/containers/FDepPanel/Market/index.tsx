import * as React from 'react';
import styles from './index.less';
import FDropdown from '@/components/FDropdown';
import FInput from '@/components/FInput';
import {FContentText} from '@/components/FText';
import {FNormalButton} from '@/components/FButton';
import {resourceTypes} from '@/utils/globals';
import {
  AddADepByIDAction,
  ChangeAction,
  DepResources,
  // OnChangeDependenciesAction,
  // OnChangeDepRelationshipAction
} from '@/models/resourceVersionCreatorPage';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceVersionCreatorPageModelState} from '@/models/connect';
import {list, ListParamsType} from '@/services/resources';
import moment from 'moment';
import {resourceList} from "@/services/collections";
import any = jasmine.any;

interface MarketProps {
  dispatch: Dispatch;
  creator: ResourceVersionCreatorPageModelState;
}

const selectOptions: { text?: string, value: string }[] = [
  {text: '资源市场', value: '1'},
  {text: '我的资源', value: '2'},
  {text: '我的收藏', value: '3'},
];

function Market({creator: {depRelationship, dependencies}, dispatch}: MarketProps) {

  const [selected, setSelected] = React.useState<any>('1');

  const [input, setInput] = React.useState<string>('');

  const [resourceObjects, setResourceObjects] = React.useState<any[]>([]);

  React.useEffect(() => {
    handleDataSource();
  }, []);

  async function handleDataSource() {
    const params: ListParamsType = {
      isLoadPolicyInfo: 1,
      isSelf: 1,
    };
    // const {data} = await list(params);
    const {data} = await list(params);
    // const {data: data2} = await resourceList({});
    // console.log(data, 'data3fasd');
    // console.log(data1, 'data1');
    // console.log(data2, 'data2');
    const resources = data.dataList.map((i: any) => ({
      id: i.resourceId,
      title: i.resourceName,
      resourceType: i.resourceType,
      time: moment(i.updateDate).format('YYYY-MM-DD HH:mm'),
      status: i.status,
      baseUpcastResources: i.baseUpcastResources,
    }));
    setResourceObjects(resources);
  }

  // async function f() {
  //
  // }

  function onSelect(i: any) {
    // dispatch<ChangeAction>({
    //   type: 'resourceVersionCreatorPage/change',
    //   payload: {
    //     dependencies: [
    //       i,
    //       ...dependencies,
    //     ],
    //     depRelationship: [
    //       {id: i.id, children: []},
    //       ...depRelationship,
    //     ]
    //   },
    // });
    // console.log(i, 'ii23dscvs');
    dispatch<AddADepByIDAction>({
      type: 'resourceVersionCreatorPage/addADepByIDAction',
      payload: [i.id, ...i.baseUpcastResources.map((up: any) => up.resourceId)],
    });
  }

  return (
    <div className={styles.SelectBucket}>
      <div className={styles.filter}>
        <div className={styles.filterSelect}>
          <FDropdown
            options={selectOptions}
            text={selectOptions.find((i) => i.value === selected)?.text}
            onChange={(value) => setSelected(value)}
          />
        </div>

        <FInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={styles.filterInput}
          theme="dark"
          size="small"
        />
      </div>

      <div style={{height: 17}}/>

      {
        resourceObjects?.map((i) => (
          <div key={i.id} className={styles.bucket}>
            <div>
              <FContentText text={i.title}/>
              <div style={{height: 2}}/>
              <FContentText type={'additional2'} text={`资源类型 ${i.resourceType} | 更新时间 ${i.time}`}/>
            </div>
            <FNormalButton
              theme="weaken"
              onClick={() => onSelect(i)}
              disabled={depRelationship.map((j) => j.id).includes(i.id)}
            >选择</FNormalButton>
          </div>
        ))
      }
    </div>
  );
}

export default connect(({resourceVersionCreatorPage}: ConnectState) => ({
  creator: resourceVersionCreatorPage,
}))(Market);
