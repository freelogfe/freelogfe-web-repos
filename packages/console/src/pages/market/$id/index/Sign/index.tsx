import * as React from 'react';
import styles from './index.less';
import FCopyToClipboard from '@/components/FCopyToClipboard';
import {FContentText, FTitleText} from '@/components/FText';
import {FDown, FFavorite} from '@/components/FIcons';
import {Checkbox, Space} from 'antd';
import {FNormalButton} from '@/components/FButton';

function Sign() {
  return (<div className={styles.info}>
    <div className={styles.infoLeft}>
      <img
        className={styles.cover}
        src={'https://image.freelog.com/preview-image/f3b712c4a7a052d71226e1d5b1c0c3342ae8d725'}/>
      <div style={{height: 10}}/>
      <div className={styles.title}>
            <span
              className={styles.titleText}>12345467890/123454678901234546789012345467890123454678901234546789012345467890 </span>
        <FCopyToClipboard
          text={'stefan/Smells like teen spirit'}
          title={'复制资源名称'}
        />
      </div>
      <div style={{height: 10}}/>
      <div className={styles.babels}>
        <label>audio</label>
        <label>音乐</label>
        <label>摇滚</label>
      </div>
      <div style={{height: 10}}/>
      <FContentText
        text={'《Smells Like Teen Spirit》是涅槃乐队演唱的一首垃圾摇滚风格单曲，由科特·柯本、大卫·格鲁、克里斯特·诺沃塞克共同作词作曲，布奇·维格制作，发行于1991年9月10日，被收录在涅槃乐队第二张录…'}/>
      <div style={{height: 20}}/>
      <a className={styles.favoriteBtn}>
        <FFavorite/> 收藏 (219人气)
      </a>
    </div>
    <div className={styles.cell}/>
    <div className={styles.infoRight}>
      <div className={styles.nodeSelector}>
        <Space size={20}>
          <span className={styles.nodeSelectorLabel}>签约节点</span>
          <FContentText text={'签约节点'}/>
        </Space>
        <FDown/>
      </div>
      <div style={{height: 15}}/>
      <div className={styles.sign}>
        <div className={styles.signLeft}>
          <div className={styles.signLeftNav}>选择主资源授权策略</div>
          <a className={styles.signResource + ' ' + styles.activatedSignResource}>
            <FTitleText
              type={'h5'}
              text={'stefan/Smells like teen spirit'}
              singleRow={true}
            />
            <div style={{height: 5}}/>
            <FContentText
              type="additional2"
              text={'audio'}
            />
            <div style={{height: 5}}/>
            <div className={styles.policeTags}>
              <label>策略1</label>
            </div>
          </a>
          <div className={styles.signLeftNav}>选择基础上抛授权策略</div>
          <a className={styles.signResource}>
            <FTitleText
              type={'h5'}
              text={'stefan/Smells like teen spirit'}
              singleRow={true}
            />
            <div style={{height: 5}}/>
            <FContentText
              type="additional2"
              text={'audio'}
            />
            <div style={{height: 5}}/>
            <div className={styles.policeTags}>
              <label>策略1</label>
            </div>
          </a>
        </div>
        <div className={styles.signRight}>
          <div>
            <div className={styles.singPolicy}>
              <div className={styles.PolicyName}>
                <Checkbox
                  // disabled={i.status === 0}
                  checked={true}
                  // onChange={(e) => onChangeChecked(e.target.checked, i)}
                />
                <div style={{width: 5}}/>
                <span>策略1</span>
              </div>
              <div style={{height: 15}}/>
              <pre>{'initial:\n' +
              '    active\n' +
              '    recontractable\n' +
              '    presentable\n' +
              '    terminate'}</pre>
            </div>

            <div className={styles.singPolicy}>
              <div className={styles.PolicyName}>
                <Checkbox
                  // disabled={i.status === 0}
                  checked={true}
                  // onChange={(e) => onChangeChecked(e.target.checked, i)}
                />
                <div style={{width: 5}}/>
                <span>策略1</span>
              </div>
              <div style={{height: 15}}/>
              <pre>{'initial:\n' +
              '    active\n' +
              '    recontractable\n' +
              '    presentable\n' +
              '    terminate'}</pre>
            </div>
          </div>
        </div>

      </div>
      <div style={{height: 15}}/>
      <div className={styles.signBottom}>
        <FNormalButton
          className={styles.signButton}
        >签约</FNormalButton>
      </div>
    </div>
  </div>);
}

export default Sign;
