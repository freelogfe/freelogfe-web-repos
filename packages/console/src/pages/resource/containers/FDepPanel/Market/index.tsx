import * as React from 'react';
import styles from './index.less';
import FDropdown from '@/components/FDropdown';
import FInput from '@/components/FInput';
import {FContentText} from '@/components/FText';
import {FNormalButton} from '@/components/FButton';
import {resourceTypes} from '@/utils/globals';
import {
  DepResources,
  OnChangeDependenciesAction,
  OnChangeDepRelationshipAction
} from '@/models/resourceVersionCreatorPage';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceVersionCreatorPageModelState} from '@/models/connect';
import {list} from '@/services/resources';
import moment from 'moment';

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

  const [resourceObjects, setResourceObjects] = React.useState<DepResources>([]);

  React.useEffect(() => {
    handleDataSource();
    // setResourceObjects([
    //   {
    //     id: '100',
    //     title: 'liukai/hahaha',
    //     resourceType: 'image',
    //     time: '2000',
    //     version: {
    //       isCustom: false,
    //       input: '',
    //       allowUpdate: true,
    //       select: '1.2.3',
    //     },
    //     versions: ['11.2.3', '1.2.3'],
    //     upthrow: false,
    //     enableReuseContracts: [{
    //       checked: true,
    //       title: '买奶粉',
    //       status: 'stopped',
    //       code: 'code',
    //       id: '1234',
    //       date: '2013-12-22',
    //       versions: ['12.23.3', '1.42.3'],
    //     }],
    //     enabledPolicies: [{
    //       checked: true,
    //       id: 'string',
    //       title: 'string',
    //       code: 'code',
    //     }],
    //   }
    // ])
  }, []);

  async function handleDataSource() {
    const params = {};
    const {data} = await list(params);
    const resources = data.dataList.map((i: any) => ({
      id: i.resourceId,
      title: i.resourceName,
      resourceType: i.resourceType,
      time: moment(i.updateDate).format('YYYY-MM-DD HH:mm'),
      status: i.status,
      version: {
        isCustom: false,
        input: '',
        allowUpdate: true,
        select: '',
      },
      versions: i.resourceVersions.map((j: any) => j.version),
      upthrow: false,
      enableReuseContracts: [
        // {
        //   checked: true,
        //   title: '买奶粉2',
        //   status: 'executing',
        //   code: 'code',
        //   id: '1234',
        //   date: '2013-12-22',
        //   versions: ['12.23.3', '1.42.3'],
        // }
      ],
      enabledPolicies: [
        // {
        //   checked: true,
        //   id: 'string',
        //   title: 'string',
        //   code: 'code',
        // }
      ],
    }));
    setResourceObjects(resources);
  }

  function onSelect(i: DepResources[number]) {
    dispatch<OnChangeDependenciesAction>({
      type: 'resourceVersionCreatorPage/onChangeDependencies',
      payload: [
        i,
        ...dependencies,
      ],
    });
    dispatch<OnChangeDepRelationshipAction>({
      type: 'resourceVersionCreatorPage/changeDepRelationship',
      payload: [
        {id: i.id, children: []},
        ...depRelationship,
      ],
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
              disabled={depRelationship.map((j) => j.id).includes(i.id) || i.status === 0}
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
