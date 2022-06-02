import * as React from 'react';
import styles from './index.less';
import {Dropdown} from "antd";
import FMenu from "@/components/FMenu";
import {DownOutlined} from '@ant-design/icons';
import {connect, Dispatch} from "dva";
import {ConnectState, GlobalModelState} from "@/models/connect";
import {SetLocaleAction} from "@/models/global";
// import {
//   formatDate,
//   formatTime,
//   formatRelative,
//   formatNumber,
//   formatPlural,
//   formatMessage,
//   formatHTMLMessage
// } from 'umi-plugin-react/locale';
const languagesOptions = [
  {value: 'zh-CN', text: '中文'},
  {value: 'en-US', text: 'English'},
];
// console.log(process.env, 'process.env');

if (process.env.NODE_ENV !== 'production') {
  languagesOptions.push({value: 'pt-BR', text: 'Key'});
}

interface FLayoutFooter {
  dispatch: Dispatch;
  style?: any;
  global: GlobalModelState;
}

function FFooter({dispatch, global, style}: FLayoutFooter) {
  console.log(style)
  function changeLocale(value: 'zh-CN' | 'en-US' | 'pt-BR') {
    // setLocale(value === '1' ? 'zh-CN' : 'en-US');
    console.log(value, 'valuevalue');
    dispatch<SetLocaleAction>({
      type: 'global/setLocale',
      payload: value,
    });
  }

  return (<div className={styles.Footer} style={style} >
    <div className={styles.styles}>
      {/* <div>关于freelog</div>
      <div style={{width: 30}}/>
      <Dropdown overlay={<FMenu
        options={languagesOptions}
        onClick={(value) => changeLocale(value as 'zh-CN' | 'en-US')}
      />
      }>
        <div
          style={{cursor: 'pointer'}}>
          <span>{languagesOptions.find((i) => i.value === global.locale)?.text}</span>
          <DownOutlined style={{marginLeft: 8}}/>
        </div>
      </Dropdown> */}
      {/* <div style={{width: 120}}/> */}
      <span>粤ICP备17085716号-1</span>
      <div style={{width: 30}}/>
      <span>Copyright© 2020 freelog freelog.com版权所有</span>
    </div>
  </div>);
}

export default connect(({global}: ConnectState) => ({
  global: global,
}))(FFooter);
