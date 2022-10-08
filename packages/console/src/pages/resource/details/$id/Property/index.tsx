import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ResourceDetailPageModelState } from '@/models/connect';
import FTooltip from '@/components/FTooltip';
import { Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';

interface PropertyProps {
  dispatch: Dispatch;
  resourceDetailPage: ResourceDetailPageModelState,
}

function Property({ dispatch, resourceDetailPage }: PropertyProps) {
  if (resourceDetailPage.resourceVersion_Info.properties.length === 0) {
    return null;
  }

  return (<>
    <div style={{ height: 30 }} />
    <div>
      <FComponentsLib.FTitleText
        text={'基础属性'}
        type='h3'
      />
      <div style={{ height: 20 }} />
      <div className={styles.list}>
        {
          resourceDetailPage.resourceVersion_Info.properties.map((p, index) => {
            return (<div key={p.key}>
              <Space size={10}>
                <FComponentsLib.FContentText
                  text={p.key}
                  type='negative'
                />
                {
                  p.description && (<FTooltip
                    title={p.description}
                  >
                    <FComponentsLib.FIcons.FInfo
                      style={{ cursor: 'pointer', fontSize: 14 }}
                    />
                  </FTooltip>)
                }
              </Space>
              <div style={{ height: 10 }} />
              <FComponentsLib.FContentText
                style={{ maxWidth: 215 }}
                text={p.value}
                singleRow
              />
            </div>);
            // return (<Item
            //   key={index}
            //   tTey={p.key}
            //   value={p.value}
            //   description={p.description}
            // />);
          })
        }

      </div>
      {/*<div className={styles.content}>*/}
      {/*  <div>*/}
      {/*    <table>*/}
      {/*      <tbody>*/}
      {/*      {*/}
      {/*        marketResourcePage.properties.filter((p, i) => i % 3 === 0)*/}
      {/*          .map((p, index) => {*/}
      {/*            return (<Item*/}
      {/*              key={index}*/}
      {/*              tTey={p.key}*/}
      {/*              value={p.value}*/}
      {/*              description={p.description}*/}
      {/*            />);*/}
      {/*          })*/}
      {/*      }*/}
      {/*      </tbody>*/}
      {/*    </table>*/}
      {/*  </div>*/}
      {/*  <div style={{width: 10}}/>*/}
      {/*  <div>*/}
      {/*    <table>*/}
      {/*      <tbody>*/}
      {/*      {*/}
      {/*        marketResourcePage.properties.filter((p, i) => i % 3 === 1)*/}
      {/*          .map((p, index) => {*/}
      {/*            return (<Item*/}
      {/*              key={index}*/}
      {/*              tTey={p.key}*/}
      {/*              value={p.value}*/}
      {/*              description={p.description}*/}
      {/*            />);*/}
      {/*          })*/}
      {/*      }*/}
      {/*      </tbody>*/}
      {/*    </table>*/}
      {/*  </div>*/}
      {/*  <div style={{width: 10}}/>*/}
      {/*  <div>*/}
      {/*    <table>*/}
      {/*      <tbody>*/}
      {/*      {*/}
      {/*        marketResourcePage.properties.filter((p, i) => i % 3 === 2)*/}
      {/*          .map((p, index) => {*/}
      {/*            return (<Item*/}
      {/*              key={index}*/}
      {/*              tTey={p.key}*/}
      {/*              value={p.value}*/}
      {/*              description={p.description}*/}
      {/*            />);*/}
      {/*          })*/}
      {/*      }*/}
      {/*      </tbody>*/}
      {/*    </table>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
    <div style={{ height: 20 }} />
  </>);
}

export default connect(({ resourceDetailPage }: ConnectState) => ({ resourceDetailPage }))(Property);

// interface ItemProps {
//   tTey: string;
//   value: string;
//   description?: string;
// }
//
// function Item({tTey, value, description}: ItemProps) {
//   return (<tr key={tTey}>
//     <td>
//       <Space size={10}>
//         <FContentText text={tTey} type="negative"/>
//         {description && (
//           <FTooltip title={description}><FInfo style={{cursor: 'pointer'}}/></FTooltip>)}
//       </Space>
//       <div style={{height: 10}}/>
//       <FContentText
//         style={{maxWidth: 215}}
//         text={value}
//         singleRow
//       />
//     </td>
//   </tr>);
// }
