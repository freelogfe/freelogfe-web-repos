import * as React from 'react';
import styles from './index.less';
import FCopyToClipboard from '@/components/FCopyToClipboard';
import {FContentText, FTitleText} from '@/components/FText';
import {FDown, FFavorite} from '@/components/FIcons';
import {Checkbox, Space} from 'antd';
import {FNormalButton} from '@/components/FButton';
import {Dispatch, connect} from 'dva';
import {ConnectState, MarketResourcePageState} from '@/models/connect';

interface SignProps {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageState;
}

function Sign({dispatch, marketResourcePage}: SignProps) {
  return (<div className={styles.info}>
    <div className={styles.infoLeft}>
      <img
        className={styles.cover}
        src={marketResourcePage.resourceInfo?.cover || undefined}
        alt={''}
      />
      <div style={{height: 10}}/>
      <div className={styles.title}>
            <span
              className={styles.titleText}>12345467890/123454678901234546789012345467890123454678901234546789012345467890 </span>
        <FCopyToClipboard
          text={marketResourcePage.resourceInfo?.name || ''}
          title={'复制资源名称'}
        />
      </div>
      <div style={{height: 10}}/>
      <div className={styles.babels}>
        <label>{marketResourcePage.resourceInfo?.type || ''}</label>
        {
          (marketResourcePage.resourceInfo?.tags || []).map((t) => (<label key={t}>{t}</label>))
        }
        {/*<label>audio</label>*/}
        {/*<label>音乐</label>*/}
        {/*<label>摇滚</label>*/}
      </div>
      <div style={{height: 10}}/>
      <FContentText
        text={marketResourcePage.resourceInfo?.about || ''}/>
      <div style={{height: 20}}/>
      <a className={styles.favoriteBtn}>
        <FFavorite/> 收藏 ({marketResourcePage.popularity}人气)
      </a>
    </div>
    <div className={styles.cell}/>
    <div className={styles.infoRight}>
      <div className={styles.nodeSelector}>
        <Space size={20}>
          <span className={styles.nodeSelectorLabel}>签约节点</span>
          <FContentText
            text={marketResourcePage.allNodes.find((n) => n.id === marketResourcePage.selectedNode)?.name || ''}/>
        </Space>
        <FDown/>
      </div>
      <div style={{height: 15}}/>
      <div className={styles.sign}>
        <div className={styles.signLeft}>
          <div className={styles.signLeftNav}>选择主资源授权策略</div>
          {
            marketResourcePage.signResources.filter((r, i) => i === 0)
              .map((r) => (<a
                key={r.id}
                className={styles.signResource + ' ' + styles.activatedSignResource}
              >
                <FTitleText
                  type="h5"
                  text={r.name}
                  singleRow
                />
                <div style={{height: 5}}/>
                <FContentText
                  type="additional2"
                  text={r.type}
                />
                <div style={{height: 5}}/>
                <div className={styles.policeTags}>
                  {
                    r.policies.filter((p) => p.checked)
                      .map((p) => (<label key={p.id}>{p.name}</label>))
                  }
                </div>
              </a>))
          }

          <div className={styles.signLeftNav}>选择基础上抛授权策略</div>
          {
            marketResourcePage.signResources.filter((r, i) => i !== 0)
              .map((r) => (<a className={styles.signResource} key={r.id}>
                <FTitleText
                  type="h5"
                  text={r.name}
                  singleRow
                />
                <div style={{height: 5}}/>
                <FContentText
                  type="additional2"
                  text={r.type}
                />
                <div style={{height: 5}}/>
                <div className={styles.policeTags}>
                  {
                    r.policies.filter((p) => p.checked)
                      .map((p) => (<label key={p.id}>{p.name}</label>))
                  }
                </div>
              </a>))
          }
        </div>
        <div className={styles.signRight}>

          {
            marketResourcePage.signResources
              .filter((r) => r.checked)
              // .map((r) => r.policies)
              .map(({policies}, i) => (<div key={i}>
                {
                  policies.map((p) => (<div className={styles.singPolicy} key={p.id}>
                    <div className={styles.PolicyName}>
                      <Checkbox
                        // disabled={i.status === 0}
                        checked={p.checked}
                        // onChange={(e) => onChangeChecked(e.target.checked, i)}
                      />
                      <div style={{width: 5}}/>
                      <span>{p.name}</span>
                    </div>
                    <div style={{height: 15}}/>
                    <pre>{p.text}</pre>
                  </div>))
                }

              </div>))
          }


          {/*<div className={styles.singPolicy}>*/}
          {/*  <div className={styles.PolicyName}>*/}
          {/*    <Checkbox*/}
          {/*      // disabled={i.status === 0}*/}
          {/*      checked={true}*/}
          {/*      // onChange={(e) => onChangeChecked(e.target.checked, i)}*/}
          {/*    />*/}
          {/*    <div style={{width: 5}}/>*/}
          {/*    <span>策略1</span>*/}
          {/*  </div>*/}
          {/*  <div style={{height: 15}}/>*/}
          {/*  <pre>{'initial:\n' +*/}
          {/*  '    active\n' +*/}
          {/*  '    recontractable\n' +*/}
          {/*  '    presentable\n' +*/}
          {/*  '    terminate'}</pre>*/}
          {/*</div>*/}

        </div>

      </div>
      <div style={{height: 15}}/>
      <div className={styles.signBottom}>
        <FNormalButton
          className={styles.signButton}
        >签约</FNormalButton>
      </div>
    </div>
  </div>);
}

export default connect(({marketResourcePage}: ConnectState) => ({marketResourcePage}))(Sign);
