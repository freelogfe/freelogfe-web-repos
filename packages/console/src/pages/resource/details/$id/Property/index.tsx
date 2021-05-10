import * as React from 'react';
import {FTitleText, FContentText} from '@/components/FText';
import styles from './index.less';
import {Dispatch, connect} from 'dva';
import {ConnectState, MarketResourcePageModelState} from '@/models/connect';
import FTooltip from "@/components/FTooltip";
import {FInfo} from "@/components/FIcons";
import {Space} from "antd";

interface PropertyProps {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageModelState,
}

function Property({dispatch, marketResourcePage}: PropertyProps) {
  if (marketResourcePage.properties.length === 0) {
    return null;
  }

  return (<>
    <div style={{height: 30}}/>
    <div>
      <FContentText text={'基础属性'} type="highlight"/>
      <div style={{height: 20}}/>
      <div className={styles.content}>
        <div>
          <table>
            <tbody>
            {
              marketResourcePage.properties.filter((p, i) => i % 3 === 0)
                .map((p, index) => {
                  return (<Item
                    key={index}
                    tTey={p.key}
                    value={p.value}
                    description={p.description}
                  />);
                })
            }
            </tbody>
          </table>
        </div>
        <div style={{width: 10}}/>
        <div>
          <table>
            <tbody>
            {
              marketResourcePage.properties.filter((p, i) => i % 3 === 1)
                .map((p, index) => {
                  return (<Item
                    key={index}
                    tTey={p.key}
                    value={p.value}
                    description={p.description}
                  />);
                })
            }
            </tbody>
          </table>
        </div>
        <div style={{width: 10}}/>
        <div>
          <table>
            <tbody>
            {
              marketResourcePage.properties.filter((p, i) => i % 3 === 2)
                .map((p, index) => {
                  return (<Item
                    key={index}
                    tTey={p.key}
                    value={p.value}
                    description={p.description}
                  />);
                })
            }
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div style={{height: 20}}/>
  </>);
}

export default connect(({marketResourcePage}: ConnectState) => ({marketResourcePage}))(Property);

interface ItemProps {
  tTey: string;
  value: string;
  description?: string;
}

function Item({tTey, value, description}: ItemProps) {
  return (<tr key={tTey}>
    <td>
      <Space size={5}>
        <FContentText text={tTey} type="negative"/>
        {description && (
          <FTooltip title={description}><FInfo style={{cursor: 'pointer'}}/></FTooltip>)}
      </Space>
    </td>
    <td><FContentText text={value}/></td>
  </tr>);
}
