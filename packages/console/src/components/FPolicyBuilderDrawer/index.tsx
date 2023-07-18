import * as React from 'react';
import styles from './index.less';
// import FInput from '../FInput';
import { Space, Divider, DatePicker, Modal } from 'antd';
import PolicyTemplates from './PolicyTemplates';
import FDrawer from '../FDrawer';
import FSelect from '../FSelect';
import FCheckbox from '../FCheckbox';
import { FUtil, FI18n, FServiceAPI } from '@freelog/tools-lib';
import moment, { Moment } from 'moment';
import FTooltip from '../FTooltip';
import FMonacoEditor from '../FMonacoEditor';
import fConfirmModal from '../fConfirmModal';
import * as AHooks from 'ahooks';
import FAddingEventDrawer from '@/components/FPolicyBuilderDrawer/AddingEventDrawer';
import FComponentsLib from '@freelog/components-lib';
import { Base64 } from 'js-base64';

const FDatePicker: any = DatePicker;

const { compile } = require('@freelog/resource-policy-lang');

interface FPolicyBuilderDrawerProps {
  visible?: boolean;

  alreadyUsedTitles?: string[];
  alreadyUsedTexts?: string[];

  targetType: 'resource' | 'presentable';

  onConfirm?({ title, text }: { title: string, text: string }): void;

  onCancel?(): void;

  afterVisibleChange?(visible: boolean): void;
}

type CombinationStructureType = {
  randomID: string;
  type: 'initial' | 'other';
  name: string;
  nameError: string;
  isNameDuplicate: boolean;
  authorizationChecked: FPolicyBuilderDrawerStates['combination_FinalAuthColor'];
  // events: Array<IEvent_Payment | IEvent_RelativeTime | IEvent_AbsoluteTime | IEvent_Terminate>;
  events: {
    randomID: string;
    type: 'payment' | 'relativeTime' | 'absoluteTime' | 'terminate';

    target?: string;

    payment_Amount?: string;
    payment_AmountError?: string;

    relativeTime_Num?: string;
    relativeTime_NumError?: string;
    relativeTime_Unit?: '' | 'year' | 'month' | 'week' | 'day' | 'cycle';

    absoluteTime_DateTime?: Moment | null;
  }[];
}[];

interface FPolicyBuilderDrawerStates {
  showView: 'edit' | 'fail' | 'success';

  titleInput: string;
  titleInputError: string;
  editMode: 'code' | 'composition';
  isVerifying: boolean;

  combination_Data: CombinationStructureType;
  combination_AddingEventStateID: string;
  combination_FinalAuthColor: Array<'active' | 'testActive'>;

  code_IsDirty: boolean;
  code_IsCompiling: boolean;
  code_Input: string;
  code_InputErrors: string[];

  failResult: {
    errorText: string;
    title: string;
    code: string;
    translation: string;
    view: any;
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
  { value: 'hour', title: '时' },
  { value: 'minute', title: '分' },
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
      authorizationChecked: [],
      events: [],
    },
  ],
  combination_AddingEventStateID: '',
  combination_FinalAuthColor: ['active'],

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

// const resourceAuthColor: ResourceAuthColor = ['active', 'testActive'];
// const exhibitAuthColor: ExhibitAuthColor = ['active'];

const authMap = {
  active: '授权',
  testActive: '测试授权',
};

function FPolicyBuilder({
                          visible = false,
                          targetType,
                          onCancel,
                          onConfirm,
                          alreadyUsedTitles = [],
                          alreadyUsedTexts = [],
                          afterVisibleChange,
                        }: FPolicyBuilderDrawerProps) {
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
      onDebounceChange_Code_Input();
    },
    [code_Input],
    {
      wait: 300,
    },
  );

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
    setTitleInputError(verifyTitle(value, alreadyUsedTitles));
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
      message: FI18n.i18nNext.t('alarm_switchto_visualeditor'),
      onOk() {
        setEditMode('composition');
      },
      okText: FI18n.i18nNext.t('btn_switch'),
      cancelText: FI18n.i18nNext.t('btn_cancel'),
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
    // console.log('********823u4928347923');
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
        target: '',
        payment_Amount: '',
        payment_AmountError: '',
      };
    } else if (eventType === 'relativeTime') {
      evn = {
        randomID: FUtil.Tool.generateRandomCode(10),
        type: 'relativeTime',
        target: '',
        relativeTime_Num: '',
        relativeTime_NumError: '',
        relativeTime_Unit: '',
      };
    } else if (eventType === 'absoluteTime') {
      evn = {
        randomID: FUtil.Tool.generateRandomCode(10),
        type: 'absoluteTime',
        target: '',
        absoluteTime_DateTime: null,
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

  async function onClick_SelectTemplateBtn(title: string, text: string) {
    // console.log(num, 'handleTemplatehandleTemplate23423423');
    setTemplateVisible(false);
    // if (num === 1) {

    setTitleInput(title);
    setTitleInputError(verifyTitle(title, alreadyUsedTitles));

    if (editMode === 'code') {
      set_Code_IsDirty(true);
      set_Code_Input(text);
      set_Code_InputErrors([]);
    } else {
      const { errors, results } = await codeToData({
        text: text,
        targetType: targetType,
      });
      results && set_Combination_Data(results);
    }
  }

  async function onClick_VerifyBtn() {
    // console.log('****88888sdfsdfsdfsdf');
    self._czc?.push(['_trackEvent', targetType === 'resource' ? '授权信息页' : '授权策略页', '检验', '', 1]);
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

      // new RegExp()
      const t: string = (code_Input || '').replace(/(\t|\r)/g, ' ');
      const e: string = Base64.encode(t);
      const { data: text }: { data: string } = await FServiceAPI.Policy.policyTranslation({ contract: e });

      setIsVerifying(false);

      if (alreadyUsedTexts?.includes(code_Input)) {
        setShowView('fail');
        setFailResult({
          errorText: '当前策略已存在',
          title: titleInput,
          code: code_Input,
          translation: text || '',
          view: [],
        });
        return;
      }
      setShowView('success');
      setSuccessResult({
        title: titleInput,
        code: code_Input,
        translation: text || '',
        view: [],
      });
    } else {
      const combinationCode: string = dataToCode(combination_Data);

      const t: string = (combinationCode || '').replace(/(\t|\r)/g, ' ');
      const e: string = Base64.encode(t);
      const { data: translationText }: { data: string } = await FServiceAPI.Policy.policyTranslation({ contract: e });

      setIsVerifying(false);
      if (alreadyUsedTexts?.includes(combinationCode)) {
        setShowView('fail');
        setFailResult({
          errorText: '当前策略已存在',
          title: titleInput,
          code: combinationCode,
          translation: translationText || '',
          view: [],
        });
        return;
      }

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
      set_Combination_FinalAuthColor(targetType === 'resource' ? ['active', 'testActive'] : ['active']);
      refPolicyTitleInput.current.focus();
    }
  }

  const titleInputHasError: boolean = titleInput.trim() === '' || titleInputError !== '';
  const codeMirrorInputHasError: boolean = code_Input.trim() === '' || code_InputErrors.length > 0;
  const combinationDataHasError: boolean = (combination_Data.some((cd) => {
    return cd.name.trim() === ''
      || !!cd.nameError
      || cd.events.length === 0
      || cd.events.some((et) => {
        if (et.type === 'payment') {
          return et.payment_Amount === '' || et.payment_AmountError !== '' || !et.target;
        } else if (et.type === 'relativeTime') {
          return et.relativeTime_Num === '' || et.relativeTime_NumError !== '' || !et.relativeTime_Unit || !et.target;
        } else if (et.type === 'absoluteTime') {
          return !et.absoluteTime_DateTime || !et.target;
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

  if (!disabledExecute) {

    FComponentsLib.fSetHotspotTooltipVisible(targetType === 'resource'
      ? 'policyBuilder.resource.policyTemplateBtn'
      : 'policyBuilder.exhibit.policyTemplateBtn', {
      value: false,
      effectiveImmediately: true,
      onlyNullish: false,
    });

    FComponentsLib.fSetHotspotTooltipVisible(targetType === 'resource'
      ? 'policyBuilder.resource.policyVerifyBtn'
      : 'policyBuilder.exhibit.policyVerifyBtn', {
      value: true,
      effectiveImmediately: true,
      onlyNullish: true,
    });

    setTimeout(() => {
      FComponentsLib.fSetHotspotTooltipVisible(targetType === 'resource'
        ? 'policyBuilder.resource.policyVerifyBtn'
        : 'policyBuilder.exhibit.policyVerifyBtn', {
        value: false,
        effectiveImmediately: false,
        onlyNullish: false,
      });
    });
  }

  const DrawerTopRight = (<Space size={30}>
    <FComponentsLib.FTextBtn
      onClick={() => {
        onCancel && onCancel();
      }}>取消</FComponentsLib.FTextBtn>

    {
      showView === 'edit' && <>
        {
          isVerifying
            ? (<FComponentsLib.FRectBtn
              disabled={true}
              type='primary'
            >校验中</FComponentsLib.FRectBtn>)
            : (<FComponentsLib.FHotspotTooltip
              id={targetType === 'resource'
                ? 'policyBuilder.resource.policyVerifyBtn'
                : 'policyBuilder.exhibit.policyVerifyBtn'}
              style={{ left: '50%', marginLeft: -16, bottom: -42 }}
              text={targetType === 'resource'
                ? FI18n.i18nNext.t('hotpots_createauthplan_resource_btn_verify')
                : FI18n.i18nNext.t('hotpots_createauthplan_exhibit_btn_verify')
              }
            >
              <FComponentsLib.FRectBtn
                onClick={onClick_VerifyBtn}
                type='primary'
                disabled={disabledExecute}
              >校验</FComponentsLib.FRectBtn>
            </FComponentsLib.FHotspotTooltip>)
        }
      </>
    }

    {
      showView === 'fail' && (<FComponentsLib.FRectBtn
        disabled={true}
        type='primary'
      >校验失败</FComponentsLib.FRectBtn>)
    }

    {
      showView === 'success' && (<FComponentsLib.FHotspotTooltip
        id={targetType === 'resource'
          ? 'policyBuilder.resource.policyCreateBtn'
          : 'policyBuilder.exhibit.policyCreateBtn'}
        style={{ left: '60%', marginLeft: -16, bottom: -42 }}
        text={targetType === 'resource'
          ? FI18n.i18nNext.t('hotpots_createauthplan_resource_btn_create')
          : FI18n.i18nNext.t('hotpots_createauthplan_exhibit_btn_create')
        }
        onMount={() => {
          FComponentsLib.fSetHotspotTooltipVisible(targetType === 'resource'
            ? 'policyBuilder.resource.policyCreateBtn'
            : 'policyBuilder.exhibit.policyCreateBtn', {
            value: false,
            effectiveImmediately: false,
            onlyNullish: false,
          });
        }}
      >
        <FComponentsLib.FRectBtn
          onClick={() => {
            self._czc?.push(['_trackEvent', targetType === 'resource' ? '授权信息页' : '授权策略页', '创建', '', 1]);

            onConfirm && onConfirm({
              title: successResult?.title || '',
              text: successResult?.code || '',
            });
          }}
          type='primary'
        >创建</FComponentsLib.FRectBtn>
      </FComponentsLib.FHotspotTooltip>)
    }

  </Space>);

  return (<>
    <FDrawer
      title={<Space size={10}>
        <FComponentsLib.FTitleText type='h2' text={'添加授权策略'} />
        <FTooltip title={'点击查看帮助文档'}>
          <label
            onClick={() => {
              self.open('https://www.yuque.com/taiyang-4rbf5/vctf9v/kl3f01');
            }}
            style={{
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
      open={visible}
      width={720}
      topRight={DrawerTopRight}
      afterOpenChange={(visible) => {
        onChange_DrawerVisible(visible);
        afterVisibleChange && afterVisibleChange(visible);
      }}
    >
      {
        showView === 'success' && (<div>
          <div className={styles.PolicyVerifySuccess}>
            <FComponentsLib.FIcons.FCheck />
            <div style={{ width: 5 }} />
            <div>校验成功</div>
            <div style={{ width: 20 }} />
            <span>以下是策略相关内容</span>
          </div>
          <div style={{ height: 30 }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FComponentsLib.FTitleText
              type='h1'
              text={successResult?.title || ''}
            />

            <FComponentsLib.FTextBtn
              type='primary'
              onClick={() => {
                setShowView('edit');
                setSuccessResult(null);
              }}
            >返回编辑</FComponentsLib.FTextBtn>
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
            <FComponentsLib.FIcons.FFail
              style={{
                fontSize: 14,
                color: '#EE4040',
              }}
            />
            <div style={{ width: 5 }} />
            <div>校验失败</div>
            <div style={{ width: 20 }} />
            {/*<span>以下是错误信息</span>*/}
            <span>{failResult?.errorText}</span>
            {
              failResult?.errorText === '当前账户未激活' && (<>
                <div style={{ width: 20 }} />
                <FComponentsLib.FTextBtn onClick={() => {
                  self.open(FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.wallet());
                  setShowView('edit');
                  // setSuccessResult(null);
                  setFailResult(null);
                }}>去激活</FComponentsLib.FTextBtn>
              </>)
            }

          </div>
          <div style={{ height: 30 }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FComponentsLib.FTitleText
              type='h1'
              text={failResult?.title || ''}
            />

            <FComponentsLib.FTextBtn
              type='primary'
              onClick={() => {
                // setCheckResult('unchecked');
                setShowView('edit');
                // setSuccessResult(null);
                setFailResult(null);
              }}
            >返回编辑</FComponentsLib.FTextBtn>
          </div>

          <div style={{ height: 30 }} />

          <PolicyShowcase
            content={failResult?.translation || ''}
            code={failResult?.code || ''}
            view={failResult?.view || ''}
          />

        </div>)
      }

      {
        showView === 'edit' && <>
          {
            isVerifying && (<>
              <div className={styles.isCheckingTip}>
                <FComponentsLib.FIcons.FLoading />
                <div style={{ width: 5 }} />
                <span>校验中，请勿离开</span>
              </div>
              <div style={{ height: 30 }} />
            </>)
          }
          <div className={styles.maskingContainer} ref={refMaskingContainer}>
            <div className={styles.policyHeader}>
              <FComponentsLib.FInput.FSingleLine
                lengthLimit={-1}
                ref={refPolicyTitleInput}
                className={styles.policyTitle}
                // wrapClassName={styles.policyTitle}
                value={titleInput}
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
                    ? (<FComponentsLib.FTextBtn
                      type='default'
                      // disabled={codeMirrorInputHasError || isVerifying}
                      onClick={onClick_SwitchMode_Composition}>
                      <Space size={4}>
                        <FComponentsLib.FIcons.FComposition />
                        <span>{FI18n.i18nNext.t('toggle_authplan_visual_editor')}</span>
                      </Space>
                    </FComponentsLib.FTextBtn>)
                    : (<FComponentsLib.FTextBtn
                      type='default'
                      // disabled={combinationDataHasError}
                      onClick={onClick_SwitchMode_Code}>
                      <Space size={4}>
                        <FComponentsLib.FIcons.FCode />
                        <span>{FI18n.i18nNext.t('toggle_authplan_code_editor')}</span>
                      </Space>
                    </FComponentsLib.FTextBtn>)
                }

                <FComponentsLib.FHotspotTooltip
                  id={targetType === 'resource'
                    ? 'policyBuilder.resource.policyTemplateBtn'
                    : 'policyBuilder.exhibit.policyTemplateBtn'}
                  style={{ left: '50%', marginLeft: -16, bottom: -42 }}
                  text={targetType === 'resource'
                    ? FI18n.i18nNext.t('hotpots_createauthplan_resource_btn_templates')
                    : FI18n.i18nNext.t('hotpots_createauthplan_exhibit_btn_templates')}
                  onMount={() => {
                    FComponentsLib.fSetHotspotTooltipVisible(targetType === 'resource'
                      ? 'policyBuilder.resource.policyTemplateBtn'
                      : 'policyBuilder.exhibit.policyTemplateBtn', {
                      value: false,
                      effectiveImmediately: false,
                      onlyNullish: false,
                    });
                  }}
                >
                  <FComponentsLib.FTextBtn
                    type='default'
                    onClick={() => setTemplateVisible(true)}>
                    <Space size={4}>
                      <FComponentsLib.FIcons.FFileText />
                      <span>策略模板</span>
                    </Space>
                  </FComponentsLib.FTextBtn>
                </FComponentsLib.FHotspotTooltip>
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

                    <FComponentsLib.FIcons.FDown />
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
                                    <FComponentsLib.FTitleText
                                      type='h3'
                                      text={cd.name}
                                    />
                                  </div>

                                  <FComponentsLib.FContentText
                                    text={'初始状态不可删除'}
                                    type='negative'
                                  />

                                </div>)
                                : (<>
                                  <div className={styles.compositionStateHeader1}>
                                    <div>
                                      <label className={styles.compositionStateIndex}>{stateIndex + 1}</label>
                                      <div style={{ width: 15 }} />
                                      <FComponentsLib.FInput.FSingleLine
                                        lengthLimit={-1}
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
                                    <FComponentsLib.FTextBtn
                                      type='danger'
                                      onClick={() => {
                                        onClickDeleteStateBtn(cd.randomID);
                                      }}
                                    >删除</FComponentsLib.FTextBtn>
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
                                      <FComponentsLib.FContentText
                                        text={authMap[ao]} />
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
                                          <FComponentsLib.FTitleText type='h4' text={'事件' + (eventIndex + 1)} />
                                        </div>

                                        <div style={{ height: 10 }} />
                                      </>)
                                    }

                                    {
                                      et.type === 'payment' && (<>
                                        <div>
                                          <FComponentsLib.FContentText text={'支付'} type='normal' />
                                          <div style={{ width: 10 }} />
                                          <FComponentsLib.FInput.FSingleLine
                                            lengthLimit={-1}
                                            // min={1}
                                            placeholder={FI18n.i18nNext.t('hint_transaction_amount')}
                                            style={{ width: 120 }}
                                            value={et.payment_Amount || ''}
                                            onChange={(e) => {
                                              const value: string = e.target.value;
                                              if (Number.isNaN(Number(value))) {
                                                return;
                                              }
                                              const valueNum: number = Number(value);
                                              let payment_AmountError: string = '';
                                              if (value === '') {
                                                payment_AmountError = '请输入金额';
                                              } else if (valueNum <= 0) {
                                                payment_AmountError = '必须大于0';
                                              } else if (!new RegExp(/^\d+(\.\d{0,2})?$/).test(value)) {
                                                payment_AmountError = '不超过2位小数';
                                              } else if (valueNum >= 1000000) {
                                                payment_AmountError = FI18n.i18nNext.t('authplan_transactionevent_err_limitation');
                                              }
                                              onChangeCombinationEvent({
                                                payment_Amount: e.target.value,
                                                payment_AmountError: payment_AmountError,
                                              }, cd.randomID, et.randomID);
                                            }}
                                          />
                                          <div style={{ width: 10 }} />
                                          <FSelect
                                            value={'feather'}
                                            disabled
                                            style={{ width: 120 }}
                                            dataSource={currencies}
                                          />
                                          <div style={{ width: 10 }} />
                                          <FComponentsLib.FContentText text={'至'} type='normal' />
                                          <div style={{ width: 10 }} />
                                          <FSelect
                                            value={'my'}
                                            disabled
                                            style={{ width: 180 }}
                                            dataSource={accounts}
                                          />
                                          <div style={{ width: 10 }} />
                                          <FComponentsLib.FContentText
                                            type='normal'
                                            text={'之后'}
                                          />
                                        </div>
                                        {et.payment_AmountError !== '' && (<div
                                          className={styles.compositionStateBodyEventError}>{et.payment_AmountError}</div>)}
                                      </>)
                                    }

                                    {
                                      et.type === 'relativeTime' && (<>
                                        <div>
                                          <FComponentsLib.FInput.FSingleLine
                                            lengthLimit={-1}
                                            // min={1}
                                            // placeholder={'输入周期数目'}
                                            placeholder={FI18n.i18nNext.t('hint_relativetime_cyclecount')}
                                            style={{ width: 250 }}
                                            value={et.relativeTime_Num || ''}
                                            onChange={(e) => {
                                              const value: string = e.target.value;
                                              let relativeTime_NumError: string = '';
                                              if (!FUtil.Regexp.POSITIVE_INTEGER.test(value)) {
                                                relativeTime_NumError = FI18n.i18nNext.t('alert_authplan_cycle_amount_error');
                                              }
                                              onChangeCombinationEvent({
                                                relativeTime_Num: value,
                                                relativeTime_NumError: relativeTime_NumError,
                                              }, cd.randomID, et.randomID);
                                            }}
                                          />
                                          <div style={{ width: 10 }} />
                                          <FSelect
                                            placeholder={FI18n.i18nNext.t('hint_relativetime_unit')}
                                            value={et.relativeTime_Unit || null}
                                            // value={''}
                                            style={{ width: 250 }}
                                            dataSource={timeUnits}
                                            onChange={(value) => {
                                              onChangeCombinationEvent({
                                                relativeTime_Unit: value as 'year',
                                              }, cd.randomID, et.randomID);
                                            }}
                                          />
                                          <div style={{ width: 10 }} />
                                          <FComponentsLib.FContentText
                                            type='normal'
                                            text={'之后'}
                                          />
                                        </div>
                                        {
                                          et.relativeTime_NumError !== '' && (<div
                                            className={styles.compositionStateBodyEventError}>{et.relativeTime_NumError}</div>)
                                        }

                                      </>)
                                    }

                                    {
                                      et.type === 'absoluteTime' && (<div>
                                        <FComponentsLib.FContentText
                                          type='normal'
                                          text={'于'}
                                        />
                                        <div style={{ width: 10 }} />
                                        <FDatePicker
                                          // placeholder={'选择日期时间'}
                                          placeholder={FI18n.i18nNext.t('hint_time_datetime')}
                                          style={{ width: 480 }}
                                          showTime={{ format: 'HH:mm' }}
                                          format='YYYY-MM-DD HH:mm'
                                          disabledDate={disabledDate}
                                          allowClear={false}
                                          value={et.absoluteTime_DateTime}
                                          disabledTime={disabledTime}
                                          onChange={(value: any, dateString: any) => {
                                            const mo: Moment | null = (value?.valueOf() || -1) < moment().valueOf() ? moment() : value;
                                            onChangeCombinationEvent({
                                              absoluteTime_DateTime: mo,
                                            }, cd.randomID, et.randomID);
                                          }}
                                        />
                                        <div style={{ width: 10 }} />
                                        <FComponentsLib.FContentText
                                          type='normal'
                                          text={'之后'}
                                        />
                                      </div>)
                                    }

                                    {
                                      et.type === 'terminate' && (<div>
                                        <FComponentsLib.FContentText type='normal' text={'状态机终止，不再接受事件'} />
                                      </div>)
                                    }

                                    {
                                      et.type !== 'terminate' && (<>
                                        <div style={{ height: 10 }} />

                                        <Divider style={{ margin: 0, borderTopColor: '#E5E7EB' }}>
                                          <FComponentsLib.FTitleText type='h4'>跳转至&nbsp;<FComponentsLib.FIcons.FGuideDown
                                            style={{ fontSize: 10 }} />
                                          </FComponentsLib.FTitleText>
                                        </Divider>

                                        <div style={{ height: 10 }} />

                                        <div>
                                          <FComponentsLib.FTitleText type='h4' text={'目标状态'} />
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
                                      </>)
                                    }

                                  </div>

                                  <FComponentsLib.FCircleBtn
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
                                <FComponentsLib.FCircleBtn
                                  type='minor'
                                  onClick={() => {
                                    set_Combination_AddingEventStateID(cd.randomID);
                                  }}
                                ><FComponentsLib.FIcons.FPlus style={{ fontSize: 12 }} /></FComponentsLib.FCircleBtn>
                                <div style={{ width: 5 }} />
                                <FComponentsLib.FTextBtn
                                  type='primary'
                                  onClick={() => {
                                    set_Combination_AddingEventStateID(cd.randomID);
                                  }}
                                >添加事件或指令</FComponentsLib.FTextBtn>
                              </div>

                              <div style={{ height: 15 }} />
                            </>)
                          }

                        </div>);
                      })
                    }

                  </Space>

                  <div style={{ height: 15 }} />

                  <FComponentsLib.FRectBtn
                    type='default'
                    onClick={onClickAddStateBtn}

                  >新建状态</FComponentsLib.FRectBtn>
                  <div ref={refBottomDiv} />
                </div>)
                : (<>
                  <FMonacoEditor
                    width={'100%'}
                    value={code_Input}
                    options={{
                      selectOnLineNumbers: true,
                      minimap: {
                        enabled: false,
                      },
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

      <FDrawer
        width={640}
        open={templateVisible}
        title={'策略模板'}
        onClose={() => setTemplateVisible(false)}
      >
        <div className={styles.SelectTemplateTip}>
          <FComponentsLib.FIcons.FInfo style={{ fontSize: 16 }} />
          <div style={{ width: 5 }} />
          <span>选择模版后可对其进行编辑</span>
        </div>
        <div style={{ height: 30 }} />
        <PolicyTemplates
          onSelect={({ title, text }) => {
            if (editMode === 'composition' && JSON.stringify(combination_Data) === JSON.stringify(initStates.combination_Data)) {
              return onClick_SelectTemplateBtn(title, text);
            }
            if (editMode === 'code' && code_Input === initStates.code_Input) {
              return onClick_SelectTemplateBtn(title, text);
            }
            Modal.confirm({
              title: FI18n.i18nNext.t('alert_plan_cover'),
              okText: FI18n.i18nNext.t('btn_import'),
              cancelText: FI18n.i18nNext.t('btn_cancel'),
              onOk() {
                onClick_SelectTemplateBtn(title, text);
              },
            });
          }}
        />
      </FDrawer>

      <FAddingEventDrawer
        visible={!!combination_AddingEventStateID}
        disabledTerminateEvent={!!(combination_Data.find((cd) => {
          return cd.randomID === combination_AddingEventStateID;
        })?.events.length)}
        onClose={() => {
          set_Combination_AddingEventStateID('');
        }}
        onSelectEvent={(type) => {
          onClickAddEventBtn(type);
        }}
      />
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
      authorizationOptions: targetType === 'resource' ? ['active', 'testActive'] : ['active'],
      authorizationChecked: v.serviceStates,
      events: v.transitions.length === 0
        ? [{
          randomID: FUtil.Tool.generateRandomCode(10),
          type: 'terminate',
        }]
        : v.transitions.map((vt: any) => {

          let event: CombinationStructureType[number]['events'][number] = {
            randomID: FUtil.Tool.generateRandomCode(10),
            type: 'terminate',
          };

          if (vt.name === 'TransactionEvent') {
            event = {
              randomID: FUtil.Tool.generateRandomCode(10),
              type: 'payment',
              target: vt.toState,
              payment_Amount: vt.args.amount,
              payment_AmountError: '',
            };
          } else if (vt.name === 'RelativeTimeEvent') {
            event = {
              randomID: FUtil.Tool.generateRandomCode(10),
              type: 'relativeTime',
              target: vt.toState,
              relativeTime_Num: vt.args.elapsed,
              relativeTime_NumError: '',
              relativeTime_Unit: vt.args.timeUnit,
            };
          } else if (vt.name === 'TimeEvent') {
            event = {
              randomID: FUtil.Tool.generateRandomCode(10),
              type: 'absoluteTime',
              target: vt.toState,
              absoluteTime_DateTime: moment(vt.args.dateTime, FUtil.Predefined.momentDateTimeFormat),
            };
          }
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
      {/*<div style={{ width: 20 }} />*/}
      {/*<a*/}
      {/*  onClick={() => {*/}
      {/*    setActivated('view');*/}
      {/*  }}*/}
      {/*  className={[activated === 'view' ? styles.AActivated : ''].join(' ')}*/}
      {/*>状态机视图</a>*/}
    </div>

    <div className={styles.PolicyShowcaseBody}>
      <div>
        {
          activated === 'content' && (<FComponentsLib.FCodeFormatter code={content} />)
        }

        {
          activated === 'code' && (<FComponentsLib.FCodeFormatter code={code} />)
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
        result += `~freelog.TransactionEvent("${Number(et.payment_Amount) || ''}","self.account") => ${targetStateName}`;
      } else if (et.type === 'relativeTime') {
        result += `~freelog.RelativeTimeEvent("${et.relativeTime_Num || ''}","${et.relativeTime_Unit}") => ${targetStateName}`;
      } else if (et.type === 'absoluteTime') {
        result += `~freelog.TimeEvent("${et.absoluteTime_DateTime?.format(FUtil.Predefined.momentDateTimeFormat) || ''}") => ${targetStateName}`;
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

// function disabledTime(date: Moment | null): DisabledTimes {
function disabledTime(date: Moment | null): any {
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
        <div
          className={styles.dropdownRenderAdd}
          onClick={() => {
            setOpen(false);
            onClickAddStateBtn && onClickAddStateBtn();
          }}
        >
          <FComponentsLib.FCircleBtn
            size='small'
            type='minor'
            onClick={() => {
              // console.log('###23948230948230480_))))))');

            }}
          >
            <FComponentsLib.FIcons.FPlus style={{ fontSize: 12 }} />
          </FComponentsLib.FCircleBtn>
          <div style={{ width: 5 }} />
          <FComponentsLib.FTextBtn
            type='primary'
            onClick={() => {
              // console.log('###23948230948230480_))))))');
              // setOpen(false);
              // onClickAddStateBtn && onClickAddStateBtn();
            }}
          >新建状态</FComponentsLib.FTextBtn>
        </div>
      </>)}
    />
  </div>);
}

/**
 * 根据策略代码和标的物类型，生成对应的翻译
 * @param code 策略代码
 * @param targetType 标的物类型
 */
// export async function policyCodeTranslationToText(code: string, targetType: 'resource' | 'presentable'): Promise<{
//   error: string[] | null;
//   text?: string;
// }> {
//   try {
//     const result = await compile(
//       code,
//       targetType,
//       FUtil.Format.completeUrlByDomain('qi'),
//       window.location.origin.endsWith('.freelog.com') ? 'prod' : 'dev',
//     );
//     const rrr = report(result.state_machine);
//     // console.log(rrr, 'rrr@#$@#$@#$44444$$$$$$$$');
//     return {
//       error: null,
//       text: rrr.content,
//     };
//   } catch (err: any) {
//     return {
//       error: [err.message],
//     };
//   }
// }

// 正整数
// const POSITIVE_INTEGER = new RegExp(/^[1-9]\d*$/);

// 最多两位小数的正数
// const MAX_2_DECIMAL_POSITIVE_NUMBER = new RegExp(/^\d+(.\d{1,2})?$/);
