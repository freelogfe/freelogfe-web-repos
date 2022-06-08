import * as React from 'react';
import { connect, Dispatch } from 'dva';
import { ConnectState, DiscoverPageModelState } from '@/models/connect';
import styles from './index.less';
import {
  OnChangeKeywordsAction,
  OnChangeResourceTypeAction,
  OnClickLoadMoreBtnAction, OnMountMarketPageAction, OnMountPageAction,
  OnUnmountMarketPageAction, OnUnmountPageAction,
} from '@/models/discoverPage';
import FInput from '@/components/FInput';
import FResourceCard from '@/components/FResourceCard';
import { Button } from 'antd';
// import { router } from 'umi';
import FNoDataTip from '@/components/FNoDataTip';
import { FUtil } from '@freelog/tools-lib';
import FLoadingTip from '@/components/FLoadingTip';
import * as AHooks from 'ahooks';

interface MarketProps {
  dispatch: Dispatch;
  discoverPage: DiscoverPageModelState,
}

function Market({ dispatch, discoverPage }: MarketProps) {

  AHooks.useMount(() => {
    dispatch<OnMountMarketPageAction>({
      type: 'discoverPage/onMountMarketPage',
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmountMarketPageAction>({
      type: 'discoverPage/onUnmountMarketPage',
    });
  });

  return (<>
    <div style={{ height: 30 }} />
    <div>

    </div>
    <div className={styles.filter}>
      <Labels
        options={discoverPage.resourceTypeOptions}
        value={discoverPage.resourceType}
        onChange={(value) => {
          dispatch<OnChangeResourceTypeAction>({
            type: 'discoverPage/onChangeResourceType',
            payload: {
              value: value,
            },
          });
        }}
      />
      <FInput
        value={discoverPage.inputText}
        debounce={300}
        onDebounceChange={(value) => {
          dispatch<OnChangeKeywordsAction>({
            type: 'discoverPage/onChangeKeywords',
            payload: {
              value: value,
            },
          });
        }}
        theme='dark'
        size='small'
        className={styles.filterInput}
      />
    </div>

    {
      discoverPage.totalItem === -1 && (<FLoadingTip height={'calc(100vh - 140px - 50px)'} />)
    }

    {
      discoverPage.dataSource.length > 0
        ? (<>
          <div style={{ height: 30 }} />
          <div className={styles.Content}>
            {
              discoverPage.dataSource.map((resource: any) => (
                <FResourceCard
                  key={resource.id}
                  resource={resource}
                  className={styles.FResourceCard}
                  onClick={() => {
                    window.open(FUtil.LinkTo.resourceDetails({
                      resourceID: resource.id,
                    }));
                  }}
                />))
            }
            <div className={styles.bottomPadding} />
            <div className={styles.bottomPadding} />
            <div className={styles.bottomPadding} />
            <div className={styles.bottomPadding} />
          </div>

          {
            discoverPage.totalItem > discoverPage.dataSource.length && (<>
              <div style={{ height: 100 }} />
              <div className={styles.bottom}>
                <Button
                  className={styles.loadMore}
                  onClick={() => {
                    dispatch<OnClickLoadMoreBtnAction>({
                      type: 'discoverPage/onClickLoadMoreBtn',
                    });
                  }}
                >加载更多</Button>
              </div>
            </>)
          }
          <div style={{ height: 200 }} />
        </>)
        : discoverPage.totalItem === 0
          ? (<FNoDataTip
            height={'calc(100vh - 275px)'}
            tipText={'没有符合条件的资源'}
          />)
          : null
    }

  </>);
}

export default connect(({ discoverPage }: ConnectState) => ({
  discoverPage: discoverPage,
}))(Market);

interface Labels {
  options: {
    value: string;
    text?: string;
  }[];
  value: string;
  onChange?: (value: string) => void;
}

function Labels({ options, value, onChange }: Labels) {
  return (<div>
    {
      options.map((i, j) => (
        <a key={i.value}
           className={styles.filterTag + ' ' + (i.value === value ? styles.filterTagActive : '')}
           onClick={() => onChange && onChange(i.value)}
        >{i.text || i.value}</a>))
    }
  </div>);
}
