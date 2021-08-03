import * as React from 'react';
import styles from './index.less';
import FInput from '@/components/FInput';
import FCodemirror from '@/components/FCodemirror';
import { Space } from 'antd';
import { FCode, FFileText } from '@/components/FIcons';
import { FRectBtn, FTextBtn } from '@/components/FButton';
import PolicyTemplates from './PolicyTemplates';
import FDrawer from '@/components/FDrawer';
import FComposition from '@/components/FIcons/FComposition';

interface FPolicyBuilderDrawerProps {
  visible?: boolean;
  alreadyHas?: {
    title: string;
    text: string;
  }[];

  onConfirm?({ title, text }: { title: string, text: string }): void;

  onCancel?(): void;
}

interface FPolicyBuilderDrawerStates {
  title: string;
  titleError: string;
  editMode: 'code' | 'composition';

  codeText: string;
  codeTextError: string;


}


function FPolicyBuilder({ visible = false, alreadyHas, onCancel, onConfirm }: FPolicyBuilderDrawerProps) {

  const [title, setTitle] = React.useState<FPolicyBuilderDrawerStates['title']>('');
  const [titleError, setTitleError] = React.useState<FPolicyBuilderDrawerStates['titleError']>('');
  const [editMode, setEditMode] = React.useState<FPolicyBuilderDrawerStates['editMode']>('composition');

  const [codeText, setCodeText] = React.useState<FPolicyBuilderDrawerStates['codeText']>('');
  const [codeTextError, setCodeTextError] = React.useState<FPolicyBuilderDrawerStates['codeTextError']>('');


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
    setCodeText(value);
    setCodeTextError(verifyText(value, usedTexts));
  }

  return (<FDrawer
    title={'添加授权策略'}
    onClose={() => onCancel && onCancel()}
    visible={true}
    width={720}
    topRight={<Space size={30}>
      <FTextBtn onClick={() => onCancel && onCancel()}>取消</FTextBtn>

      {
        true
          ? (<FRectBtn
            onClick={() => {
              onConfirm && onConfirm({
                title,
                text: codeText,
              });
            }}
            disabled={title === '' || codeText === '' || !!titleError || !!codeTextError}
            type='primary'
          >校验</FRectBtn>)
          : (<FRectBtn
            onClick={() => {
              onConfirm && onConfirm({
                title,
                text: codeText,
              });
            }}
            disabled={title === '' || codeText === '' || !!titleError || !!codeTextError}
            type='primary'
          >创建</FRectBtn>)
      }


    </Space>}
    afterVisibleChange={(visible) => {
      if (!visible) {
        setTitle('');
        setTitleError('');
        setCodeText('');
        setCodeTextError('');
      }
    }}
    // bodyStyle={{paddingLeft: 40, paddingRight: 40, height: 600, overflow: 'auto'}}
  >
    <div className={styles.maskingContainer}>
      <div className={styles.policyHeader}>
        <FInput
          className={styles.policyTitle}
          // className={styles.newTitle}
          value={title}
          // errorText={titleError}
          onChange={(e) => {
            onChangeTitleInput(e.target.value);
          }}
          // placeholder={'请输入授权策略名称'}
          placeholder={'输入策略名称…'}
        />

        <Space size={20}>
          {
            true
              ? (<FTextBtn
                type='default'
                onClick={() => {
                  // setTemplateVisible(true);
                }}>
                <Space size={4}>
                  <FComposition />
                  <span>组合模式</span>
                </Space>
              </FTextBtn>)
              : (<FTextBtn
                type='default'
                onClick={() => {
                  // setTemplateVisible(true);
                }}>
                <Space size={4}>
                  <FCode />
                  <span>代码模式</span>
                </Space>
              </FTextBtn>)
          }

          <FTextBtn
            type='default'
            onClick={() => setTemplateVisible(true)}>
            <Space size={4}>
              <FFileText />
              <span>策略模板</span>
            </Space>
          </FTextBtn>
        </Space>
      </div>
      {titleError && <>
        <div style={{ height: 5 }} />
        <div className={styles.textError}>{titleError}</div>
      </>}
      <div style={{ height: 20 }} />
      <FCodemirror
        value={codeText}
        onChange={(value) => {
          // console.log(value, 'value1234231421344324');
          onChangeTextInput(value);
        }}
      />
      {codeTextError && <>
        <div style={{ height: 5 }} />
        <div className={styles.textError}>{codeTextError}</div>
      </>}
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
        }} />
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
