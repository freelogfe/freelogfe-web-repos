import * as React from 'react';
import styles from './index.less';
// import {Col, Drawer, Row, Space} from "antd";
// import {FTextButton, FCircleButton, FNormalButton} from "@/components/FButton";
// import {FContentText, FTitleText} from "@/components/FText";
// import FTooltip from "@/components/FTooltip";
// import {FInfo} from "@/components/FIcons";
// import {CloseCircleFilled} from '@ant-design/icons';
// import FInput from "@/components/FInput";
// import {ChangeAction, UpdateObjectInfoAction} from "@/models/storageObjectEditor";
// import {UpdateAObjectAction} from "@/models/storageHomePage";
import FBasePropertiesCards from "@/components/FBasePropertiesCards";

// interface FBasePropertiesState {
//   visible: boolean;
//   editDataSource: {
//     key: string;
//     keyError: string;
//     value: string;
//     valueError: string;
//     description: string;
//     descriptionError: string;
//   }[];
// }

interface FBasePropertiesProps {
  basics: {
    key: string;
    value: string;
  }[];
  additions: {
    key: string;
    value: string;
    description: string;
  }[];

  rightTop?: React.ReactNode;

  onChangeAdditions?(value: FBasePropertiesProps['additions']): void;
}

function FBaseProperties({basics, additions, rightTop, onChangeAdditions}: FBasePropertiesProps) {

  return (<div className={styles.attributes}>
      <div className={styles.attributesHeader}>
        <span>基础属性</span>
        <div>{rightTop}</div>
      </div>

      <FBasePropertiesCards
        rawProperties={basics.map((b) => {
          return {
            theKey: b.key,
            value: b.value,
          };
        })}
        baseProperties={additions.map((a) => {
          return {
            theKey: a.key,
            description: a.description,
            value: a.value,
          };
        })}
        // onEdit={(theKey) => {
        //
        // }}
        onDelete={(theKey) => {
          onChangeAdditions && onChangeAdditions(additions.filter((a) => {
            return a.key !== theKey;
          }));
        }}
      />
      <div style={{height: 10}}/>

      {/*<div className={styles.attributesBody}>*/}
      {/*  <Row gutter={[20, 20]}>*/}
      {/*    {*/}
      {/*      basics.map((b) => {*/}
      {/*        return (<Col key={b.key} span={6}>*/}
      {/*          <FContentText text={b.key} type="additional2"/>*/}
      {/*          <div style={{height: 10}}/>*/}
      {/*          <FContentText singleRow text={b.value}/>*/}
      {/*        </Col>);*/}
      {/*      })*/}
      {/*    }*/}

      {/*    {*/}
      {/*      additions.map((ad) => {*/}
      {/*        return (<Col key={ad.key} span={6}>*/}
      {/*          <Space size={5}>*/}
      {/*            <FContentText text={ad.key} type="additional2"/>*/}
      {/*            {*/}
      {/*              ad.description && (<FTooltip title={ad.description}><FInfo/></FTooltip>)*/}
      {/*            }*/}

      {/*            <FTextButton>*/}
      {/*              <CloseCircleFilled onClick={() => {*/}
      {/*                onChangeAdditions && onChangeAdditions(additions.filter((a) => {*/}
      {/*                  return a.key !== ad.key;*/}
      {/*                }));*/}
      {/*              }}/>*/}
      {/*            </FTextButton>*/}
      {/*          </Space>*/}
      {/*          <div style={{height: 10}}/>*/}
      {/*          <FContentText singleRow text={ad.value}/>*/}
      {/*        </Col>);*/}
      {/*      })*/}
      {/*    }*/}

      {/*  </Row>*/}
      {/*</div>*/}
    </div>
  );
}

export default FBaseProperties;
