import * as React from 'react';
import styles from "./index.less";
import {Radio, Space} from "antd";
import {connect, Dispatch} from "dva";
import {ConnectState, ResourceVersionCreatorPageModelState} from "@/models/connect";
import {DepResources, ChangeAction} from "@/models/resourceVersionCreatorPage";
import {InfoCircleFilled} from '@ant-design/icons';
import {FInfo} from "@/components/FIcons";
import FTooltip from "@/components/FTooltip";
import FUtil from "@/utils";

// import {i18nMessage} from "@/utils/i18n";

interface IsUpthrowProps {
  dispatch: Dispatch;
  resourceVersionCreatorPage: ResourceVersionCreatorPageModelState;
}

function IsUpthrow({resourceVersionCreatorPage, dispatch}: IsUpthrowProps) {
  const resource: ResourceVersionCreatorPageModelState['dependencies'][number] = resourceVersionCreatorPage.dependencies.find((i) => i.id === resourceVersionCreatorPage.depActivatedID) as ResourceVersionCreatorPageModelState['dependencies'][number];

  if (!resource) {
    return null;
  }

  function onChangeIsUpthrow(bool: boolean) {

    dispatch<ChangeAction>({
      type: 'resourceVersionCreatorPage/change',
      payload: {
        dependencies: resourceVersionCreatorPage.dependencies.map((dds) => {
          if (dds.id !== resource.id) {
            return dds;
          }
          return {
            ...dds,
            upthrow: bool,
          }
        }),
        dataIsDirty: true,
      },
      caller: '234532434345902904u9823u4dxfsad234324534%#$%#$%#$%#$#$',
    });
  }

  return (<div className={styles.radios}>
    {/*{(!resource.upthrowDisabled || resource.upthrow) && (*/}
    <Space size={20}>
      <Space size={2}>
        <Radio
          style={{lineHeight: '16px', color: 'red'}}
          checked={resource.upthrow}
          disabled={resource.upthrowDisabled && !resource.upthrow}
          onClick={() => onChangeIsUpthrow(true)}
        />
        <span style={{color: '#666'}}>上抛</span>
      </Space>

      <FTooltip title={FUtil.I18n.message('info_upcast')}>
        <div><FInfo/></div>
      </FTooltip>
    </Space>

    <div style={{height: 15}}/>
    {/*{(!resource.upthrowDisabled || !resource.upthrow) && (*/}
    <Space size={20}>
      <Space size={2}>
        <Radio
          style={{lineHeight: '16px'}}
          checked={!resource.upthrow}
          disabled={resource.upthrowDisabled}
          onClick={() => onChangeIsUpthrow(false)}
        />
        <span style={{color: '#666'}}>{FUtil.I18n.message('sign_contract')}</span>
      </Space>
      <FTooltip title={FUtil.I18n.message('info_sign_contract')}>
        <div><FInfo/></div>
      </FTooltip>

    </Space>
  </div>);
}

export default connect(({resourceVersionCreatorPage}: ConnectState) => ({
  resourceVersionCreatorPage: resourceVersionCreatorPage,
}))(IsUpthrow);
