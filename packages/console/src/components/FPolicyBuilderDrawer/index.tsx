import * as React from 'react';
import styles from './index.less';
import FInput from '@/components/FInput';
import FCodemirror from '@/components/FCodemirror';
import { Space, Divider, DatePicker, InputNumber } from 'antd';
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
import FUil1 from '@/utils';

const { compile } = require('@freelog/resource-policy-lang');

interface FPolicyBuilderDrawerProps {
  visible?: boolean;

  alreadyUsedTitles?: string[];
  alreadyUsedTexts?: string[];

  targetType: 'resource' | 'presentable';

  onConfirm?({ title, text }: { title: string, text: string }): void;

  onCancel?(): void;
}

interface FPolicyBuilderDrawerStates {
  title: string;
  titleError: string;
  editMode: 'code' | 'composition';
  checkResult: 'unchecked' | 'checking' | 'checked';

  combinationData: CombinationStructureType;
  combinationDataError: string;
  enabledTargetState: string[];
  addingEventStateID: string;

  codeText: string;
  codeTextError: string;

  successResult: {
    title: string;
    code: string;
    translation: string;
    view: any;
  } | null;

  templateVisible: boolean;
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
    amount: number;
    target: string;
  } | {
    randomID: string;
    type: 'relativeTime';
    num: number;
    unit: 'year' | 'month' | 'week' | 'day' | 'cycle';
    target: string;
  } | {
    randomID: string;
    type: 'absoluteTime';
    dateTime: string;
    target: string;
  } | {
    randomID: string;
    type: 'terminate';
  }>;
}[];

const title1: string = '免费订阅（包月）';
const text1: string = `for public

initial[active]:
  ~freelog.RelativeTimeEvent("1","month") => finish
finish:
  terminate`;

const title2: string = '付费订阅（包月）';
const text2: string = `for public

initial:
  ~freelog.TransactionEvent("10","self.account") => auth
auth[active]:
  ~freelog.RelativeTimeEvent("1","month")  =>  finish
finish:
  terminate`;

function FPolicyBuilder({
                          visible = false,
                          targetType,
                          onCancel,
                          onConfirm,
                          alreadyUsedTitles = [],
                          alreadyUsedTexts = [],
                        }: FPolicyBuilderDrawerProps) {

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
      auth: false,
      testAuth: false,
      events: [],
    },
  ]);
  const [combinationDataError, setCombinationDataError] = React.useState<FPolicyBuilderDrawerStates['combinationDataError']>('');
  const [enabledTargetState, setEnabledTargetState] = React.useState<FPolicyBuilderDrawerStates['enabledTargetState']>(['initial']);
  const [addingEventStateID, setAddingEventStateID] = React.useState<FPolicyBuilderDrawerStates['addingEventStateID']>('');

  const [codeText, setCodeText] = React.useState<FPolicyBuilderDrawerStates['codeText']>('');
  const [codeTextError, setCodeTextError] = React.useState<FPolicyBuilderDrawerStates['codeTextError']>('');

  const [successResult, setSuccessResult] = React.useState<FPolicyBuilderDrawerStates['successResult']>(null);

  const [templateVisible, setTemplateVisible] = React.useState<boolean>(false);

  const disabledExecute: boolean = title.trim() === ''
    || !!titleError
    || (editMode === 'code'
      ? codeText.trim() === '' || !!codeTextError
      : combinationData.some((cd) => {
        return cd.name.trim() === ''
          || !!cd.nameError
          || cd.events.some((et) => {
            if (et.type === 'payment') {
              return !et.amount || !et.target;
            } else if (et.type === 'relativeTime') {
              return !et.num || !et.unit || !et.target;
            } else if (et.type === 'absoluteTime') {
              return !et.dateTime || !et.target;
            } else {
              return false;
            }
          });
      }));

  function onChangeTitleInput(value: string) {
    // const value: string = e.target.value;
    setTitle(value);
    setTitleError(verifyTitle(value, alreadyUsedTitles));
  }

  async function onChangeTextInput(value: string) {
    // const value: string = e.target.value;
    setCodeText(value);
    setCodeTextError(await verifyText(value, alreadyUsedTexts));
  }

  function onChangeCombinationData(data: Partial<Omit<CombinationStructureType[number], 'events'>>, randomID: string) {
    let result: CombinationStructureType = combinationData.map((cd) => {
      if (cd.randomID !== randomID) {
        return cd;
      }
      return {
        ...cd,
        ...data,
      };
    });

    const duplicateNames: string[] = searchDuplicateElements<string>(result.map((r) => {
      return r.name;
    }).filter((n) => {
      return !!n;
    }));

    result = result.map((r) => {
      return {
        ...r,
        isNameDuplicate: duplicateNames.includes(r.name),
      };
    });

    setCombinationData(result);
  }

  function onChangeCombinationEvent(data: Partial<CombinationStructureType[number]['events'][number]>, randomID1: string, randomID2: string) {
    // console.log(data, stateIndex, eventIndex, '!@#$@!#$234213423412342342134');
    const result: CombinationStructureType = combinationData.map<CombinationStructureType[number]>((cd, si) => {
      if (cd.randomID !== randomID1) {
        return cd;
      }
      return {
        ...cd,
        events: cd.events.map<CombinationStructureType[number]['events'][number]>((et: any, ei) => {
          if (et.randomID !== randomID2) {
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

  function deleteState(randomID: string) {
    const result: CombinationStructureType = combinationData.filter((cd) => {
      // console.log(stateIndex, si, '@!$@#$@##$%@#$%#$@%#@$%#$@5');
      return cd.randomID !== randomID;
    });

    handleTargetState(result);
  }

  function deleteEvent(randomID1: string, randomID2: string) {
    const result: CombinationStructureType = combinationData.map((cd) => {
      if (cd.randomID !== randomID1) {
        return cd;
      }
      return {
        ...cd,
        events: cd.events.filter((et) => {
          return et.randomID !== randomID2;
        }),
      };
    });
    // console.log(result, 'resultresultresult!@#$2134234');
    setCombinationData(result);
  }

  function addEvent(eventType: 'payment' | 'relativeTime' | 'absoluteTime' | 'terminate') {

    let evn: CombinationStructureType[number]['events'][number];

    if (eventType === 'payment') {
      evn = {
        randomID: FUtil.Tool.generateRandomCode(10),
        type: 'payment',
        amount: 10,
        target: '',
      };
    } else if (eventType === 'relativeTime') {
      evn = {
        randomID: FUtil.Tool.generateRandomCode(10),
        type: 'relativeTime',
        num: 1,
        unit: 'month',
        target: '',
      };
    } else if (eventType === 'absoluteTime') {
      evn = {
        randomID: FUtil.Tool.generateRandomCode(10),
        type: 'absoluteTime',
        dateTime: '',
        target: '',
      };
    } else {
      evn = {
        randomID: FUtil.Tool.generateRandomCode(10),
        type: 'terminate',
      };
    }

    const result: CombinationStructureType = combinationData.map((cd) => {
      if (addingEventStateID !== cd.randomID) {
        return cd;
      }
      return {
        ...cd,
        events: [
          ...cd.events,
          evn,
        ],
      };
    });

    setCombinationData(result);
    setAddingEventStateID('');
  }

  function handleTargetState(data: CombinationStructureType) {
    const results: string[] = Array.from(new Set(data
      .filter((cd) => {
        return !!cd.name && !cd.nameError;
      })
      .map((cd) => {
        return cd.name;
      })));
    // console.log(results, 'resultsresultsresults!@#$234234');

    const results2: CombinationStructureType = data
      .map((cd) => {
        return {
          ...cd,
          events: cd.events.map((et) => {
            if (et.type === 'terminate') {
              return et;
            }
            // console.log(et.target, 'et.targetet.targetet.target234234');
            return {
              ...et,
              target: results.includes(et.target) ? et.target : '',
            };
          }),
        };
      });

    setEnabledTargetState(results);
    setCombinationData(results2);
  }

  async function handleTemplate(num: 1 | 2) {
    // console.log(num, 'handleTemplatehandleTemplate23423423');
    setTemplateVisible(false);
    if (num === 1) {
      setCodeText(text1);
      setCodeTextError(await verifyText(text1, alreadyUsedTexts));
      setTitle(title1);
      setTitleError(verifyTitle(title1, alreadyUsedTitles));
      const result: CombinationStructureType = [
        {
          randomID: FUtil.Tool.generateRandomCode(10),
          type: 'initial',
          name: 'initial',
          nameError: '',
          isNameDuplicate: false,
          auth: true,
          testAuth: false,
          events: [
            {
              randomID: FUtil.Tool.generateRandomCode(10),
              type: 'relativeTime',
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
          testAuth: false,
          events: [
            {
              randomID: FUtil.Tool.generateRandomCode(10),
              type: 'terminate',
            },
          ],
        },
      ];
      handleTargetState(result);
    } else {
      setCodeText(text2);
      setCodeTextError(await verifyText(text2, alreadyUsedTexts));
      setTitle(title2);
      setTitleError(verifyTitle(title2, alreadyUsedTitles));
      const result: CombinationStructureType = [
        {
          randomID: FUtil.Tool.generateRandomCode(10),
          type: 'initial',
          name: 'initial',
          nameError: '',
          isNameDuplicate: false,
          auth: false,
          testAuth: false,
          events: [
            {
              randomID: FUtil.Tool.generateRandomCode(10),
              type: 'payment',
              amount: 10,
              target: 'auth',
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
              type: 'relativeTime',
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
          testAuth: false,
          events: [
            {
              randomID: FUtil.Tool.generateRandomCode(10),
              type: 'terminate',
            },
          ],
        },
      ];
      handleTargetState(result);
    }
  }

  return (<>
    <FDrawer
      title={'添加授权策略'}
      onClose={() => onCancel && onCancel()}
      visible={visible}
      width={720}
      topRight={<Space size={30}>
        <FTextBtn
          onClick={() => {
            onCancel && onCancel();
          }}>取消</FTextBtn>

        {
          checkResult === 'unchecked' && (<FRectBtn
            onClick={async () => {
              setCheckResult('checking');
              let code: string;
              if (editMode === 'code') {

                code = codeText;
              } else {
                code = dataToCode(combinationData);
                const err: string = await verifyText(code, alreadyUsedTexts);
                if (err) {
                  setCombinationDataError(err);
                  setCheckResult('unchecked');
                  return;
                } else {
                  setCombinationDataError('');
                }
              }

              // console.log(code, 'code1234123421341234');

              const { error, text } = await FUil1.Tool.codeTranslationToText({ code, targetType });

              if (error) {
                if (editMode === 'code') {
                  setCodeTextError(error[0]);
                } else {
                  setCombinationDataError(error[0]);
                }
                setCheckResult('unchecked');
                return;
              }

              setCheckResult('checked');
              setSuccessResult({
                title: title,
                code: code,
                translation: text || '',
                view: [],
              });

            }}
            // disabled={title === '' || codeText === '' || !!titleError || !!codeTextError}
            type='primary'
            disabled={disabledExecute}
          >校验</FRectBtn>)
        }

        {
          checkResult === 'checking' && (<FRectBtn
            disabled={true}
            type='primary'
          >校验中</FRectBtn>)
        }

        {
          checkResult === 'checked' && (<FRectBtn
            onClick={() => {
              onConfirm && onConfirm({
                title: successResult?.title || '',
                text: successResult?.code || '',
              });
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
            <FTitleText
              type='h1'
              text={successResult?.title || ''}
            />

            <FTextBtn
              type='primary'
              onClick={() => {
                setCheckResult('unchecked');
              }}
            >返回编辑</FTextBtn>
          </div>

          <div style={{ height: 30 }} />

          <PolicyShowcase
            content={successResult?.translation || ''}
            code={successResult?.code || ''}
            view={successResult?.view || ''}
          />
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
        !!combinationDataError && (<>
          <div className={styles.combinationDataError}>
            <FInfo />
            <div style={{ width: 5 }} />
            <span>{combinationDataError}</span>
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
                                      placeholder='输入状态名称'
                                      style={{ width: 400 }}
                                      value={cd.name}
                                      onChange={(e) => {
                                        const value: string = e.target.value;

                                        onChangeCombinationData({
                                          name: value,
                                          nameError: /^[A-Za-z$_][\w$_]*$/.test(value) ? '' : '请使用JavaScript英文变量命名规则',
                                        }, cd.randomID);
                                      }}
                                      onBlur={() => {
                                        handleTargetState(combinationData);
                                      }}
                                    />
                                  </div>
                                  <FTextBtn
                                    type='danger'
                                    onClick={() => {
                                      deleteState(cd.randomID);
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
                                }, cd.randomID);
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
                                }, cd.randomID);
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
                                      <InputNumber
                                        min={1}
                                        placeholder='输入数值'
                                        style={{ width: 120 }}
                                        value={et.amount}
                                        onChange={(value) => {
                                          // console.log(value, 'valuevaluevalue980upoaisdjfl');
                                          onChangeCombinationEvent({
                                            amount: value,
                                          }, cd.randomID, et.randomID);
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
                                      <InputNumber
                                        min={1}
                                        placeholder='输入数值'
                                        style={{ width: 250 }}
                                        value={et.num}
                                        onChange={(value) => {
                                          onChangeCombinationEvent({
                                            num: value,
                                          }, cd.randomID, et.randomID);
                                        }}
                                      />
                                      <div style={{ width: 10 }} />
                                      <FSelect
                                        placeholder='选择时间单位'
                                        value={et.unit}
                                        style={{ width: 250 }}
                                        dataSource={timeUnits}
                                        onChange={(value) => {
                                          onChangeCombinationEvent({
                                            unit: value as 'year',
                                          }, cd.randomID, et.randomID);
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
                                      <FContentText
                                        type='normal'
                                        text={'于'}
                                      />
                                      <div style={{ width: 10 }} />
                                      <DatePicker
                                        placeholder='选择日期时间'
                                        style={{ width: 480 }}
                                        showTime={{ format: 'HH:mm' }}
                                        format='YYYY-MM-DD HH:mm'
                                        onChange={(value, dateString) => {
                                          // console.log(value, dateString, 'onChange23423423');
                                          onChangeCombinationEvent({
                                            dateTime: dateString,
                                          }, cd.randomID, et.randomID);
                                        }}
                                        // onOk={(date) => {
                                        //   console.log(date, 'onOk');
                                        // }}
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
                                        <FSelect
                                          value={et.target || undefined}
                                          placeholder='选择目标状态'
                                          style={{ width: '100%' }}
                                          dataSource={enabledTargetState.map((ets) => {
                                            return {
                                              value: ets,
                                              title: ets,
                                            };
                                          })}
                                          onChange={(value) => {
                                            onChangeCombinationEvent({
                                              target: value,
                                            }, cd.randomID, et.randomID);
                                          }}
                                        />
                                      </div>
                                    </>)
                                  }

                                </div>

                                <FCircleBtn
                                  type='danger'
                                  onClick={() => {
                                    deleteEvent(cd.randomID, et.randomID);
                                  }}
                                />
                              </div>);

                            })
                          }

                        </Space>

                        {
                          !cd.events.some((et) => {
                            return et.type === 'terminate';
                          }) && (<>
                            <div className={styles.compositionStateFooter}>
                              <FCircleBtn
                                type='minor'
                                onClick={() => {
                                  setAddingEventStateID(cd.randomID);
                                }}
                              ><FPlus style={{ fontSize: 12 }} /></FCircleBtn>
                              <div style={{ width: 5 }} />
                              <FTextBtn
                                type='primary'
                                onClick={() => {
                                  setAddingEventStateID(cd.randomID);
                                }}
                              >添加事件或指令</FTextBtn>
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
                    const results: CombinationStructureType = [
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
                    ];
                    handleTargetState(results);
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
            // onChangeTitleInput(p.title);
            // onChangeTextInput(p.text);
            // setTemplateVisible(false);
          }}
          onClickSelect={(num) => {
            handleTemplate(num);
          }}
        />
      </FDrawer>

      <FDrawer
        width={640}
        visible={!!addingEventStateID}
        title={'添加事件或指令'}
        onClose={() => {
          setAddingEventStateID('');
        }}
      >
        <FTitleText type='h3' text={'事件'} />
        <div style={{ height: 20 }} />
        <div className={styles.templateEvent}>
          <div>
            <div style={{ width: 130 }}>
              <FContentText type='normal' text={'相对时间事件'} />
            </div>
            <div>
              <FContentText type='negative' text={'示例：1 周之后'} />
            </div>
          </div>
          <FRectBtn
            type='secondary'
            size='small'
            onClick={() => {
              addEvent('relativeTime');
            }}>选择</FRectBtn>
        </div>

        <div style={{ height: 10 }} />

        <div className={styles.templateEvent}>
          <div>
            <div style={{ width: 130 }}>
              <FContentText type='normal' text={'绝对时间事件'} />
            </div>
            <div>
              <FContentText type='negative' text={'示例：于 2021/05/03'} />
            </div>
          </div>
          <FRectBtn
            type='secondary'
            size='small'
            onClick={() => {
              addEvent('absoluteTime');
            }}>选择</FRectBtn>
        </div>

        <div style={{ height: 10 }} />

        <div className={styles.templateEvent}>
          <div>
            <div style={{ width: 130 }}>
              <FContentText type='normal' text={'支付事件'} />
            </div>
            <div>
              <FContentText type='negative' text={'示例：支付 10 羽币 至 我的代币账户'} />
            </div>
          </div>
          <FRectBtn
            type='secondary'
            size='small'
            onClick={() => {
              addEvent('payment');
            }}
          >选择</FRectBtn>
        </div>

        <div style={{ height: 30 }} />

        <FTitleText type='h3' text={'指令'} />

        <div style={{ height: 20 }} />

        <div className={styles.templateEvent}>
          <div>
            <FContentText type='normal' text={'状态机终止，停止接收事件'} />
          </div>
          <FRectBtn
            type='secondary'
            size='small'
            disabled={!!(combinationData.find((cd) => {
              return cd.randomID === addingEventStateID;
            })?.events.length)}
            onClick={() => {
              addEvent('terminate');
            }}
          >选择</FRectBtn>
        </div>
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

async function verifyText(text: string, allTexts: string[]): Promise<string> {
  let error: string = '';
  if (text === '') {
    error = '请输入内容';
  } else if (allTexts.includes(text)) {
    error = '内容已存在';
  } else {
    try {
      const result = await compile(text, 'resource', 'http://qi.testfreelog.com', 'dev');
    } catch (err) {
      // console.log(err.message, 'err234234234');
      error = err.message;
    }
  }
  return error;
}

interface PolicyShowcaseProps {
  code: string;
  content: string;
  view: any;
}

function PolicyShowcase({ code, content, view }: PolicyShowcaseProps) {

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
          activated === 'content' && (<FCodeFormatter code={content} />)
        }

        {
          activated === 'code' && (<FCodeFormatter code={code} />)
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

function dataToCode(data: CombinationStructureType): string {
  let result: string = 'for public\n';
  for (const st of data) {
    result += '\n';
    const colors: string[] = [];
    if (st.auth) {
      colors.push('active');
    }
    if (st.testAuth) {
      colors.push('testActive');
    }
    result += `${st.name}${colors.length > 0 ? `[${colors.join(',')}]` : ''}:`;

    for (const et of st.events) {
      result += '\n  ';
      if (et.type === 'payment') {
        result += `~freelog.TransactionEvent("${et.amount}","self.account") => ${et.target}`;
      } else if (et.type === 'relativeTime') {
        result += `~freelog.RelativeTimeEvent("${et.num}","${et.unit}") => ${et.target}`;
      } else if (et.type === 'absoluteTime') {
        result += `~freelog.TimeEvent("${et.dateTime}") => ${et.target}`;
      } else {
        result += 'terminate';
      }
    }
  }
  return result;
}

function codeToData(code: string): CombinationStructureType {
  return [];
}


