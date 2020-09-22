import * as React from 'react';
import styles from './index.less';
import {List} from 'antd';
import {FNormalButton} from '@/components/FButton';
import {FContentText} from '@/components/FText';
import StatusLabel from "@/components/StatusLabel";

export interface FResourceListProps {
  loading: boolean;
  stillMore: boolean;
  resourceObjects: {
    id: string;
    title: string;
    resourceType: string;
    time: string;
    status: 0 | 1;
    buttonStatus?: 'select' | 'disabled' | 'remove';
  }[];

  onLoadMord?(): void;

  onSelect?(i: FResourceListProps['resourceObjects'][number]): void;

  onDelete?(i: FResourceListProps['resourceObjects'][number]): void;
}

function FResourceList({
                         resourceObjects, loading, stillMore,
                         onLoadMord, onSelect, onDelete,
                       }: FResourceListProps) {
  return (<List
    loading={loading}
    itemLayout="horizontal"
    loadMore={stillMore
      ? (<div className={styles.footer}>
        <FNormalButton
          onClick={() => onLoadMord && onLoadMord()}
        >加载更多</FNormalButton>
      </div>)
      : (resourceObjects.length > 0 && (
        <div style={{textAlign: 'center', padding: '10px 0'}}>
          <FContentText type="additional1" text={'没有更多了~'}/>
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
            {i.status === 0 && <label>未上线</label>}
          </div>
          <div style={{height: 2}}/>
          <FContentText
            type={'additional2'}
            text={`资源类型 ${i.resourceType} | 更新时间 ${i.time}`}
          />
        </div>
        {
          i.buttonStatus !== 'remove' ? (<FNormalButton
              theme="weaken"
              onClick={() => onSelect && onSelect(i)}
              disabled={i.buttonStatus === 'disabled'}
            >选择</FNormalButton>)
            : (<FNormalButton
              theme="delete2"
              onClick={() => onDelete && onDelete(i)}
              // disabled={i.buttonStatus === 'disabled'}
            >移除</FNormalButton>)
        }
      </div>
    )}
  />);
}

export default FResourceList;
