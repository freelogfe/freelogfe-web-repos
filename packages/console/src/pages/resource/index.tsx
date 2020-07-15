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
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourcePageModelState} from '@/models/connect';
import {router} from 'umi';
import {resourceTypes} from '@/utils/globals';
import {
  OnChangeInputTextAction,
  OnChangePageCurrentAction, OnChangePageSizeAction,
  OnChangeResourceStatusAction,
  OnChangeResourceTypeAction
} from "@/models/resourcePage";

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

interface ResourceProps {
  dispatch: Dispatch;
  resource: ResourcePageModelState;
}

function Resource({dispatch, resource}: ResourceProps) {

  const [typeText, setTypeText] = React.useState('');
  const [statusText, setStatusText] = React.useState('');


  React.useEffect(() => {
    const selectedType: any = resourceTypeOptions.find((i) => i.value === resource.resourceType);
    setTypeText(selectedType?.text || selectedType?.value);
  }, [resource.resourceType]);

  React.useEffect(() => {
    const selectedStatus: any = resourceStatusOptions.find((i) => i.value === resource.resourceStatus);
    console.log(selectedStatus, 'selectedStatusselectedStatus');
    setStatusText(selectedStatus?.text || selectedStatus?.value);
  }, [resource.resourceStatus]);

  function onChangeTab(value: '1' | '2') {
    if (value === '2') {
      return router.push('/resource/collect');
    }
  }

  return (
    <FLayout>
      <FAffixTabs
        value={'1'}
        options={navs}
        onChange={onChangeTab}
      />

      <div className={styles.filter}>
        <div className={styles.filterLeft}>
          <div>
            <span>类型：</span>
            <Dropdown overlay={<FMenu
              options={resourceTypeOptions}
              onClick={(value) => dispatch<OnChangeResourceTypeAction>({
                type: 'resourcePage/onChangeResourceType',
                payload: value
              })}
            />}>
              <span style={{cursor: 'pointer'}}>{typeText}<DownOutlined
                style={{marginLeft: 8}}/></span>
            </Dropdown>
          </div>
          <div style={{marginLeft: 60}}>
            <span>类型：</span>
            <Dropdown overlay={<FMenu
              options={resourceStatusOptions}
              onClick={(value) => dispatch<OnChangeResourceStatusAction>({
                type: 'resourcePage/onChangeResourceStatus',
                payload: value
              })}
            />}>
              <span style={{cursor: 'pointer'}}>{statusText}<DownOutlined style={{marginLeft: 10}}/></span>
            </Dropdown>
          </div>

        </div>
        <div className={styles.filterRight}>
          <FInput
            value={resource.inputText}
            onChange={(e) => dispatch<OnChangeInputTextAction>({
              type: 'resourcePage/onChangeInputText',
              payload: e.target.value
            })}
            theme="dark"
            className={styles.FInput}
          />
          <FNormalButton
            onClick={() => router.push('/resource/creator')}
            type="primary"
          >创建资源</FNormalButton>
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
      <FPagination
        current={resource.pageCurrent}
        pageSize={resource.pageSize}
        total={resource.totalNum}
        onChangeCurrent={(value) => dispatch<OnChangePageCurrentAction>({
          type: 'resourcePage/onChangePageCurrent',
          payload: value
        })}
        onChangePageSize={(value) => dispatch<OnChangePageSizeAction>({
          type: 'resourcePage/onChangePageSize',
          payload: value
        })}
        className={styles.FPagination}
      />
    </FLayout>
  );
}

export default connect(({resourcePage}: ConnectState) => ({
  resource: resourcePage,
}))(Resource);
