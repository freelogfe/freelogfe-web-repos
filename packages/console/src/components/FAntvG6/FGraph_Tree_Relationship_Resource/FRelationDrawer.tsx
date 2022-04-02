import * as React from 'react';
import FFormLayout from '@/components/FFormLayout';
// import { Space } from 'antd';
import { FContentText } from '@/components/FText';
// import FResource from '@/components/FIcons/FResource';
// import { FNodes, FUser } from '@/components/FIcons';
import FDrawer from '@/components/FDrawer';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { Space } from 'antd';
import FIdentityTypeBadge from '@/components/FIdentityTypeBadge';
import FLoadingTip from '@/components/FLoadingTip';

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
          <FContentText
            type='highlight'
            text={'5678'}
          />
        </FFormLayout.FBlock>
      </FFormLayout>)
    }

  </FDrawer>);
}

export default FRelationDrawer;
