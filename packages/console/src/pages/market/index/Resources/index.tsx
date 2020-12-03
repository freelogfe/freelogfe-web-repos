import * as React from 'react';
import {connect, Dispatch} from 'dva';
import {ConnectState, MarketPageModelState} from '@/models/connect';
import styles from '@/pages/market/index/index.less';
import {ChangeStatesAction, FetchDataSourceAction} from '@/models/marketPage';
import FInput from '@/components/FInput';
import FResourceCard from '@/components/FResourceCard';
import {Button} from 'antd';
import {resourceTypes} from '@/utils/globals';
import {router} from "umi";
import FNoDataTip from "@/components/FNoDataTip";

const filters = [{
  value: '-1',
  text: '全部类型'
}, ...resourceTypes.map((i) => ({value: i}))];

interface ResourcesProps {
  dispatch: Dispatch;
  market: MarketPageModelState,
}

function Resources({dispatch, market}: ResourcesProps) {

  const [contentMinHeight, setContentMinHeight] = React.useState<number>(window.innerHeight - 275);

  React.useEffect(() => {
    window.addEventListener('resize', setHeight);
    return () => {
      window.removeEventListener('resize', setHeight);
    }
  }, []);

  function setHeight() {
    setContentMinHeight(window.innerHeight - 275);
  }

  // <FNoDataTip height={} tipText={}
  return (<>
    <div style={{height: 30}}/>
    <div className={styles.filter}>
      <Labels
        options={filters}
        value={market.resourceType}
        onChange={(value) => dispatch<ChangeStatesAction>({
          type: 'marketPage/changeStates',
          payload: {resourceType: value as string},
        })}
      />
      <FInput
        value={market.inputText}
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
      market.dataSource.length > 0
        ? (<>
          <div style={{height: 30}}/>
          <div className={styles.Content}>
            {
              market.dataSource.map((resource: any) => (
                <FResourceCard
                  key={resource.id}
                  resource={resource}
                  className={styles.FResourceCard}
                  onClick={() => {
                    // console.log(resource, 'resourceq098upioq');
                    return router.push(`/resource/${resource.id}`);
                  }}
                />))
            }
            <div className={styles.bottomPadding}/>
            <div className={styles.bottomPadding}/>
            <div className={styles.bottomPadding}/>
            <div className={styles.bottomPadding}/>
          </div>

          {
            market.totalItem > market.dataSource.length && (<>
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
        : (<FNoDataTip
          height={contentMinHeight}
          tipText={'没有符合条件的资源'}
        />)
    }

  </>);
}

export default connect(({marketPage}: ConnectState) => ({
  market: marketPage,
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
