import * as React from 'react';
import styles from './index.less';
import { FContentText, FTitleText } from '@/components/FText';
import { Drawer, Space } from 'antd';
import { connect, Dispatch } from 'dva';
import { ConnectState, MarketResourcePageModelState } from '@/models/connect';
import FPolicyDisplay from '@/components/FPolicyDisplay';

interface ResourcesAndPoliciesProps {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageModelState;
}

function ResourcesAndPolicies({ dispatch, marketResourcePage }: ResourcesAndPoliciesProps) {

  const showResource = marketResourcePage.signResources;

  const [visibleR, setVisibleR] = React.useState<string>('');

  const showRInfo = marketResourcePage.signResources.find((sr) => sr.id === visibleR);

  return (<>
    <div className={styles.smallTitle}>当前资源</div>
    <div style={{ height: 10 }} />
    {
      showResource
        .filter((r, i: number) => i === 0)
        .map((r) => {
          return (<a
            key={r.id}
            className={styles.resource}
            onClick={() => setVisibleR(r.id)}
          >
            <div>
              <FContentText
                type='highlight'
                text={r.name}
              />
              <div style={{ height: 5 }} />
              <FContentText
                type='additional2'
                text={r.type}
              />
            </div>
            <div className={styles.resourcePolicies}>
              {
                r.policies
                  .filter((p) => {
                    return p.checked;
                  })
                  .map((p) => {
                    return (<label key={p.fullInfo.policyId}>{p.fullInfo.policyName}</label>);
                  })
              }
            </div>
          </a>);
        })
    }

    {
      showResource.length > 1 && <>
        <div style={{ height: 20 }} />
        <div className={styles.smallTitle}>基础上抛</div>
        <div style={{ height: 10 }} />
        <Space
          direction='vertical'
          size={10}
          style={{ width: '100%' }}
        >
          {
            showResource
              .filter((r, i: number) => i !== 0)
              .map((r) => {
                return (<a
                  key={r.id}
                  className={styles.resource}
                  onClick={() => setVisibleR(r.id)}
                >
                  <div>
                    <FContentText
                      type='highlight'
                      text={r.name}
                    />
                    <div style={{ height: 5 }} />
                    <FContentText
                      type='additional2'
                      text={r.type}
                    />
                  </div>
                  <div className={styles.resourcePolicies}>
                    {
                      r.contracts
                        .filter((c) => {
                          return c.checked;
                        })
                        .map((c) => {
                          return (<label key={c.id}>{c.name}</label>);
                        })
                    }
                    {
                      r.policies
                        .filter((p) => {
                          return p.checked;
                        })
                        .map((p) => {
                          return (<label key={p.fullInfo.policyId}>{p.fullInfo.policyName}</label>);
                        })
                    }
                  </div>
                </a>);
              })
          }
        </Space>
      </>
    }

    <Drawer
      visible={!!visibleR}
      // title={<span style={{fontWeight: 400}}>stefan/Smell like teen spirit</span>}
      title={null}
      width={720}
      bodyStyle={{ padding: 40 }}
      onClose={() => setVisibleR('')}
      maskClosable={false}
    >
      <FTitleText
        text={showRInfo?.name}
        type='h3'
      />
      <div style={{ height: 10 }} />
      <FContentText
        type='additional1'
        text={showRInfo?.type}
      />
      <div style={{ height: 50 }} />
      <FTitleText
        type='h3'
        text={'已选策略'}
      />
      <div style={{ height: 30 }} />
      <Space
        direction='vertical'
        size={20}
        style={{ width: '100%' }}
      >
        {
          showRInfo?.contracts
            .filter((rp) => rp.checked)
            .map((rp) => (<div
              className={styles.policy}
              key={rp.id}
            >
              <div style={{ padding: '10px 20px 0' }}>
                <FContentText
                  text={rp.name}
                  type='highlight'
                />
              </div>
              {/*<pre>{rp.text}</pre>*/}
              <div style={{ height: 10 }} />
              <div style={{ padding: '0 20px' }}>
                <FPolicyDisplay
                  code={rp.text}
                  containerHeight={300}
                />
              </div>
            </div>))
        }
        {
          showRInfo?.policies
            .filter((rp) => rp.checked)
            .map((rp) => (<div
              className={styles.policy}
              key={rp.fullInfo.policyId}
            >
              <div style={{ padding: '10px 20px 0' }}>
                <FContentText
                  text={rp.fullInfo.policyName}
                  type='highlight'
                />
              </div>
              <div style={{ height: 10 }} />
              <div style={{ padding: '0 20px' }}>
                <FPolicyDisplay
                  fullInfo={rp.fullInfo}
                  containerHeight={300}
                />
              </div>
            </div>))
        }
      </Space>
    </Drawer>
  </>);
}

export default connect(({ marketResourcePage }: ConnectState) => ({
  marketResourcePage,
}))(ResourcesAndPolicies);
