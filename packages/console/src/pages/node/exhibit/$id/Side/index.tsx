import * as React from 'react';
import styles from './index.less';
import {FContentText, FTitleText} from '@/components/FText';
import * as imgSrc from '@/assets/default-resource-cover.jpg';
import {FClose, FEdit} from "@/components/FIcons";
import {Space} from "antd";
import FInput from "@/components/FInput";
import {FNormalButton, FTextButton, FCircleButton} from "@/components/FButton";
import {ChangeAction, UpdatePoliciesAction} from "@/models/resourceAuthPage";
import FSelect from "@/components/FSelect";

interface SideProps {

}

function Side({}: SideProps) {
  return (<div className={styles.side}>
    <div className={styles.base}>
      <FTitleText text={'基础信息'} type="h4"/>
      <div style={{height: 20}}/>

      <div className={styles.cover}>
        <img
          alt=""
          src={imgSrc}
        />
        <div>
          <FEdit style={{fontSize: 32}}/>
          <div style={{height: 10}}/>
          <div>修改封面</div>
        </div>
      </div>

      <div style={{height: 20}}/>

      <FTitleText text={'展品标题'} type="form"/>
      <div style={{height: 15}}/>
      <Space size={10}>
        <FContentText text={'Smells like teen spirit'}/>
        <a><FEdit/></a>
      </Space>
      <FInput
        className={styles.Input}
      />
      <div style={{height: 10}}/>
      <div className={styles.btn}>
        <FTextButton size="small">取消</FTextButton>
        <div style={{width: 15}}/>
        <FNormalButton size="small">确定</FNormalButton>
      </div>
      <div style={{height: 30}}/>

      <FTitleText text={'展品标签'} type="form"/>
      <div style={{height: 15}}/>
      <div className={styles.tags}>
        <label>标签1<FClose/></label>
        <label>标签1<FClose/></label>
        <label>标签2<FClose/></label>
      </div>
      <div style={{height: 15}}/>
      <FInput
        placeholder={'回车添加标签，esc取消'}
        className={styles.Input}
      />
      <div style={{height: 30}}/>

      <FTitleText text={'高级设置'} type="h4"/>
      <div style={{height: 20}}/>

      <FTitleText text={'基础属性'} type="form"/>
      <div style={{height: 15}}/>
      <div className={styles.attr}>
        <table>
          <tbody>
          <tr>
            <td><FContentText text={'类型'}/></td>
            <td><FContentText text={'audio'}/></td>
          </tr>
          <tr>
            <td><FContentText text={'最新版本'}/></td>
            <td><FContentText text={'1.1.3'}/></td>
          </tr>
          </tbody>
        </table>
      </div>
      <div style={{height: 30}}/>

      <FTitleText text={'自定义选项'} type="form"/>
      <div style={{height: 15}}/>
      <div className={styles.options}>
        <div>
          <FContentText text={'流派'}/>
          <FSelect
            className={styles.FSelect}
            value={'123'}
            dataSource={[{value: '123', title: 'ROCK摇滚'}]}
          />
        </div>
        <div>
          <FContentText text={'流派'}/>
          <FInput className={styles.FInput}/>
        </div>
      </div>
      <div style={{height: 20}}/>
      <Space className={styles.addCustomTitle}>
        <FCircleButton theme="text"/>
        <span>添加自定义选项</span>
      </Space>
    </div>
    <div style={{height: 10}}/>
    <div className={styles.info}>
      <div className={styles.cover} style={{cursor: 'default'}}>
        <img
          alt=""
          src={imgSrc}
        />
      </div>

      <div style={{height: 12}}/>
      <FContentText singleRow text={'这里是展品名称这里是展品名这里是展品名称这里是展品名称'}/>
      <div style={{height: 10}}/>
      <div style={{fontSize: 12, color: '#666'}}>audio</div>
    </div>

  </div>);
}

export default Side;
