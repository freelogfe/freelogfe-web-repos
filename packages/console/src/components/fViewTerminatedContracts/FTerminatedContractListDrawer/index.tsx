import * as React from 'react';
import styles from './index.less';
import FDrawer from '@/components/FDrawer';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { ColumnsType } from 'antd/lib/table/interface';
import FCoverImage from '@/components/FCoverImage';
import FIdentityTypeBadge from '@/components/FIdentityTypeBadge';
import FComponentsLib from '@freelog/components-lib';
import { Space } from 'antd';
import FTable from '@/components/FTable';
import FContractDetailsDrawer from '@/components/FContractDetailsDrawer';

interface FTerminatedContractListDrawerProps {
  terminatedContractIDs?: string[];

  counterpartyInfo?: {
    licenseeIdentityType: 1 | 2 | 3; // 可选	int	乙方身份类型 1:资源方 2:节点方 3:C端用户
    licensorId: string; // 可选	string	甲方ID
    licenseeId: string; // 可选	string	乙方ID
  };

  onClose?: () => void;
}

interface FTerminatedContractListDrawerStates {
  visible: boolean;
  terminatedContracts: {
    cover: string;
    subjectType: 'resource' | 'exhibit';
    subjectName: string;
    contractName: string;
    licensorId: string;
    licensorType: 'resource' | 'node';
    licensorName: string;
    licenseeId: string;
    licenseeType: 'resource' | 'node' | 'user';
    licenseeName: string;
    status: 'terminated' | 'exception' | 'authorized' | 'testAuthorized' | 'unauthorized';
    dataTime: string;
    contractID: string;
  }[];
  contractDetailID: string;
}

const initStates: FTerminatedContractListDrawerStates = {
  visible: true,
  terminatedContracts: [],
  contractDetailID: '',
};

function FTerminatedContractListDrawer({
                                         terminatedContractIDs,
                                         counterpartyInfo,
                                         onClose,
                                       }: FTerminatedContractListDrawerProps) {

  const [visible, set_visible] = React.useState<FTerminatedContractListDrawerStates['visible']>(initStates['visible']);
  const [terminatedContracts, set_terminatedContracts] = React.useState<FTerminatedContractListDrawerStates['terminatedContracts']>(initStates['terminatedContracts']);
  const [contractDetailID, set_contractDetailID] = React.useState<FTerminatedContractListDrawerStates['contractDetailID']>(initStates['contractDetailID']);

  async function handleData() {
    // const params: Parameters<typeof FServiceAPI.Contract.batchContracts>[0] = {
    //   contractIds: (terminatedContractIDs || []).join(','),
    //   isLoadPolicyInfo: 1,
    // };
    // console.log(params2, 'params2093lksdjflk');
    const data = await contractList({
      contractIDs: terminatedContractIDs,
      counterpartyInfo: counterpartyInfo,
    });
    // console.log(data, 'data09w3oejlskdfjsdlkfj');
    const resultList: FTerminatedContractListDrawerStates['terminatedContracts'] = [
      ...(data as any[]).map<FTerminatedContractListDrawerStates['terminatedContracts'][number]>((al: any) => {

        return {
          cover: al.subjectInfo?.coverImages[0] || '',
          subjectType: al.subjectType === 1 ? 'resource' : 'exhibit',
          subjectName: al.subjectName,
          contractName: al.contractName,
          licensorId: al.licenseeId,
          licensorType: al.subjectType === 1 ? 'resource' : 'node',
          licensorName: al.licensorName,
          licenseeId: al.licenseeId,
          licenseeType: al.licenseeIdentityType === 1 ? 'resource' : al.licenseeIdentityType === 2 ? 'node' : 'user',
          licenseeName: al.licenseeName,
          // status: al.status === 1 ? 'terminated' : ((al.authStatus & 1) === 1) ? 'authorization' : 'pending',
          status: handleContractState({
            status: al.status,
            authStatus: al.authStatus,
          }),
          dataTime: FUtil.Format.formatDateTime(al.createDate, true),
          contractID: al.contractId,
        };
      }),
    ];
    // console.log(data2, 'data22222222#$##$@$##$');
    // const AssociateContractsResult: FTerminatedContractListDrawerStates['terminatedContracts'] = (data2 as any)
    //   .map((d: any) => {
    //     return {
    //       expansion: false,
    //       contractId: d.contractId,
    //       contractName: d.contractName,
    //       contractCreateDate: FUtil.Format.formatDateTime(d.createDate, true),
    //       // contractStatus: d.status === 1 ? 2 : ((d.authStatus & 1) === 1) ? 1 : 0,
    //       contractStatus: d.status === 1 ? 'terminal' : (d.authStatus === 1 || d.authStatus === 3) ? 'active' : d.authStatus === 2 ? 'testActive' : 'inactive',
    //       policyID: d.policyId,
    //       policyText: d.policyInfo.policyText,
    //     };
    //   });
    // console.log(AssociateContractsResult, 'AssociateContractsResult290342309u');
    set_terminatedContracts(resultList);
  }

  // console.log(terminatedContracts, 'terminatedContracts90oi23jlksdjflk');

  const columns1: ColumnsType<FTerminatedContractListDrawerStates['terminatedContracts'][number]> = [
    {
      title: (<FComponentsLib.FTitleText type='table' text={'标的物 | 类型 | 所签授权策略'} />),
      dataIndex: 'target',
      key: 'target',
      render(_: any, record) {
        return (<div className={styles.target}>
          <div className={styles.targetCover}>
            {/*<img src={record.cover || imgSrc} />*/}
            <FCoverImage
              style={{ borderRadius: 4 }}
              src={record.cover || ''}
              width={120}
            />
            <div className={styles.targetType}>
              <FIdentityTypeBadge status={record.subjectType} />
            </div>
          </div>

          <div style={{ width: 10 }} />
          <div className={styles.targetInfo}>
            <FComponentsLib.FContentText text={record.subjectName} type='highlight' />
            <div style={{ height: 10 }} />
            {/*<Space size={5} className={styles.targetInfoLabels}>*/}
            {/*  <label>{record.contractName}</label>*/}
            {/*</Space>*/}
            <FComponentsLib.F_Contract_And_Policy_Labels data={[{ text: record.contractName, dot: '' }]} />
          </div>
        </div>);
      },
    },
    {
      title: (<FComponentsLib.FTitleText type='table' text={'授权方 | 被授权方'} />),
      dataIndex: 'signatory',
      key: 'signatory',
      render(_: any, record) {
        return (<div className={styles.signatory}>
          <Space size={5}>
            {
              record.licensorType === 'resource' && (<FComponentsLib.FIcons.FResource style={{ fontSize: 14 }} />)
            }
            {
              record.licensorType === 'node' && (<FComponentsLib.FIcons.FNodes style={{ fontSize: 14 }} />)
            }

            {/*{*/}
            {/*  record.licensorType === '' && (<FUser style={{ fontSize: 14 }} />)*/}
            {/*}*/}

            <FComponentsLib.FContentText text={record.licensorName} type='highlight' />
          </Space>
          <div style={{ height: 10 }} />
          <Space size={5}>
            {
              record.licenseeType === 'resource' && (<FComponentsLib.FIcons.FResource style={{ fontSize: 14 }} />)
            }
            {
              record.licenseeType === 'node' && (<FComponentsLib.FIcons.FNodes style={{ fontSize: 14 }} />)
            }

            {
              record.licenseeType === 'user' && (<FComponentsLib.FIcons.FUser style={{ fontSize: 14 }} />)
            }

            <FComponentsLib.FContentText text={record.licenseeName} type='highlight' />
          </Space>
        </div>);
      },
    },
    {
      title: (<FComponentsLib.FTitleText type='table' text={'合约状态 | 签约时间 | 合约ID'} />),
      dataIndex: 'contract',
      key: 'contract',
      width: 190,
      render(_: any, record) {
        return (<div className={styles.contract}>
          {
            record.status === 'authorized' && (<span className={styles.authorized}>已授权</span>)
          }
          {
            record.status === 'testAuthorized' && (<span className={styles.authorized}>测试授权</span>)
          }
          {
            record.status === 'unauthorized' && (<span className={styles.pending}>未授权</span>)
          }
          {
            record.status === 'exception' && (<span className={styles.exception}>异常</span>)
          }
          {
            record.status === 'terminated' && (<span className={styles.terminated}>已终止</span>)
          }
          <div style={{ height: 5 }} />
          <FComponentsLib.FContentText text={record.dataTime} type='additional2' />
          <div style={{ height: 5 }} />
          <FComponentsLib.FContentText text={record.contractID} type='additional2' />
          <div style={{ height: 5 }} />
          <FComponentsLib.FTextBtn
            className={styles.hoverVisible}
            type='primary'
            onClick={() => {
              set_contractDetailID(record.contractID);
            }}
          >查看合约详情</FComponentsLib.FTextBtn>
        </div>);
      },
    },
  ];

  return (<FDrawer
    open={visible}
    title={'已终止合约'}
    width={window.innerWidth - 280}
    onClose={() => {
      set_visible(false);
    }}
    afterOpenChange={async (visible) => {
      if (visible) {
        await handleData();
      } else {
        onClose && onClose();
      }
    }}
  >
    <FTable
      className={styles.table}
      rowClassName={styles.rowClassName}
      columns={columns1}
      dataSource={terminatedContracts.map((al) => {
        return {
          key: al.contractID,
          ...al,
        };
      })}
    />

    <FContractDetailsDrawer
      contractID={contractDetailID}
      onClose={() => {
        set_contractDetailID('');
      }}
    />
  </FDrawer>);
}

export default FTerminatedContractListDrawer;

interface HandleContractStateParams {
  status: 0 | 1 | 2; // 合同综合状态: 0:正常 1:已终止(不接受任何事件,也不给授权,事实上无效的合约) 2:异常
  authStatus: 1 | 2 | 128 | number; // 合同授权状态 1:正式授权 2:测试授权 128:未获得授权
}

function handleContractState({
                               status,
                               authStatus,
                             }: HandleContractStateParams): 'terminated' | 'exception' | 'authorized' | 'testAuthorized' | 'unauthorized' {
  if (status === 1) {
    return 'terminated';
  }
  if (status === 2) {
    return 'exception';
  }

  if (authStatus === 1 || authStatus === 3) {
    return 'authorized';
  }
  if (authStatus === 2) {
    return 'testAuthorized';
  }
  if (authStatus === 128) {
    return 'unauthorized';
  }
  return 'exception';
}

interface ContractListParams {
  contractIDs?: string[];
  counterpartyInfo?: FTerminatedContractListDrawerProps['counterpartyInfo'];
}

async function contractList({ contractIDs, counterpartyInfo }: ContractListParams): Promise<any[]> {

  if (!contractIDs && counterpartyInfo) {
    return [];
  }

  let list: any[] = [];

  if (!!contractIDs) {
    const params: Parameters<typeof FServiceAPI.Contract.batchContracts>[0] = {
      contractIds: contractIDs.join(','),
      isLoadPolicyInfo: 1,
    };
    const { data } = await FServiceAPI.Contract.batchContracts(params);
    list = data;
  }

  if (!!counterpartyInfo) {
    const params: Parameters<typeof FServiceAPI.Contract.batchContracts>[0] = {
      ...counterpartyInfo,
      isLoadPolicyInfo: 1,
    };
    const { data } = await FServiceAPI.Contract.batchContracts(params);
    list = data;
  }

  const exhibitIDs: string[] = list
    .filter((d: any) => {
      return d.subjectType === 2;
    }).map((d: any) => {
      return d.subjectId;
    });

  const resourceIDs: string[] = list
    .filter((d: any) => {
      return d.subjectType === 1;
    }).map((d: any) => {
      return d.subjectId;
    });

  // console.log(exhibitIDs, resourceIDs, '######3900928309482034809');
  let exhibits: any[] = [];
  let resources: any[] = [];

  if (exhibitIDs.length > 0) {
    const params1: Parameters<typeof FServiceAPI.Exhibit.presentableList>[0] = {
      presentableIds: Array.from(new Set(exhibitIDs)).join(','),
    };

    const { data: data1 } = await FServiceAPI.Exhibit.presentableList(params1);
    // console.log(data1, '#####0920938048230480239');
    exhibits = data1;
  }

  if (resourceIDs.length > 0) {
    const params2: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] = {
      resourceIds: Array.from(new Set(resourceIDs)).join(','),
    };

    const { data: data2 } = await FServiceAPI.Resource.batchInfo(params2);
    // console.log(data2, '*******0920938048230480239');
    resources = data2;
  }
  // console.log(exhibits, resources, '####92093840238704230u399999999');
  //coverImages
  return list.map((d: any) => {
    // console.log(d, 'd09ioje3wlksdfjl');
    let subjectInfo: any = null;
    if (d.subjectType === 1) {
      subjectInfo = resources.find((r: any) => {
        return r.resourceId === d.subjectId;
      }) || null;
    } else if (d.subjectType === 2) {
      subjectInfo = exhibits.find((e: any) => {
        return e.presentableId === d.subjectId;
      }) || null;
    }
    return {
      ...d,
      subjectInfo,
    };
  });
}
