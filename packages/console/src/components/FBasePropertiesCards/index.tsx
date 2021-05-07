import * as React from 'react';
import styles from './index.less';
import {Col, Row, Space} from "antd";
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
  return (<div>
    <Row gutter={[10, 10]}>
      {
        rawProperties.map((rp) => {
          return (<Col key={rp.theKey} span={6}>
            <div className={styles.rawProperties}>
              <div style={{height: 5}}/>
              <FContentText text={rp.theKey} type="additional2"/>
              <div style={{height: 10}}/>
              <FContentText singleRow text={rp.value}/>
            </div>
          </Col>)
        })
      }

      {
        baseProperties.map((bp) => {
          return (<Col
            key={bp.theKey}
            span={6}
          >
            <div className={styles.baseProperty}>
              <div>
                <Space size={5}>
                  <FContentText text={bp.theKey} type="additional2"/>
                  {bp.description && (<FTooltip title={bp.description}><FInfo/></FTooltip>)}
                </Space>
                <div style={{height: 10}}/>
                <FContentText singleRow text={bp.value}/>
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
          </Col>)
        })
      }

    </Row>
  </div>);
}

export default FBasePropertiesCards;
