import * as React from 'react';
import FFormLayout from '@/components/FFormLayout';
// import { Space } from 'antd';
import { FContentText } from '@/components/FText';
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
      contractName: string;
      createDate: string;
    }[];
  } | null;
}

const initData: FRelationDrawerStates = {
  dataSource: null,
};

function FRelationDrawer({ licensor, licensee }: FRelationDrawerProps) {

  const [dataSource, set_DataSource] = React.useState<FRelationDrawerStates['dataSource']>(initData['dataSource']);

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

    console.log(data_ResourceInfos, 'data_ResourceInfos39028iojsdkfs90');

    const params1: Parameters<typeof FServiceAPI.Contract.batchContracts>[0] = {
      subjectIds: licensor.licensorID,
      subjectType: 1,
      licensorId: licensor.licensorID,
      licenseeId: licensee.licenseeID,
      licenseeIdentityType: 1,
      projection: 'contractId,contractName,createDate',
    };

    const { data: data_Contracts }: {
      data: {
        contractId: string;
        contractName: string;
        createDate: string;
      }[];
    } = await FServiceAPI.Contract.batchContracts(params1);
    console.log(data_Contracts, 'data_Contracts@3098uijoklsdfl');
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
        };
      }),
    };

    set_DataSource(data);
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

                  {/*{*/}
                  {/*  (<div className={styles.PolicyInfo}>*/}
                  {/*    <div className={styles.versionControl}>*/}
                  {/*      <FContentText type='additional2'>当前合约在此资源上被多个版本应用：</FContentText>*/}
                  {/*      <div style={{ height: 8 }} />*/}
                  {/*      <div className={styles.allVersions}>*/}
                  {/*        {k.versions.map((i) => <Space size={8} key={i.version}>*/}
                  {/*          <Checkbox*/}
                  {/*            checked={i.checked}*/}
                  {/*            disabled={i.disabled}*/}
                  {/*            onChange={(e) => onLicenseChange(i.version, k.policyId, e.target.checked)}*/}
                  {/*          />*/}
                  {/*          <span>{i.version}</span>*/}
                  {/*        </Space>)}*/}
                  {/*      </div>*/}
                  {/*    </div>*/}
                  {/*  </div>)*/}
                  {/*}*/}

                </div>);
              })}
          </Space>
        </FFormLayout.FBlock>
      </FFormLayout>)
    }

  </FDrawer>);
}

export default FRelationDrawer;
