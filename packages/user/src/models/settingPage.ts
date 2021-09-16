import { DvaReducer, WholeReadonly } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';

type ResidenceOptions = {
  value: string;
  label: string;
  children: ResidenceOptions;
}[];

export interface SettingPageModelState {
  showPage: 'profile' | 'security' | 'privacy';

  avatar: string;
  gender: 'male' | 'female' | 'unknown';
  profileText: string;
  birthday: string;
  residenceOptions: ResidenceOptions;
  residence: string[];
  career: string;

  username: string;
  email: string;
  phone: string;

  nodeDataSize: string;

  bindEmail_ModalVisible: boolean;
  bindEmail_EmailInput: string;
  bindEmail_EmailInputError: string;
  bindEmail_CaptchaInput: string;
  bindEmail_CaptchaWait: number;

  changeEmail_Old_ModalVisible: boolean;
  changeEmail_Old_CaptchaInput: string;
  changeEmail_Old_CaptchaWait: string;

  changeEmail_New_ModalVisible: boolean;
  changeEmail_New_EmailInput: string;
  changeEmail_New_EmailInputError: string;
  changeEmail_New_EmailWait: string;
  changeEmail_New_CaptchaInput: string;
  changeEmail_New_CaptchaWait: string;

  bindPhone_ModalVisible: boolean;
  bindPhone_PhoneInput: string;
  bindPhone_PhoneInputError: string;
  bindPhone_CaptchaInput: string;
  bindPhone_CaptchaWait: number;

  changePhone_Old_ModalVisible: boolean;
  changePhone_Old_CaptchaInput: string;
  changePhone_Old_CaptchaWait: number;

  changePhone_New_ModalVisible: boolean;
  changePhone_New_PhoneInput: string;
  changePhone_New_PhoneInputError: string;
  changePhone_New_PhoneWait: string;
  changePhone_New_CaptchaInput: string;
  changePhone_New_CaptchaWait: number;
}

export interface ChangeAction extends AnyAction {
  type: 'change';
  payload: Partial<SettingPageModelState>;
}

export interface OnMount_Page_Action extends AnyAction {
  type: 'settingPage/onMount_Page';
}

export interface OnUnmount_Page_Action extends AnyAction {
  type: 'settingPage/onUnmount_Page';
}

export interface OnChange_ShowPage_Action extends AnyAction {
  type: 'settingPage/onChange_ShowPage';
  payload: {
    value: 'profile' | 'security' | 'privacy';
  };
}

export interface OnChange_Avatar_Action extends AnyAction {
  type: 'settingPage/onChange_Avatar';
  payload: {
    value: File;
  };
}

export interface OnChange_Gender_Action extends AnyAction {
  type: 'settingPage/onChange_Gender_Action';
  payload: {
    value: 'male' | 'female';
  };
}

export interface OnChange_ProfileText_Action extends AnyAction {
  type: 'settingPage/onChange_ProfileText';
  payload: {
    value: string;
  };
}

export interface OnChange_Birthday_Action extends AnyAction {
  type: 'settingPage/onChange_Birthday';
  payload: {
    value: string;
  };
}

export interface OnChange_Residence_Action extends AnyAction {
  type: 'settingPage/onChange_Residence';
  payload: {
    value: string[];
  };
}

export interface OnChange_Career_Action extends AnyAction {
  type: 'settingPage/onChange_Career';
  payload: {
    value: string;
  };
}

export interface OnClick_BindEmailBtn_Action extends AnyAction {
  type: 'settingPage/onClick_BindEmailBtn';
}

export interface OnClick_ReplaceEmailBtn_Action extends AnyAction {
  type: 'settingPage/onClick_ReplaceEmailBtn';
}

export interface OnClick_BindPhoneBtn_Action extends AnyAction {
  type: 'settingPage/onClick_BindPhoneBtn';
}

export interface OnClick_ReplacePhoneBtn_Action extends AnyAction {
  type: 'settingPage/onClick_ReplacePhoneBtn';
}

export interface OnClick_ChangePasswordBtn_Action extends AnyAction {
  type: 'settingPage/onClick_ChangePasswordBtn';
}

export interface OnClick_DataCleaningBtn_Action extends AnyAction {
  type: 'settingPage/onClick_DataCleaningBtn';
}

// 绑定邮箱
export interface OnCancel_BindEmail_Modal_Action extends AnyAction {
  type: 'settingPage/onCancel_BindEmail_Modal';
}

export interface OnChange_BindEmail_EmailInput_Action extends AnyAction {
  type: 'settingPage/onChange_BindEmail_EmailInput';
  payload: {
    value: string;
  };
}

export interface OnBlur_BindEmail_EmailInput_Action extends AnyAction {
  type: 'settingPage/onBlur_BindEmail_EmailInput';
  payload: {
    value: string;
  };
}

export interface OnChange_BindEmail_CaptchaInput_Action extends AnyAction {
  type: 'settingPage/onChange_BindEmail_CaptchaInput';
  payload: {
    value: string;
  };
}

export interface OnChange_BindEmail_CaptchaWait_Action extends AnyAction {
  type: 'settingPage/onChange_BindEmail_CaptchaWait';
  payload: {
    value: string;
  };
}

export interface OnClick_BindEmail_SendCaptchaBtn_Action extends AnyAction {
  type: 'settingPage/onClick_BindEmail_SendCaptchaBtn';
}

export interface OnClick_BindEmail_ConfirmBtn_Action extends AnyAction {
  type: 'settingPage/onClick_BindEmail_ConfirmBtn';
}

// 替换邮箱
export interface OnCancel_ChangeEmail_Old_Modal_Action extends AnyAction {
  type: 'settingPage/onCancel_ChangeEmail_Old_Modal';
}

export interface OnChange_ChangeEmail_Old_CaptchaInput_Action extends AnyAction {
  type: 'settingPage/onChange_ChangeEmail_Old_CaptchaInput';
  payload: {
    value: string;
  };
}

export interface OnClick_ChangeEmail_Old_SendCaptchaBtn_Action extends AnyAction {
  type: 'settingPage/onClick_ChangeEmail_Old_SendCaptchaBtn';
}

export interface OnChange_ChangeEmail_Old_CaptchaWait_Action extends AnyAction {
  type: 'settingPage/onChange_ChangeEmail_Old_CaptchaWait';
  payload: {
    value: string;
  };
}

export interface OnClick_ChangeEmail_Old_NextBtn_Action extends AnyAction {
  type: 'settingPage/onClick_ChangeEmail_Old_NextBtn';
  payload: {
    value: string;
  };
}

export interface OnCancel_ChangeEmail_New_Modal_Action extends AnyAction {
  type: 'settingPage/onCancel_ChangeEmail_New_Modal';
}

export interface OnChange_ChangeEmail_New_EmailInput_Action extends AnyAction {
  type: 'settingPage/onChange_ChangeEmail_New_EmailInput';
  payload: {
    value: string;
  };
}

export interface OnBlur_ChangeEmail_New_EmailInput_Action extends AnyAction {
  type: 'settingPage/onBlur_ChangeEmail_New_EmailInput';
}

export interface OnChange_ChangeEmail_New_CaptchaInput_Action extends AnyAction {
  type: 'settingPage/onChange_ChangeEmail_New_CaptchaInput';
  payload: {
    value: string;
  };
}

export interface OnClick_ChangeEmail_New_SendCaptchaBtn_Action extends AnyAction {
  type: 'settingPage/onClick_ChangeEmail_New_SendCaptchaBtn';
}

export interface OnChange_ChangeEmail_New_CaptchaWait_Action extends AnyAction {
  type: 'settingPage/onChange_ChangeEmail_New_CaptchaWait';
  payload: {
    value: string;
  };
}

export interface OnClick_ChangeEmail_New_ConfirmBtn_Action extends AnyAction {
  type: 'settingPage/OnClick_ChangeEmail_New_ConfirmBtn';
}

// 绑定手机
export interface OnCancel_BindPhone_Modal_Action extends AnyAction {
  type: 'settingPage/onCancel_BindPhone_Modal';
}

export interface OnChange_BindPhone_PhoneInput_Action extends AnyAction {
  type: 'settingPage/onChange_BindPhone_PhoneInput';
  payload: {
    value: string;
  };
}

export interface OnBlur_BindPhone_PhoneInput_Action extends AnyAction {
  type: 'settingPage/onBlur_BindPhone_PhoneInput';
  payload: {
    value: string;
  };
}

export interface OnChange_BindPhone_CaptchaInput_Action extends AnyAction {
  type: 'settingPage/onChange_BindPhone_CaptchaInput';
  payload: {
    value: string;
  };
}

export interface OnChange_BindPhone_CaptchaWait_Action extends AnyAction {
  type: 'settingPage/onChange_BindPhone_CaptchaWait';
  payload: {
    value: string;
  };
}

export interface OnClick_BindPhone_SendCaptchaBtn_Action extends AnyAction {
  type: 'settingPage/onClick_BindPhone_SendCaptchaBtn';
}

export interface OnClick_BindPhone_ConfirmBtn_Action extends AnyAction {
  type: 'settingPage/onClick_BindPhone_ConfirmBtn';
}

// 替换手机
export interface OnCancel_ChangePhone_Old_Modal_Action extends AnyAction {
  type: 'settingPage/onCancel_ChangePhone_Old_Modal';
}

export interface OnChange_ChangePhone_Old_CaptchaInput_Action extends AnyAction {
  type: 'settingPage/onChange_ChangePhone_Old_CaptchaInput';
  payload: {
    value: string;
  };
}

export interface OnClick_ChangePhone_Old_SendCaptchaBtn_Action extends AnyAction {
  type: 'settingPage/onClick_ChangePhone_Old_SendCaptchaBtn';
}

export interface OnChange_ChangePhone_Old_CaptchaWait_Action extends AnyAction {
  type: 'settingPage/onChange_ChangePhone_Old_CaptchaWait';
  payload: {
    value: string;
  };
}

export interface OnClick_ChangePhone_Old_NextBtn_Action extends AnyAction {
  type: 'settingPage/onClick_ChangePhone_Old_NextBtn';
}

export interface OnCancel_ChangePhone_New_Modal_Action extends AnyAction {
  type: 'settingPage/onCancel_ChangePhone_New_Modal';
}

export interface OnChange_ChangePhone_New_PhoneInput_Action extends AnyAction {
  type: 'settingPage/onChange_ChangePhone_New_PhoneInput';
  payload: {
    value: string;
  };
}

export interface OnBlur_ChangePhone_New_PhoneInput_Action extends AnyAction {
  type: 'settingPage/onBlur_ChangePhone_New_PhoneInput';
}

export interface OnChange_ChangePhone_New_CaptchaInput_Action extends AnyAction {
  type: 'settingPage/onChange_ChangePhone_New_CaptchaInput';
  payload: {
    value: string;
  };
}

export interface OnClick_ChangePhone_New_SendCaptchaBtn_Action extends AnyAction {
  type: 'settingPage/onClick_ChangePhone_New_SendCaptchaBtn';
}

export interface OnChange_ChangePhone_New_CaptchaWait_Action extends AnyAction {
  type: 'settingPage/onChange_ChangePhone_New_CaptchaWait';
  payload: {
    value: string;
  };
}

export interface OnClick_ChangePhone_New_ConfirmBtn_Action extends AnyAction {
  type: 'settingPage/OnClick_ChangePhone_New_ConfirmBtn';
}


interface SettingPageModelType {
  namespace: 'settingPage';
  state: SettingPageModelState;
  effects: {
    onMount_Page: (action: OnMount_Page_Action, effects: EffectsCommandMap) => void;
    onUnmount_Page: (action: OnUnmount_Page_Action, effects: EffectsCommandMap) => void;
    onChange_ShowPage: (action: OnChange_ShowPage_Action, effects: EffectsCommandMap) => void;
    onChange_Avatar: (action: OnChange_Avatar_Action, effects: EffectsCommandMap) => void;
    onChange_Gender: (action: OnChange_Gender_Action, effects: EffectsCommandMap) => void;
    onChange_ProfileText: (action: OnChange_ProfileText_Action, effects: EffectsCommandMap) => void;
    onChange_Birthday: (action: OnChange_Birthday_Action, effects: EffectsCommandMap) => void;
    onChange_Residence: (action: OnChange_Residence_Action, effects: EffectsCommandMap) => void;
    onChange_Career: (action: OnChange_Career_Action, effects: EffectsCommandMap) => void;
    onClick_BindEmailBtn: (action: OnClick_BindEmailBtn_Action, effects: EffectsCommandMap) => void;
    onClick_ReplaceEmailBtn: (action: OnClick_ReplaceEmailBtn_Action, effects: EffectsCommandMap) => void;
    onClick_BindPhoneBtn: (action: OnClick_BindPhoneBtn_Action, effects: EffectsCommandMap) => void;
    onClick_ReplacePhoneBtn: (action: OnClick_ReplacePhoneBtn_Action, effects: EffectsCommandMap) => void;
    onClick_ChangePasswordBtn: (action: OnClick_ChangePasswordBtn_Action, effects: EffectsCommandMap) => void;
    onClick_DataCleaningBtn: (action: OnClick_DataCleaningBtn_Action, effects: EffectsCommandMap) => void;

    onCancel_BindEmail_Modal: (action: OnCancel_BindEmail_Modal_Action, effects: EffectsCommandMap) => void;
    onChange_BindEmail_EmailInput: (action: OnChange_BindEmail_EmailInput_Action, effects: EffectsCommandMap) => void;
    onBlur_BindEmail_EmailInput: (action: OnBlur_BindEmail_EmailInput_Action, effects: EffectsCommandMap) => void;
    onChange_BindEmail_CaptchaInput: (action: OnChange_BindEmail_CaptchaInput_Action, effects: EffectsCommandMap) => void;
    onChange_BindEmail_CaptchaWait: (action: OnChange_BindEmail_CaptchaWait_Action, effects: EffectsCommandMap) => void;
    onClick_BindEmail_SendCaptchaBtn: (action: OnClick_BindEmail_SendCaptchaBtn_Action, effects: EffectsCommandMap) => void;
    onClick_BindEmail_ConfirmBtn: (action: OnClick_BindEmail_ConfirmBtn_Action, effects: EffectsCommandMap) => void;
    onCancel_ChangeEmail_Old_Modal: (action: OnCancel_ChangeEmail_Old_Modal_Action, effects: EffectsCommandMap) => void;
    onChange_ChangeEmail_Old_CaptchaInput: (action: OnChange_ChangeEmail_Old_CaptchaInput_Action, effects: EffectsCommandMap) => void;
    onClick_ChangeEmail_Old_SendCaptchaBtn: (action: OnClick_ChangeEmail_Old_SendCaptchaBtn_Action, effects: EffectsCommandMap) => void;
    onChange_ChangeEmail_Old_CaptchaWait: (action: OnChange_ChangeEmail_Old_CaptchaWait_Action, effects: EffectsCommandMap) => void;
    onClick_ChangeEmail_Old_NextBtn: (action: OnClick_ChangeEmail_Old_NextBtn_Action, effects: EffectsCommandMap) => void;
    onCancel_ChangeEmail_New_Modal: (action: OnCancel_ChangeEmail_New_Modal_Action, effects: EffectsCommandMap) => void;
    onChange_ChangeEmail_New_EmailInput: (action: OnChange_ChangeEmail_New_EmailInput_Action, effects: EffectsCommandMap) => void;
    onBlur_ChangeEmail_New_EmailInput: (action: OnBlur_ChangeEmail_New_EmailInput_Action, effects: EffectsCommandMap) => void;
    onChange_ChangeEmail_New_CaptchaInput: (action: OnChange_ChangeEmail_New_CaptchaInput_Action, effects: EffectsCommandMap) => void;
    onClick_ChangeEmail_New_SendCaptchaBtn: (action: OnClick_ChangeEmail_New_SendCaptchaBtn_Action, effects: EffectsCommandMap) => void;
    onChange_ChangeEmail_New_CaptchaWait: (action: OnChange_ChangeEmail_New_CaptchaWait_Action, effects: EffectsCommandMap) => void;
    onClick_ChangeEmail_New_ConfirmBtn: (action: OnClick_ChangeEmail_New_ConfirmBtn_Action, effects: EffectsCommandMap) => void;

    onCancel_BindPhone_Modal: (action: OnCancel_BindPhone_Modal_Action, effects: EffectsCommandMap) => void;
    onChange_BindPhone_PhoneInput: (action: OnChange_BindPhone_PhoneInput_Action, effects: EffectsCommandMap) => void;
    onBlur_BindPhone_PhoneInput: (action: OnBlur_BindPhone_PhoneInput_Action, effects: EffectsCommandMap) => void;
    onChange_BindPhone_CaptchaInput: (action: OnChange_BindPhone_CaptchaInput_Action, effects: EffectsCommandMap) => void;
    onChange_BindPhone_CaptchaWait: (action: OnChange_BindPhone_CaptchaWait_Action, effects: EffectsCommandMap) => void;
    onClick_BindPhone_SendCaptchaBtn: (action: OnClick_BindPhone_SendCaptchaBtn_Action, effects: EffectsCommandMap) => void;
    onClick_BindPhone_ConfirmBtn: (action: OnClick_BindPhone_ConfirmBtn_Action, effects: EffectsCommandMap) => void;
    onCancel_ChangePhone_Old_Modal: (action: OnCancel_ChangePhone_Old_Modal_Action, effects: EffectsCommandMap) => void;
    onChange_ChangePhone_Old_CaptchaInput: (action: OnChange_ChangePhone_Old_CaptchaInput_Action, effects: EffectsCommandMap) => void;
    onClick_ChangePhone_Old_SendCaptchaBtn: (action: OnClick_ChangePhone_Old_SendCaptchaBtn_Action, effects: EffectsCommandMap) => void;
    onChange_ChangePhone_Old_CaptchaWait: (action: OnChange_ChangePhone_Old_CaptchaWait_Action, effects: EffectsCommandMap) => void;
    onClick_ChangePhone_Old_NextBtn: (action: OnClick_ChangePhone_Old_NextBtn_Action, effects: EffectsCommandMap) => void;
    onCancel_ChangePhone_New_Modal: (action: OnCancel_ChangePhone_New_Modal_Action, effects: EffectsCommandMap) => void;
    onChange_ChangePhone_New_PhoneInput: (action: OnChange_ChangePhone_New_PhoneInput_Action, effects: EffectsCommandMap) => void;
    onBlur_ChangePhone_New_PhoneInput: (action: OnBlur_ChangePhone_New_PhoneInput_Action, effects: EffectsCommandMap) => void;
    onChange_ChangePhone_New_CaptchaInput: (action: OnChange_ChangePhone_New_CaptchaInput_Action, effects: EffectsCommandMap) => void;
    onClick_ChangePhone_New_SendCaptchaBtn: (action: OnClick_ChangePhone_New_SendCaptchaBtn_Action, effects: EffectsCommandMap) => void;
    onChange_ChangePhone_New_CaptchaWait: (action: OnChange_ChangePhone_New_CaptchaWait_Action, effects: EffectsCommandMap) => void;
    onClick_ChangePhone_New_ConfirmBtn: (action: OnClick_ChangePhone_New_ConfirmBtn_Action, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<SettingPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: SettingPageModelState = {
  showPage: 'security',

  avatar: '',
  gender: 'unknown',
  profileText: '',
  birthday: '',
  residenceOptions: [],
  residence: [],
  career: '',

  username: '',
  email: '',
  phone: '',

  nodeDataSize: '',

  bindEmail_ModalVisible: false,
  bindEmail_EmailInput: '',
  bindEmail_EmailInputError: '',
  bindEmail_CaptchaInput: '',
  bindEmail_CaptchaWait: 0,

  changeEmail_Old_ModalVisible: false,
  changeEmail_Old_CaptchaInput: '',
  changeEmail_Old_CaptchaWait: '',

  changeEmail_New_ModalVisible: false,
  changeEmail_New_EmailInput: '',
  changeEmail_New_EmailInputError: '',
  changeEmail_New_EmailWait: '',
  changeEmail_New_CaptchaInput: '',
  changeEmail_New_CaptchaWait: '',

  bindPhone_ModalVisible: false,
  bindPhone_PhoneInput: '',
  bindPhone_PhoneInputError: '',
  bindPhone_CaptchaInput: '',
  bindPhone_CaptchaWait: 0,

  changePhone_Old_ModalVisible: false,
  changePhone_Old_CaptchaInput: '',
  changePhone_Old_CaptchaWait: 0,

  changePhone_New_ModalVisible: false,
  changePhone_New_PhoneInput: '',
  changePhone_New_PhoneInputError: '',
  changePhone_New_PhoneWait: '',
  changePhone_New_CaptchaInput: '',
  changePhone_New_CaptchaWait: 0,
};

const Model: SettingPageModelType = {
  namespace: 'settingPage',
  state: initStates,
  effects: {
    * onMount_Page({}: OnMount_Page_Action, {}: EffectsCommandMap) {
      // console.log('onMountPage111111');
    },
    * onUnmount_Page({}: OnUnmount_Page_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    * onChange_ShowPage({ payload }: OnChange_ShowPage_Action, { put }: EffectsCommandMap) {
      // console.log(payload, 'payloadpayloadpayload12342134');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          showPage: payload.value,
        },
      });
    },
    * onChange_Avatar(action: OnChange_Avatar_Action, effects: EffectsCommandMap) {
    },
    * onChange_Gender({ payload }: OnChange_Gender_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          gender: payload.value,
        },
      });
    },
    * onChange_ProfileText({ payload }: OnChange_ProfileText_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          profileText: payload.value,
        },
      });
    },
    * onChange_Birthday({ payload }: OnChange_Birthday_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          birthday: payload.value,
        },
      });
    },
    * onChange_Residence({ payload }: OnChange_Residence_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          residence: payload.value,
        },
      });
    },
    * onChange_Career({ payload }: OnChange_Career_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          career: payload.value,
        },
      });
    },
    * onClick_BindEmailBtn(action: OnClick_BindEmailBtn_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          bindEmail_ModalVisible: true,
        },
      });
    },
    * onClick_ReplaceEmailBtn(action: OnClick_ReplaceEmailBtn_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changeEmail_Old_ModalVisible: true,
        },
      });
    },
    * onClick_BindPhoneBtn(action: OnClick_BindPhoneBtn_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          bindPhone_ModalVisible: true,
        },
      });
    },
    * onClick_ReplacePhoneBtn(action: OnClick_ReplacePhoneBtn_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changePhone_Old_ModalVisible: true,
        },
      });
    },
    * onClick_ChangePasswordBtn(action: OnClick_ChangePasswordBtn_Action, effects: EffectsCommandMap) {
    },
    * onClick_DataCleaningBtn(action: OnClick_DataCleaningBtn_Action, effects: EffectsCommandMap) {
    },

    * onCancel_BindEmail_Modal(action: OnCancel_BindEmail_Modal_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          bindEmail_ModalVisible: false,
        },
      });
    },
    * onChange_BindEmail_EmailInput(action: OnChange_BindEmail_EmailInput_Action, effects: EffectsCommandMap) {
    },
    * onBlur_BindEmail_EmailInput(action: OnBlur_BindEmail_EmailInput_Action, effects: EffectsCommandMap) {
    },
    * onChange_BindEmail_CaptchaInput(action: OnChange_BindEmail_CaptchaInput_Action, effects: EffectsCommandMap) {
    },
    * onChange_BindEmail_CaptchaWait(action: OnChange_BindEmail_CaptchaWait_Action, effects: EffectsCommandMap) {
    },
    * onClick_BindEmail_SendCaptchaBtn(action: OnClick_BindEmail_SendCaptchaBtn_Action, effects: EffectsCommandMap) {
    },
    * onClick_BindEmail_ConfirmBtn(action: OnClick_BindEmail_ConfirmBtn_Action, effects: EffectsCommandMap) {
    },
    * onCancel_ChangeEmail_Old_Modal(action: OnCancel_ChangeEmail_Old_Modal_Action, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changeEmail_Old_ModalVisible: true,
        },
      });
    },
    * onChange_ChangeEmail_Old_CaptchaInput(action: OnChange_ChangeEmail_Old_CaptchaInput_Action, effects: EffectsCommandMap) {
    },
    * onClick_ChangeEmail_Old_SendCaptchaBtn(action: OnClick_ChangeEmail_Old_SendCaptchaBtn_Action, effects: EffectsCommandMap) {
    },
    * onChange_ChangeEmail_Old_CaptchaWait(action: OnChange_ChangeEmail_Old_CaptchaWait_Action, effects: EffectsCommandMap) {
    },
    * onClick_ChangeEmail_Old_NextBtn(action: OnClick_ChangeEmail_Old_NextBtn_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changeEmail_Old_ModalVisible: false,
          changeEmail_New_ModalVisible: true,
        },
      });
    },
    * onCancel_ChangeEmail_New_Modal(action: OnCancel_ChangeEmail_New_Modal_Action, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changeEmail_New_ModalVisible: false,
        },
      });
    },
    * onChange_ChangeEmail_New_EmailInput(action: OnChange_ChangeEmail_New_EmailInput_Action, effects: EffectsCommandMap) {
    },
    * onBlur_ChangeEmail_New_EmailInput(action: OnBlur_ChangeEmail_New_EmailInput_Action, effects: EffectsCommandMap) {
    },
    * onChange_ChangeEmail_New_CaptchaInput(action: OnChange_ChangeEmail_New_CaptchaInput_Action, effects: EffectsCommandMap) {
    },
    * onClick_ChangeEmail_New_SendCaptchaBtn(action: OnClick_ChangeEmail_New_SendCaptchaBtn_Action, effects: EffectsCommandMap) {
    },
    * onChange_ChangeEmail_New_CaptchaWait(action: OnChange_ChangeEmail_New_CaptchaWait_Action, effects: EffectsCommandMap) {
    },
    * onClick_ChangeEmail_New_ConfirmBtn(action: OnClick_ChangeEmail_New_ConfirmBtn_Action, effects: EffectsCommandMap) {
    },

    * onCancel_BindPhone_Modal(action: OnCancel_BindPhone_Modal_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          bindPhone_ModalVisible: false,
        },
      });
    },
    * onChange_BindPhone_PhoneInput(action: OnChange_BindPhone_PhoneInput_Action, effects: EffectsCommandMap) {
    },
    * onBlur_BindPhone_PhoneInput(action: OnBlur_BindPhone_PhoneInput_Action, effects: EffectsCommandMap) {
    },
    * onChange_BindPhone_CaptchaInput(action: OnChange_BindPhone_CaptchaInput_Action, effects: EffectsCommandMap) {
    },
    * onChange_BindPhone_CaptchaWait(action: OnChange_BindPhone_CaptchaWait_Action, effects: EffectsCommandMap) {
    },
    * onClick_BindPhone_SendCaptchaBtn(action: OnClick_BindPhone_SendCaptchaBtn_Action, effects: EffectsCommandMap) {
    },
    * onClick_BindPhone_ConfirmBtn(action: OnClick_BindPhone_ConfirmBtn_Action, effects: EffectsCommandMap) {
    },
    * onCancel_ChangePhone_Old_Modal(action: OnCancel_ChangePhone_Old_Modal_Action, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changePhone_Old_ModalVisible: false,
        },
      });
    },
    * onChange_ChangePhone_Old_CaptchaInput(action: OnChange_ChangePhone_Old_CaptchaInput_Action, effects: EffectsCommandMap) {
    },
    * onClick_ChangePhone_Old_SendCaptchaBtn(action: OnClick_ChangePhone_Old_SendCaptchaBtn_Action, effects: EffectsCommandMap) {
    },
    * onChange_ChangePhone_Old_CaptchaWait(action: OnChange_ChangePhone_Old_CaptchaWait_Action, effects: EffectsCommandMap) {
    },
    * onClick_ChangePhone_Old_NextBtn(action: OnClick_ChangePhone_Old_NextBtn_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changePhone_Old_ModalVisible: false,
          changePhone_New_ModalVisible: true,
        },
      });
    },
    * onCancel_ChangePhone_New_Modal(action: OnCancel_ChangePhone_New_Modal_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changePhone_New_ModalVisible: false,
        },
      });
    },
    * onChange_ChangePhone_New_PhoneInput(action: OnChange_ChangePhone_New_PhoneInput_Action, effects: EffectsCommandMap) {
    },
    * onBlur_ChangePhone_New_PhoneInput(action: OnBlur_ChangePhone_New_PhoneInput_Action, effects: EffectsCommandMap) {
    },
    * onChange_ChangePhone_New_CaptchaInput(action: OnChange_ChangePhone_New_CaptchaInput_Action, effects: EffectsCommandMap) {
    },
    * onClick_ChangePhone_New_SendCaptchaBtn(action: OnClick_ChangePhone_New_SendCaptchaBtn_Action, effects: EffectsCommandMap) {
    },
    * onChange_ChangePhone_New_CaptchaWait(action: OnChange_ChangePhone_New_CaptchaWait_Action, effects: EffectsCommandMap) {
    },
    * onClick_ChangePhone_New_ConfirmBtn(action: OnClick_ChangePhone_New_ConfirmBtn_Action, effects: EffectsCommandMap) {
    },
  },
  reducers: {
    change(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  subscriptions: {
    setup({}) {

    },
  },
};

export default Model;
