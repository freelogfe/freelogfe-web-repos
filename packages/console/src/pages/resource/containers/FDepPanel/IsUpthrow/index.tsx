import * as React from 'react';
import styles from "./index.less";
import {Radio} from "antd";
import {connect, Dispatch} from "dva";
import {ConnectState, ResourceVersionCreatorPageModelState} from "@/models/connect";
import {DepResources, ChangeAction} from "@/models/resourceVersionCreatorPage";
import {InfoCircleFilled} from '@ant-design/icons';
import {i18nMessage} from "@/utils/i18n";

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

    // const rrr: ResourceVersionCreatorPageModelState['dependencies'][number] = {
    //   ...resource,
    //   upthrow: bool,
    //   // enableReuseContracts: resource.enableReuseContracts.map((erc) => {
    //   //
    //   //   return {
    //   //
    //   //   }
    //   // });
    // };

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
        })
      },
    });
  }

  return (<div className={styles.radios}>
    {/*{(!resource.upthrowDisabled || resource.upthrow) && (*/}
    <div>
      <Radio
        style={{lineHeight: '16px', color: 'red'}}
        checked={resource.upthrow}
        disabled={resource.upthrowDisabled && !resource.upthrow}
        onClick={() => onChangeIsUpthrow(true)}
      />
      {/*<span style={{color: '#666'}}>{i18nMessage('info_upcast')}</span>*/}
      <span style={{color: '#666'}}>上抛</span>
      <InfoCircleFilled style={{color: '#C7C7C7', fontSize: 16, marginLeft: 20}}/>
    </div>

    <div style={{height: 18}}/>
    {/*{(!resource.upthrowDisabled || !resource.upthrow) && (*/}
    <div>
      <Radio
        style={{lineHeight: '16px'}}
        checked={!resource.upthrow}
        // disabled={resource.upthrowDisabled && resource.upthrow}
        disabled={resource.upthrowDisabled}
        onClick={() => onChangeIsUpthrow(false)}
      />
      {/*<span style={{color: '#666'}}>{i18nMessage('info_sign_contract')}</span>*/}
      <span style={{color: '#666'}}>签约</span>
      <InfoCircleFilled style={{color: '#C7C7C7', fontSize: 16, marginLeft: 20}}/>
    </div>
    {/*)}*/}

  </div>);
}

export default connect(({resourceVersionCreatorPage}: ConnectState) => ({
  resourceVersionCreatorPage: resourceVersionCreatorPage,
}))(IsUpthrow);
