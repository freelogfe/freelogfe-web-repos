import * as React from 'react';
import styles from './index.less';
import {FTitleText, FContentText} from '@/components/FText';
import FInput from '@/components/FInput';
import * as imgSrc from '@/assets/default-resource-cover.jpg';
import {Space} from 'antd';
import {FExclamation} from '@/components/FIcons';

interface ThemesProps {

}

function Themes({}: ThemesProps) {

  // React.useEffect(() => {
  //   console.log('Themes useEffect');
  // }, []);

  return (<div>
    <div className={styles.header}>
      <FTitleText type="h1" text={'主题管理'}/>
      <FInput
        className={styles.input}
        theme="dark"
      />
    </div>
    <div className={styles.body}>
      {
        [1, 2, 3, 4, 5, 6, 7].map((i) => (<div className={styles.theme} key={i}>
          <div className={styles.cover}>
            <Space size={10}>
              <Label active={false}/>
              <FExclamation/>
            </Space>

            <img alt="" src={imgSrc}/>
            <div className={styles.action} style={{justifyContent: 'space-between'}}>
                <span>编辑</span>
                <span>|</span>
                <span>激活</span>
            </div>
          </div>
          <div style={{height: 12}}/>
          <FContentText text={'这里是展品名称这里是展品名称这这里是展品名称这里是展品名称这'} singleRow/>
          <div style={{height: 6}}/>
          <FContentText type="additional1" text={'展示版本 1.0.10'}/>
          <div style={{height: 15}}/>
          <div className={styles.polices}>
            <label>免费</label>
            <label>免费2</label>
            <label>收费策略1</label>
          </div>
        </div>))
      }
      <div style={{width: 290}}/>
      <div style={{width: 290}}/>
    </div>
  </div>);
}

export default Themes;

interface LabelProps {
  active?: boolean
}

function Label({active = true}: LabelProps) {
  return (<label
    className={styles.label + ' ' + (active ? styles.labelActive : styles.labelInActive)}>{active ? '已激活' : '未激活'}</label>);
}
