import * as React from "react";
import styles from './index.less';
import {FTitleText, FContentText} from '@/components/FText';
import FCenterLayout from "@/layouts/FCenterLayout";
import {FInfo, FSwap} from "@/components/FIcons";
import FInput from "@/components/FInput";
import {Space, Tooltip, Drawer} from 'antd';

function Sign() {
  return (<FCenterLayout>
    <div className={styles.header}>
      <FTitleText text={'确认签约'}/>
      <div style={{width: 50}}/>
      <div className={styles.headerResource}>
        <img src={undefined}/>
        <div style={{width: 8}}/>
        <FContentText text={'stefan/Smells like teen spirit'}/>
      </div>
    </div>

    <div className={styles.content}>
      <div>
        <FTitleText type={'h3'} text={'确认签约节点'}/>
        <div style={{height: 20}}/>
        <div className={styles.nodeName}>
          <FTitleText type={'h5'} text={'我的音乐节点'}/>
          <div style={{width: 20}}/>
          <FSwap/>
        </div>
        <div style={{height: 50}}/>
        <FTitleText text={'输入展品名称'} type={'h3'}/>
        <div style={{height: 20}}/>
        <div className={styles.exhibitName}>
          <FInput className={styles.exhibitNameInput}/>
          <div style={{width: 10}}/>
          <Tooltip
            placement="leftBottom"
            title={'展品名称在当前节点内部唯一，后期不可修改，仅供编码用'}
          >
            <FInfo/>
          </Tooltip>
        </div>
        <div style={{height: 50}}/>
        <FTitleText text={'确认签约策略'} type={'h3'}/>
        <div style={{height: 20}}/>
        <div className={styles.smallTitle}>当前资源</div>
        <div style={{height: 10}}/>
        <a className={styles.resource}>
          <div>
            <FTitleText type={'h4'} text={'stefan/Smells like teen spirit'}/>
            <div style={{height: 5}}/>
            <FContentText type="additional2" text={'audio'}/>
          </div>
          <div className={styles.resourcePolicies}>
            <label>策略1</label>
          </div>
        </a>
        <div style={{height: 20}}/>
        <div className={styles.smallTitle}>基础上抛</div>
        <div style={{height: 10}}/>
        <Space
          direction="vertical"
          size={10}
          style={{width: '100%'}}
        >
          <a className={styles.resource}>
            <div>
              <FTitleText type={'h4'} text={'stefan/Smells like teen spirit'}/>
              <div style={{height: 5}}/>
              <FContentText type="additional2" text={'audio'}/>
            </div>
            <div className={styles.resourcePolicies}>
              <label>策略1</label>
              <label>策略1</label>
              <label>策略1</label>
            </div>
          </a>
          <a className={styles.resource}>
            <div>
              <FTitleText type={'h4'} text={'stefan/Smells like teen spirit'}/>
              <div style={{height: 5}}/>
              <FContentText type="additional2" text={'audio'}/>
            </div>
            <div className={styles.resourcePolicies}>
              <label>策略1</label>
            </div>
          </a>
        </Space>
      </div>
    </div>

    <Drawer
      visible={true}
      // title={<span style={{fontWeight: 400}}>stefan/Smell like teen spirit</span>}
      title={null}
      width={720}
      bodyStyle={{padding: 40}}
    >
      <FTitleText text={'stefan/Smell like teen spirit'} type={'h3'}/>
      <div style={{height: 10}}/>
      <FContentText type="additional1" text={'audio'}/>
      <div style={{height: 50}}/>
      <FTitleText type={'h3'} text={'已选策略'}/>
      <div style={{height: 30}}/>
      <Space
        direction="vertical"
        size={20}
        style={{width: '100%'}}>
        <div className={styles.policy}>
          <FTitleText text={'策略1'} type={'h4'}/>
          <div style={{height: 15}}/>
          <pre>{'initial:\n' +
          '    active\n' +
          '    recontractable\n' +
          '    presentable\n' +
          '    terminate'}</pre>
        </div>
        <div className={styles.policy}>
          <FTitleText text={'策略1'} type={'h4'}/>
          <div style={{height: 15}}/>
          <pre>{'initial:\n' +
          '    active\n' +
          '    recontractable\n' +
          '    presentable\n' +
          '    terminate'}</pre>
        </div>
        <div className={styles.policy}>
          <FTitleText text={'策略1'} type={'h4'}/>
          <div style={{height: 15}}/>
          <pre>{'initial:\n' +
          '    active\n' +
          '    recontractable\n' +
          '    presentable\n' +
          '    terminate'}</pre>
        </div>
      </Space>
    </Drawer>
  </FCenterLayout>);
}

export default Sign;
