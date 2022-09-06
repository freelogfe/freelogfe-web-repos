import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import useUrlState from '@ahooksjs/use-url-state';

interface BindingProps {

}

const types = {
  wechat: '微信',
  weibo: '微博',
} as const;

const states = {
  1: '绑定成功',
  2: '绑定失败',
  3: '已被其他账号绑定',
};

function Binding({}: BindingProps) {

  // 状态 1:绑定成功 2:绑定失败 3:微信号已被其他账号绑定
  const [urlParams] = useUrlState<{ type: 'wechat' | 'weibo'; status: 1 | 2 | 3; }>();

  return (<div>
    <div style={{ height: 100 }} />
    <div className={styles.modal}>
      <i className={'freelog fl-icon-shenqingchenggong'} />
      <div style={{ height: 20 }} />
      <FComponentsLib.FTipText
        type='second'
        text={types[urlParams.type as 'wechat'] + states[urlParams.status as 1]}
      />
      {/*<div style={{height: 40}}/>*/}
      {/*<FComponentsLib.FTipText type="third" text={FI18n.i18nNext.t('hint_create_1st_version')}/>*/}
      {/*<div style={{height: 20}}/>*/}
      {/*<FComponentsLib.FRectBtn onClick={goto}>{FI18n.i18nNext.t('create_first_version')}</FComponentsLib.FRectBtn>*/}
    </div>
  </div>);
}

export default Binding;
