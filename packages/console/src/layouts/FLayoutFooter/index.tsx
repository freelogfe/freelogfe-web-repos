import * as React from 'react';

import styles from './index.less';
import {Affix, Dropdown, Layout} from "antd";
import FMenu from "@/components/FMenu";
import {DownOutlined} from '@ant-design/icons';

const languagesOptions = [{
  value: '1',
  text: '中文'
}, {
  value: '2',
  text: 'English'
}];


export default function () {
  const [footerOffsetTop, setFooterOffsetTop] = React.useState<number>(window.innerHeight - 68);

  React.useEffect(() => {
    window.onresize = () => {
      setFooterOffsetTop(window.innerHeight - 68);
    }
  }, []);

  return (<Affix offsetTop={footerOffsetTop}>
    <Layout.Footer className={styles.Footer}>
      <div>
        <div>关于freelog</div>
        <div style={{width: 30}}/>
        <Dropdown overlay={<FMenu
          options={languagesOptions}/>}>
          <div style={{cursor: 'pointer'}}>中文<DownOutlined style={{marginLeft: 8}}/></div>
        </Dropdown>
        <div style={{width: 120}}/>
        <span>粤ICP备17085716号-1</span>
        <div style={{width: 30}}/>
        <span>Copyright© 2020 freelog freelog.com版权所有</span>
      </div>
    </Layout.Footer>
  </Affix>);
}
