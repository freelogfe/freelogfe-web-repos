import * as React from 'react';
import styles from './index.less';
import FNoDataTip from "@/components/FNoDataTip";
import {FContentText, FTitleText} from "@/components/FText";
import {Space} from "antd";
import {FTextButton} from "@/components/FButton";
import {ChangeAction, FetchThemeListAction, InformalNodeManagerPageModelState} from "@/models/informalNodeManagerPage";
import FAdd from "@/components/FIcons/FAdd";
import FInput from "@/components/FInput";
import * as imgSrc from '@/assets/default-resource-cover.jpg';
import {FWarning} from '@/components/FIcons';
import {router} from "umi";
import {Dispatch, connect} from 'dva';
import FIdentityTypeBadge from "@/components/FIdentityTypeBadge";
import MappingRule from "@/pages/node/informal/$id/Exhibit/MappingRule";
import {ConnectState} from "@/models/connect";
import FLoadingTip from "@/components/FLoadingTip";
import {informExhibitManagement} from "@/utils/path-assembler";

interface ThemeProps {
  dispatch: Dispatch;

  informalNodeManagerPage: InformalNodeManagerPageModelState;
}

function Theme({dispatch, informalNodeManagerPage}: ThemeProps) {

  React.useEffect(() => {
    dispatch<FetchThemeListAction>({
      type: 'informalNodeManagerPage/fetchThemeList',
    });
  }, []);

  if (informalNodeManagerPage.themeListIsLoading) {
    return (<FLoadingTip height={'calc(100vh - 94px)'}/>);
  }

  if (informalNodeManagerPage.themeList.length === 0) {
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
                <img src={t.cover || imgSrc} alt=""/>
                <div className={styles.coverLabel}>
                  {
                    t.isOnline
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
                    t.isOnline
                      ? (<span onClick={() => {
                        router.push(informExhibitManagement({exhibitID: t.id}));
                      }}>编辑</span>)
                      : (<div>
                        <div style={{width: 1}}/>
                        <span onClick={() => {
                          router.push(informExhibitManagement({exhibitID: t.id}));
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
                <FTitleText type="h5" text={t.name} singleRow/>
              </div>
              <div style={{height: 6}}/>
              <div className={styles.itemVersion}>
                <FContentText
                  text={`展示版本 ${t.version}`}
                  type="additional1"
                />
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
  </>);
}

export default connect(({informalNodeManagerPage}: ConnectState) => ({
  informalNodeManagerPage,
}))(Theme);
