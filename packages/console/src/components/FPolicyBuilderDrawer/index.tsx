import * as React from 'react';
import styles from './index.less';
import FInput from '../FInput';
import FCodemirror from '../FCodemirror';
import { Space, Divider, DatePicker, InputNumber, Modal } from 'antd';
import { FCheck, FCode, FDown, FFileText, FInfo, FLoading, FPlus } from '../FIcons';
import { FCircleBtn, FRectBtn, FTextBtn } from '../FButton';
import PolicyTemplates, { title1, text1, title2, text2 } from './PolicyTemplates';
import FDrawer from '../FDrawer';
import FComposition from '../FIcons/FComposition';
import FSelect from '../FSelect';
import { FContentText, FTitleText } from '../FText';
import FCheckbox from '../FCheckbox';
import FGuideDown from '../FIcons/FGuideDown';
import FCodeFormatter from '../FCodeFormatter';
import { FUtil } from '@freelog/tools-lib';
import FUil1 from '@/utils';
import moment, { Moment } from 'moment';
import { DisabledTimes } from 'rc-picker/lib/interface';

const { compile } = require('@freelog/resource-policy-lang');

interface FPolicyBuilderDrawerProps {
  visible?: boolean;

  alreadyUsedTitles?: string[];
  alreadyUsedTexts?: string[];

  targetType: 'resource' | 'presentable';

  onConfirm?({ title, text }: { title: string, text: string }): void;

  onCancel?(): void;
}

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
    amount: number | null;
    target: string;
  } | {
    randomID: string;
    type: 'relativeTime';
    num: number | null;
    unit: '' | 'year' | 'month' | 'week' | 'day' | 'cycle';
    target: string;
  } | {
    randomID: string;
    type: 'absoluteTime';
    dateTime: Moment | null;
    target: string;
  } | {
    randomID: string;
    type: 'terminate';
  }>;
}[];

interface FPolicyBuilderDrawerStates {
  showView: 'edit' | 'fail' | 'success';

  title: string;
  titleError: string;
  editMode: 'code' | 'composition';
  isVerifying: boolean;

  combinationData: CombinationStructureType;

  addingEventStateID: string;

  codeText: string;
  codeTextError: string;

  failResult: {
    errorText: string;
  } | null;

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

const combinationDataInitialRandomID: string = FUtil.Tool.generateRandomCode(10);

const initStates: FPolicyBuilderDrawerStates = {
  showView: 'edit',

  title: '',
  titleError: '',
  editMode: 'composition',
  isVerifying: false,

  combinationData: [
    {
      randomID: combinationDataInitialRandomID,
      type: 'initial',
      name: 'initial',
      nameError: '',
      isNameDuplicate: false,
      auth: false,
      testAuth: false,
      events: [],
    },
  ],

  addingEventStateID: '',

  codeText: '',
  codeTextError: '',

  failResult: null,

  successResult: null,

  templateVisible: false,
};

function FPolicyBuilder({
                          visible = false,
                          targetType,
                          onCancel,
                          onConfirm,
                          alreadyUsedTitles = [],
                          alreadyUsedTexts = [],
                        }: FPolicyBuilderDrawerProps) {
  const refContainer = React.useRef(null);
  const [showView, setShowView] = React.useState<FPolicyBuilderDrawerStates['showView']>('edit');

  const [title, setTitle] = React.useState<FPolicyBuilderDrawerStates['title']>(initStates.title);
  const [titleError, setTitleError] = React.useState<FPolicyBuilderDrawerStates['titleError']>(initStates.titleError);
  const [editMode, setEditMode] = React.useState<FPolicyBuilderDrawerStates['editMode']>(initStates.editMode);
  const [isVerifying, setIsVerifying] = React.useState<FPolicyBuilderDrawerStates['isVerifying']>(initStates.isVerifying);

  const [combinationData, setCombinationData] = React.useState<FPolicyBuilderDrawerStates['combinationData']>(initStates.combinationData);
  // const [enabledTargetState, setEnabledTargetState] = React.useState<FPolicyBuilderDrawerStates['enabledTargetState']>(initStates.enabledTargetState);
  const [addingEventStateID, setAddingEventStateID] = React.useState<FPolicyBuilderDrawerStates['addingEventStateID']>(initStates.addingEventStateID);

  const [codeText, setCodeText] = React.useState<FPolicyBuilderDrawerStates['codeText']>(initStates.codeText);
  const [codeTextError, setCodeTextError] = React.useState<FPolicyBuilderDrawerStates['codeTextError']>(initStates.codeTextError);


  const [failResult, setFailResult] = React.useState<FPolicyBuilderDrawerStates['failResult']>(initStates.failResult);
  const [successResult, setSuccessResult] = React.useState<FPolicyBuilderDrawerStates['successResult']>(initStates.successResult);

  const [templateVisible, setTemplateVisible] = React.useState<FPolicyBuilderDrawerStates['templateVisible']>(initStates.templateVisible);

  function resetAllStates() {
    setShowView(initStates.showView);
    setTitle(initStates.title);
    setTitleError(initStates.titleError);
    setEditMode(initStates.editMode);
    setIsVerifying(initStates.isVerifying);
    setCombinationData(initStates.combinationData);
    // setEnabledTargetState(initStates.enabledTargetState);
    setAddingEventStateID(initStates.addingEventStateID);
    setCodeText(initStates.codeText);
    setCodeTextError(initStates.codeTextError);
    setFailResult(initStates.failResult);
    setSuccessResult(initStates.successResult);
    setTemplateVisible(initStates.templateVisible);
  }

  function onChangeTitleInput(value: string) {
    setTitle(value);
    setTitleError(verifyTitle(value, alreadyUsedTitles));
  }

  async function onChangeCodemirror(value: string) {
    // const value: string = e.target.value;
    setCodeText(value);
    setCodeTextError(await verifyCodeText(value, alreadyUsedTexts, targetType));
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
    // console.log(r/**/esult, 'resultresultresult09213j4lkjsdfalafasdf');
    setCombinationData(result);
  }

  function onClickAddStateBtn() {
    const results: FPolicyBuilderDrawerStates['combinationData'] = [
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

    setCombinationData(results);
  }

  function onClickDeleteStateBtn(randomID: string) {
    const result: FPolicyBuilderDrawerStates['combinationData'] = combinationData.filter((cd) => {
      // console.log(stateIndex, si, '@!$@#$@##$%@#$%#$@%#@$%#$@5');
      return cd.randomID !== randomID;
    }).map((cd) => {
      return {
        ...cd,
        events: cd.events.map((ev) => {
          if ((ev as any).target && (ev as any).target === randomID) {
            return {
              ...ev,
              target: '',
            };
          }
          return ev;
        }),
      };
    });
    setCombinationData(result);
    // handleTargetState(result);
  }

  function onClickAddEventBtn(eventType: 'payment' | 'relativeTime' | 'absoluteTime' | 'terminate') {

    let evn: CombinationStructureType[number]['events'][number];

    if (eventType === 'payment') {
      evn = {
        randomID: FUtil.Tool.generateRandomCode(10),
        type: 'payment',
        amount: null,
        target: '',
      };
    } else if (eventType === 'relativeTime') {
      evn = {
        randomID: FUtil.Tool.generateRandomCode(10),
        type: 'relativeTime',
        num: null,
        unit: '',
        target: '',
      };
    } else if (eventType === 'absoluteTime') {
      evn = {
        randomID: FUtil.Tool.generateRandomCode(10),
        type: 'absoluteTime',
        dateTime: null,
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

  function onClickDeleteEventBtn(randomID1: string, randomID2: string) {
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

  function onClickSelectTemplateBtn(num: 1 | 2) {
    // console.log(num, 'handleTemplatehandleTemplate23423423');
    setTemplateVisible(false);
    if (num === 1) {
      setCodeText(text1);
      // setCodeTextError(await verifyText(text1, alreadyUsedTexts));
      setTitle(title1);
      setTitleError(verifyTitle(title1, alreadyUsedTitles));

      const initialRandomID: string = FUtil.Tool.generateRandomCode(10);
      const finishRandomID: string = FUtil.Tool.generateRandomCode(10);
      const result: CombinationStructureType = [
        {
          randomID: initialRandomID,
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
              target: finishRandomID,
            },
          ],
        },
        {
          randomID: finishRandomID,
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
      setCombinationData(result);
    } else {
      setCodeText(text2);
      // setCodeTextError(await verifyText(text2, alreadyUsedTexts));
      setTitle(title2);
      setTitleError(verifyTitle(title2, alreadyUsedTitles));

      const initialRandomID: string = FUtil.Tool.generateRandomCode(10);
      const authRandomID: string = FUtil.Tool.generateRandomCode(10);
      const finishRandomID: string = FUtil.Tool.generateRandomCode(10);
      const result: CombinationStructureType = [
        {
          randomID: initialRandomID,
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
              target: authRandomID,
            },
          ],
        },
        {
          randomID: authRandomID,
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
              target: finishRandomID,
            },
          ],
        },
        {
          randomID: finishRandomID,
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
      setCombinationData(result);
      // handleTargetState(result);
    }
  }

  async function onClickVerifyBtn() {
    setIsVerifying(true);
    let code: string;
    if (editMode === 'code') {
      code = codeText;
    } else {
      code = dataToCode(combinationData);
    }
    console.log(code, 'code823u423u4ooij');
    const err: string = await verifyCodeText(code, alreadyUsedTexts, targetType);
    if (err) {
      setIsVerifying(false);
      setShowView('fail');
      setFailResult({ errorText: err });
      return;
    }

    const { error, text } = await FUtil.Format.policyCodeTranslationToText(code, targetType);

    if (error) {
      setIsVerifying(false);
      setShowView('fail');
      setFailResult({ errorText: err });
      return;
    }

    setIsVerifying(false);
    setShowView('success');
    setSuccessResult({
      title: title,
      code: code,
      translation: text || '',
      view: [],
    });
  }

  function onChangeDrawerVisible(visible: boolean) {
    if (!visible) {
      resetAllStates();
    }
  }

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

  const enabledTargetState: { value: string; title: string }[] = combinationData.map<{ value: string; title: string }>((cd, index) => {
    return {
      value: cd.randomID,
      title: `(${index + 1}) ${cd.name}`,
    };
  });

  const DrawerTopRight = (<Space size={30}>
    <FTextBtn
      onClick={() => {
        onCancel && onCancel();
      }}>取消</FTextBtn>

    {
      showView === 'edit' && <>
        {
          isVerifying
            ? (<FRectBtn
              disabled={true}
              type='primary'
            >校验中</FRectBtn>)
            : (<FRectBtn
              onClick={onClickVerifyBtn}
              type='primary'
              disabled={disabledExecute}
            >校验</FRectBtn>)
        }
      </>
    }

    {
      showView === 'fail' && (<FRectBtn
        disabled={true}
        type='primary'
      >校验失败</FRectBtn>)
    }

    {
      showView === 'success' && (<FRectBtn
        onClick={() => {
          onConfirm && onConfirm({
            title: successResult?.title || '',
            text: successResult?.code || '',
          });
        }}
        type='primary'
      >创建</FRectBtn>)
    }

  </Space>);

  const EditView = (<div className={styles.maskingContainer} ref={refContainer}>
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
        ? (<div className={styles.compositionView}>
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
                                  // handleTargetState(combinationData);
                                }}
                              />
                            </div>
                            <FTextBtn
                              type='danger'
                              onClick={() => {
                                onClickDeleteStateBtn(cd.randomID);
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
                                  // placeholder={'输入交易金额'}
                                  placeholder={FUil1.I18n.message('hint_transaction_amount')}
                                  style={{ width: 120 }}
                                  value={et.amount as 0}
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
                                  // placeholder={'输入周期数目'}
                                  placeholder={FUil1.I18n.message('hint_relativetime_cyclecount')}
                                  style={{ width: 250 }}
                                  value={et.num as number}
                                  onChange={(value) => {
                                    onChangeCombinationEvent({
                                      num: value,
                                    }, cd.randomID, et.randomID);
                                  }}
                                />
                                <div style={{ width: 10 }} />
                                <FSelect
                                  placeholder={FUil1.I18n.message('hint_relativetime_unit')}
                                  value={et.unit || null}
                                  // value={''}
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
                                  // placeholder={'选择日期时间'}
                                  placeholder={FUil1.I18n.message('hint_time_datetime')}
                                  style={{ width: 480 }}
                                  showTime={{ format: 'HH:mm' }}
                                  format='YYYY-MM-DD HH:mm'
                                  disabledDate={disabledDate}
                                  allowClear={false}
                                  value={et.dateTime}
                                  disabledTime={disabledTime}
                                  onChange={(value, dateString) => {
                                    const mo: Moment | null = (value?.valueOf() || -1) < moment().valueOf() ? moment() : value;
                                    onChangeCombinationEvent({
                                      dateTime: mo,
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
                                    dataSource={enabledTargetState}
                                    onChange={(value) => {
                                      onChangeCombinationEvent({
                                        target: value,
                                      }, cd.randomID, et.randomID);
                                    }}
                                    getPopupContainer={() => {
                                      return refContainer?.current || document.body;
                                    }}
                                    dropdownRender={menu => (<>
                                      {menu}
                                      <div className={styles.dropdownRenderAdd}>
                                        <FCircleBtn
                                          size='small'
                                          type='minor'
                                          onClick={onClickAddStateBtn}
                                        >
                                          <FPlus style={{ fontSize: 12 }} />
                                        </FCircleBtn>
                                        <div style={{ width: 5 }} />
                                        <FTextBtn
                                          type='primary'
                                          onClick={onClickAddStateBtn}
                                        >新建状态</FTextBtn>
                                      </div>
                                    </>)}
                                  />
                                </div>
                              </>)
                            }

                          </div>

                          <FCircleBtn
                            type='danger'
                            onClick={() => {
                              onClickDeleteEventBtn(cd.randomID, et.randomID);
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
            onClick={onClickAddStateBtn}
          >新建状态</FRectBtn>

        </div>)
        : (<>
          <FCodemirror
            value={codeText}
            onChange={(value) => {
              // console.log(value, 'value1234231421344324');
              onChangeCodemirror(value);
            }}
          />
          {codeTextError && <>
            <div style={{ height: 5 }} />
            <div className={styles.textError}>{codeTextError}</div>
          </>}
        </>)
    }

    {
      isVerifying && (<div className={styles.maskingBox} />)
    }

  </div>);

  return (<>
    <FDrawer
      title={'添加授权策略'}
      onClose={() => onCancel && onCancel()}
      visible={visible}
      width={720}
      topRight={DrawerTopRight}
      afterVisibleChange={onChangeDrawerVisible}
    >
      {
        showView === 'success' && (<div>
          <div className={styles.PolicyVerifySuccess}>
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
                // setCheckResult('unchecked');
                setShowView('edit');
                setSuccessResult(null);
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
        showView === 'fail' && (<div>
          <div className={styles.PolicyVerifyFail}>
            <FInfo />
            <div style={{ width: 5 }} />
            <div>校验失败</div>
            <div style={{ width: 20 }} />
            <span>以下是错误信息</span>
          </div>
          <div style={{ height: 30 }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div />

            <FTextBtn
              type='primary'
              onClick={() => {
                // setCheckResult('unchecked');
                setShowView('edit');
                // setSuccessResult(null);
                setFailResult(null);
              }}
            >返回编辑</FTextBtn>
          </div>

          <div style={{ height: 30 }} />

          <div>
            <FContentText text={failResult?.errorText || ''} />
          </div>

        </div>)
      }

      {
        showView === 'edit' && <>
          {
            isVerifying && (<>
              <div className={styles.isCheckingTip}>
                <FLoading />
                <div style={{ width: 5 }} />
                <span>校验中，请勿离开</span>
              </div>
              <div style={{ height: 30 }} />
            </>)
          }
          {EditView}
        </>
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
          // onSelect={(p) => {
          //   // setTitle(p.title);
          //   // onChangeTitleInput(p.title);
          //   // onChangeTextInput(p.text);
          //   // setTemplateVisible(false);
          // }}
          onClickSelect={(num) => {
            if (codeText === '' && JSON.stringify(combinationData) === JSON.stringify(initStates.combinationData)) {
              return onClickSelectTemplateBtn(num);
            }
            Modal.confirm({
              title: FUil1.I18n.message('alert_plan_cover '),
              okText: FUil1.I18n.message('btn_import'),
              cancelText: FUil1.I18n.message('btn_cancel'),
              onOk() {
                onClickSelectTemplateBtn(num);
              },
              onCancel() {
                // console.log('Cancel');
              },
            });
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
              onClickAddEventBtn('relativeTime');
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
              onClickAddEventBtn('absoluteTime');
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
              onClickAddEventBtn('payment');
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
              onClickAddEventBtn('terminate');
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

async function verifyCodeText(text: string, allTexts: string[], targetType = 'resource'): Promise<string> {
  // console.log(allTexts, 'allTexts2342323423234234');
  // console.log(text, 'text234234234');
  let error: string = '';
  if (text === '') {
    error = '请输入内容';
  } else if (allTexts.includes(text)) {
    error = FUil1.I18n.message('error_auth_plan_existed');
  } else {
    try {
      // TODO:
      console.log('@@@@@@@############');
      const result = await compile(text, targetType, FUtil.Format.completeUrlByDomain('qi'), 'dev');
      console.log(result, 'resultresult@$!@$#@#$');
    } catch (err) {
      console.log(err.message, 'err234234234');
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

      const targetStateName: string = data.find((dt) => dt.randomID === (et as any).target)?.name || '';
      if (et.type === 'payment') {
        result += `~freelog.TransactionEvent("${et.amount}","self.account") => ${targetStateName}`;
      } else if (et.type === 'relativeTime') {
        result += `~freelog.RelativeTimeEvent("${et.num}","${et.unit}") => ${targetStateName}`;
      } else if (et.type === 'absoluteTime') {
        result += `~freelog.TimeEvent("${et.dateTime}") => ${targetStateName}`;
      } else {
        result += 'terminate';
      }
    }
  }
  return result;
}

function disabledDate(date: Moment): boolean {
  return date.valueOf() < moment().subtract(1, 'days').valueOf();
}

function disabledTime(date: Moment | null): DisabledTimes {
  const isToday: boolean = date?.format(FUtil.Predefined.momentDateFormat) === moment().format(FUtil.Predefined.momentDateFormat);
  return {
    disabledHours(): number[] {
      const dis = !isToday
        ? []
        : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].slice(0, moment().hours());
      return dis;
    },
    disabledMinutes(hour: number): number[] {
      const isTheHour: boolean = hour <= moment().hours();
      return isToday && isTheHour
        ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].slice(0, moment().minutes())
        : [];
    },
    // disabledSeconds(hour: number, minute: number): number[] {
    //   return [];
    // },
  };
}
