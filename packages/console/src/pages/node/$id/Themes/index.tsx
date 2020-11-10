import * as React from 'react';
import styles from './index.less';
import {FTitleText, FContentText} from '@/components/FText';
import FInput from '@/components/FInput';
import * as imgSrc from '@/assets/default-resource-cover.jpg';
import {Space} from 'antd';
import {FWarning} from '@/components/FIcons';
import {connect, Dispatch} from 'dva';
import {ConnectState, NodeManagerModelState} from "@/models/connect";
import {OnChangeThemeAction} from "@/models/nodeManagerPage";
import {router} from "umi";
import {i18nMessage} from "@/utils/i18n";

interface ThemesProps {
  dispatch: Dispatch;
  nodeManagerPage: NodeManagerModelState;
}

function Themes({dispatch, nodeManagerPage}: ThemesProps) {

  // React.useEffect(() => {
  //   console.log('Themes useEffect');
  // }, []);

  return (<div>
    <div className={styles.header}>
      <FTitleText type="h1" text={'主题管理'}/>
      <FInput
        className={styles.input}
        theme="dark"
        debounce={300}
        onDebounceChange={(value) => dispatch<OnChangeThemeAction>({
          type: 'nodeManagerPage/onChangeTheme',
          payload: {
            themeInputFilter: value,
          },
        })}
      />
    </div>
    <div className={styles.body}>
      {
        nodeManagerPage.themeList.map((i) => (<div
          className={styles.theme}
          key={i.id}
        >
          <div className={styles.cover}>
            <Space size={10}>
              <Label active={i.isOnline}/>
              {!i.isOnline && <FWarning/>}
            </Space>

            <img alt="" src={i.cover || imgSrc}/>
            <div
              className={styles.action}
              style={{justifyContent: 'space-between'}}
            >
              <span onClick={() => router.push('/node/exhibit/' + i.id)}>编辑</span>
              <span>|</span>
              <span>激活</span>
            </div>
          </div>
          <div style={{height: 12}}/>
          <FContentText
            text={i.title}
            singleRow
          />
          <div style={{height: 6}}/>
          <FContentText type="additional1" text={'展示版本 1.0.10'}/>
          <div style={{height: 15}}/>
          <div className={styles.bottom}>
            <div className={styles.polices}>
              {
                i.policies.map((p) => (<label>{p}</label>))
              }
            </div>
            <a onClick={() => null}>{i18nMessage('more_details')}>></a>
          </div>
        </div>))
      }
      <div style={{width: 290}}/>
      <div style={{width: 290}}/>
    </div>
  </div>);
}

export default connect(({nodeManagerPage}: ConnectState) => ({
  nodeManagerPage,
}))(Themes);

interface LabelProps {
  active?: boolean
}

function Label({active = true}: LabelProps) {
  return (<label
    className={styles.label + ' ' + (active ? styles.labelActive : styles.labelInActive)}>{active ? '已激活' : '未激活'}</label>);
}
