import * as React from 'react';
import styles from './index.less';
import FFormLayout from '@/components/FFormLayout';

interface SettingProps {

}

function Setting({}: SettingProps) {
  return (<div className={styles.styles}>
    <div style={{height: 100}}/>
    <div className={styles.content}>
      <FFormLayout>
        <FFormLayout.FBlock
          title={'账号安全'}
        >

        </FFormLayout.FBlock>

        <FFormLayout.FBlock
          title={'第三方账号绑定'}
        >

        </FFormLayout.FBlock>
      </FFormLayout>
    </div>
  </div>);
}

export default Setting;
