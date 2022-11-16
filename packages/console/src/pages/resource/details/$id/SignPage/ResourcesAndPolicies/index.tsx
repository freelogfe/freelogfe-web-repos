import * as React from 'react';
import styles from './index.less';
import { Drawer, Space } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ResourceDetailPageModelState } from '@/models/connect';
import FPolicyDisplay from '@/components/FPolicyDisplay';
import FComponentsLib from '@freelog/components-lib';

interface ResourcesAndPoliciesProps {
  dispatch: Dispatch;
  resourceDetailPage: ResourceDetailPageModelState;
}

function ResourcesAndPolicies({ dispatch, resourceDetailPage }: ResourcesAndPoliciesProps) {

  const showResource = resourceDetailPage.sign_SignResources;

  const [visibleR, setVisibleR] = React.useState<string>('');

  const showRInfo = resourceDetailPage.sign_SignResources.find((sr) => sr.id === visibleR);

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
              <FComponentsLib.FContentText
                type='highlight'
                text={r.name}
              />
              <div style={{ height: 5 }} />
              <FComponentsLib.FContentText
                type='additional2'
                text={r.type.join(' / ')}
              />
            </div>
            <div className={styles.resourcePolicies}>
              <FComponentsLib.F_Contract_And_Policy_Labels data={[
                ...r.contracts
                  .filter((c) => {
                    return c.checked;
                  })
                  .map<{ text: string; dot: 'yellow' | 'green' }>((c) => {
                    // return (<label key={c.id}>{c.name}</label>);
                    return {
                      text: c.name,
                      dot: c.status === 'inactive' ? 'yellow' : 'green',
                    };
                  }),
                ...r.policies
                  .filter((p) => {
                    return p.checked;
                  })
                  .map<{ text: string; dot: '' }>((p) => {
                    // return (<label key={p.fullInfo.policyId}>{p.fullInfo.policyName}</label>);
                    return {
                      text: p.fullInfo.policyName,
                      dot: '',
                    };
                  }),
              ]} />
              {/*{*/}
              {/*  r.policies*/}
              {/*    .filter((p) => {*/}
              {/*      return p.checked;*/}
              {/*    })*/}
              {/*    .map((p) => {*/}
              {/*      return (<label key={p.fullInfo.policyId}>{p.fullInfo.policyName}</label>);*/}
              {/*    })*/}
              {/*}*/}
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
                    <FComponentsLib.FContentText
                      type='highlight'
                      text={r.name}
                    />
                    <div style={{ height: 5 }} />
                    <FComponentsLib.FContentText
                      type='additional2'
                      text={r.type.join(' / ')}
                    />
                  </div>
                  <div className={styles.resourcePolicies}>
                    <FComponentsLib.F_Contract_And_Policy_Labels data={[
                      ...r.contracts
                        .filter((c) => {
                          return c.checked;
                        })
                        .map<{ text: string; dot: 'yellow' | 'green' }>((c) => {
                          // return (<label key={c.id}>{c.name}</label>);
                          return {
                            text: c.name,
                            dot: c.status === 'inactive' ? 'yellow' : 'green',
                          };
                        }),
                      ...r.policies
                        .filter((p) => {
                          return p.checked;
                        })
                        .map<{ text: string; dot: '' }>((p) => {
                          // return (<label key={p.fullInfo.policyId}>{p.fullInfo.policyName}</label>);
                          return {
                            text: p.fullInfo.policyName,
                            dot: '',
                          };
                        }),
                    ]} />
                    {/*{*/}
                    {/*  r.contracts*/}
                    {/*    .filter((c) => {*/}
                    {/*      return c.checked;*/}
                    {/*    })*/}
                    {/*    .map((c) => {*/}
                    {/*      return (<label key={c.id}>{c.name}</label>);*/}
                    {/*    })*/}
                    {/*}*/}
                    {/*{*/}
                    {/*  r.policies*/}
                    {/*    .filter((p) => {*/}
                    {/*      return p.checked;*/}
                    {/*    })*/}
                    {/*    .map((p) => {*/}
                    {/*      return (<label key={p.fullInfo.policyId}>{p.fullInfo.policyName}</label>);*/}
                    {/*    })*/}
                    {/*}*/}
                  </div>
                </a>);
              })
          }
        </Space>
      </>
    }

    <Drawer
      open={!!visibleR}
      // title={<span style={{fontWeight: 400}}>stefan/Smell like teen spirit</span>}
      title={null}
      width={720}
      bodyStyle={{ padding: 40 }}
      onClose={() => setVisibleR('')}
      maskClosable={false}
    >
      <FComponentsLib.FTitleText
        text={showRInfo?.name}
        type='h3'
      />
      <div style={{ height: 10 }} />
      <FComponentsLib.FContentText
        type='additional1'
        text={showRInfo?.type.join(' / ')}
      />
      <div style={{ height: 50 }} />
      <FComponentsLib.FTitleText
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
                <FComponentsLib.FContentText
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
                <FComponentsLib.FContentText
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

export default connect(({ resourceDetailPage }: ConnectState) => ({
  resourceDetailPage,
}))(ResourcesAndPolicies);
