import * as React from 'react';
import styles from './index.less';
import {Space} from "antd";
import {FContentText} from "../FText";
import FTooltip from "../FTooltip";
import {FInfo} from "../FIcons";
import {FCircleBtn} from "../FButton";

interface FBasePropertiesCardsProps {
  rawProperties: {
    theKey: string;
    value: string;
  }[];
  baseProperties: {
    theKey: string;
    description: string;
    value: string;
  }[];

  onEdit?(theKey: string): void;

  onDelete?(theKey: string): void;
}

function FBasePropertiesCards({rawProperties, baseProperties, onEdit, onDelete}: FBasePropertiesCardsProps) {
  return (<div className={styles.styles}>
    {
      rawProperties.map((rp) => {
        return (<div className={styles.rawProperties} key={rp.theKey}>
          <div>
            <div style={{height: 5}}/>
            <FContentText text={rp.theKey} type="additional2"/>
            <div style={{height: 10}}/>
            <FContentText singleRow text={rp.value}/>
          </div>
        </div>);
      })
    }

    {
      baseProperties.map((bp) => {
        return (<div className={styles.baseProperty} key={bp.theKey}>
          <div>
            <div>
              <Space size={5}>
                <FContentText
                  text={bp.theKey}
                  type="additional2"
                  singleRow
                  style={{
                    maxWidth: 80
                  }}
                />
                {bp.description && (
                  <FTooltip title={bp.description}><FInfo style={{cursor: 'pointer', fontSize: 14}}/></FTooltip>)}
              </Space>
              <div style={{height: 10}}/>
              <FContentText
                singleRow
                text={bp.value}
                style={{maxWidth: 110}}
              />
            </div>
            <Space size={10} className={styles.Operation}>
              {
                onEdit && (<FTooltip title={'编辑'}>
                  <div>
                    <FCircleBtn
                      type="minor"
                      onClick={() => {
                        onEdit(bp.theKey);
                      }}
                    />
                  </div>
                </FTooltip>)
              }

              {
                onDelete && (<FTooltip title={'删除'}>
                  <div>
                    <FCircleBtn
                      type="danger"
                      onClick={() => {
                        onDelete(bp.theKey);
                      }}
                    />
                  </div>
                </FTooltip>)
              }

            </Space>
          </div>
        </div>);
      })
    }

  </div>);
}

export default FBasePropertiesCards;
