import * as React from 'react';
import FLayout from '@/layouts/FLayout';
import {Dropdown} from 'antd';
import styles from './index.less';
import FInput from '@/components/FInput';
import {FNormalButton} from '@/components/FButton';
import {DownOutlined} from '@ant-design/icons';
import FMenu from '@/components/FMenu';
import FResourceCard from '@/components/FResourceCard';
import FPagination from '@/components/FPagination';
import FAffixTabs from '@/components/FAffixTabs';
import {connect, Dispatch} from "dva";
import {ConnectState, ResourceCollectPageModelState} from '@/models/connect';
import {router} from 'umi';
import {resourceTypes} from "@/utils/globals";

const resourceTypeOptions = [
  {text: '全部', value: '-1'},
  ...resourceTypes.map((i) => ({value: i}))
];

const resourceStatusOptions = [
  {text: '全部', value: '-1'},
  {text: '已上线', value: '1'},
];
const navs = [
  {
    value: '1',
    text: '我的资源',
  },
  {
    value: '2',
    text: '我的收藏',
  },
];

interface ResourceCollectProps {
  dispatch: Dispatch;
  resource: ResourceCollectPageModelState;
}

function ResourceCollect({dispatch, resource}: ResourceCollectProps) {

  function onChangeTab(value: '1' | '2') {
    if (value === '1') {
      return router.push('/resource');
    }
  }

  return (
    <FLayout>
      <FAffixTabs
        value={'2'}
        options={navs}
        onChange={onChangeTab}
      />

      <div className={styles.filter}>
        <div className={styles.filterLeft}>
          <div>
            <span>类型：</span>
            <Dropdown overlay={<FMenu options={resourceTypeOptions}/>}>
              <span style={{cursor: 'pointer'}}>全部<DownOutlined style={{marginLeft: 8}}/></span>
            </Dropdown>
          </div>
          <div style={{marginLeft: 60}}>
            <span>类型：</span>
            <Dropdown overlay={<FMenu options={resourceStatusOptions}/>}>
              <span style={{cursor: 'pointer'}}>全部<DownOutlined style={{marginLeft: 10}}/></span>
            </Dropdown>
          </div>

        </div>
        <div className={styles.filterRight}>
          <FInput
            theme="dark"
            className={styles.FInput}
          />
          {/*<FNormalButton type="primary">创建资源</FNormalButton>*/}
        </div>
      </div>

      <div className={styles.Content}>
        {
          resource.dataSource.map((i: any) => (<FResourceCard
            key={i.id}
            resource={i}
            type="resource"
            className={styles.FResourceCard}/>))
        }
        <div className={styles.bottomPadding}/>
        <div className={styles.bottomPadding}/>
        <div className={styles.bottomPadding}/>
        <div className={styles.bottomPadding}/>
      </div>
      <div style={{height: 10}}/>
      <FPagination className={styles.FPagination}/>
    </FLayout>
  );
}

export default connect(({resourceCollectPage}: ConnectState) => ({
  resource: resourceCollectPage,
}))(ResourceCollect);
