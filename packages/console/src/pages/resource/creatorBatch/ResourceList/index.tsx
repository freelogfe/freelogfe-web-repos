import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import { connect } from 'dva';
import { ConnectState, ResourceCreatorBatchPageState } from '@/models/connect';
import Card from './Card';
import { Dispatch } from 'redux';
import { ChangeAction } from '@/models/resourceCreatorBatchPage';

interface ResourceListProps {
  dispatch: Dispatch;
  resourceCreatorBatchPage: ResourceCreatorBatchPageState;
}

function ResourceList({ dispatch, resourceCreatorBatchPage }: ResourceListProps) {
  return (<>
    <div className={styles.container3}>
      <div style={{ width: 920 }}>
        <div style={{ height: 35 }} />
        <div className={styles.nav}>
          <div className={styles.left}>批量发行资源</div>
          <div style={{ width: 10 }} />
          <div className={styles.other}>{'>'}</div>
          <div style={{ width: 7 }} />
          <div className={styles.other}>完善资源信息</div>
        </div>
        <div style={{ height: 35 }} />
        <div className={styles.header}>
          <Space size={10}>
            <FComponentsLib.FContentText text={'资源类型'} type={'additional2'} />
            <FComponentsLib.FContentText
              text={resourceCreatorBatchPage.selectedResourceType?.labels.join('/')}
              type={'highlight'}
              style={{ fontSize: 12 }}
            />
          </Space>

          <FComponentsLib.FContentText
            text={`共 ${resourceCreatorBatchPage.resourceListInfo.length} 个资源`}
            type={'additional2'}
          />

        </div>

        {
          resourceCreatorBatchPage.resourceListInfo.map((r, ri) => {
            return (<React.Fragment key={r.fileUID}>
              <div style={{ height: 40 }} />
              <Card
                resourceType={resourceCreatorBatchPage.selectedResourceType?.labels || []}
                order={ri + 1}
                info={r}
                onChange={(value) => {
                  dispatch<ChangeAction>({
                    type: 'resourceCreatorBatchPage/change',
                    payload: {
                      resourceListInfo: resourceCreatorBatchPage.resourceListInfo.map((rli) => {
                        if (value.fileUID !== rli.fileUID) {
                          return rli;
                        }
                        return value;
                      }),
                    },
                  });
                }}
                onDelete={() => {

                }}
                onAddPolicy={() => {

                }}
              />
            </React.Fragment>);
          })
        }

        <div style={{ height: 100 }} />
      </div>

    </div>

    <div className={styles.submit}>
      <div>
        <div>
          <FComponentsLib.FIcons.FInfo style={{ fontSize: 12 }} />
          &nbsp;已添加授权策略的资源将会自动上架
        </div>
        <Space size={20}>
          <FComponentsLib.FRectBtn>继续添加</FComponentsLib.FRectBtn>
          <FComponentsLib.FRectBtn>现在发行</FComponentsLib.FRectBtn>
        </Space>

      </div>
    </div>
  </>);
}

export default connect(({ resourceCreatorBatchPage }: ConnectState) => ({
  resourceCreatorBatchPage: resourceCreatorBatchPage,
}))(ResourceList);
