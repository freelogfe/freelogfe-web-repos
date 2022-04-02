import * as React from 'react';
import FFormLayout from '@/components/FFormLayout';
// import { Space } from 'antd';
import { FContentText, FTitleText } from '@/components/FText';
// import FResource from '@/components/FIcons/FResource';
// import { FNodes, FUser } from '@/components/FIcons';
import FDrawer from '@/components/FDrawer';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { Checkbox, Space } from 'antd';
import FIdentityTypeBadge from '@/components/FIdentityTypeBadge';
import FLoadingTip from '@/components/FLoadingTip';
import styles from '@/pages/resource/auth/$id/FAuthPanel/Contracts/index.less';
import FContractDisplay from '@/components/FContractDisplay';
import { OnTrigger_AuthorizedContractEvent_Action } from '@/models/resourceAuthPage';
import FUtil1 from '@/utils';
import FDivider from '@/components/FDivider';
import FCheckbox from '@/components/FCheckbox';
import FContractAppliedVersions from '@/components/FContractAppliedVersions';

interface FRelationDrawerProps {
  licensor: {
    licensorID: string;
    licensorIdentityType: 'resource';
  };
  licensee: {
    licenseeID: string;
    licensorIdentityType: 'resource' | 'exhibit';
  };
}

interface FRelationDrawerStates {
  dataSource: {
    licensor: {
      licensorID: string;
      licensorName: string;
      licensorIdentityType: 'resource';
    };
    licensee: {
      licenseeID: string;
      licenseeName: string;
      licensorIdentityType: 'resource' | 'exhibit';
    };
    contracts: {
      contractID: string;
      policyID: string;
      contractName: string;
      createDate: string;
    }[];
  } | null;

  versions: {
    version: string;
    policyIDs: string[];
  }[];

}

const initData: FRelationDrawerStates = {
  dataSource: null,
  versions: [],
};

function FRelationDrawer({ licensor, licensee }: FRelationDrawerProps) {

  const [dataSource, set_DataSource] = React.useState<FRelationDrawerStates['dataSource']>(initData['dataSource']);
  const [versions, set_Versions] = React.useState<FRelationDrawerStates['versions']>(initData['versions']);

  React.useEffect(() => {

  }, []);

  function onChange_DrawerVisible(visible: boolean) {
    if (visible) {
      if (licensor.licensorIdentityType === 'resource' && licensee.licensorIdentityType === 'resource') {
        handleData_Resource2Resource();
      }
    }
  }

  async function handleData_Resource2Resource() {

    const params0: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] = {
      resourceIds: [licensor.licensorID, licensee.licenseeID].join(','),
      projection: 'resourceId,resourceName,userId',
    };

    const { data: data_ResourceInfos }: {
      data: {
        resourceId: string;
        resourceName: string;
        userId: number;
      }[];
    } = await FServiceAPI.Resource.batchInfo(params0);

    const params1: Parameters<typeof FServiceAPI.Contract.batchContracts>[0] = {
      subjectIds: licensor.licensorID,
      subjectType: 1,
      licensorId: licensor.licensorID,
      licenseeId: licensee.licenseeID,
      licenseeIdentityType: 1,
      projection: 'contractId,contractName,createDate,policyId',
    };

    const { data: data_Contracts }: {
      data: {
        contractId: string;
        contractName: string;
        createDate: string;
        policyId:  string;
      }[];
    } = await FServiceAPI.Contract.batchContracts(params1);

    const params2: Parameters<typeof FServiceAPI.Resource.resolveResources>[0] = {
      resourceId: licensee.licenseeID,
    };

    const { data: data_resolveResource }: {
      data: {
        resourceId: string;
        resourceName: string;
        versions: {
          version: string;
          versionId: string;
          contracts: {
            policyId: string;
            contractId: string;
          }[];
        }[];
      }[];
    } = await FServiceAPI.Resource.resolveResources(params2);

    // console.log(JSON.stringify(data_resolveResource), 'data_resolveResource0932ojisdlf');

    const lor = data_ResourceInfos.find((ri) => {
      return ri.resourceId === licensor.licensorID;
    });
    const lee = data_ResourceInfos.find((ri) => {
      return ri.resourceId === licensee.licenseeID;
    });

    if (!lor || !lee) {
      return;
    }

    const data: FRelationDrawerStates['dataSource'] = {
      licensor: {
        licensorID: lor.resourceId,
        licensorName: lor.resourceName,
        licensorIdentityType: 'resource',
      },
      licensee: {
        licenseeID: lee.resourceId,
        licenseeName: lee.resourceName,
        licensorIdentityType: 'resource',
      },
      contracts: data_Contracts.map<NonNullable<FRelationDrawerStates['dataSource']>['contracts'][number]>((dc) => {
        return {
          contractID: dc.contractId,
          contractName: dc.contractName,
          createDate: FUtil.Format.formatDateTime(dc.createDate),
          policyID: dc.policyId,
        };
      }),
    };

    const currentResource = data_resolveResource.find((rr) => {
      return rr.resourceId === licensor.licensorID;
    });

    if (!currentResource) {
      return;
    }

    set_DataSource(data);
    const vs: FRelationDrawerStates['versions'] = currentResource.versions.map((v) => {
      return {
        version: v.version,
        policyIDs: v.contracts.map((c) => {
          return c.policyId;
        }),
      };
    });
    set_Versions(vs);
  }

  async function handleData_Resource2Exhibit() {

  }

  return (<FDrawer
    visible={true}
    title={'授权关系'}
    // onClose={() => onClose && onClose()}
    afterVisibleChange={onChange_DrawerVisible}
  >
    {
      !dataSource && (<FLoadingTip height={500} />)
    }

    {
      dataSource && (<FFormLayout>
        <FFormLayout.FBlock title={'授权方'}>
          <Space size={10}>
            <FIdentityTypeBadge status={dataSource.licensor.licensorIdentityType} />
            <FContentText
              type='highlight'
              text={dataSource.licensor.licensorName}
            />
          </Space>

        </FFormLayout.FBlock>
        <FFormLayout.FBlock title={'被授权方'}>
          <Space size={10}>
            <FIdentityTypeBadge status={dataSource.licensee.licensorIdentityType} />
            <FContentText
              type='highlight'
              text={dataSource.licensee.licenseeName}
            />
          </Space>
        </FFormLayout.FBlock>
        <FFormLayout.FBlock title={'合约详情'}>
          <Space size={15} direction='vertical' style={{ width: '100%' }}>
            {
              dataSource.contracts.map((k) => {
                return (<div key={k.contractID} className={styles.Policy}>
                  <div style={{ height: 15 }} />

                  <div className={styles.PolicyGrammarName}>
                    <Space size={10}>
                      <span>{k.contractName}</span>
                    </Space>
                  </div>

                  <div style={{ height: 10 }} />
                  <div style={{ padding: '0 20px' }}>
                    <FContractDisplay
                      contractID={k.contractID}
                      onChangedEvent={() => {
                        // dispatch<OnTrigger_AuthorizedContractEvent_Action>({
                        //   type: 'resourceAuthPage/onTrigger_AuthorizedContractEvent',
                        // });
                      }}
                    />
                  </div>
                  <div style={{ height: 10 }} />
                  <Space style={{ padding: '0 20px' }} size={2}>
                    <FContentText
                      type='additional2'
                      text={FUtil1.I18n.message('contract_id') + '：' + k.contractID}
                    />
                    <FDivider style={{ fontSize: 14 }} />
                    <FContentText
                      type='additional2'
                      text={FUtil1.I18n.message('contract_signed_time') + '：' + k.createDate}
                    />
                  </Space>
                  <div style={{ height: 10 }} />

                  {
                    (<div style={{
                      padding: '12px 20px',
                      borderTop: '1px solid #E5E7EB',
                    }}>
                      <FTitleText
                        // text={`当前合约资源 ${dataSource.licensee.licenseeName} 中各个版本的应用情况`}
                        // text={`当前合约在此资源上被多个版本应用`}
                        text={`当前合约应用版本`}
                        type='table'
                        style={{ fontSize: 12 }}
                      />
                      <div style={{ height: 8 }} />
                      <FContractAppliedVersions
                        versionAndPolicyIDs={versions}
                        currentPolicyID={k.policyID}
                      />
                      {/*<FContentText type='additional2'>当前合约在此资源上被多个版本应用：</FContentText>*/}

                      {/*<div className={styles.allVersions}>*/}
                      {/*  {k.versions.map((i) => <Space size={8} key={i.version}>*/}
                      {/*    <Checkbox*/}
                      {/*      checked={i.checked}*/}
                      {/*      disabled={i.disabled}*/}
                      {/*      onChange={(e) => onLicenseChange(i.version, k.policyId, e.target.checked)}*/}
                      {/*    />*/}
                      {/*    <span>{i.version}</span>*/}
                      {/*  </Space>)}*/}
                      {/*</div>*/}
                    </div>)
                  }

                </div>);
              })}
          </Space>
        </FFormLayout.FBlock>
      </FFormLayout>)
    }

  </FDrawer>);
}

export default FRelationDrawer;


