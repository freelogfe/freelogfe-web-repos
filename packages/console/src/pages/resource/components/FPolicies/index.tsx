import * as React from 'react';
import {FTipText, FContentText} from '@/components/FText';
import StatusLabel from '@/pages/resource/components/StatusLabel';
import {FNormalButton, FTextButton, FCircleButton} from '@/components/FButton';
import FDropdown from '@/components/FDropdown';
import FModal from '@/components/FModal';
import FCodemirror from '@/components/FCodemirror';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {PlusOutlined} from '@ant-design/icons';


import styles from './index.less';

interface Policy {
  title: string;
  status: 'executing' | 'stopped';
  code: string;
}

interface FPoliciesProps {
  dataSource?: Policy[];
}

export default function ({dataSource = []}: FPoliciesProps) {

  const [newVisible, setNewVisible] = React.useState<boolean>(false);
  const [newCode, setNewCode] = React.useState<string>('');
  const [previewCode, setPreviewCode] = React.useState<string>('');
  const [previewVisible, setPreviewVisible] = React.useState<boolean>(false);

  function openNewVisible() {
    setNewVisible(true);
  }

  function closeNewVisible() {
    setNewVisible(false);
  }

  function onChangeCode(value: string) {
    setNewCode(value);
  }

  function onOkNewPolice() {

  }

  function openPreviewCode(code: string) {
    setPreviewCode(code);
    setPreviewVisible(true);
  }

  function closePreview() {
    setPreviewVisible(false);
  }


  return (<div className={styles.FPoliciesStyles}>
    {dataSource?.length === 0
      ? (<div className={styles.empty}>
        <FTipText type="secondary" text={'未添加策略的资源不会出现在资源市场中'}/>
        <div style={{height: 20}}/>
        <FNormalButton onClick={openNewVisible}>立即添加策略</FNormalButton>
      </div>)
      : (<div className={styles.policies}>
        {
          dataSource?.map((i) => (<PolicyCard
            key={i.title}
            title={i.title}
            status={i.status}
            code={i.code}
            onPreview={() => openPreviewCode(i.code)}
          />))
        }
        <div>
          <FNormalButton
            onClick={openNewVisible}
            theme="weaken"
            shape="circle"
            icon={<PlusOutlined/>}
          />
        </div>
      </div>)}
    <FModal
      title="查看策略"
      visible={previewVisible}
      // onOk={this.handleOk}
      onCancel={() => closePreview(false)}
    >
      <SyntaxHighlighter
        showLineNumbers={true}
      >{previewCode}</SyntaxHighlighter>
    </FModal>
    <FModal
      title="新建策略"
      visible={newVisible}
      onCancel={closeNewVisible}
      onOk={onOkNewPolice}
    >
      <FCodemirror
        value={newCode}
        onChange={onChangeCode}
      />
    </FModal>
  </div>);
}

interface PolicyCardProps {
  title: string;
  status: 'executing' | 'stopped';
  code: string;
  onPreview?: () => void;
}

function PolicyCard({title, status, code, onPreview}: PolicyCardProps) {
  return (<div className={styles.policy}>
    <div className={styles.policyHeader}>
      <FContentText text={title} singleRow={true}/>
      <FDropdown
        onChange={(value) => console.log(value)}
        text={<StatusLabel status={'executing'}/>}
        options={[{value: 'executing', text: '启用'}, {value: 'stopped', text: '停用'}]}
      />
    </div>
    <div style={{height: 5}}/>
    <div className={styles.policyContent}>
      <pre>{code}</pre>
    </div>
    <div style={{height: 3}}/>
    <div className={styles.fullscreen}>
      <FTextButton onClick={onPreview}>全屏查看</FTextButton>
    </div>
  </div>);
}

// policies
