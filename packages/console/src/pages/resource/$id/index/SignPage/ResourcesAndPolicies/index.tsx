import * as React from 'react';
import styles from './index.less';
import {FContentText, FTitleText} from '@/components/FText';
import {Drawer, Space} from 'antd';
import {connect, Dispatch} from 'dva';
import {ConnectState, MarketResourcePageModelState} from '@/models/connect';

interface ResourcesAndPoliciesProps {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageModelState;
}

function ResourcesAndPolicies({dispatch, marketResourcePage}: ResourcesAndPoliciesProps) {

  const showResource = marketResourcePage.signResources;

  const [visibleR, setVisibleR] = React.useState<string>('');

  // function showR(id: string) {
  //   setVisibleR()
  // }
  const showRInfo = marketResourcePage.signResources.find((sr) => sr.id === visibleR);

  return (<>
    <div className={styles.smallTitle}>当前资源</div>
    <div style={{height: 10}}/>
    {
      showResource
        .filter((r, i: number) => i === 0)
        .map((r) => (<a
          key={r.id}
          className={styles.resource}
          onClick={() => setVisibleR(r.id)}
        >
          <div>
            <FTitleText
              type="h4"
              text={r.name}
            />
            <div style={{height: 5}}/>
            <FContentText type="additional2" text={'audio'}/>
          </div>
          <div className={styles.resourcePolicies}>
            {
              r.policies.filter((p: any) => p.checked)
                .map((p: any) => (<label key={p.id}>{p.name}</label>))
            }
            {/*<label>策略1</label>*/}
          </div>
        </a>))
    }

    {
      showResource.length > 1 && <>
        <div style={{height: 20}}/>
        <div className={styles.smallTitle}>基础上抛</div>
        <div style={{height: 10}}/>
        <Space
          direction="vertical"
          size={10}
          style={{width: '100%'}}
        >
          {
            showResource
              .filter((r, i: number) => i !== 0)
              .map((r) => (<a
                key={r.id}
                className={styles.resource}
                onClick={() => setVisibleR(r.id)}
              >
                <div>
                  <FTitleText
                    type="h4"
                    text={r.name}
                  />
                  <div style={{height: 5}}/>
                  <FContentText type="additional2" text={'audio'}/>
                </div>
                <div className={styles.resourcePolicies}>
                  {
                    r.policies.filter((p: any) => p.checked)
                      .map((p: any) => (<label key={p.id}>{p.name}</label>))
                  }
                  {/*<label>策略1</label>*/}
                </div>
              </a>))
          }
          {/*<a className={styles.resource}>*/}
          {/*  <div>*/}
          {/*    <FTitleText type={'h4'} text={'stefan/Smells like teen spirit'}/>*/}
          {/*    <div style={{height: 5}}/>*/}
          {/*    <FContentText type="additional2" text={'audio'}/>*/}
          {/*  </div>*/}
          {/*  <div className={styles.resourcePolicies}>*/}
          {/*    <label>策略1</label>*/}
          {/*    <label>策略1</label>*/}
          {/*    <label>策略1</label>*/}
          {/*  </div>*/}
          {/*</a>*/}
        </Space>
      </>
    }

    <Drawer
      visible={!!visibleR}
      // title={<span style={{fontWeight: 400}}>stefan/Smell like teen spirit</span>}
      title={null}
      width={720}
      bodyStyle={{padding: 40}}
      onClose={() => setVisibleR('')}
    >
      <FTitleText
        text={showRInfo?.name}
        type="h3"
      />
      <div style={{height: 10}}/>
      <FContentText
        type="additional1"
        text={showRInfo?.type}
      />
      <div style={{height: 50}}/>
      <FTitleText
        type="h3"
        text={'已选策略'}
      />
      <div style={{height: 30}}/>
      <Space
        direction="vertical"
        size={20}
        style={{width: '100%'}}
      >
        {
          showRInfo?.policies
            .filter((rp) => rp.checked)
            .map((rp) => (<div
              className={styles.policy}
              key={rp.id}
            >
              <FTitleText
                text={rp.name}
                type="h4"
              />
              <div style={{height: 15}}/>
              <pre>{rp.text}</pre>
            </div>))
        }
      </Space>
    </Drawer>
  </>);
}

export default connect(({marketResourcePage}: ConnectState) => ({
  marketResourcePage,
}))(ResourcesAndPolicies);
