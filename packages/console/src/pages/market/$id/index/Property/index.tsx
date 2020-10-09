import * as React from 'react';
import {FTitleText, FContentText} from '@/components/FText';
import styles from './index.less';
import {Dispatch, connect} from 'dva';
import {ConnectState, MarketResourcePageState} from '@/models/connect';

interface PropertyProps {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageState,
}

function Property({dispatch, marketResourcePage: {properties}}: PropertyProps) {
  return (<div>
    <FTitleText text={'基础属性'} type="h3"/>
    <div style={{height: 20}}/>
    <div className={styles.content}>
      <div>
        <table>
          <tbody>
          {
            properties.filter((p, i) => i % 3 === 0)
              .map((p) => (<tr key={p.key}>
                <td><FContentText text={p.key} type="negative"/></td>
                <td><FContentText text={p.value}/></td>
              </tr>))
          }
          </tbody>
        </table>
      </div>
      <div style={{width: 10}}/>
      <div>
        <table>
          <tbody>
          {
            properties.filter((p, i) => i % 3 === 1)
              .map((p) => (<tr key={p.key}>
                <td><FContentText text={p.key} type="negative"/></td>
                <td><FContentText text={p.value}/></td>
              </tr>))
          }
          </tbody>
        </table>
      </div>
      <div style={{width: 10}}/>
      <div>
        <table>
          <tbody>
          {
            properties.filter((p, i) => i % 3 === 2)
              .map((p) => (<tr key={p.key}>
                <td><FContentText text={p.key} type="negative"/></td>
                <td><FContentText text={p.value}/></td>
              </tr>))
          }
          </tbody>
        </table>
      </div>
    </div>
  </div>);
}

export default connect(({marketResourcePage}: ConnectState) => ({marketResourcePage}))(Property);
