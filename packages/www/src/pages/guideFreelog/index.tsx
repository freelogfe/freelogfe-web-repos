import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import * as AHooks from 'ahooks';
import moment from 'moment';
import fCenterMessage from '@/components/fCenterMessage';
import { FUtil } from '../../../../@freelog/tools-lib';

interface GuideFreelogProps {

}

function GuideFreelog({}: GuideFreelogProps) {

  const [cookie, setCookie] = AHooks.useCookieState('guideFreelog');

  return (<div className={styles.guide}>
    <FComponentsLib.FTitleText type={'h1'} text={'目前您在测试环境，现在去正式环境'} />
    <div style={{ height: 100 }} />
    <FComponentsLib.FRectBtn
      onClick={() => {
        self.location.replace('https://www.freelog.com');
      }}
    >去正式环境</FComponentsLib.FRectBtn>
    <div style={{ height: 100 }} />
    <div style={{ width: 300 }}>
      <FComponentsLib.FInput.FPassword
        // className={styles.FPassword}
        placeholder={'输入内部密码'}
        onPressEnter={((value: any) => {
          if (value.target.value !== moment().format('YYYYMMDD').split('').reverse().join('')) {
            fCenterMessage({ message: '密码错误' });
            return;
          }
          setCookie('false', {
            domain: '.testfreelog.com',
            path: '/', // cookie 的路径
            // expires: new Date('2099-12-31T23:59:59.000Z'),
            expires: moment().add(7, 'days').toDate(),
            // expires: Date.now() * 2,
            secure: true,
          });
          self.location.replace(FUtil.LinkTo.home());
        })}
      />
    </div>
  </div>);
}


export default GuideFreelog;
