import * as React from 'react';
import styles from './index.less';
import FFormLayout from "@/layouts/FFormLayout";
import {Space} from "antd";
import * as imgSrc from "@/assets/default-resource-cover.jpg";
import {FContentText} from "@/components/FText";
import FIdentityTypeBadge from "@/components/FIdentityTypeBadge";
import {FDown, FNodes, FUp, FUser} from "@/components/FIcons";
import FDivider from "@/components/FDivider";
import FDrawer from "@/components/FDrawer";
import FContractStatusBadge from "@/components/FContractStatusBadge";
import {FTextBtn} from "@/components/FButton";

interface FContractDetailsDrawerProps {
  contractID: string;
}

function FContractDetailsDrawer({}: FContractDetailsDrawerProps) {
  return (<FDrawer
    visible={true}
    title={'合约详情'}
  >
    <FFormLayout>
      <FFormLayout.FBlock title={'标的物'}>
        <Space size={10}>
          <img alt="" className={styles.targetCover} src={imgSrc}/>
          <div>
            <FContentText type="highlight" text={'喜马拉雅山照片'}/>
            <div style={{height: 5}}/>
            <FIdentityTypeBadge status={'exhibit'}/>
          </div>
        </Space>
      </FFormLayout.FBlock>

      <FFormLayout.FBlock title={'缔约方'}>
        <Space size={10}>
          <div style={{width: 80}}>
            <FContentText type="negative" text={'授权方'}/>
          </div>
          <Space size={10}>
            <FNodes style={{color: '#E9A923'}}/>
            <FContentText type="highlight" text={'喜马拉雅山照片'}/>
          </Space>
        </Space>
        <div style={{height: 15}}/>
        <Space size={10}>
          <div style={{width: 80}}>
            <FContentText type="negative" text={'照片节点'}/>
          </div>
          <Space size={10}>
            <FUser style={{color: '#BD10E0'}}/>
            <FContentText type="highlight" text={'James'}/>
          </Space>
        </Space>
      </FFormLayout.FBlock>

      <FFormLayout.FBlock title={'所签授权策略'}>
        <Space size={10}>
          <FContentText text={'免费授权策略'} type="highlight"/>
          <FContractStatusBadge/>
        </Space>

        <div style={{height: 10}}/>
        <Space size={2}>
          <FContentText
            type="additional2"
            text={'签约时间：2020/09/09 12:00'}
          />
          <FDivider style={{fontSize: 14}}/>
          <FContentText
            type="additional2"
            text={'合约ID：asakfhadghsifdhdidhfsfoh'}
          />
        </Space>

        <div style={{height: 20}}/>
        <Space className={styles.navs}>
          <div>
            <FContentText text={'合约状态机'}/>
            <div style={{height: 4}}/>
          </div>
        </Space>
        <pre className={styles.policyText}>
                {`initial:
  active
    recontractable
    presentable
  terminate`}
              </pre>
      </FFormLayout.FBlock>

      <FFormLayout.FBlock title={'关联合约'}>
        <Space size={10} direction="vertical" className={styles.associateContracts}>
          <div className={styles.associateContract}>
            <div className={styles.associateContractHeader}>
              <div>
                <Space size={10}>
                  <FContentText text={'免费授权策略'} type="highlight"/>
                  <FContractStatusBadge status="pending"/>
                </Space>
                <div style={{height: 10}}/>
                <Space size={40}>
                  <Space size={10}>
                    <FContentText text={'签约时间'} type="additional2"/>
                    <FContentText text={'2020/09/09 12:00'}/>
                  </Space>
                  <Space size={10}>
                    <FContentText text={'合约ID'} type="additional2"/>
                    <FContentText text={'asakfhadghsifdhdidhfsfoh'}/>
                  </Space>
                </Space>
              </div>
              <FUp/>
            </div>
            <div className={styles.contractText}>
              <pre>{`for public:
    escrow account acct
    custom event acceptor.customEvent
      initial:
         recontractable
         proceed to
               auth:
         presentable
         recontractable
         active
         proceed to refund on acct.confiscated
      refund:
         recontractable
         proceed to finish on acct.refunded
      finish:
         recontractable
         terminate`}</pre>
            </div>
          </div>

          <div className={styles.associateContract}>
            <div className={styles.associateContractHeader}>
              <div>
                <Space size={10}>
                  <FContentText text={'免费授权策略'} type="highlight"/>
                  <FContractStatusBadge status="stopped"/>
                </Space>
                <div style={{height: 10}}/>
                <Space size={40}>
                  <Space size={10}>
                    <FContentText text={'签约时间'} type="additional2"/>
                    <FContentText text={'2020/09/09 12:00'}/>
                  </Space>
                  <Space size={10}>
                    <FContentText text={'合约ID'} type="additional2"/>
                    <FContentText text={'asakfhadghsifdhdidhfsfoh'}/>
                  </Space>
                </Space>
              </div>
              <FDown/>
            </div>
          </div>

        </Space>
      </FFormLayout.FBlock>
    </FFormLayout>
  </FDrawer>);
}

export default FContractDetailsDrawer;
