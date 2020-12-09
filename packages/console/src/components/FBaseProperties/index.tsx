import * as React from 'react';
import styles from './index.less';
import {Col, Drawer, Row, Space} from "antd";
import {FTextButton, FCircleButton, FNormalButton} from "@/components/FButton";
import {FContentText, FTitleText} from "@/components/FText";
import FTooltip from "@/components/FTooltip";
import {FInfo} from "@/components/FIcons";
import {CloseCircleFilled} from '@ant-design/icons';
import FInput from "@/components/FInput";
import {ChangeAction, UpdateObjectInfoAction} from "@/models/storageObjectEditor";
import {UpdateAObjectAction} from "@/models/storageHomePage";

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
  disabledKeys: string[];

  onChangeAdditions?(value: FBasePropertiesProps['additions']): void;

  onClickImport?(): void;
}

function FBaseProperties({}: FBasePropertiesProps) {

  const [visible, setVisible] = React.useState<boolean>(false);

  return (<>
    <div className={styles.attributes}>
      <div className={styles.attributesHeader}>
        <span>基础属性</span>

        <Space size={20}>
          <FTextButton theme="primary">补充属性</FTextButton>
          <FTextButton theme="primary">从上个版本导入</FTextButton>
        </Space>
      </div>
      <div className={styles.attributesBody}>
        <Row gutter={[20, 20]}>
          <Col span={6}>
            <FContentText text={'种类'} type="additional2"/>
            <div style={{height: 10}}/>
            <FContentText singleRow text={'png图像'}/>
          </Col>
          <Col span={6}>
            <Space size={5}>
              <FContentText text={'种类'} type="additional2"/>
              <FTooltip title={'描述'}><FInfo/></FTooltip>
              <FTextButton>
                <CloseCircleFilled/>
              </FTextButton>
            </Space>
            <div style={{height: 10}}/>
            <FContentText singleRow text={'png图像'}/>
          </Col>
        </Row>
      </div>
    </div>
    <Drawer
      title={'补充属性'}
      // onClose={() => onCancel && onCancel()}
      visible={visible}
      width={720}
      // className={styles}
      bodyStyle={{paddingLeft: 40, paddingRight: 40, height: 600, overflow: 'auto'}}
    >
      <Space
        size={30}
        direction="vertical"
        style={{width: '100%'}}
      >
        <Space size={10}>
          <div className={styles.input}>
            <div className={styles.title}>
              <i className={styles.dot}/>
              <FTitleText type="form">key</FTitleText>
            </div>
            <div style={{height: 5}}/>
            <FInput className={styles.input} placeholder={'输入key'}/>
          </div>
          <div className={styles.input}>
            <div className={styles.title}>
              <i className={styles.dot}/>
              <FTitleText type="form">value</FTitleText>
            </div>
            <div style={{height: 5}}/>
            <FInput className={styles.input} placeholder={'输入value'}/>
          </div>
          <div className={styles.input}>
            <div className={styles.title}>
              {/*<i className={styles.dot}/>*/}
              <FTitleText type="form">属性说明</FTitleText>
            </div>
            <div style={{height: 5}}/>
            <FInput className={styles.input} placeholder={'输入属性说明'}/>
          </div>
          <div>
            <div style={{height: 22}}/>
            <div className={styles.delete}>
              <FCircleButton theme="delete"/>
            </div>
          </div>
        </Space>

        <Space size={10}>
          <div className={styles.input}>
            <div className={styles.title}>
              <i className={styles.dot}/>
              <FTitleText type="form">key</FTitleText>
            </div>
            <div style={{height: 5}}/>
            <FInput className={styles.input} placeholder={'输入key'}/>
          </div>
          <div className={styles.input}>
            <div className={styles.title}>
              <i className={styles.dot}/>
              <FTitleText type="form">value</FTitleText>
            </div>
            <div style={{height: 5}}/>
            <FInput className={styles.input} placeholder={'输入value'}/>
          </div>
          <div className={styles.input}>
            <div className={styles.title}>
              {/*<i className={styles.dot}/>*/}
              <FTitleText type="form">属性说明</FTitleText>
            </div>
            <div style={{height: 5}}/>
            <FInput className={styles.input} placeholder={'输入属性说明'}/>
          </div>
          <div>
            <div style={{height: 22}}/>
            <div className={styles.delete}>
              <FCircleButton theme="delete"/>
            </div>
          </div>
        </Space>
      </Space>

      <div style={{height: 30}}/>
      <Space size={10}>
        <FCircleButton/>
        <FContentText text={'新增一项属性'}/>
      </Space>

      <div style={{height: 120}}/>
      <div className={styles.footer}>
        <Space size={30}>
          <FTextButton>取消</FTextButton>
          <FNormalButton
            // disabled={editor.typeVerify === 1 || hasError}
            // onClick={async () => {
            //   await dispatch<UpdateObjectInfoAction>({
            //     type: 'storageObjectEditor/updateObjectInfo',
            //   });
            //   dispatch<UpdateAObjectAction>({
            //     type: 'storageHomePage/updateAObject',
            //     payload: {
            //       id: editor.objectId,
            //       type: editor.type,
            //     },
            //   });
            //   dispatch<ChangeAction>({
            //     type: 'storageObjectEditor/change',
            //     payload: {
            //       visible: false,
            //     }
            //   });
            // }}
          >确定</FNormalButton>
        </Space>
      </div>
    </Drawer>
  </>);
}

export default FBaseProperties;
