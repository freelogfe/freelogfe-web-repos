import * as React from 'react';
import styles from './index.less';
import {Button, Space} from 'antd';
import FMenu from '@/components/FMenu';
import FInput from '@/components/FInput';
import {FRectBtn} from '@/components/FButton';
import {router} from 'umi';
import FResourceCard, {FResourceCardProps} from '@/components/FResourceCard';
import {resourceTypes} from '@/utils/globals';
import {DownOutlined} from '@ant-design/icons';
import FNoDataTip from '@/components/FNoDataTip';
import FUtil from "@/utils";
import FDropdown from "@/components/FDropdown";

const resourceTypeOptions = [
  {text: '全部', value: '-1'},
  ...resourceTypes.map((i) => ({value: i}))
];

const resourceStatusOptions = [
  {text: '全部', value: '2'},
  {text: '已上线', value: '1'},
  {text: '已下线', value: '0'},
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

type EventFunc = (id: string | number, record: any, index: number) => void;

interface FResourceCardsListProps {
  resourceType: string;
  resourceStatus: string;
  inputText: string;

  dataSource: FResourceCardProps['resource'][];
  totalNum: number;

  onChangeResourceType?: (value: string) => void;
  onChangeResourceStatus?: (value: '0' | '1' | '2') => void;
  onChangeInputText?: (value: string) => void;

  onloadMore?(): void;

  showGotoCreateBtn?: boolean;
  isCollect?: boolean;

  onBoomJuice?: EventFunc;
  onClickDetails?: EventFunc;
  onClickEditing?: EventFunc;
  onClickRevision?: EventFunc;
  onClickMore?: EventFunc;
}

function FResourceCardsList({
                              resourceType, resourceStatus, inputText, dataSource, totalNum,
                              onChangeResourceType, onChangeResourceStatus, onChangeInputText, onloadMore,
                              showGotoCreateBtn = false, isCollect = false,
                              onBoomJuice, onClickDetails, onClickEditing, onClickRevision, onClickMore
                            }: FResourceCardsListProps) {

  const [typeText, setTypeText] = React.useState('');
  const [statusText, setStatusText] = React.useState('');

  React.useEffect(() => {
    const selectedType: any = resourceTypeOptions.find((i) => i.value === resourceType);
    setTypeText(selectedType?.text || selectedType?.value);
  }, [resourceType]);

  React.useEffect(() => {
    const selectedStatus: any = resourceStatusOptions.find((i) => i.value === resourceStatus);
    setStatusText(selectedStatus?.text || selectedStatus?.value);
  }, [resourceStatus]);

  return (<>
    <div style={{height: 40}}/>
    <div className={styles.filter}>
      <div className={styles.filterLeft}>
        <div>
          <span>{FUtil.I18n.message('resource_type')}：</span>
          <FDropdown overlay={<FMenu
            options={resourceTypeOptions}
            onClick={(value) => onChangeResourceType && onChangeResourceType(value)}
          />}>
              <span style={{cursor: 'pointer'}}>{typeText}<DownOutlined
                style={{marginLeft: 8}}/></span>
          </FDropdown>
        </div>
        <div style={{marginLeft: 60}}>
          <span>{FUtil.I18n.message('resource_state')}：</span>
          <FDropdown overlay={<FMenu
            options={resourceStatusOptions}
            onClick={(value) => onChangeResourceStatus && onChangeResourceStatus(value as '0' | '1' | '2')}
          />}>
            <span style={{cursor: 'pointer'}}>{statusText}<DownOutlined style={{marginLeft: 10}}/></span>
          </FDropdown>
        </div>

      </div>
      <Space size={20}>
        <FInput
          value={inputText}
          debounce={300}
          allowClear={true}
          // onChange={(e) => onChangeInputText && onChangeInputText(e.target.value)}
          onDebounceChange={(value) => onChangeInputText && onChangeInputText(value)}
          theme="dark"
          className={styles.FInput}
          placeholder={FUtil.I18n.message('search_resource')}
        />
        {showGotoCreateBtn && <FRectBtn
          onClick={() => router.push(FUtil.LinkTo.resourceCreator())}
          type="primary"
        >{FUtil.I18n.message('create_resource')}</FRectBtn>}
      </Space>
    </div>

    {
      dataSource.length > 0
        ? (<>
          <div style={{height: 40}}/>
          <div className={styles.Content}>
            {
              dataSource.map((i: any, j: number) => (<FResourceCard
                key={i.id}
                resource={i}
                type={isCollect ? 'favorite' : 'resource'}
                className={styles.FResourceCard}
                onBoomJuice={() => onBoomJuice && onBoomJuice(i.id, i, j)}
                onClickDetails={() => onClickDetails && onClickDetails(i.id, i, j)}
                onClickEditing={() => onClickEditing && onClickEditing(i.id, i, j)}
                onClickRevision={() => onClickRevision && onClickRevision(i.id, i, j)}
                onClickMore={() => onClickMore && onClickMore(i.id, i, j)}
              />))
            }
            <div className={styles.bottomPadding}/>
            <div className={styles.bottomPadding}/>
            <div className={styles.bottomPadding}/>
            <div className={styles.bottomPadding}/>
          </div>
          <div style={{height: 100}}/>
        </>)
        : (<FNoDataTip
          height={'calc(100vh - 220px)'}
          tipText={'没有符合条件的资源'}
        />)
    }

    {
      totalNum > dataSource.length && (<>

        <div className={styles.bottom}>
          <Button
            className={styles.loadMore}
            onClick={() => onloadMore && onloadMore()}
          >加载更多</Button>
        </div>
        <div style={{height: 100}}/>
      </>)
    }
    <div style={{height: 100}}/>
  </>);
}

export default FResourceCardsList;
