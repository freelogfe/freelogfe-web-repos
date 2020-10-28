import * as React from 'react';
import styles from './index.less';
import FInput from "@/components/FInput";
import {ChangeAction, UpdatePoliciesAction} from "@/models/resourceAuthPage";
import FCodemirror from "@/components/FCodemirror";
import {Drawer, Space} from "antd";
import {FFileText} from "@/components/FIcons";
import {FNormalButton, FTextButton} from "@/components/FButton";
import PolicyTemplates from "./PolicyTemplates";

interface FPolicyBuilderDrawerProps {
  visible?: boolean;

  onConfirm?({title, text}: { title: string, text: string }): void;

  onCancel?(): void;
}

function FPolicyBuilder({visible = false, onCancel, onConfirm}: FPolicyBuilderDrawerProps) {

  const [title, setTitle] = React.useState<string>('');
  const [text, setText] = React.useState<string>('');
  const [templateVisible, setTemplateVisible] = React.useState<boolean>(false);


  return (<Drawer
    title={'添加授权策略'}
    onClose={() => onCancel && onCancel()}
    visible={visible}
    width={720}
    bodyStyle={{paddingLeft: 40, paddingRight: 40, height: 600, overflow: 'auto'}}
  >
    <FInput
      className={styles.newTitle}
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder={'请输入授权策略名称'}
    />
    <div style={{height: 20}}/>
    <FCodemirror
      value={text}
      onChange={(value) => setText(value)}
    />
    <div style={{height: 10}}/>
    <div className={styles.footer}>
      <a
        style={{color: '#666'}}
        onClick={() => setTemplateVisible(true)}>
        <Space size={4}>
          <FFileText/>
          <span>策略模板</span>
        </Space>
      </a>
      <Space size={30}>
        <FTextButton onClick={() => onCancel && onCancel()}>取消</FTextButton>
        <FNormalButton onClick={() => {
          onConfirm && onConfirm({
            title,
            text,
          });
        }}>确定</FNormalButton>
      </Space>
    </div>

    <Drawer
      width={640}
      visible={templateVisible}
      title={'策略模板'}
      onClose={() => setTemplateVisible(false)}
    >
      <PolicyTemplates
        onSelect={(p) => {
          setTitle(p.title);
          setText(p.text);
          setTemplateVisible(false);
        }}/>
    </Drawer>
  </Drawer>);
}

export default FPolicyBuilder;
