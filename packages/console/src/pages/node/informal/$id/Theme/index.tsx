import * as React from 'react';
import styles from './index.less';
import FNoDataTip from "@/components/FNoDataTip";
import {FContentText, FTitleText} from "@/components/FText";
import {Space} from "antd";
import {FTextButton} from "@/components/FButton";
import {ChangeAction, InformalNodeManagerPageModelState} from "@/models/informalNodeManagerPage";
import FAdd from "@/components/FIcons/FAdd";
import FInput from "@/components/FInput";
import * as imgSrc from '@/assets/default-resource-cover.jpg';
import {FWarning} from '@/components/FIcons';
import {router} from "umi";
import {Dispatch, connect} from 'dva';
import FIdentityTypeBadge from "@/components/FIdentityTypeBadge";
import MappingRule from "@/pages/node/informal/$id/Exhibit/MappingRule";
import {ConnectState} from "@/models/connect";

interface ThemeProps {
  dispatch: Dispatch;

  informalNodeManagerPage: InformalNodeManagerPageModelState;
}

function Theme({dispatch, informalNodeManagerPage}: ThemeProps) {

  if (false) {
    return (<FNoDataTip
      height={'calc(100vh - 94px)'}
      tipText={'当前节点没有添加主题展品'}
      btnText={'添加测试主题展品'}
    />);
  }

  return (<>
    <div className={styles.header}>
      <FTitleText text={'展品管理'}/>
      <Space size={30}>
        <Space size={5}>
          <FTextButton onClick={() => {
            // dispatch<ChangeAction>({
            //   type: 'informalNodeManagerPage/change',
            //   payload: {
            //     addExhibitDrawerVisible: true,
            //   },
            // });
          }}><FAdd/></FTextButton>
          <FContentText text={'新增测试展品'}/>
        </Space>
        <div><FInput theme={'dark'}/></div>
      </Space>
    </div>

    <div className={styles.body}>
      <div className={styles.list}>
        {
          informalNodeManagerPage.themeList.map((t) => {
            return (<div key={t.id} className={styles.item}>
              <div className={styles.cover}>
                <img src={imgSrc} alt=""/>
                <div className={styles.coverLabel}>
                  {
                    false
                      ? (<label className={styles.activated}>已激活</label>)
                      : (<>
                        <label className={styles.nonActivated}>未激活</label>
                        <div style={{width: 10}}/>
                        <FWarning/>
                      </>)
                  }
                </div>
                <div className={styles.coverFooter}>
                  {
                    false
                      ? (<span onClick={() => {
                      }}>编辑</span>)
                      : (<div>
                        <div style={{width: 1}}/>
                        <span onClick={() => {
                        }}>编辑</span>
                        <span>|</span>
                        <span onClick={() => {
                        }}>激活</span>
                        <div style={{width: 1}}/>
                      </div>)
                  }

                </div>
              </div>
              <div style={{height: 12}}/>
              <div className={styles.itemTitle}>
                <FIdentityTypeBadge/>
                <div style={{width: 5}}/>
                <FTitleText type="h5" text={'markdown阅读器'} singleRow/>
              </div>
              <div style={{height: 6}}/>
              <div className={styles.itemVersion}>
                <FContentText text={'展示版本 1.0.10'} type="additional1"/>
              </div>
              <div style={{height: 10}}/>
              <div className={styles.itemBar}>
                <MappingRule/>
              </div>
            </div>);
          })
        }

      </div>
    </div>

    <div style={{height: 100}}/>
  </>);
}

export default connect(({informalNodeManagerPage}: ConnectState) => ({
  informalNodeManagerPage,
}))(Theme);
