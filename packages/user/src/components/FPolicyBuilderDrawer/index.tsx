import * as React from 'react';
import styles from './index.less';
import FInput from '../FInput';
// import FCodemirror from '../FCodemirror';
import { Space, Divider, DatePicker, InputNumber, Modal, Select } from 'antd';
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
import FTooltip from '@/components/FTooltip';
// import MonacoEditor from 'react-monaco-editor';
import FMonacoEditor from '@/components/FMonacoEditor';
// import fMessage from '@/components/fMessage';
import fConfirmModal from '@/components/fConfirmModal';
import * as AHooks from 'ahooks';
import { JS_VARIABLE_NAME } from '@freelog/tools-lib/dist/utils/regexp';

const { compile } = require('@freelog/resource-policy-lang');

interface FPolicyBuilderDrawerProps {
  visible?: boolean;

  alreadyUsedTitles?: string[];
  alreadyUsedTexts?: string[];

  targetType: 'resource' | 'presentable';

  onConfirm?({ title, text }: { title: string, text: string }): void;

  onCancel?(): void;
}

type ResourceAuthColor = Array<'active' | 'testActive'>;
type ExhibitAuthColor = Array<'active'>;

interface IEvent_Payment {
  randomID: string;
  type: 'payment';
  amount: number | null;
  target: string;
}

interface IEvent_RelativeTime {
  randomID: string;
  type: 'relativeTime';
  num: number | null;
  unit: '' | 'year' | 'month' | 'week' | 'day' | 'cycle';
  target: string;
}

interface IEvent_AbsoluteTime {
  randomID: string;
  type: 'absoluteTime';
  dateTime: Moment | null;
  target: string;
}

interface IEvent_Terminate {
  randomID: string;
  type: 'terminate';
}

type CombinationStructureType = {
  randomID: string;
  type: 'initial' | 'other';
  name: string;
  nameError: string;
  isNameDuplicate: boolean;
  // authorizationOptions: ResourceAuthColor | ExhibitAuthColor;
  // authorizationChecked: CombinationStructureType[number]['authorizationOptions'] extends ResourceAuthColor ? Partial<ResourceAuthColor> : Partial<ExhibitAuthColor>;
  authorizationChecked: FPolicyBuilderDrawerStates['combination_FinalAuthColor'] extends ResourceAuthColor ? Partial<ResourceAuthColor> : Partial<ExhibitAuthColor>;
  // authorizationChecked: Partial<ResourceAuthColor> | Partial<ExhibitAuthColor>;
  events: Array<IEvent_Payment | IEvent_RelativeTime | IEvent_AbsoluteTime | IEvent_Terminate>;
}[];

interface FPolicyBuilderDrawerStates {
  showView: 'edit' | 'fail' | 'success';

  titleInput: string;
  titleInputError: string;
  editMode: 'code' | 'composition';
  isVerifying: boolean;

  combination_Data: CombinationStructureType;
  combination_AddingEventStateID: string;
  combination_FinalAuthColor: ResourceAuthColor | ExhibitAuthColor;

  code_IsDirty: boolean;
  code_IsCompiling: boolean;
  code_Input: string;
  code_InputErrors: string[];

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

const initStates: FPolicyBuilderDrawerStates = {
  showView: 'edit',

  titleInput: '',
  titleInputError: '',
  editMode: 'composition',
  isVerifying: false,

  combination_Data: [
    {
      randomID: FUtil.Tool.generateRandomCode(10),
      type: 'initial',
      name: 'initial',
      nameError: '',
      isNameDuplicate: false,
      // authorizationOptions: targetType === 'resource' ? resourceAuthColor : exhibitAuthColor,
      authorizationChecked: [],
      events: [],
    },
  ],
  combination_AddingEventStateID: '',
  combination_FinalAuthColor: [],

  code_IsDirty: false,
  code_IsCompiling: false,
  code_Input: 'for public\n' +
    '\n' +
    'initial:',
  code_InputErrors: [],

  failResult: null,

  successResult: null,

  templateVisible: false,
};

const resourceAuthColor: ResourceAuthColor = ['active', 'testActive'];
const exhibitAuthColor: ExhibitAuthColor = ['active'];

function FPolicyBuilder({
                          visible = false,
                          targetType,
                          onCancel,
                          onConfirm,
                          alreadyUsedTitles = [],
                          alreadyUsedTexts = [],
                        }: FPolicyBuilderDrawerProps) {
  // const refContainer = React.useRef<any>(null);
  // const refContainerContent = React.useRef<any>(null);
  const refBottomDiv = React.useRef<any>(null);
  const refMaskingContainer = React.useRef<any>(null);
  const refPolicyTitleInput = React.useRef<any>(null);

  const [showView, setShowView] = React.useState<FPolicyBuilderDrawerStates['showView']>('edit');

  const [titleInput, setTitleInput] = React.useState<FPolicyBuilderDrawerStates['titleInput']>(initStates.titleInput);
  const [titleInputError, setTitleInputError] = React.useState<FPolicyBuilderDrawerStates['titleInputError']>(initStates.titleInputError);
  const [editMode, setEditMode] = React.useState<FPolicyBuilderDrawerStates['editMode']>(initStates.editMode);
  const [isVerifying, setIsVerifying] = React.useState<FPolicyBuilderDrawerStates['isVerifying']>(initStates.isVerifying);

  const [combination_Data, set_Combination_Data] = React.useState<FPolicyBuilderDrawerStates['combination_Data']>(initStates.combination_Data);
  const [combination_AddingEventStateID, set_Combination_AddingEventStateID] = React.useState<FPolicyBuilderDrawerStates['combination_AddingEventStateID']>(initStates.combination_AddingEventStateID);
  const [combination_FinalAuthColor, set_Combination_FinalAuthColor] = React.useState<FPolicyBuilderDrawerStates['combination_FinalAuthColor']>(initStates.combination_FinalAuthColor);

  const [code_IsDirty, set_Code_IsDirty] = React.useState<FPolicyBuilderDrawerStates['code_IsDirty']>(initStates.code_IsDirty);
  const [code_IsCompiling, set_Code_IsCompiling] = React.useState<FPolicyBuilderDrawerStates['code_IsCompiling']>(initStates.code_IsDirty);
  const [code_Input, set_Code_Input] = React.useState<FPolicyBuilderDrawerStates['code_Input']>(initStates.code_Input);
  const [code_InputErrors, set_Code_InputErrors] = React.useState<FPolicyBuilderDrawerStates['code_InputErrors']>(initStates.code_InputErrors);

  const [failResult, setFailResult] = React.useState<FPolicyBuilderDrawerStates['failResult']>(initStates.failResult);
  const [successResult, setSuccessResult] = React.useState<FPolicyBuilderDrawerStates['successResult']>(initStates.successResult);

  const [templateVisible, setTemplateVisible] = React.useState<FPolicyBuilderDrawerStates['templateVisible']>(initStates.templateVisible);

  AHooks.useDebounceEffect(
    () => {
      // console.log(code_Input, 'useDebounceEffect*(*******');
      onDebounceChange_Code_Input();
    },
    [code_Input],
    {
      wait: 300,
    },
  );

  // console.log(code_Input, 'code_Inputcode_Inputcode_Input0923u4io234jl2k3jl');

  function resetAllStates() {
    setShowView(initStates.showView);
    setTitleInput(initStates.titleInput);
    setTitleInputError(initStates.titleInputError);
    setEditMode(initStates.editMode);
    setIsVerifying(initStates.isVerifying);
    set_Combination_Data(initStates.combination_Data);
    set_Combination_AddingEventStateID(initStates.combination_AddingEventStateID);
    set_Code_IsDirty(initStates.code_IsDirty);
    set_Code_IsCompiling(initStates.code_IsCompiling);
    set_Code_Input(initStates.code_Input);
    set_Code_InputErrors(initStates.code_InputErrors);
    setFailResult(initStates.failResult);
    setSuccessResult(initStates.successResult);
    setTemplateVisible(initStates.templateVisible);
  }

  function onChange_TitleInput(value: string) {
    setTitleInput(value);
  }

  function onBlur_TitleInput() {
    setTitleInputError(verifyTitle(titleInput, alreadyUsedTitles));
  }

  function onClick_SwitchMode_Code() {
    const code: string = dataToCode(combination_Data);
    set_Code_Input(code);
    set_Code_IsDirty(false);
    setEditMode('code');
  }

  async function onClick_SwitchMode_Composition() {
    if (!code_IsDirty || code_InputErrors.length === 0) {
      return setEditMode('composition');
    }
    fConfirmModal({
      message: FUil1.I18n.message('alarm_switchto_visualeditor'),
      onOk() {
        setEditMode('composition');
      },
      okText: FUil1.I18n.message('btn_switch'),
      cancelText: FUil1.I18n.message('btn_cancel'),
    });
  }

  function onChange_Code_Input(value: string) {
    set_Code_IsDirty(true);
    set_Code_IsCompiling(true);
    set_Code_Input(value);
    // set_Code_InputErrors([]);
  }

  async function onDebounceChange_Code_Input() {
    const { errors, results } = await codeToData({
      text: code_Input,
      targetType: targetType,
    });
    set_Code_IsCompiling(false);
    // console.log(errors, 'onDebounceChange_Code_Input ____  errorserrorserrorserrors');
    if (errors.length > 0) {
      set_Code_InputErrors(errors);
      return;
    }
    set_Combination_Data(results || []);
    set_Code_InputErrors([]);
    // setEditMode('composition');
  }

  function onChangeCombinationData(data: Partial<Omit<CombinationStructureType[number], 'events'>>, randomID: string) {
    let result: CombinationStructureType = combination_Data.map((cd) => {
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

    set_Combination_Data(result);
  }

  function onChangeCombinationEvent(data: Partial<CombinationStructureType[number]['events'][number]>, randomID1: string, randomID2: string) {
    // console.log(data, stateIndex, eventIndex, '!@#$@!#$234213423412342342134');
    const result: CombinationStructureType = combination_Data.map<CombinationStructureType[number]>((cd, si) => {
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
    set_Combination_Data(result);
  }

  function onClickAddStateBtn() {
    console.log('********823u4928347923');
    const results: FPolicyBuilderDrawerStates['combination_Data'] = [
      ...combination_Data,
      {
        randomID: FUtil.Tool.generateRandomCode(10),
        type: 'other',
        name: '',
        nameError: '',
        isNameDuplicate: false,
        // authorizationOptions: targetType === 'resource' ? resourceAuthColor : exhibitAuthColor,
        authorizationChecked: [],
        events: [],
      },
    ];

    set_Combination_Data(results);

    setTimeout(() => {
      // refContainer.current.scrollTop = refContainerContent.current.clientHeight;
      refBottomDiv.current.scrollIntoView({ behavior: 'auto' });
    });
  }

  function onClickDeleteStateBtn(randomID: string) {
    const result: FPolicyBuilderDrawerStates['combination_Data'] = combination_Data.filter((cd) => {
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
    set_Combination_Data(result);
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

    const result: CombinationStructureType = combination_Data.map((cd) => {
      if (combination_AddingEventStateID !== cd.randomID) {
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

    set_Combination_Data(result);
    set_Combination_AddingEventStateID('');
  }

  function onClickDeleteEventBtn(randomID1: string, randomID2: string) {
    const result: CombinationStructureType = combination_Data.map((cd) => {
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
    set_Combination_Data(result);
  }

  function onClick_SelectTemplateBtn(num: 1 | 2) {
    // console.log(num, 'handleTemplatehandleTemplate23423423');
    setTemplateVisible(false);
    if (num === 1) {

      setTitleInput(title1);
      setTitleInputError(verifyTitle(title1, alreadyUsedTitles));

      if (editMode === 'code') {
        set_Code_IsDirty(true);
        set_Code_Input(text1);
        set_Code_InputErrors([]);
      } else {
        const initialRandomID: string = FUtil.Tool.generateRandomCode(10);
        const finishRandomID: string = FUtil.Tool.generateRandomCode(10);
        const result: CombinationStructureType = [
          {
            randomID: initialRandomID,
            type: 'initial',
            name: 'initial',
            nameError: '',
            isNameDuplicate: false,
            // authorizationOptions: targetType === 'resource' ? resourceAuthColor : exhibitAuthColor,
            authorizationChecked: ['active'],
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
            // authorizationOptions: targetType === 'resource' ? resourceAuthColor : exhibitAuthColor,
            authorizationChecked: [],
            events: [
              {
                randomID: FUtil.Tool.generateRandomCode(10),
                type: 'terminate',
              },
            ],
          },
        ];
        set_Combination_Data(result);
      }
    } else {
      setTitleInput(title2);
      setTitleInputError(verifyTitle(title2, alreadyUsedTitles));
      if (editMode === 'code') {
        set_Code_IsDirty(true);
        set_Code_Input(text2);
        set_Code_InputErrors([]);
      } else {
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
            // authorizationOptions: targetType === 'resource' ? resourceAuthColor : exhibitAuthColor,
            authorizationChecked: [],
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
            // authorizationOptions: targetType === 'resource' ? resourceAuthColor : exhibitAuthColor,
            authorizationChecked: ['active'],
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
            // authorizationOptions: targetType === 'resource' ? resourceAuthColor : exhibitAuthColor,
            authorizationChecked: [],
            events: [
              {
                randomID: FUtil.Tool.generateRandomCode(10),
                type: 'terminate',
              },
            ],
          },
        ];
        set_Combination_Data(result);
      }
    }
  }

  async function onClick_VerifyBtn() {
    setIsVerifying(true);

    if (editMode === 'code') {
      const { errors } = await compileCodeText({
        text: code_Input,
        targetType: targetType,
      });
      if (errors.length > 0) {
        setIsVerifying(false);
        set_Code_InputErrors(errors);
        return;
      }

      const { error, text } = await FUtil.Format.policyCodeTranslationToText(code_Input, targetType);
      setIsVerifying(false);

      if (error) {
        setShowView('fail');
        setFailResult({ errorText: error.join(',') });
        return;
      }

      if (alreadyUsedTexts?.includes(code_Input)) {
        setShowView('fail');
        setFailResult({ errorText: '当前策略已存在' });
        return;
      }

      // setIsVerifying(false);
      setShowView('success');
      setSuccessResult({
        title: titleInput,
        code: code_Input,
        translation: text || '',
        view: [],
      });
    } else {
      const combinationCode: string = dataToCode(combination_Data);
      const {
        error,
        text: translationText,
      } = await FUtil.Format.policyCodeTranslationToText(combinationCode, targetType);
      setIsVerifying(false);
      if (error) {
        setShowView('fail');
        setFailResult({ errorText: error.join(',') });
        return;
      }
      if (alreadyUsedTexts?.includes(combinationCode)) {
        setShowView('fail');
        setFailResult({ errorText: '当前策略已存在' });
        return;
      }
      // setIsVerifying(false);
      setShowView('success');
      setSuccessResult({
        title: titleInput,
        code: combinationCode,
        translation: translationText || '',
        view: [],
      });
    }
  }

  function onChange_DrawerVisible(visible: boolean) {
    if (!visible) {
      resetAllStates();
    } else {
      set_Combination_FinalAuthColor(targetType === 'resource' ? resourceAuthColor : exhibitAuthColor);
      refPolicyTitleInput.current.focus();
    }
  }

  const titleInputHasError: boolean = titleInput.trim() === '' || titleInputError !== '';
  const codeMirrorInputHasError: boolean = code_Input.trim() === '' || code_InputErrors.length > 0;
  const combinationDataHasError: boolean = (combination_Data.some((cd) => {
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
  })) || !combination_Data.some((cd) => {
    return cd.authorizationChecked.length > 0;
  });

  const disabledExecute: boolean = titleInputHasError
    || (editMode === 'code' ? codeMirrorInputHasError : combinationDataHasError);

  const enabledTargetState: { value: string; title: string }[] = combination_Data.map<{ value: string; title: string }>((cd, index) => {
    return {
      value: cd.randomID,
      title: `状态${index + 1}: ${cd.name}`,
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
              onClick={onClick_VerifyBtn}
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

  return (<>
    <FDrawer
      title={<Space size={10}>
        <FTitleText type='h2' text={'添加授权策略'} />
        <FTooltip title={<FTextBtn
          type='default'
          onClick={() => {
            window.open('https://www.yuque.com/taiyang-4rbf5/vctf9v/kl3f01');
          }}
        >点击查看帮助文档</FTextBtn>}>
          <label style={{
            cursor: 'pointer',
            width: 20,
            height: 20,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#E9E9E9',
            fontSize: 12,
          }}>?
          </label>
        </FTooltip>
      </Space>}
      onClose={() => onCancel && onCancel()}
      visible={visible}
      width={720}
      topRight={DrawerTopRight}
      afterVisibleChange={onChange_DrawerVisible}
      // destroyOnClose
    >
      {/*<div className={styles.container} ref={refContainer}>*/}
      {/*  <div ref={refContainerContent}>*/}
      {/*<button onClick={() => {*/}
      {/*  // console.log(refContainerContent.current.clientHeight, '#######224234');*/}
      {/*  refContainer.current.scrollTop = refContainerContent.current.clientHeight;*/}
      {/*}}>bottom*/}
      {/*</button>*/}
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
          <div className={styles.maskingContainer} ref={refMaskingContainer}>
            <div className={styles.policyHeader}>
              <input
                ref={refPolicyTitleInput}
                className={styles.policyTitle}
                // className={styles.newTitle}
                value={titleInput}
                // errorText={titleError}
                onChange={(e) => {
                  onChange_TitleInput(e.target.value.trim());
                }}
                // placeholder={'请输入授权策略名称'}
                placeholder={'输入策略名称…'}
                onBlur={() => {
                  // console.log(titleInput, 'title@@@@@@@@');
                  onBlur_TitleInput();
                }}
              />

              <Space size={20}>
                {
                  editMode === 'code'
                    ? (<FTextBtn
                      type='default'
                      // disabled={codeMirrorInputHasError || isVerifying}
                      onClick={onClick_SwitchMode_Composition}>
                      <Space size={4}>
                        <FComposition />
                        <span>组合模式</span>
                      </Space>
                    </FTextBtn>)
                    : (<FTextBtn
                      type='default'
                      // disabled={combinationDataHasError}
                      onClick={onClick_SwitchMode_Code}>
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
            {titleInputError && <>
              <div style={{ height: 5 }} />
              <div className={styles.textError}>{titleInputError}</div>
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
                      combination_Data.map((cd, stateIndex) => {
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
                                        autoFocus={true}
                                        style={{ width: 400 }}
                                        value={cd.name}
                                        onChange={(e) => {
                                          const value: string = e.target.value;

                                          onChangeCombinationData({
                                            name: value,
                                            nameError: FUtil.Regexp.JS_VARIABLE_NAME.test(value) ? '' : '请使用JavaScript英文变量命名规则',
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
                              <Space size={20}>
                                {
                                  combination_FinalAuthColor.map((ao) => {
                                    return (<Space key={ao}>
                                      <FCheckbox
                                        checked={cd.authorizationChecked.includes(ao)}
                                        onChange={(e) => {
                                          onChangeCombinationData({
                                            authorizationChecked: e.target.checked
                                              ? [
                                                ...cd.authorizationChecked,
                                                ao,
                                              ]
                                              : cd.authorizationChecked.filter((ac) => {
                                                return ac !== ao;
                                              }),
                                          }, cd.randomID);
                                        }}
                                      />
                                      {/*<div*/}
                                      {/*  style={{ cursor: 'pointer' }}*/}
                                      {/*  onClick={() => {*/}

                                      {/*  }}>*/}
                                      <FContentText
                                        text={ao === 'active' ? '授权' : ao === 'testActive' ? '测试授权' : ao} />
                                      {/*</div>*/}
                                    </Space>);
                                  })
                                }

                              </Space>
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
                                        <div style={{ height: 10 }} />

                                        <Divider style={{ margin: 0, borderTopColor: '#E5E7EB' }}>
                                          <FTitleText type='h4'>跳转至&nbsp;<FGuideDown style={{ fontSize: 10 }} />
                                          </FTitleText>
                                        </Divider>

                                        <div style={{ height: 10 }} />

                                        <div>
                                          <FTitleText type='h4' text={'目标状态'} />
                                        </div>

                                        <div style={{ height: 10 }} />

                                        <TargetSelect
                                          value={et.target || undefined}
                                          dataSource={enabledTargetState}
                                          onChange={(value) => {
                                            onChangeCombinationEvent({
                                              target: value,
                                            }, cd.randomID, et.randomID);
                                          }}
                                          onClickAddStateBtn={onClickAddStateBtn}
                                        />
                                        {/*<div>*/}
                                        {/*  <FSelect*/}
                                        {/*    value={et.target || undefined}*/}
                                        {/*    placeholder='选择目标状态'*/}
                                        {/*    style={{ width: '100%' }}*/}
                                        {/*    dataSource={enabledTargetState}*/}
                                        {/*    onChange={(value) => {*/}
                                        {/*      onChangeCombinationEvent({*/}
                                        {/*        target: value,*/}
                                        {/*      }, cd.randomID, et.randomID);*/}
                                        {/*    }}*/}
                                        {/*    getPopupContainer={() => {*/}
                                        {/*      return refMaskingContainer?.current || document.body;*/}
                                        {/*    }}*/}
                                        {/*    dropdownRender={menu => (<>*/}
                                        {/*      {menu}*/}
                                        {/*      <div className={styles.dropdownRenderAdd}>*/}
                                        {/*        <FCircleBtn*/}
                                        {/*          size='small'*/}
                                        {/*          type='minor'*/}
                                        {/*          onClick={onClickAddStateBtn}*/}
                                        {/*        >*/}
                                        {/*          <FPlus style={{ fontSize: 12 }} />*/}
                                        {/*        </FCircleBtn>*/}
                                        {/*        <div style={{ width: 5 }} />*/}
                                        {/*        <FTextBtn*/}
                                        {/*          type='primary'*/}
                                        {/*          onClick={onClickAddStateBtn}*/}
                                        {/*        >新建状态</FTextBtn>*/}
                                        {/*      </div>*/}
                                        {/*    </>)}*/}
                                        {/*  />*/}
                                        {/*</div>*/}
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
                                    set_Combination_AddingEventStateID(cd.randomID);
                                  }}
                                ><FPlus style={{ fontSize: 12 }} /></FCircleBtn>
                                <div style={{ width: 5 }} />
                                <FTextBtn
                                  type='primary'
                                  onClick={() => {
                                    set_Combination_AddingEventStateID(cd.randomID);
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
                  <div ref={refBottomDiv} />
                </div>)
                : (<>
                  <FMonacoEditor
                    width={'100%'}
                    value={code_Input}
                    options={{
                      selectOnLineNumbers: true,
                    }}
                    onChange={onChange_Code_Input}
                    editorDidMount={(editor, monaco) => {
                      // console.log('editorDidMount', editor, monaco);
                      editor.focus();
                    }}
                  />

                  {
                    code_IsCompiling && (<>
                      <div style={{ height: 5 }} />
                      <div style={{ color: '#2784FF' }}>编译中......</div>
                    </>)
                  }

                  {!code_IsCompiling && code_InputErrors.length > 0 && <>
                    <div style={{ height: 5 }} />
                    {
                      code_InputErrors.map((err, ei) => {
                        return (<div key={ei} className={styles.textError}>{err}</div>);
                      })
                    }

                  </>}
                </>)
            }

            {
              isVerifying && (<div className={styles.maskingBox} />)
            }

          </div>
        </>
      }
      {/*  </div>*/}
      {/*</div>*/}

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
            // console.log(combination_Data, 'combination_Data1111');
            // console.log(initStates.combination_Data, 'initStates.combination_Data');
            if (editMode === 'composition' && JSON.stringify(combination_Data) === JSON.stringify(initStates.combination_Data)) {
              return onClick_SelectTemplateBtn(num);
            }
            if (editMode === 'code' && code_Input === initStates.code_Input) {
              return onClick_SelectTemplateBtn(num);
            }
            Modal.confirm({
              title: FUil1.I18n.message('alert_plan_cover '),
              okText: FUil1.I18n.message('btn_import'),
              cancelText: FUil1.I18n.message('btn_cancel'),
              onOk() {
                onClick_SelectTemplateBtn(num);
              },
            });
          }}
        />
      </FDrawer>

      <FDrawer
        width={640}
        visible={!!combination_AddingEventStateID}
        title={'添加事件或指令'}
        onClose={() => {
          set_Combination_AddingEventStateID('');
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
            disabled={!!(combination_Data.find((cd) => {
              return cd.randomID === combination_AddingEventStateID;
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
  if (title.length < 2 || title.length > 20) {
    error = '2~20个字符';
  } else if (allTitles.includes(title)) {
    error = '标题已存在';
  }
  return error;
}

interface CompileCodeText {
  text: string;
  targetType: 'resource' | 'presentable';
}

async function compileCodeText({ text, targetType }: CompileCodeText): Promise<{
  errors: string[];
  result?: any;
}> {
  if (text === '') {
    return {
      errors: ['请输入内容'],
    };
  }
  try {
    const result = await compile(text, targetType, FUtil.Format.completeUrlByDomain('qi'), 'dev');
    // console.log(result, 'resultresult@$!@$#@#$');
    return {
      errors: [
        ...result.errors,
        ...result.warnings,
      ],
      result: result.state_machine,
    };
  } catch (err: any) {
    // console.log(err.message, 'err234234234');
    return {
      errors: [err.message + '(抛错)'],
    };
  }
}

interface CodeToDataParams extends CompileCodeText {

}

async function codeToData({
                            text,
                            targetType,
                          }: CodeToDataParams): Promise<{ errors: string[]; results?: CombinationStructureType }> {

  // console.log(text, 'text%%%%%%%TTTTTTTXXXXXXXXS');
  const { errors, result } = await compileCodeText({ text, targetType });
  if (errors.length > 0) {
    return {
      errors: errors,
    };
  }
  // console.log(result, 'resultQ!@#$!@#$@#334343434');
  const results: CombinationStructureType = Object.entries(result.states).map<CombinationStructureType[number]>(([k, v]: any) => {
    return {
      randomID: FUtil.Tool.generateRandomCode(10),
      type: v.isInitial ? 'initial' : 'other',
      name: k,
      nameError: '',
      isNameDuplicate: false,
      authorizationOptions: targetType === 'resource' ? resourceAuthColor : exhibitAuthColor,
      authorizationChecked: v.serviceStates,
      events: v.transitions.length === 0
        ? [{
          randomID: FUtil.Tool.generateRandomCode(10),
          type: 'terminate',
        }]
        : v.transitions.map((vt: any) => {
          if (vt.name === 'TransactionEvent') {
            const event: IEvent_Payment = {
              randomID: FUtil.Tool.generateRandomCode(10),
              type: 'payment',
              amount: vt.args.amount,
              target: vt.toState,
            };
            return event;
          }
          if (vt.name === 'RelativeTimeEvent') {
            const event: IEvent_RelativeTime = {
              randomID: FUtil.Tool.generateRandomCode(10),
              type: 'relativeTime',
              num: vt.args.elapsed,
              unit: vt.args.timeUnit,
              target: vt.toState,
            };
            return event;
          }
          if (vt.name === 'TimeEvent') {
            const event: IEvent_AbsoluteTime = {
              randomID: FUtil.Tool.generateRandomCode(10),
              type: 'absoluteTime',
              dateTime: moment(vt.args.dateTime, FUtil.Predefined.momentDateTimeFormat),
              target: vt.toState,
            };
            return event;
          }

          const event: IEvent_Terminate = {
            randomID: FUtil.Tool.generateRandomCode(10),
            type: 'terminate',
          };
          return event;
        }),
    };
  });
  // console.log(results, 'results!!!!!@@@@@@######34343434');
  return {
    errors: [],
    results: results.map((vt, _, array) => {
      return {
        ...vt,
        events: vt.events.map((vte) => {
          if (vte.type === 'terminate') {
            return vte;
          }
          return {
            ...vte,
            target: array.find((af) => {
              return af.name === vte.target;
            })?.randomID || '',
          };
        }),
      };
    }),
  };
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
    result += `${st.name}${st.authorizationChecked.length > 0 ? `[${st.authorizationChecked.join(',')}]` : ''}:`;
    for (const et of st.events) {
      result += '\n  ';

      const targetStateName: string = data.find((dt) => dt.randomID === (et as any).target)?.name || '';
      if (et.type === 'payment') {
        result += `~freelog.TransactionEvent("${et.amount || ''}","self.account") => ${targetStateName}`;
      } else if (et.type === 'relativeTime') {
        result += `~freelog.RelativeTimeEvent("${et.num || ''}","${et.unit}") => ${targetStateName}`;
      } else if (et.type === 'absoluteTime') {
        result += `~freelog.TimeEvent("${et.dateTime?.format(FUtil.Predefined.momentDateTimeFormat) || ''}") => ${targetStateName}`;
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

interface TargetSelectProps {
  value?: string;
  dataSource: any;

  onChange?(value: string): void;

  onClickAddStateBtn?(): void;
}

function TargetSelect({ value, dataSource, onChange, onClickAddStateBtn }: TargetSelectProps) {
  const refDev = React.useRef<any>(null);
  const refSelect = React.useRef<any>(null);
  const [open1, setOpen] = React.useState<boolean>(false);

  AHooks.useMount(() => {
    window.addEventListener('click', () => {
      setOpen(false);
    });
  });

  return (<div
    style={{ position: 'relative' }}
    ref={refDev}
    onClick={(e) => {
      e.stopPropagation();
    }}
  >
    <FSelect
      ref={refSelect}
      open={open1}
      value={value}
      placeholder='选择目标状态'
      style={{ width: '100%' }}
      dataSource={dataSource}
      onFocus={() => {
        setOpen(true);
      }}
      onChange={(value) => {
        setOpen(false);
        refSelect.current.blur();
        onChange && onChange(value);
        // onChangeCombinationEvent({
        //   target: value,
        // }, cd.randomID, et.randomID);
      }}
      getPopupContainer={() => refDev.current}
      dropdownRender={menu => (<>
        {menu}
        <div className={styles.dropdownRenderAdd}>
          <FCircleBtn
            size='small'
            type='minor'
            onClick={() => {
              // console.log('###23948230948230480_))))))');
              setOpen(false);
              onClickAddStateBtn && onClickAddStateBtn();
            }}
          >
            <FPlus style={{ fontSize: 12 }} />
          </FCircleBtn>
          <div style={{ width: 5 }} />
          <FTextBtn
            type='primary'
            onClick={() => {
              // console.log('###23948230948230480_))))))');
              setOpen(false);
              onClickAddStateBtn && onClickAddStateBtn();
            }}
          >新建状态</FTextBtn>
        </div>
      </>)}
    />
  </div>);
}
