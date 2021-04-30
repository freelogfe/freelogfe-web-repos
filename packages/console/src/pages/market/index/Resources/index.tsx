import * as React from 'react';
import {connect, Dispatch} from 'dva';
import {ConnectState, MarketPageModelState} from '@/models/connect';
import styles from '@/pages/market/index/index.less';
import {ChangeAction, ChangeStatesAction, FetchDataSourceAction, marketInitData} from '@/models/marketPage';
import FInput from '@/components/FInput';
import FResourceCard from '@/components/FResourceCard';
import {Button} from 'antd';
// import {resourceTypes} from '@/utils/predefined';
import {router} from "umi";
import FNoDataTip from "@/components/FNoDataTip";
import FUtil from "@/utils";
import FLoadingTip from "@/components/FLoadingTip";
import * as AHooks from 'ahooks';

const filters = [{
  value: '-1',
  text: '全部类型'
}, ...FUtil.Predefined.resourceTypes.map((i) => ({value: i}))];

interface ResourcesProps {
  dispatch: Dispatch;
  marketPage: MarketPageModelState,
}

function Resources({dispatch, marketPage}: ResourcesProps) {

  AHooks.useUnmount(() => {
    dispatch<ChangeAction>({
      type: 'marketPage/change',
      payload: marketInitData,
    });
  });

  return (<>
    <div style={{height: 30}}/>
    <div className={styles.filter}>
      <Labels
        options={filters}
        value={marketPage.resourceType}
        onChange={(value) => dispatch<ChangeStatesAction>({
          type: 'marketPage/changeStates',
          payload: {resourceType: value as string},
        })}
      />
      <FInput
        value={marketPage.inputText}
        debounce={300}
        onDebounceChange={(value) => dispatch<ChangeStatesAction>({
          type: 'marketPage/changeStates',
          payload: {inputText: value},
        })}
        // onChange={(e) => }
        theme="dark"
        size="small"
        className={styles.filterInput}
      />
    </div>

    {
      marketPage.totalItem === -1 && (<FLoadingTip height={'calc(100vh - 140px - 50px)'}/>)
    }

    {
      marketPage.dataSource.length > 0
        ? (<>
          <div style={{height: 30}}/>
          <div className={styles.Content}>
            {
              marketPage.dataSource.map((resource: any) => (
                <FResourceCard
                  key={resource.id}
                  resource={resource}
                  className={styles.FResourceCard}
                  onClick={() => {
                    // console.log(resource, 'resourceq098upioq');
                    // return router.push(`/resource/${resource.id}`);
                    return router.push(FUtil.LinkTo.resourceDetails({
                      resourceID: resource.id,
                    }));
                  }}
                />))
            }
            <div className={styles.bottomPadding}/>
            <div className={styles.bottomPadding}/>
            <div className={styles.bottomPadding}/>
            <div className={styles.bottomPadding}/>
          </div>

          {
            marketPage.totalItem > marketPage.dataSource.length && (<>
              <div style={{height: 100}}/>
              <div className={styles.bottom}>
                <Button
                  className={styles.loadMore}
                  onClick={() => dispatch<FetchDataSourceAction>({
                    type: 'marketPage/fetchDataSource',
                    payload: false,
                  })}
                >加载更多</Button>
              </div>
            </>)
          }
          <div style={{height: 200}}/>
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

export default connect(({marketPage}: ConnectState) => ({
  marketPage: marketPage,
}))(Resources);

interface Labels {
  options: {
    value: string | number;
    text?: string | number;
  }[];
  value: string | number;
  onChange?: (value: string | number) => void;
}

function Labels({options, value, onChange}: Labels) {
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
