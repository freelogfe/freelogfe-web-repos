import * as React from 'react';
import {FTipText, FContentText} from '@/components/FText';
import StatusLabel from '@/pages/resource/components/StatusLabel';
import {FNormalButton, FTextButton, FCircleButton} from '@/components/FButton';
import FDropdown from '@/components/FDropdown';
import FModal from '@/components/FModal';
import FCodemirror from '@/components/FCodemirror';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {PlusOutlined} from '@ant-design/icons';
// import {Controlled as CodeMirror} from 'react-codemirror2'


import styles from './index.less';

const code = 'for public:\n' +
  '  initial:\n' +
  '    active\n' +
  '    recontractable\n' +
  '    presentable\n' +
  '    presentable\n' +
  '    presentable\n' +
  '    presentable\n' +
  '    presentable\n' +
  '    presentable\n' +
  '    presentable\n' +
  '    presentable\n' +
  '    presentable\n' +
  '    terminate';

export default function () {
  return (<div className={styles.FPoliciesStyles}>
    {false && <div className={styles.empty}>
      <FTipText type="secondary" text={'未添加策略的资源不会出现在资源市场中'}/>
      <div style={{height: 20}}/>
      <FNormalButton>立即添加策略</FNormalButton>
    </div>}
    <div className={styles.policies}>
      <PolicyCard/>
      <PolicyCard/>
      <PolicyCard/>
      <PolicyCard/>
      <PolicyCard/>
      <PolicyCard/>
      <div>
        <FNormalButton theme="weaken" shape="circle" icon={<PlusOutlined/>}/>
      </div>
    </div>
    <FModal title="查看策略"
            visible={false}
      // onOk={this.handleOk}
      // onCancel={this.handleCancel}
    >
      <SyntaxHighlighter showLineNumbers={true}>
        {code}
      </SyntaxHighlighter>
    </FModal>
    <FModal title="新建策略" visible={false}>
      <FCodemirror value={code}/>
    </FModal>
  </div>);
}

function PolicyCard() {
  return (<div className={styles.policy}>
    <div className={styles.policyHeader}>
      <FContentText text={'策略1'} singleRow={true}/>
      <FDropdown text={<StatusLabel/>} dataSource={[{id: 1, children: '启用'}, {id: 2, children: '停用'}]}/>
    </div>
    <div style={{height: 5}}/>
    <div className={styles.policyContent}>
      <pre>{code}</pre>
    </div>
    <div style={{height: 3}}/>
    <div className={styles.fullscreen}>
      <FTextButton>全屏查看</FTextButton>
    </div>
  </div>);
}
