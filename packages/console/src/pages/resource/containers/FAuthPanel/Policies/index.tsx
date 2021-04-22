import * as React from 'react';
import styles from './index.less';
import PolicyCard from './PolicyCard';
import {Dispatch, connect} from "dva";
import {UpdateAuthorizedAction} from "@/models/resourceAuthPage";
import {FAuthPanelProps} from "@/pages/resource/containers/FAuthPanel";
import {Space} from "antd";

interface PoliciesProps {
  dispatch: Dispatch;
  dataSource: {
    id: string;
    title: string;
    code: string;
    allEnabledVersions: string[];
  }[];
  // onLicense?: (id: string, record: PoliciesProps['dataSource'][0]) => void;
}

function Policies({dataSource, dispatch}: PoliciesProps) {
  function onLicense(versions: string[], policyId: string) {
    dispatch<UpdateAuthorizedAction>({
      type: 'resourceAuthPage/updateAuthorized',
      payload: versions.map((v: string) => ({
        version: v,
        policyId: policyId,
        operation: 1,
      })),
    });
  }

  return (<Space
    size={15}
    style={{width: '100%'}}
    direction="vertical"
  >
    {dataSource.map((i) => (
      <PolicyCard
        key={i.id}
        title={i.title}
        code={i.code}
        allVersions={i.allEnabledVersions}
        onClickLicense={(versions: string[]) => onLicense(versions, i.id)}
      />
    ))}
  </Space>)
}

export default connect()(Policies);
