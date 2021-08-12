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
import { FUtil } from '@freelog/tools-lib';

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

  combinationData: CombinationStructureType;

  codeText: string;
  codeTextError: string;
}

const timeUnits = [
  { value: 'year', title: '年' },
  { value: 'month', title: '月' },
  { value: 'week', title: '周' },
  { value: 'day', title: '天' },
  { value: 'cycle', title: '周期' },
];

const accounts = [
  { value: 'my', title: '我的代币账户' },
];

const currencies = [
  { value: 'feather', title: '羽币' },
];

type CombinationStructureType = {
  randomID: string;
  type: 'initial' | 'other';
  name: string;
  nameError: string;
  isNameDuplicate: boolean;
  auth: boolean;
  testAuth: boolean;
  events: Array<{
    randomID: string;
    type: 'payment';
    eventName: string;
    amount: number;
    target: string;
  } | {
    randomID: string;
    type: 'relativeTime';
    eventName: string;
    num: number;
    unit: 'year' | 'month' | 'week' | 'day' | 'cycle';
    target: string;
  } | {
    randomID: string;
    type: 'absoluteTime';
    eventName: string;
    dateTime: string;
    target: string;
  } | {
    randomID: string;
    type: 'terminate';
  }>;
}[];

function FPolicyBuilder({ visible = false, alreadyHas, onCancel, onConfirm }: FPolicyBuilderDrawerProps) {

  const [title, setTitle] = React.useState<FPolicyBuilderDrawerStates['title']>('');
  const [titleError, setTitleError] = React.useState<FPolicyBuilderDrawerStates['titleError']>('');
  const [editMode, setEditMode] = React.useState<FPolicyBuilderDrawerStates['editMode']>('composition');
  const [checkResult, setCheckResult] = React.useState<FPolicyBuilderDrawerStates['checkResult']>('unchecked');

  const [combinationData, setCombinationData] = React.useState<FPolicyBuilderDrawerStates['combinationData']>([
    {
      randomID: FUtil.Tool.generateRandomCode(10),
      type: 'initial',
      name: 'initial',
      nameError: '',
      isNameDuplicate: false,
      auth: true,
      testAuth: true,
      events: [
        {
          randomID: FUtil.Tool.generateRandomCode(10),
          type: 'payment',
          eventName: '事件一',
          amount: 10,
          target: 'finish',
        },
      ],
    },
    {
      randomID: FUtil.Tool.generateRandomCode(10),
      type: 'other',
      name: 'auth',
      nameError: '',
      isNameDuplicate: false,
      auth: true,
      testAuth: false,
      events: [
        {
          randomID: FUtil.Tool.generateRandomCode(10),
          type: 'absoluteTime',
          eventName: '事件一',
          dateTime: '2022-01-01 00:00:00',
          target: 'finish',
        },
        {
          randomID: FUtil.Tool.generateRandomCode(10),
          type: 'relativeTime',
          eventName: '事件二',
          num: 1,
          unit: 'month',
          target: 'finish',
        },
      ],
    },
    {
      randomID: FUtil.Tool.generateRandomCode(10),
      type: 'other',
      name: 'finish',
      nameError: '',
      isNameDuplicate: false,
      auth: false,
      testAuth: true,
      events: [{
        randomID: FUtil.Tool.generateRandomCode(10),
        type: 'terminate',
      }],
    },
  ]);

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

  function onChangeCombinationData(data: Partial<Omit<CombinationStructureType[number], 'events'>>, index: number) {
    let result: CombinationStructureType = combinationData.map((cd, ii) => {
      if (ii !== index) {
        return cd;
      }
      return {
        ...cd,
        ...data,
      };
    });

    const duplicateNames: string[] = searchDuplicateElements<string>(result.map((r) => {
      return r.name;
    }));

    // console.log(duplicateNames, 'duplicateNames9023uj;i4orjlkj');

    result = result.map((r) => {
      return {
        ...r,
        isNameDuplicate: duplicateNames.includes(r.name),
      };
    });

    setCombinationData(result);
  }

  function onChangeCombinationEvent(data: Partial<CombinationStructureType[number]['events'][number]>, stateIndex: number, eventIndex: number) {
    // console.log(data, stateIndex, eventIndex, '!@#$@!#$234213423412342342134');
    const result: CombinationStructureType = combinationData.map<CombinationStructureType[number]>((cd, si) => {
      if (si !== stateIndex) {
        return cd;
      }
      return {
        ...cd,
        events: cd.events.map<CombinationStructureType[number]['events'][number]>((et: any, ei) => {
          if (ei !== eventIndex) {
            return et;
          }
          return {
            ...et,
            ...data,
          };
        }),
      };
    });

    setCombinationData(result);
  }

  return (<>
    <FDrawer
      title={'添加授权策略'}
      onClose={() => onCancel && onCancel()}
      visible={visible}
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
                  {
                    combinationData.map((cd, stateIndex) => {
                      return (<div key={cd.randomID} className={styles.compositionState}>

                        <div className={styles.compositionStateHeader}>
                          <div style={{ height: 15 }} />
                          {
                            cd.type === 'initial'
                              ? (<div className={styles.compositionStateHeader1}>
                                <div>
                                  <label className={styles.compositionStateIndex}>{stateIndex + 1}</label>
                                  <div style={{ width: 15 }} />
                                  <FTitleText
                                    type='h3'
                                    text={cd.name}
                                  />
                                </div>

                                <FContentText
                                  text={'初始状态不可删除'}
                                  type='negative'
                                />

                              </div>)
                              : (<>
                                <div className={styles.compositionStateHeader1}>
                                  <div>
                                    <label className={styles.compositionStateIndex}>{stateIndex + 1}</label>
                                    <div style={{ width: 15 }} />
                                    <FInput
                                      style={{ width: 400 }}
                                      value={cd.name}
                                      onChange={(e) => {
                                        const value: string = e.target.value;

                                        onChangeCombinationData({
                                          name: value,
                                          nameError: /^[A-Za-z$_][\w$_]*$/.test(value) ? '' : '请使用JavaScript英文变量命名规则',
                                        }, stateIndex);
                                      }}
                                    />
                                  </div>
                                  <FTextBtn
                                    type='danger'
                                    onClick={() => {
                                      const result: CombinationStructureType = combinationData.filter((cd, si) => {
                                        // console.log(stateIndex, si, '@!$@#$@##$%@#$%#$@%#@$%#$@5');
                                        return stateIndex !== si;
                                      });

                                      console.log(result, 'result!@#412341234123412434444dsfsdfdsf');
                                      setCombinationData(result);
                                    }}
                                  >删除</FTextBtn>
                                </div>
                                {
                                  cd.nameError
                                    ? (<div style={{
                                      color: '#EE4040',
                                      paddingLeft: 55,
                                      paddingTop: 5,
                                    }}>{cd.nameError}</div>)
                                    : cd.isNameDuplicate
                                      ? (<div style={{
                                        color: '#EE4040',
                                        paddingLeft: 55,
                                        paddingTop: 5,
                                      }}>有重复的名称</div>)
                                      : null
                                }

                              </>)
                          }

                          <div style={{ height: 15 }} />

                          <div className={styles.compositionStateHeader2}>
                            <div style={{ width: 50 }} />
                            <FCheckbox
                              checked={cd.auth}
                              onChange={(e) => {
                                onChangeCombinationData({
                                  auth: e.target.checked,
                                }, stateIndex);
                              }}
                            />
                            <div style={{ width: 5 }} />
                            <FContentText text={'授权'} />
                            <div style={{ width: 20 }} />
                            <FCheckbox
                              checked={cd.testAuth}
                              onChange={(e) => {
                                onChangeCombinationData({
                                  testAuth: e.target.checked,
                                }, stateIndex);
                              }}
                            />
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
                          {
                            cd.events.map((et, eventIndex) => {
                              return (<div key={et.randomID} className={styles.compositionStateBodyItem}>
                                <div className={styles.compositionStateBodyEvent}>

                                  {
                                    et.type !== 'terminate' && (<>
                                      <div>
                                        <FTitleText type='h4' text={'事件' + (eventIndex + 1)} />
                                      </div>

                                      <div style={{ height: 10 }} />
                                    </>)
                                  }

                                  {
                                    et.type === 'payment' && (<div>
                                      <FContentText text={'支付'} type='normal' />
                                      <div style={{ width: 10 }} />
                                      <FInput
                                        style={{ width: 120 }}
                                        value={String(et.amount)}
                                        onChange={(e) => {

                                        }}
                                      />
                                      <div style={{ width: 10 }} />
                                      <FSelect
                                        value={'feather'}
                                        disabled
                                        style={{ width: 120 }}
                                        dataSource={currencies}
                                        // onChange={(value) => {
                                        //   onChangeCombinationEvent({});
                                        // }}
                                      />
                                      <div style={{ width: 10 }} />
                                      <FContentText text={'至'} type='normal' />
                                      <div style={{ width: 10 }} />
                                      <FSelect
                                        value={'my'}
                                        disabled
                                        style={{ width: 180 }}
                                        dataSource={accounts}
                                      />
                                      <div style={{ width: 10 }} />
                                      <FContentText
                                        type='normal'
                                        text={'之后'}
                                      />
                                    </div>)
                                  }

                                  {
                                    et.type === 'relativeTime' && (<div>
                                      <FInput
                                        style={{ width: 250 }}
                                        value={String(et.num)}
                                      />
                                      <div style={{ width: 10 }} />
                                      <FSelect
                                        value={et.unit}
                                        style={{ width: 250 }}
                                        dataSource={timeUnits}
                                        onChange={(value) => {
                                          onChangeCombinationEvent({
                                            unit: value as 'year',
                                          }, stateIndex, eventIndex);
                                        }}
                                      />
                                      <div style={{ width: 10 }} />
                                      <FContentText
                                        type='normal'
                                        text={'之后'}
                                      />
                                    </div>)
                                  }

                                  {
                                    et.type === 'absoluteTime' && (<div>
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
                                    </div>)
                                  }

                                  {
                                    et.type === 'terminate' && (<div>
                                      <FContentText type='normal' text={'状态机终止，不再接受事件'} />
                                    </div>)
                                  }

                                  {
                                    et.type !== 'terminate' && (<>
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
                                    </>)
                                  }

                                </div>

                                <FCircleBtn type='danger' />
                              </div>);

                            })
                          }

                        </Space>

                        {
                          !cd.events.some((et) => {
                            return et.type === 'terminate';
                          }) && (<>
                            <div className={styles.compositionStateFooter}>
                              <FCircleBtn type='minor'><FPlus style={{ fontSize: 12 }} /></FCircleBtn>
                              <div style={{ width: 5 }} />
                              <FTextBtn type='primary'>添加事件或指令</FTextBtn>
                            </div>

                            <div style={{ height: 15 }} />
                          </>)
                        }

                      </div>);
                    })
                  }

                </Space>

                <div style={{ height: 15 }} />

                <FRectBtn
                  type='default'
                  onClick={() => {
                    setCombinationData([
                      ...combinationData,
                      {
                        randomID: FUtil.Tool.generateRandomCode(10),
                        type: 'other',
                        name: '',
                        nameError: '',
                        isNameDuplicate: false,
                        auth: false,
                        testAuth: false,
                        events: [],
                      },
                    ]);
                  }}
                >新建状态</FRectBtn>

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

function searchDuplicateElements<T>(arr: T[]): T[] {
  const myMap: Map<T, number> = new Map<T, number>();
  for (const i of arr) {
    myMap.set(i, (myMap.get(i) || 0) + 1);
  }
  return Array.from(myMap).filter((mm) => {
    return mm[1] > 1;
  }).map((mm) => {
    return mm[0];
  });
}
