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
  type: 'setting/onMountPage';
}

export interface OnUnmount_Page_Action extends AnyAction {
  type: 'setting/onUnmountPage';
}

export interface OnChange_ShowPage_Action extends AnyAction {
  type: 'setting/onChangeShowPage';
  payload: {
    value: 'profile' | 'security' | 'privacy';
  };
}

export interface OnChange_Avatar_Action extends AnyAction {
  type: 'setting/onChangeAvatar';
  payload: {
    value: File;
  };
}

export interface OnChange_Gender_Action extends AnyAction {
  type: 'setting/onChangeGender';
  payload: {
    value: 'male' | 'female';
  };
}

export interface OnChange_ProfileText_Action extends AnyAction {
  type: 'setting/onChange_ProfileText';
  payload: {
    value: string;
  };
}

export interface OnChange_Birthday_Action extends AnyAction {
  type: 'setting/onChange_Birthday';
  payload: {
    value: string;
  };
}

export interface OnChange_Residence_Action extends AnyAction {
  type: 'setting/onChange_Residence';
  payload: {
    value: string[];
  };
}

export interface OnChange_Career_Action extends AnyAction {
  type: 'setting/onChange_Career';
  payload: {
    value: string;
  };
}

export interface OnClick_BindEmailBtn_Action extends AnyAction {
  type: 'setting/onClick_BindEmailBtn';
}

export interface OnClick_ReplaceEmailBtn_Action extends AnyAction {
  type: 'setting/onClick_ReplaceEmailBtn';
}

export interface OnClick_BindPhoneBtn_Action extends AnyAction {
  type: 'setting/onClick_BindPhoneBtn';
}

export interface OnClick_ReplacePhoneBtn_Action extends AnyAction {
  type: 'setting/onClick_ReplacePhoneBtn';
}

export interface OnClick_ChangePasswordBtn_Action extends AnyAction {
  type: 'setting/onClick_ChangePasswordBtn';
}

export interface OnClick_DataCleaningBtn_Action extends AnyAction {
  type: 'setting/onClick_DataCleaningBtn';
}

// 绑定邮箱
export interface OnChange_BindEmail_EmailInput_Action extends AnyAction {
  type: 'setting/onChange_BindEmail_EmailInput';
  payload: {
    value: string;
  };
}

export interface OnBlur_BindEmail_EmailInput_Action extends AnyAction {
  type: 'setting/onBlur_BindEmail_EmailInput';
  payload: {
    value: string;
  };
}

export interface OnChange_BindEmail_CaptchaInput_Action extends AnyAction {
  type: 'setting/onChange_BindEmail_CaptchaInput';
  payload: {
    value: string;
  };
}

export interface OnChange_BindEmail_CaptchaWait_Action extends AnyAction {
  type: 'setting/onChange_BindEmail_CaptchaWait';
  payload: {
    value: string;
  };
}

export interface OnClick_BindEmail_SendCaptchaBtn_Action extends AnyAction {
  type: 'setting/onClick_BindEmail_SendCaptchaBtn';
}

export interface OnClick_BindEmail_ConfirmBtn_Action extends AnyAction {
  type: 'setting/onClick_BindEmail_ConfirmBtn';
}

// 替换邮箱
export interface OnChange_ChangeEmail_Old_CaptchaInput_Action extends AnyAction {
  type: 'setting/onChange_ChangeEmail_Old_CaptchaInput';
  payload: {
    value: string;
  };
}

export interface OnClick_ChangeEmail_Old_SendCaptchaBtn_Action extends AnyAction {
  type: 'setting/onClick_ChangeEmail_Old_SendCaptchaBtn';
}

export interface OnChange_ChangeEmail_Old_CaptchaWait_Action extends AnyAction {
  type: 'setting/onChange_ChangeEmail_Old_CaptchaWait';
  payload: {
    value: string;
  };
}

export interface OnClick_ChangeEmail_Old_NextBtn_Action extends AnyAction {
  type: 'setting/onClick_ChangeEmail_Old_NextBtn';
  payload: {
    value: string;
  };
}

export interface OnChange_ChangeEmail_New_EmailInput_Action extends AnyAction {
  type: 'setting/onChange_ChangeEmail_New_EmailInput';
  payload: {
    value: string;
  };
}

export interface OnBlur_ChangeEmail_New_EmailInput_Action extends AnyAction {
  type: 'setting/onBlur_ChangeEmail_New_EmailInput';
}

export interface OnChange_ChangeEmail_New_CaptchaInput_Action extends AnyAction {
  type: 'setting/onChange_ChangeEmail_New_CaptchaInput';
  payload: {
    value: string;
  };
}

export interface OnClick_ChangeEmail_New_SendCaptchaBtn_Action extends AnyAction {
  type: 'setting/onClick_ChangeEmail_New_SendCaptchaBtn';
}

export interface OnChange_ChangeEmail_New_CaptchaWait_Action extends AnyAction {
  type: 'setting/onChange_ChangeEmail_New_CaptchaWait';
  payload: {
    value: string;
  };
}

export interface OnClick_ChangeEmail_New_ConfirmBtn_Action extends AnyAction {
  type: 'setting/OnClick_ChangeEmail_New_ConfirmBtn';
}

// 绑定手机
export interface OnChange_BindPhone_PhoneInput_Action extends AnyAction {
  type: 'setting/onChange_BindPhone_PhoneInput';
  payload: {
    value: string;
  };
}

export interface OnBlur_BindPhone_PhoneInput_Action extends AnyAction {
  type: 'setting/onBlur_BindPhone_PhoneInput';
  payload: {
    value: string;
  };
}

export interface OnChange_BindPhone_CaptchaInput_Action extends AnyAction {
  type: 'setting/onChange_BindPhone_CaptchaInput';
  payload: {
    value: string;
  };
}

export interface OnChange_BindPhone_CaptchaWait_Action extends AnyAction {
  type: 'setting/onChange_BindPhone_CaptchaWait';
  payload: {
    value: string;
  };
}

export interface OnClick_BindPhone_SendCaptchaBtn_Action extends AnyAction {
  type: 'setting/onClick_BindPhone_SendCaptchaBtn';
}

export interface OnClick_BindPhone_ConfirmBtn_Action extends AnyAction {
  type: 'setting/onClick_BindPhone_ConfirmBtn';
}

// 替换邮箱
export interface OnChange_ChangePhone_Old_CaptchaInput_Action extends AnyAction {
  type: 'setting/onChange_ChangePhone_Old_CaptchaInput';
  payload: {
    value: string;
  };
}

export interface OnClick_ChangePhone_Old_SendCaptchaBtn_Action extends AnyAction {
  type: 'setting/onClick_ChangePhone_Old_SendCaptchaBtn';
}

export interface OnChange_ChangePhone_Old_CaptchaWait_Action extends AnyAction {
  type: 'setting/onChange_ChangePhone_Old_CaptchaWait';
  payload: {
    value: string;
  };
}

export interface OnClick_ChangePhone_Old_NextBtn_Action extends AnyAction {
  type: 'setting/onClick_ChangePhone_Old_NextBtn';
  payload: {
    value: string;
  };
}

export interface OnChange_ChangePhone_New_PhoneInput_Action extends AnyAction {
  type: 'setting/onChange_ChangePhone_New_PhoneInput';
  payload: {
    value: string;
  };
}

export interface OnBlur_ChangePhone_New_PhoneInput_Action extends AnyAction {
  type: 'setting/onBlur_ChangePhone_New_PhoneInput';
}

export interface OnChange_ChangePhone_New_CaptchaInput_Action extends AnyAction {
  type: 'setting/onChange_ChangePhone_New_CaptchaInput';
  payload: {
    value: string;
  };
}

export interface OnClick_ChangePhone_New_SendCaptchaBtn_Action extends AnyAction {
  type: 'setting/onClick_ChangePhone_New_SendCaptchaBtn';
}

export interface OnChange_ChangePhone_New_CaptchaWait_Action extends AnyAction {
  type: 'setting/onChange_ChangePhone_New_CaptchaWait';
  payload: {
    value: string;
  };
}

export interface OnClick_ChangePhone_New_ConfirmBtn_Action extends AnyAction {
  type: 'setting/OnClick_ChangePhone_New_ConfirmBtn';
}


interface SettingPageModelType {
  namespace: 'settingPage';
  state: SettingPageModelState;
  effects: {
    onMountPage: (action: OnMount_Page_Action, effects: EffectsCommandMap) => void;
    onUnmountPage: (action: OnUnmount_Page_Action, effects: EffectsCommandMap) => void;
    onChange_ShowPage: (action: OnChange_ShowPage_Action, effects: EffectsCommandMap) => void;
    onChange_Avatar: (action: OnChange_Avatar_Action, effects: EffectsCommandMap) => void;
    onChange_Gender_Action: (action: OnChange_Gender_Action, effects: EffectsCommandMap) => void;
    onChange_ProfileText_Action: (action: OnChange_ProfileText_Action, effects: EffectsCommandMap) => void;
    onChange_Birthday_Action: (action: OnChange_Birthday_Action, effects: EffectsCommandMap) => void;
    onChange_Residence_Action: (action: OnChange_Residence_Action, effects: EffectsCommandMap) => void;
    onChange_Career_Action: (action: OnChange_Career_Action, effects: EffectsCommandMap) => void;
    onClick_BindEmailBtn_Action: (action: OnClick_BindEmailBtn_Action, effects: EffectsCommandMap) => void;
    onClick_ReplaceEmailBtn_Action: (action: OnClick_ReplaceEmailBtn_Action, effects: EffectsCommandMap) => void;
    onClick_BindPhoneBtn_Action: (action: OnClick_BindPhoneBtn_Action, effects: EffectsCommandMap) => void;
    onClick_ReplacePhoneBtn_Action: (action: OnClick_ReplacePhoneBtn_Action, effects: EffectsCommandMap) => void;
    onClick_ChangePasswordBtn_Action: (action: OnClick_ChangePasswordBtn_Action, effects: EffectsCommandMap) => void;
    onClick_DataCleaningBtn_Action: (action: OnClick_DataCleaningBtn_Action, effects: EffectsCommandMap) => void;

    onChange_BindEmail_EmailInput_Action: (action: OnChange_BindEmail_EmailInput_Action, effects: EffectsCommandMap) => void;
    onBlur_BindEmail_EmailInput_Action: (action: OnBlur_BindEmail_EmailInput_Action, effects: EffectsCommandMap) => void;
    onChange_BindEmail_CaptchaInput_Action: (action: OnChange_BindEmail_CaptchaInput_Action, effects: EffectsCommandMap) => void;
    onChange_BindEmail_CaptchaWait_Action: (action: OnChange_BindEmail_CaptchaWait_Action, effects: EffectsCommandMap) => void;
    onClick_BindEmail_SendCaptchaBtn_Action: (action: OnClick_BindEmail_SendCaptchaBtn_Action, effects: EffectsCommandMap) => void;
    onClick_BindEmail_ConfirmBtn_Action: (action: OnClick_BindEmail_ConfirmBtn_Action, effects: EffectsCommandMap) => void;
    onChange_ChangeEmail_Old_CaptchaInput_Action: (action: OnChange_ChangeEmail_Old_CaptchaInput_Action, effects: EffectsCommandMap) => void;
    onClick_ChangeEmail_Old_SendCaptchaBtn_Action: (action: OnClick_ChangeEmail_Old_SendCaptchaBtn_Action, effects: EffectsCommandMap) => void;
    onChange_ChangeEmail_Old_CaptchaWait_Action: (action: OnChange_ChangeEmail_Old_CaptchaWait_Action, effects: EffectsCommandMap) => void;
    onClick_ChangeEmail_Old_NextBtn_Action: (action: OnClick_ChangeEmail_Old_NextBtn_Action, effects: EffectsCommandMap) => void;
    onChange_ChangeEmail_New_EmailInput_Action: (action: OnChange_ChangeEmail_New_EmailInput_Action, effects: EffectsCommandMap) => void;
    onBlur_ChangeEmail_New_EmailInput_Action: (action: OnBlur_ChangeEmail_New_EmailInput_Action, effects: EffectsCommandMap) => void;
    onChange_ChangeEmail_New_CaptchaInput_Action: (action: OnChange_ChangeEmail_New_CaptchaInput_Action, effects: EffectsCommandMap) => void;
    onClick_ChangeEmail_New_SendCaptchaBtn_Action: (action: OnClick_ChangeEmail_New_SendCaptchaBtn_Action, effects: EffectsCommandMap) => void;
    onChange_ChangeEmail_New_CaptchaWait_Action: (action: OnChange_ChangeEmail_New_CaptchaWait_Action, effects: EffectsCommandMap) => void;
    onClick_ChangeEmail_New_ConfirmBtn_Action: (action: OnClick_ChangeEmail_New_ConfirmBtn_Action, effects: EffectsCommandMap) => void;

    onChange_BindPhone_PhoneInput_Action: (action: OnChange_BindPhone_PhoneInput_Action, effects: EffectsCommandMap) => void;
    onBlur_BindPhone_PhoneInput_Action: (action: OnBlur_BindPhone_PhoneInput_Action, effects: EffectsCommandMap) => void;
    onChange_BindPhone_CaptchaInput_Action: (action: OnChange_BindPhone_CaptchaInput_Action, effects: EffectsCommandMap) => void;
    onChange_BindPhone_CaptchaWait_Action: (action: OnChange_BindPhone_CaptchaWait_Action, effects: EffectsCommandMap) => void;
    onClick_BindPhone_SendCaptchaBtn_Action: (action: OnClick_BindPhone_SendCaptchaBtn_Action, effects: EffectsCommandMap) => void;
    onClick_BindPhone_ConfirmBtn_Action: (action: OnClick_BindPhone_ConfirmBtn_Action, effects: EffectsCommandMap) => void;
    onChange_ChangePhone_Old_CaptchaInput_Action: (action: OnChange_ChangePhone_Old_CaptchaInput_Action, effects: EffectsCommandMap) => void;
    onClick_ChangePhone_Old_SendCaptchaBtn_Action: (action: OnClick_ChangePhone_Old_SendCaptchaBtn_Action, effects: EffectsCommandMap) => void;
    onChange_ChangePhone_Old_CaptchaWait_Action: (action: OnChange_ChangePhone_Old_CaptchaWait_Action, effects: EffectsCommandMap) => void;
    onClick_ChangePhone_Old_NextBtn_Action: (action: OnClick_ChangePhone_Old_NextBtn_Action, effects: EffectsCommandMap) => void;
    onChange_ChangePhone_New_PhoneInput_Action: (action: OnChange_ChangePhone_New_PhoneInput_Action, effects: EffectsCommandMap) => void;
    onBlur_ChangePhone_New_PhoneInput_Action: (action: OnBlur_ChangePhone_New_PhoneInput_Action, effects: EffectsCommandMap) => void;
    onChange_ChangePhone_New_CaptchaInput_Action: (action: OnChange_ChangePhone_New_CaptchaInput_Action, effects: EffectsCommandMap) => void;
    onClick_ChangePhone_New_SendCaptchaBtn_Action: (action: OnClick_ChangePhone_New_SendCaptchaBtn_Action, effects: EffectsCommandMap) => void;
    onChange_ChangePhone_New_CaptchaWait_Action: (action: OnChange_ChangePhone_New_CaptchaWait_Action, effects: EffectsCommandMap) => void;
    onClick_ChangePhone_New_ConfirmBtn_Action: (action: OnClick_ChangePhone_New_ConfirmBtn_Action, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<SettingPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: SettingPageModelState = {
  showPage: 'privacy',

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
    * onMountPage({}: OnMount_Page_Action, {}: EffectsCommandMap) {

    },
    * onUnmountPage({}: OnUnmount_Page_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    * onChange_ShowPage(action: OnChange_ShowPage_Action, effects: EffectsCommandMap) {
    },
    * onChange_Avatar(action: OnChange_Avatar_Action, effects: EffectsCommandMap) {
    },
    * onChange_Gender_Action(action: OnChange_Gender_Action, effects: EffectsCommandMap) {
    },
    * onChange_ProfileText_Action(action: OnChange_ProfileText_Action, effects: EffectsCommandMap) {
    },
    * onChange_Birthday_Action(action: OnChange_Birthday_Action, effects: EffectsCommandMap) {
    },
    * onChange_Residence_Action(action: OnChange_Residence_Action, effects: EffectsCommandMap) {
    },
    * onChange_Career_Action(action: OnChange_Career_Action, effects: EffectsCommandMap) {
    },
    * onClick_BindEmailBtn_Action(action: OnClick_BindEmailBtn_Action, effects: EffectsCommandMap) {
    },
    * onClick_ReplaceEmailBtn_Action(action: OnClick_ReplaceEmailBtn_Action, effects: EffectsCommandMap) {
    },
    * onClick_BindPhoneBtn_Action(action: OnClick_BindPhoneBtn_Action, effects: EffectsCommandMap) {
    },
    * onClick_ReplacePhoneBtn_Action(action: OnClick_ReplacePhoneBtn_Action, effects: EffectsCommandMap) {
    },
    * onClick_ChangePasswordBtn_Action(action: OnClick_ChangePasswordBtn_Action, effects: EffectsCommandMap) {
    },
    * onClick_DataCleaningBtn_Action(action: OnClick_DataCleaningBtn_Action, effects: EffectsCommandMap) {
    },

    * onChange_BindEmail_EmailInput_Action(action: OnChange_BindEmail_EmailInput_Action, effects: EffectsCommandMap) {
    },
    * onBlur_BindEmail_EmailInput_Action(action: OnBlur_BindEmail_EmailInput_Action, effects: EffectsCommandMap) {
    },
    * onChange_BindEmail_CaptchaInput_Action(action: OnChange_BindEmail_CaptchaInput_Action, effects: EffectsCommandMap) {
    },
    * onChange_BindEmail_CaptchaWait_Action(action: OnChange_BindEmail_CaptchaWait_Action, effects: EffectsCommandMap) {
    },
    * onClick_BindEmail_SendCaptchaBtn_Action(action: OnClick_BindEmail_SendCaptchaBtn_Action, effects: EffectsCommandMap) {
    },
    * onClick_BindEmail_ConfirmBtn_Action(action: OnClick_BindEmail_ConfirmBtn_Action, effects: EffectsCommandMap) {
    },
    * onChange_ChangeEmail_Old_CaptchaInput_Action(action: OnChange_ChangeEmail_Old_CaptchaInput_Action, effects: EffectsCommandMap) {
    },
    * onClick_ChangeEmail_Old_SendCaptchaBtn_Action(action: OnClick_ChangeEmail_Old_SendCaptchaBtn_Action, effects: EffectsCommandMap) {
    },
    * onChange_ChangeEmail_Old_CaptchaWait_Action(action: OnChange_ChangeEmail_Old_CaptchaWait_Action, effects: EffectsCommandMap) {
    },
    * onClick_ChangeEmail_Old_NextBtn_Action(action: OnClick_ChangeEmail_Old_NextBtn_Action, effects: EffectsCommandMap) {
    },
    * onChange_ChangeEmail_New_EmailInput_Action(action: OnChange_ChangeEmail_New_EmailInput_Action, effects: EffectsCommandMap) {
    },
    * onBlur_ChangeEmail_New_EmailInput_Action(action: OnBlur_ChangeEmail_New_EmailInput_Action, effects: EffectsCommandMap) {
    },
    * onChange_ChangeEmail_New_CaptchaInput_Action(action: OnChange_ChangeEmail_New_CaptchaInput_Action, effects: EffectsCommandMap) {
    },
    * onClick_ChangeEmail_New_SendCaptchaBtn_Action(action: OnClick_ChangeEmail_New_SendCaptchaBtn_Action, effects: EffectsCommandMap) {
    },
    * onChange_ChangeEmail_New_CaptchaWait_Action(action: OnChange_ChangeEmail_New_CaptchaWait_Action, effects: EffectsCommandMap) {
    },
    * onClick_ChangeEmail_New_ConfirmBtn_Action(action: OnClick_ChangeEmail_New_ConfirmBtn_Action, effects: EffectsCommandMap) {
    },

    * onChange_BindPhone_PhoneInput_Action(action: OnChange_BindPhone_PhoneInput_Action, effects: EffectsCommandMap) {
    },
    * onBlur_BindPhone_PhoneInput_Action(action: OnBlur_BindPhone_PhoneInput_Action, effects: EffectsCommandMap) {
    },
    * onChange_BindPhone_CaptchaInput_Action(action: OnChange_BindPhone_CaptchaInput_Action, effects: EffectsCommandMap) {
    },
    * onChange_BindPhone_CaptchaWait_Action(action: OnChange_BindPhone_CaptchaWait_Action, effects: EffectsCommandMap) {
    },
    * onClick_BindPhone_SendCaptchaBtn_Action(action: OnClick_BindPhone_SendCaptchaBtn_Action, effects: EffectsCommandMap) {
    },
    * onClick_BindPhone_ConfirmBtn_Action(action: OnClick_BindPhone_ConfirmBtn_Action, effects: EffectsCommandMap) {
    },
    * onChange_ChangePhone_Old_CaptchaInput_Action(action: OnChange_ChangePhone_Old_CaptchaInput_Action, effects: EffectsCommandMap) {
    },
    * onClick_ChangePhone_Old_SendCaptchaBtn_Action(action: OnClick_ChangePhone_Old_SendCaptchaBtn_Action, effects: EffectsCommandMap) {
    },
    * onChange_ChangePhone_Old_CaptchaWait_Action(action: OnChange_ChangePhone_Old_CaptchaWait_Action, effects: EffectsCommandMap) {
    },
    * onClick_ChangePhone_Old_NextBtn_Action(action: OnClick_ChangePhone_Old_NextBtn_Action, effects: EffectsCommandMap) {
    },
    * onChange_ChangePhone_New_PhoneInput_Action(action: OnChange_ChangePhone_New_PhoneInput_Action, effects: EffectsCommandMap) {
    },
    * onBlur_ChangePhone_New_PhoneInput_Action(action: OnBlur_ChangePhone_New_PhoneInput_Action, effects: EffectsCommandMap) {
    },
    * onChange_ChangePhone_New_CaptchaInput_Action(action: OnChange_ChangePhone_New_CaptchaInput_Action, effects: EffectsCommandMap) {
    },
    * onClick_ChangePhone_New_SendCaptchaBtn_Action(action: OnClick_ChangePhone_New_SendCaptchaBtn_Action, effects: EffectsCommandMap) {
    },
    * onChange_ChangePhone_New_CaptchaWait_Action(action: OnChange_ChangePhone_New_CaptchaWait_Action, effects: EffectsCommandMap) {
    },
    * onClick_ChangePhone_New_ConfirmBtn_Action(action: OnClick_ChangePhone_New_ConfirmBtn_Action, effects: EffectsCommandMap) {
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
