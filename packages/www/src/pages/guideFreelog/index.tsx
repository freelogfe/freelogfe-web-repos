import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';

interface GuideFreelogProps {

}

function GuideFreelog({}: GuideFreelogProps) {
  return (<div className={styles.guide}>
    <FComponentsLib.FTitleText type={'h1'} text={'目前您在测试环境，现在去正式环境'} />
    <div style={{ height: 100 }} />
    <FComponentsLib.FRectBtn
      onClick={() => {
        self.location.replace('https://www.freelog.com')
      }}
    >去正式环境</FComponentsLib.FRectBtn>
  </div>);
}

export default GuideFreelog;
