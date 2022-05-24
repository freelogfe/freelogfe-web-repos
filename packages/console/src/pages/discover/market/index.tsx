import * as React from 'react';
import { connect, Dispatch } from 'dva';
import { ConnectState, MarketPageModelState } from '@/models/connect';
import styles from '@/pages/market/index/index.less';
import {
  OnChangeKeywordsAction,
  OnChangeResourceTypeAction,
  OnClickLoadMoreBtnAction, OnMountPageAction,
  OnUnmountMarketPageAction, OnUnmountPageAction,
} from '@/models/marketPage';
import FInput from '@/components/FInput';
import FResourceCard from '@/components/FResourceCard';
import { Button } from 'antd';
import { router } from 'umi';
import FNoDataTip from '@/components/FNoDataTip';
import { FUtil } from '@freelog/tools-lib';
import FLoadingTip from '@/components/FLoadingTip';
import * as AHooks from 'ahooks';

interface ResourcesProps {
  dispatch: Dispatch;
  marketPage: MarketPageModelState,
}

function Resources({ dispatch, marketPage }: ResourcesProps) {

  AHooks.useMount(() => {
    dispatch<OnMountPageAction>({
      type: 'marketPage/onMountPage',
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmountPageAction>({
      type: 'marketPage/onUnmountPage',
    });
  });

  return (<>
    <div style={{ height: 30 }} />
    <div className={styles.filter}>
      <Labels
        options={marketPage.resourceTypeOptions}
        value={marketPage.resourceType}
        onChange={(value) => {
          dispatch<OnChangeResourceTypeAction>({
            type: 'marketPage/onChangeResourceType',
            payload: {
              value: value,
            },
          });
        }}
      />
      <FInput
        value={marketPage.inputText}
        debounce={300}
        onDebounceChange={(value) => {
          dispatch<OnChangeKeywordsAction>({
            type: 'marketPage/onChangeKeywords',
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
      marketPage.totalItem === -1 && (<FLoadingTip height={'calc(100vh - 140px - 50px)'} />)
    }

    {
      marketPage.dataSource.length > 0
        ? (<>
          <div style={{ height: 30 }} />
          <div className={styles.Content}>
            {
              marketPage.dataSource.map((resource: any) => (
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
            marketPage.totalItem > marketPage.dataSource.length && (<>
              <div style={{ height: 100 }} />
              <div className={styles.bottom}>
                <Button
                  className={styles.loadMore}
                  onClick={() => {
                    dispatch<OnClickLoadMoreBtnAction>({
                      type: 'marketPage/onClickLoadMoreBtn',
                    });
                  }}
                >加载更多</Button>
              </div>
            </>)
          }
          <div style={{ height: 200 }} />
        </>)
        : marketPage.totalItem === 0
          ? (<FNoDataTip
            height={'calc(100vh - 275px)'}
            tipText={'没有符合条件的资源'}
          />)
          : null
    }

  </>);
}

export default connect(({ marketPage }: ConnectState) => ({
  marketPage: marketPage,
}))(Resources);

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
