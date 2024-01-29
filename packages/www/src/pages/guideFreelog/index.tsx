import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import * as AHooks from 'ahooks';

interface GuideFreelogProps {

}

function GuideFreelog({}: GuideFreelogProps) {

  const [cookie, setCookie] = AHooks.useCookieState('guideFreelog', {
    defaultValue: 'true', // 默认值
    domain: '.testfreelog.com',
    path: '/', // cookie 的路径
    expires: new Date('2099-12-31T23:59:59.000Z'),
  });

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
        onPressEnter={((e) => {
          // console.log(e, 'asdfiosahjdlkfjslkdjflkjl');
          // console.log(cookie, 'cookieisdjf;lksjdl;kfjsdl;kjflkj');
          setCookie('false', {
            value: 'false',
            domain: '.testfreelog.com',
            path: '/', // cookie 的路径
            expires: new Date('2099-12-31T23:59:59.000Z'),
          });
        })}
      />
    </div>
  </div>);
}

export default GuideFreelog;
