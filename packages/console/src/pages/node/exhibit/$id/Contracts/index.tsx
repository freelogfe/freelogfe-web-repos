import * as React from 'react';
import styles from './index.less';
import {FContentText, FTitleText} from "@/components/FText";
import {FNormalButton} from "@/components/FButton";
import {Space} from "antd";

interface ContractsProps {

}

function Contracts({}: ContractsProps) {
  return (<div>
    <FTitleText text={'关联合约'} type="h3"/>

    <div style={{height: 20}}/>

    <div className={styles.sign}>
      <div className={styles.signLeft}>
        <div className={styles.signLeftNav}>主资源</div>
        <a
          className={styles.signResource + ' ' + styles.activatedSignResource}
          onClick={() => null}
        >
          <FTitleText
            type="h5"
            text={'r.name'}
            singleRow
          />
          <div style={{height: 5}}/>
          <FContentText
            type="additional2"
            text={'r.type'}
          />
          <div style={{height: 5}}/>
          <div className={styles.policeTags}>
            <label>{'p.name'}</label>
          </div>
        </a>

        <div className={styles.signLeftNav}>基础上抛</div>
        <a
          className={styles.signResource + ' ' + styles.activatedSignResource}
          onClick={() => null}
        >
          <FTitleText
            type="h5"
            text={'r.name'}
            singleRow
          />
          <div style={{height: 5}}/>
          <FContentText
            type="additional2"
            text={'r.type'}
          />
          <div style={{height: 5}}/>
          <div className={styles.policeTags}>
            <label>{'p.name'}</label>
          </div>
        </a>
      </div>

      <div className={styles.signRight}>
        <div>
          <div className={styles.smallTitle}>当前合约</div>
          <div style={{height: 5}}/>
          <div className={styles.Contracts}>
            <div className={styles.content}>
              <Space size={5}>
                <span>{'c.name'}</span>
                <label className={styles.executing}>执行中</label>
              </Space>
              <div style={{height: 10}}/>
              <pre>{'c.text'}</pre>
              <div style={{height: 10}}/>
            </div>
            <div className={styles.footer}>
              <div>
                合约ID {'c.id'}
              </div>
              <div>
                签约时间 {'c.createTime'}
              </div>
            </div>
          </div>

          <div className={styles.smallTitle}>未签约策略</div>
          <div style={{height: 5}}/>
          <div className={styles.singPolicy}>
            <div className={styles.singPolicyHeader}>
              <span>{'p.name'}</span>
              <a className={styles.singPolicyHeaderBtn}>签约</a>
            </div>
            <div style={{height: 15}}/>
            <pre>{'p.text'}</pre>
          </div>

        </div>
      </div>
    </div>
  </div>);
}

export default Contracts;
