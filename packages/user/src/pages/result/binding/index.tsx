import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';

interface BindingProps {

}

function Binding({}: BindingProps) {
  return (<div>
    <div style={{ height: 100 }} />
    <div className={styles.modal}>
      <i className={'freelog fl-icon-shenqingchenggong'} />
      <div style={{ height: 20 }} />
      <FComponentsLib.FTipText type='second' text={'绑定成功'} />
      {/*<div style={{height: 40}}/>*/}
      {/*<FComponentsLib.FTipText type="third" text={FI18n.i18nNext.t('hint_create_1st_version')}/>*/}
      {/*<div style={{height: 20}}/>*/}
      {/*<FComponentsLib.FRectBtn onClick={goto}>{FI18n.i18nNext.t('create_first_version')}</FComponentsLib.FRectBtn>*/}
    </div>
  </div>);
}

export default Binding;
