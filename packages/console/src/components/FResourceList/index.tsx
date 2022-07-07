import * as React from 'react';
import styles from './index.less';
import { List } from 'antd';
import { FRectBtn } from '../FButton';
import { FContentText } from '../FText';
import FResourceStatusBadge from '../FResourceStatusBadge';
import { FUtil } from '@freelog/tools-lib';


export interface FResourceListProps {
  loading: boolean;
  stillMore: boolean;
  resourceObjects: {
    id: string;
    title: string;
    resourceType: string[];
    time: string;
    status: 0 | 1;
    latestVersion: string;
    baseUpcastResources?: any;
  }[];
  disabledIDsOrNames?: string[];
  showRemoveIDsOrNames?: string[];

  onLoadMord?(): void;

  onSelect?(i: FResourceListProps['resourceObjects'][number]): void;

  onDelete?(i: FResourceListProps['resourceObjects'][number]): void;
}

function FResourceList({
                         resourceObjects, loading, stillMore,
                         disabledIDsOrNames = [], showRemoveIDsOrNames = [],
                         onLoadMord, onSelect, onDelete,
                       }: FResourceListProps) {
  return (<List
    loading={loading}
    itemLayout='horizontal'
    loadMore={stillMore
      ? (<div>
        <div style={{ height: 10 }} />
        <div className={styles.footer}>
          <FRectBtn
            onClick={() => onLoadMord && onLoadMord()}
          >加载更多</FRectBtn>
        </div>
      </div>)
      : (resourceObjects.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
          <FContentText type='additional1' text={'没有更多了~'} />
        </div>))}
    dataSource={resourceObjects}
    renderItem={(i: FResourceListProps['resourceObjects'][number]) => (
      <div className={styles.bucket}>
        <div>
          <div className={styles.title}>
            <div>
              <FContentText
                singleRow={true}
                text={i.title}
              />
            </div>
            <div style={{ width: 5 }} />
            {i.status === 0 && <FResourceStatusBadge status={!i.latestVersion ? 'unreleased' : 'offline'} />}
          </div>
          <div style={{ height: 2 }} />
          <FContentText
            type={'additional2'}
            text={(i.resourceType.length > 0 ? `资源类型 ${FUtil.Format.resourceTypeKeyArrToResourceType(i.resourceType)}` : '未设置类型') + ` | 更新时间 ${i.time}`}
          />
        </div>
        {
          (!showRemoveIDsOrNames?.includes(i.title) && !showRemoveIDsOrNames?.includes(i.id))
            ? (<FRectBtn
              type='secondary'
              size='small'
              onClick={() => onSelect && onSelect(i)}
              disabled={!i.latestVersion || disabledIDsOrNames?.includes(i.title) || disabledIDsOrNames?.includes(i.id)}
            >选择</FRectBtn>)
            : (<FRectBtn
              type='danger2'
              size='small'
              onClick={() => onDelete && onDelete(i)}
              disabled={disabledIDsOrNames?.includes(i.title) || disabledIDsOrNames?.includes(i.id)}
            >移除</FRectBtn>)
        }
      </div>
    )}
  />);
}

export default FResourceList;
