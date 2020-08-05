import * as React from 'react';

import styles from './index.less';
import {Affix, Dropdown, Layout} from "antd";
import FMenu from "@/components/FMenu";
import {DownOutlined} from '@ant-design/icons';
import {withRouter} from "umi";
import {RouteComponentProps} from "react-router";
import {setLocale} from 'umi-plugin-react/locale';

const languagesOptions = [{
  value: '1',
  text: '中文'
}, {
  value: '2',
  text: 'English'
}];

interface FLayoutFooter extends RouteComponentProps {

}

function FLayoutFooter({...props}: FLayoutFooter) {

  // console.log(props, 'props');

  const [footerOffsetTop, setFooterOffsetTop] = React.useState<number>(window.innerHeight - 68);

  React.useEffect(() => {
    window.onresize = () => {
      setFooterOffsetTop(window.innerHeight - 68);
    }
  }, []);

  function changeLocale(value: any) {
    setLocale(value === '1' ? 'zh-CN' : 'en-US');
  }

  return (<Affix offsetTop={footerOffsetTop}>
    <Layout.Footer className={styles.Footer}>
      <div>
        <div>关于freelog</div>
        <div style={{width: 30}}/>
        <Dropdown overlay={<FMenu
          options={languagesOptions}
          onClick={changeLocale}
        />
        }>
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

export default withRouter(FLayoutFooter);
