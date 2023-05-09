import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ResourceDetailPageModelState } from '@/models/connect';
import FTooltip from '@/components/FTooltip';
import FComponentsLib from '@freelog/components-lib';
import FResourceOptions from '@/components/FResourceOptions';

interface OptionProps {
  dispatch: Dispatch;
  resourceDetailPage: ResourceDetailPageModelState;
}

function Option({ dispatch, resourceDetailPage }: OptionProps) {

  if (resourceDetailPage.resourceVersion_Info.customOptions.length === 0) {
    return null;
  }

  return (<>
    <div style={{ height: 30 }} />
    <div>
      <FComponentsLib.FTitleText
        text={'自定义选项'}
        type='h3'
      />
      <div style={{ height: 20 }} />
      <FResourceOptions dataSource={resourceDetailPage.resourceVersion_Info.customOptions} />
      {/*<div className={styles.content}>*/}
      {/*  */}
      {/*  /!*{*!/*/}
      {/*  /!*  resourceDetailPage.resourceVersion_Info.options.map((i) => {*!/*/}
      {/*  /!*    return (<div key={i.key}>*!/*/}
      {/*  /!*      <Space size={10}>*!/*/}
      {/*  /!*        <FComponentsLib.FContentText*!/*/}
      {/*  /!*          text={i.key}*!/*/}
      {/*  /!*        />*!/*/}
      {/*  /!*        {*!/*/}
      {/*  /!*          i.description && (<FTooltip*!/*/}
      {/*  /!*            title={i.description}*!/*/}
      {/*  /!*            color={'#fff'}*!/*/}
      {/*  /!*          >*!/*/}
      {/*  /!*            <FComponentsLib.FIcons.FInfo*!/*/}
      {/*  /!*              style={{ cursor: 'pointer', fontSize: 14 }}*!/*/}
      {/*  /!*            />*!/*/}
      {/*  /!*          </FTooltip>)*!/*/}
      {/*  /!*        }*!/*/}
      {/*  /!*      </Space>*!/*/}
      {/*  /!*    </div>);*!/*/}
      {/*  /!*  })*!/*/}
      {/*  /!*}*!/*/}
      {/*</div>*/}
    </div>
    <div style={{ height: 20 }} />
  </>);
}

export default connect(({ resourceDetailPage }: ConnectState) => ({ resourceDetailPage }))(Option);
