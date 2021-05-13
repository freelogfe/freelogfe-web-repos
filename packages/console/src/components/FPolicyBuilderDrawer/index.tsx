import * as React from 'react';
import styles from './index.less';
import FInput from "@/components/FInput";
import {ChangeAction, UpdatePoliciesAction} from "@/models/resourceAuthPage";
import FCodemirror from "@/components/FCodemirror";
import {Drawer, Space} from "antd";
import {FFileText} from "@/components/FIcons";
import {FRectBtn, FTextButton} from "@/components/FButton";
import PolicyTemplates from "./PolicyTemplates";
import FDrawer from "@/components/FDrawer";

interface FPolicyBuilderDrawerProps {
  visible?: boolean;
  alreadyHas?: {
    title: string;
    text: string;
  }[];

  onConfirm?({title, text}: { title: string, text: string }): void;

  onCancel?(): void;
}

function FPolicyBuilder({visible = false, alreadyHas, onCancel, onConfirm}: FPolicyBuilderDrawerProps) {

  const [title, setTitle] = React.useState<string>('');
  const [titleError, setTitleError] = React.useState<string>('');
  const [text, setText] = React.useState<string>('');
  const [textError, setTextError] = React.useState<string>('');
  const [templateVisible, setTemplateVisible] = React.useState<boolean>(false);
  const [usedTitles, setUsedTitles] = React.useState<string[]>([]);
  const [usedTexts, setUsedTexts] = React.useState<string[]>([]);

  React.useEffect(() => {
    setUsedTitles(alreadyHas?.map<string>((ah) => ah.title) || []);
    setUsedTexts(alreadyHas?.map<string>((ah) => ah.text) || []);
  }, [alreadyHas]);

  function onChangeTitleInput(value: string) {
    // const value: string = e.target.value;
    setTitle(value);
    setTitleError(verifyTitle(value, usedTitles));
  }

  function onChangeTextInput(value: string) {
    // const value: string = e.target.value;
    setText(value);
    setTextError(verifyText(value, usedTexts));
  }

  return (<FDrawer
    title={'添加授权策略'}
    onClose={() => onCancel && onCancel()}
    visible={visible}
    width={720}
    topRight={<Space size={30}>
      <FTextButton onClick={() => onCancel && onCancel()}>取消</FTextButton>
      <FRectBtn
        onClick={() => {
          onConfirm && onConfirm({
            title,
            text,
          });
        }}
        disabled={title === '' || text === '' || !!titleError || !!textError}
        type="primary"
      >确定</FRectBtn>
    </Space>}
    afterVisibleChange={(visible  )=> {
      if (!visible) {
        setTitle('');
        setTitleError('');
        setText('');
        setTextError('');
      }
    }}
    // bodyStyle={{paddingLeft: 40, paddingRight: 40, height: 600, overflow: 'auto'}}
  >
    <FInput
      className={styles.newTitle}
      value={title}
      // errorText={titleError}
      onChange={(e) => {
        onChangeTitleInput(e.target.value);
      }}
      placeholder={'请输入授权策略名称'}
    />
    {titleError && <>
      <div style={{height: 5}}/>
      <div className={styles.textError}>{titleError}</div>
    </>}
    <div style={{height: 20}}/>
    <FCodemirror
      value={text}
      onChange={(value) => {
        onChangeTextInput(value);
      }}
    />
    {textError && <>
      <div style={{height: 5}}/>
      <div className={styles.textError}>{textError}</div>
    </>}
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

    </div>

    <FDrawer
      width={640}
      visible={templateVisible}
      title={'策略模板'}
      onClose={() => setTemplateVisible(false)}
    >
      <PolicyTemplates
        onSelect={(p) => {
          // setTitle(p.title);
          onChangeTitleInput(p.title);
          onChangeTextInput(p.text);
          setTemplateVisible(false);
        }}/>
    </FDrawer>
  </FDrawer>);
}

export default FPolicyBuilder;

function verifyTitle(title: string, allTitles: string[]): string {
  let error: string = '';
  if (title === '') {
    error = '请输入标题';
  } else if (title.length > 20) {
    error = '不错过20个字符';
  } else if (allTitles.includes(title)) {
    error = '标题已存在';
  }
  return error;
}

function verifyText(text: string, allTexts: string[]): string {
  let error: string = '';
  if (text === '') {
    error = '请输入内容';
  } else if (allTexts.includes(text)) {
    error = '内容已存在';
  }
  return error;
}
