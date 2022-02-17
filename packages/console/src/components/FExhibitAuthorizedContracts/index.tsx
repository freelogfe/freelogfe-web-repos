import * as React from 'react';
import styles from './index.less';
import { FContentText, FTitleText } from '@/components/FText';
import { FUtil } from '@freelog/tools-lib';
import { FTextBtn } from '@/components/FButton';
import FResourceContractLabels from '@/components/FResourceContractLabels';

interface FExhibitAuthorizedContractsProps {

}

interface FExhibitAuthorizedContractsStates {
  selectedID: string;
  authorizedContracts: {
    id: string;
    name: string;
    type: string;
    identity: 'resource' | 'object';
    disuseAuthorized: boolean;
    contracts: {
      id: string;
      name: string;
      createTime: string;
      status: 'active' | 'testActive' | 'inactive';
      policyID: string;
    }[];
    policies: {
      id: string;
      name: string;
      text: string;
    }[];
  }[];
  exhibitResourceMappingContractIDs: {
    exhibitID: string;
    resourceID: string;
    contractIDs: string[];
  }[];
}

function FExhibitAuthorizedContracts({}: FExhibitAuthorizedContractsProps) {

  const [selectedID, set_SelectedID] = React.useState<FExhibitAuthorizedContractsStates['selectedID']>('1');
  const [authorizedContracts, set_AuthorizedContracts] = React.useState<FExhibitAuthorizedContractsStates['authorizedContracts']>([
    {
      id: '1',
      name: 'Stefan/freelog白皮书',
      type: 'json',
      identity: 'object',
      disuseAuthorized: true,
      contracts: [{
        id: 'c1',
        name: '免费1',
        createTime: '2002-10-10',
        status: 'active',
        policyID: 'p1',
      }],
      policies: [{
        id: 'p2',
        name: '收费',
        text: '',
      }],
    },
    {
      id: '2',
      name: 'Stefan/freelog白皮书2',
      type: 'json',
      identity: 'resource',
      disuseAuthorized: false,
      contracts: [{
        id: 'c1',
        name: '免费1',
        createTime: '2002-10-10',
        status: 'active',
        policyID: 'p1',
      }],
      policies: [{
        id: 'p2',
        name: '收费',
        text: '',
      }],
    },
    {
      id: '3',
      name: 'Stefan/freelog白皮书3',
      type: 'json',
      identity: 'resource',
      disuseAuthorized: false,
      contracts: [],
      policies: [{
        id: 'p2',
        name: '收费',
        text: '',
      }],
    },
  ]);
  const [exhibitResourceMappingContractIDs, set_ExhibitResourceMappingContractIDs] = React.useState<FExhibitAuthorizedContractsStates['exhibitResourceMappingContractIDs']>([]);

  return (<div className={styles.FExhibitAuthorizedContracts}>
    <div className={styles.subjects}>
      {
        authorizedContracts.map((ac, aci) => {
          return (<React.Fragment key={ac.id}>
            {
              aci === 0 && (<div style={{ padding: '0 15px' }}>
                <div style={{ height: 15 }} />
                <FTitleText type='h4'>主资源</FTitleText>
                <div style={{ height: 5 }} />
              </div>)
            }

            {
              aci === 1 && (<div style={{ padding: '0 15px' }}>
                <div style={{ height: 15 }} />
                <FTitleText type='h4'>基础上抛</FTitleText>
                <div style={{ height: 5 }} />
              </div>)
            }

            <div className={styles.subject}
                 style={{ backgroundColor: selectedID === ac.id ? '#FAFBFC' : 'transparent' }}>
              <FTextBtn
                onClick={(e) => {
                  // e.stopPropagation();
                  // window.open(FUtil.LinkTo.resourceDetails({
                  //   resourceID: mainResource.id,
                  // }));
                }}
              >
                <FContentText
                  type='highlight'
                  text={ac.name}
                  singleRow
                  className={styles.FContentText}
                />
              </FTextBtn>
              <div style={{ height: 5 }} />
              <FContentText
                type='additional2'
                text={ac.type}
              />
              <div style={{ height: 5 }} />
              {
                ac.disuseAuthorized
                  ? (<div className={styles.disuseAuthorized}>无需处理授权</div>)
                  : (<FResourceContractLabels contracts={ac.contracts.map((c) => {
                    return {
                      name: c.name,
                      auth: c.status === 'active' || c.status === 'testActive',
                    };
                  })} />)
              }

            </div>

          </React.Fragment>);
        })
      }

    </div>

    <div className={styles.operatorPanel}>

    </div>
  </div>);
}

export default FExhibitAuthorizedContracts;
