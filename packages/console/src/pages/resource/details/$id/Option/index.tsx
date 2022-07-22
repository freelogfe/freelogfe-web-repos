import * as React from 'react';
import styles from './index.less';
import {Space} from 'antd';
import {FInfo} from '@/components/FIcons';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceDetailPageModelState} from '@/models/connect';
import FTooltip from "@/components/FTooltip";
import FComponentsLib from '@freelog/components-lib';

interface OptionProps {
  dispatch: Dispatch;
  resourceDetailPage: ResourceDetailPageModelState;
}

function Option({dispatch, resourceDetailPage}: OptionProps) {

  if (resourceDetailPage.resourceVersion_Info.options.length === 0) {
    return null;
  }

  return (<>
    <div style={{height: 30}}/>
    <div>
      <FComponentsLib.FTitleText
        text={'自定义选项'}
        type="h3"
      />
      <div style={{height: 20}}/>
      <div className={styles.content}>
        {
          resourceDetailPage.resourceVersion_Info.options.map((i) => {
            return (<div key={i.key}>
              <Space size={10}>
                <FComponentsLib.FContentText
                  text={i.key}
                />
                {
                  i.description && (<FTooltip
                    title={i.description}
                    color={'#fff'}
                  >
                    <FInfo
                      style={{cursor: 'pointer', fontSize: 14}}
                    />
                  </FTooltip>)
                }
              </Space>
            </div>);
          })
        }
      </div>
    </div>
    <div style={{height: 20}}/>
  </>);
}

export default connect(({resourceDetailPage}: ConnectState) => ({resourceDetailPage}))(Option);
