import * as React from 'react';
import styles from './index.less';
import FInput from '@/components/FInput';
import FCodemirror from '@/components/FCodemirror';
import { Space, Divider } from 'antd';
import { FCheck, FCode, FDown, FFileText, FInfo, FLoading, FPlus } from '@/components/FIcons';
import { FCircleBtn, FRectBtn, FTextBtn } from '@/components/FButton';
import PolicyTemplates from './PolicyTemplates';
import FDrawer from '@/components/FDrawer';
import FComposition from '@/components/FIcons/FComposition';
import FSelect from '@/components/FSelect';
import { FContentText, FTitleText } from '@/components/FText';
import FCheckbox from '@/components/FCheckbox';
import FGuideDown from '@/components/FIcons/FGuideDown';
import FCodeFormatter from '@/components/FCodeFormatter';

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
  checkResult: 'unchecked' | 'checking' | 'checked';

  codeText: string;
  codeTextError: string;
}

function FPolicyBuilder({ visible = false, alreadyHas, onCancel, onConfirm }: FPolicyBuilderDrawerProps) {

  const [title, setTitle] = React.useState<FPolicyBuilderDrawerStates['title']>('');
  const [titleError, setTitleError] = React.useState<FPolicyBuilderDrawerStates['titleError']>('');
  const [editMode, setEditMode] = React.useState<FPolicyBuilderDrawerStates['editMode']>('composition');
  const [checkResult, setCheckResult] = React.useState<FPolicyBuilderDrawerStates['checkResult']>('checked');

  const [codeText, setCodeText] = React.useState<FPolicyBuilderDrawerStates['codeText']>('');
  const [codeTextError, setCodeTextError] = React.useState<FPolicyBuilderDrawerStates['codeTextError']>('');

  const [templateVisible, setTemplateVisible] = React.useState<boolean>(true);
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

  return (<>
    <FDrawer
      title={'添加授权策略'}
      onClose={() => onCancel && onCancel()}
      visible={false}
      width={720}
      topRight={<Space size={30}>
        <FTextBtn onClick={() => onCancel && onCancel()}>取消</FTextBtn>

        {
          checkResult === 'unchecked' && (<FRectBtn
            onClick={() => {
              setCheckResult('checking');
              setTimeout(() => {
                setCheckResult('checked');
              }, 2000);
            }}
            disabled={title === '' || codeText === '' || !!titleError || !!codeTextError}
            type='primary'
          >校验</FRectBtn>)
        }

        {
          checkResult === 'checking' && (<FRectBtn
            onClick={() => {
              onConfirm && onConfirm({
                title,
                text: codeText,
              });
            }}
            disabled={true}
            type='primary'
          >校验中</FRectBtn>)
        }

        {
          checkResult === 'checked' && (<FRectBtn
            onClick={() => {
              // onConfirm && onConfirm({
              //   title,
              //   text: codeText,
              // });
            }}
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
    >
      {
        checkResult === 'checked' && (<div>
          <div className={styles.PolicyChecked}>
            <FCheck />
            <div style={{ width: 5 }} />
            <div>校验成功</div>
            <div style={{ width: 20 }} />
            <span>以下是策略相关内容</span>
          </div>
          <div style={{ height: 30 }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FTitleText type='h1' text={'试用后订阅（包月/包年）'} />

            <FTextBtn
              type='primary'
              onClick={() => {
                setCheckResult('unchecked');
              }}
            >返回编辑</FTextBtn>
          </div>

          <div style={{ height: 30 }} />

          <PolicyShowcase text={''} />
        </div>)
      }

      {
        checkResult === 'checking' && (<>
          <div className={styles.isCheckingTip}>
            <FLoading />
            <div style={{ width: 5 }} />
            <span>校验中，请勿离开</span>
          </div>
          <div style={{ height: 30 }} />
        </>)
      }


      {
        checkResult !== 'checked' && (<div className={styles.maskingContainer}>
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
                editMode === 'code'
                  ? (<FTextBtn
                    type='default'
                    onClick={() => {
                      setEditMode('composition');
                    }}>
                    <Space size={4}>
                      <FComposition />
                      <span>组合模式</span>
                    </Space>
                  </FTextBtn>)
                  : (<FTextBtn
                    type='default'
                    onClick={() => {
                      setEditMode('code');
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

          {
            editMode === 'composition'
              ? (<div>
                <div className={styles.compositionSelect}>
                  <Space size={10}>
                    <span>可签约人群</span>
                    <span>所有人</span>
                  </Space>

                  <FDown />
                </div>

                <div style={{ height: 20 }} />

                <Space size={20} style={{ width: '100%' }} direction='vertical'>
                  <div className={styles.compositionState}>

                    <div className={styles.compositionStateHeader}>
                      <div style={{ height: 15 }} />
                      <div className={styles.compositionStateHeader1}>
                        <div>
                          <label className={styles.compositionStateIndex}>1</label>
                          <div style={{ width: 15 }} />
                          <FTitleText
                            type='h3'
                            text={'完成签约'}
                          />
                        </div>

                        <FContentText
                          text={'初始状态不可删除'}
                          type='negative'
                        />
                      </div>

                      <div style={{ height: 15 }} />

                      <div className={styles.compositionStateHeader2}>
                        <div style={{ width: 50 }} />
                        <FCheckbox />
                        <div style={{ width: 5 }} />
                        <FContentText text={'授权'} />
                        <div style={{ width: 20 }} />
                        <FCheckbox />
                        <div style={{ width: 5 }} />
                        <FContentText text={'测试授权'} />
                      </div>
                    </div>

                    <div style={{ height: 15 }} />

                    <Space
                      className={styles.compositionStateBody}
                      size={15}
                      direction='vertical'
                    >
                      <div className={styles.compositionStateBodyItem}>
                        <div className={styles.compositionStateBodyEvent}>

                          <div>
                            <FTitleText type='h4' text={'事件1'} />
                          </div>

                          <div style={{ height: 10 }} />

                          <div>
                            <FInput style={{ width: 250 }} />
                            <div style={{ width: 10 }} />
                            <FSelect
                              style={{ width: 250 }}
                              dataSource={[]}
                            />
                            <div style={{ width: 10 }} />
                            <FContentText
                              type='normal'
                              text={'之后'}
                            />
                          </div>

                          <div style={{ height: 10 }}></div>

                          <Divider style={{ margin: 0, borderTopColor: '#E5E7EB' }}>
                            <FTitleText type='h4'>跳转至&nbsp;<FGuideDown style={{ fontSize: 10 }} />
                            </FTitleText>
                          </Divider>

                          <div style={{ height: 10 }}></div>

                          <div>
                            <FTitleText type='h4' text={'目标状态'} />
                          </div>

                          <div style={{ height: 10 }}></div>

                          <div>
                            <FSelect style={{ width: '100%' }} dataSource={[]} />
                          </div>

                        </div>

                        <FCircleBtn type='danger' />
                      </div>

                      <div className={styles.compositionStateBodyItem}>
                        <div className={styles.compositionStateBodyEvent}>

                          <div>
                            <FTitleText type='h4' text={'事件2'} />
                          </div>

                          <div style={{ height: 10 }} />

                          <div>
                            <FInput style={{ width: 250 }} />
                            <div style={{ width: 10 }} />
                            <FSelect
                              style={{ width: 250 }}
                              dataSource={[]}
                            />
                            <div style={{ width: 10 }} />
                            <FContentText
                              type='normal'
                              text={'之后'}
                            />
                          </div>

                          <div style={{ height: 10 }}></div>

                          <Divider style={{ margin: 0, borderTopColor: '#E5E7EB' }}>
                            <FTitleText type='h4'>跳转至&nbsp;<FGuideDown style={{ fontSize: 10 }} />
                            </FTitleText>
                          </Divider>

                          <div style={{ height: 10 }}></div>

                          <div>
                            <FTitleText type='h4' text={'目标状态'} />
                          </div>

                          <div style={{ height: 10 }}></div>

                          <div>
                            <FSelect style={{ width: '100%' }} dataSource={[]} />
                          </div>

                        </div>

                        <FCircleBtn type='danger' />
                      </div>

                    </Space>

                    <div className={styles.compositionStateFooter}>
                      <FCircleBtn type='minor'><FPlus style={{ fontSize: 12 }} /></FCircleBtn>
                      <div style={{ width: 5 }} />
                      <FTextBtn type='primary'>添加事件或指令</FTextBtn>
                    </div>

                    <div style={{ height: 15 }} />
                  </div>

                  <div className={styles.compositionState}>

                    <div className={styles.compositionStateHeader}>
                      <div style={{ height: 15 }} />
                      <div className={styles.compositionStateHeader1}>
                        <div>
                          <label className={styles.compositionStateIndex}>2</label>
                          <div style={{ width: 15 }} />
                          <FInput style={{ width: 400 }} />
                        </div>
                        <FTextBtn type='danger'>删除</FTextBtn>
                      </div>

                      <div style={{ height: 15 }} />

                      <div className={styles.compositionStateHeader2}>
                        <div style={{ width: 50 }} />
                        <FCheckbox />
                        <div style={{ width: 5 }} />
                        <FContentText text={'授权'} />
                        <div style={{ width: 20 }} />
                        <FCheckbox />
                        <div style={{ width: 5 }} />
                        <FContentText text={'测试授权'} />
                      </div>
                    </div>

                    <div style={{ height: 15 }} />

                    <Space
                      className={styles.compositionStateBody}
                      size={15}
                      direction='vertical'
                    >

                      <div className={styles.compositionStateBodyItem}>
                        <div className={styles.compositionStateBodyEvent}>

                          <div>
                            <FTitleText type='h4' text={'事件3'} />
                          </div>

                          <div style={{ height: 10 }} />

                          <div>
                            <FContentText text={'支付'} type='normal' />
                            <div style={{ width: 10 }} />
                            <FInput style={{ width: 120 }} />
                            <div style={{ width: 10 }} />
                            <FSelect
                              style={{ width: 120 }}
                              dataSource={[]}
                            />
                            <div style={{ width: 10 }} />
                            <FContentText text={'至'} type='normal' />
                            <div style={{ width: 10 }} />
                            <FSelect
                              style={{ width: 180 }}
                              dataSource={[]}
                            />
                            <div style={{ width: 10 }} />
                            <FContentText
                              type='normal'
                              text={'之后'}
                            />
                          </div>

                          <div style={{ height: 10 }}></div>

                          <Divider style={{ margin: 0, borderTopColor: '#E5E7EB' }}>
                            <FTitleText type='h4'>跳转至&nbsp;<FGuideDown style={{ fontSize: 10 }} />
                            </FTitleText>
                          </Divider>

                          <div style={{ height: 10 }}></div>

                          <div>
                            <FTitleText type='h4' text={'目标状态'} />
                          </div>

                          <div style={{ height: 10 }}></div>

                          <div>
                            <FSelect style={{ width: '100%' }} dataSource={[]} />
                          </div>

                        </div>

                        <FCircleBtn type='danger' />
                      </div>

                    </Space>
                    {/*<div style={{ height: 20 }} />*/}
                    <div className={styles.compositionStateFooter}>
                      <FCircleBtn type='minor'><FPlus style={{ fontSize: 12 }} /></FCircleBtn>
                      <div style={{ width: 5 }} />
                      <FTextBtn type='primary'>添加事件或指令</FTextBtn>
                    </div>

                    <div style={{ height: 15 }} />
                  </div>
                </Space>

                <div style={{ height: 15 }} />

                <FRectBtn type='default'>新建状态</FRectBtn>

              </div>)
              : (<>
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
              </>)
          }

          {
            checkResult === 'checking' && (<div className={styles.maskingBox} />)
          }

        </div>)
      }

    </FDrawer>
    <FDrawer
      width={640}
      visible={templateVisible}
      title={'策略模板'}
      onClose={() => setTemplateVisible(false)}
    >
      <div className={styles.SelectTemplateTip}>
        <FInfo style={{ fontSize: 16 }} />
        <div style={{ width: 5 }} />
        <span>选择模版后可对其进行编辑</span>
      </div>
      <div style={{ height: 30 }} />
      <PolicyTemplates
        onSelect={(p) => {
          // setTitle(p.title);
          onChangeTitleInput(p.title);
          onChangeTextInput(p.text);
          setTemplateVisible(false);
        }}
      />
    </FDrawer>
  </>);
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

const policyText: string = `公开（所有人可签约）

初始状态[已授权]
  1周后 进入 状态 auth
状态 auth
  支付 10枚 羽币 进入 状态 auth_month
  支付 100枚 羽币 进入 状态 auth_year
  3天后 进入 终止状态
状态 auth_month[已授权]
  1个月后 进入 终止状态
状态 auth_year[已授权]
  1年后 进入 终止状态
终止状态
  停止接收事件`;

interface PolicyShowcaseProps {
  text: string;
}

function PolicyShowcase({ text }: PolicyShowcaseProps) {

  const [activated, setActivated] = React.useState<'content' | 'code' | 'view'>('content');

  return (<div className={styles.PolicyShowcase}>
    <div className={styles.PolicyShowcaseHeader}>
      <div style={{ width: 15 }} />
      <a
        onClick={() => {
          setActivated('content');
        }}
        className={[activated === 'content' ? styles.AActivated : ''].join(' ')}
      >策略内容</a>
      <div style={{ width: 20 }} />
      <a
        onClick={() => {
          setActivated('code');
        }}
        className={[activated === 'code' ? styles.AActivated : ''].join(' ')}
      >策略代码</a>
      <div style={{ width: 20 }} />
      <a
        onClick={() => {
          setActivated('view');
        }}
        className={[activated === 'view' ? styles.AActivated : ''].join(' ')}
      >状态机视图</a>
    </div>

    <div className={styles.PolicyShowcaseBody}>
      <div>
        {
          activated === 'content' && (<FCodeFormatter code={policyText} />)
        }

        {
          activated === 'code' && (<FCodeFormatter code={policyText} />)
        }

        {
          activated === 'view' && (<div />)
        }
      </div>
    </div>
  </div>);
}
