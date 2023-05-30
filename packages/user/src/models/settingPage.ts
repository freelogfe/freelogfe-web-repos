import { DvaReducer } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { FServiceAPI, FUtil, FI18n } from '@freelog/tools-lib';
import { ConnectState } from '@/models/connect';
import fMessage from '@/components/fMessage';
import moment, { Moment } from 'moment';
import { FetchInfoAction } from '@/models/user';

type ResidenceOptions = {
  value: string | number;
  label: string;
  children?: ResidenceOptions;
}[];

type VerifyState = 'unverified' | 'verifying' | 'verified';

export interface SettingPageModelState {
  showPage: 'profile' | 'security' | 'privacy';

  profile_state: 'editing' | 'normal';
  profile_avatar: string;
  profileInfo: {
    gender: 'male' | 'female' | 'unknown';
    profileText: string;
    birthday: Moment | null;
    residenceOptions: ResidenceOptions;
    residence: Array<string | number>;
    residenceText: string;
    career: string;
  };
  profile_gender: 'male' | 'female' | 'unknown';
  profile_profileText: string;
  profile_birthday: Moment | null;
  // profile_residenceOptions: ResidenceOptions;
  profile_residence: Array<string | number>;
  profile_residenceText: string;
  profile_career: string;
  // profile_careerError: string;

  username: string;
  email: string;
  phone: string;

  nodeDataSize: string;

  showModal: ''
    | 'bindEmail' | 'changeEmail_VerifyPass' | 'changeEmail_Old' | 'changeEmail_New'
    | 'bindPhone' | 'changePhone_VerifyPass' | 'changePhone_Old' | 'changePhone_New'
    | 'changePassword';
  bindEmail_EmailInput: string;
  bindEmail_EmailInput_VerifyState: VerifyState;
  bindEmail_EmailInputError: string;
  bindEmail_CaptchaInput: string;
  bindEmail_CaptchaWait: number;

  changeEmail_Old_CaptchaInput: string;
  changeEmail_Old_CaptchaWait: number;

  changeEmail_New_EmailInput: string;
  changeEmail_New_EmailInput_VerifyState: VerifyState;
  changeEmail_New_EmailInputError: string;
  changeEmail_New_CaptchaInput: string;
  changeEmail_New_CaptchaWait: number;

  bindPhone_PhoneInput: string;
  bindPhone_PhoneInput_VerifyState: VerifyState;
  bindPhone_PhoneInputError: string;
  bindPhone_CaptchaInput: string;
  bindPhone_CaptchaWait: number;

  changePhone_Old_CaptchaInput: string;
  changePhone_Old_CaptchaWait: number;

  changePhone_New_PhoneInput: string;
  changePhone_New_PhoneInput_VerifyState: VerifyState;
  changePhone_New_PhoneInputError: string;
  changePhone_New_CaptchaInput: string;
  changePhone_New_CaptchaWait: number;

  changePassword_Old_PasswordInput: string;
  changePassword_Old_PasswordInput_Error: string;
  changePassword_New1_PasswordInput: string;
  changePassword_New1_PasswordInput_Error: string;
  changePassword_New2_PasswordInput: string;
  changePassword_New2_PasswordInput_Error: string;

  nodeDataDrawerVisible: boolean;
  nodeDataList: {
    checked: boolean;
    id: number;
    domain: string;
    name: string;
    url: string;
    size: string;
    dateTime: string;
  }[];
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'settingPage/change';
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
  type: 'settingPage/onChange_Gender';
  payload: {
    value: SettingPageModelState['profile_gender'];
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
    value: Moment | null;
  };
}

export interface OnChange_Residence_Action extends AnyAction {
  type: 'settingPage/onChange_Residence';
  payload: {
    value: Array<string | number>;
    text: string;
  };
}

export interface OnChange_Career_Action extends AnyAction {
  type: 'settingPage/onChange_Career';
  payload: {
    value: string;
  };
}

export interface OnClick_SubmitUserInfoBtn_Action extends AnyAction {
  type: 'settingPage/onClick_SubmitUserInfoBtn';
}

export interface OnClick_CancelEditUserInfoBtn_Action extends AnyAction {
  type: 'settingPage/onClick_CancelEditUserInfoBtn';
}

export interface OnClick_EditUserInfoBtn_Action extends AnyAction {
  type: 'settingPage/onClick_EditUserInfoBtn';
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
    value: number;
  };
}

export interface OnClick_BindEmail_SendCaptchaBtn_Action extends AnyAction {
  type: 'settingPage/onClick_BindEmail_SendCaptchaBtn';
}

export interface OnClick_BindEmail_ConfirmBtn_Action extends AnyAction {
  type: 'settingPage/onClick_BindEmail_ConfirmBtn';
}

// 替换邮箱
export interface OnCancel_ChangeEmailVerifyPass_Action extends AnyAction {
  type: 'settingPage/onCancel_ChangeEmailVerifyPass';
}

export interface OnClick_ChangeEmailVerifyPass_NextBtn_Action extends AnyAction {
  type: 'settingPage/onClick_ChangeEmailVerifyPass_NextBtn';
}

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
    value: number;
  };
}

export interface OnClick_ChangeEmail_Old_NextBtn_Action extends AnyAction {
  type: 'settingPage/onClick_ChangeEmail_Old_NextBtn';
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
    value: number;
  };
}

export interface OnClick_ChangeEmail_New_ConfirmBtn_Action extends AnyAction {
  type: 'settingPage/onClick_ChangeEmail_New_ConfirmBtn';
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
    value: number;
  };
}

export interface OnClick_BindPhone_SendCaptchaBtn_Action extends AnyAction {
  type: 'settingPage/onClick_BindPhone_SendCaptchaBtn';
}

export interface OnClick_BindPhone_ConfirmBtn_Action extends AnyAction {
  type: 'settingPage/onClick_BindPhone_ConfirmBtn';
}

// 替换手机
export interface OnCancel_ChangePhoneVerifyPass_Action extends AnyAction {
  type: 'settingPage/onCancel_ChangePhoneVerifyPass';
}

export interface OnClick_ChangePhoneVerifyPass_NextBtn_Action extends AnyAction {
  type: 'settingPage/onClick_ChangePhoneVerifyPass_NextBtn';
}

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
    value: number;
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
    value: number;
  };
}

export interface OnClick_ChangePhone_New_ConfirmBtn_Action extends AnyAction {
  type: 'settingPage/onClick_ChangePhone_New_ConfirmBtn';
}

// 修改密码
export interface OnCancel_ChangePassword_Modal_Action extends AnyAction {
  type: 'settingPage/onCancel_ChangePassword_Modal';
}

export interface OnChange_ChangePassword_Old_PasswordInput_Action extends AnyAction {
  type: 'settingPage/onChange_ChangePassword_Old_PasswordInput';
  payload: {
    value: string
  };
}

export interface OnBlur_ChangePassword_Old_PasswordInput_Action extends AnyAction {
  type: 'settingPage/onBlur_ChangePassword_Old_PasswordInput';
}

export interface OnChange_ChangePassword_New1_PasswordInput_Action extends AnyAction {
  type: 'settingPage/onChange_ChangePassword_New1_PasswordInput';
  payload: {
    value: string
  };
}

export interface OnBlur_ChangePassword_New1_PasswordInput_Action extends AnyAction {
  type: 'settingPage/onBlur_ChangePassword_New1_PasswordInput';
}

export interface OnChange_ChangePassword_New2_PasswordInput_Action extends AnyAction {
  type: 'settingPage/onChange_ChangePassword_New2_PasswordInput';
  payload: {
    value: string
  };
}

export interface OnBlur_ChangePassword_New2_PasswordInput_Action extends AnyAction {
  type: 'settingPage/onBlur_ChangePassword_New2_PasswordInput';
}

export interface OnClick_ChangePassword_ConfirmBtn_Action extends AnyAction {
  type: 'settingPage/onClick_ChangePassword_ConfirmBtn';
}

export interface OnChange_NodeDate_CheckedAll_Action extends AnyAction {
  type: 'settingPage/onChange_NodeDate_CheckedAll';
  payload: {
    value: boolean;
  };
}

export interface OnChange_NodeDate_ItemChecked_Action extends AnyAction {
  type: 'settingPage/onChange_NodeDate_ItemChecked';
  payload: {
    nodeID: number;
    value: boolean;
  };
}

export interface OnCancel_NodeDate_Drawer_Action extends AnyAction {
  type: 'settingPage/onCancel_NodeDate_Drawer';
}

export interface OnClick_NodeDate_ConfirmBtn_Action extends AnyAction {
  type: 'settingPage/onClick_NodeDate_ConfirmBtn';
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
    onClick_SubmitUserInfoBtn: (action: OnClick_SubmitUserInfoBtn_Action, effects: EffectsCommandMap) => void;
    onClick_CancelEditUserInfoBtn: (action: OnClick_CancelEditUserInfoBtn_Action, effects: EffectsCommandMap) => void;
    onClick_EditUserInfoBtn: (action: OnClick_EditUserInfoBtn_Action, effects: EffectsCommandMap) => void;
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
    onCancel_ChangeEmailVerifyPass: (action: OnCancel_ChangeEmailVerifyPass_Action, effects: EffectsCommandMap) => void;
    onClick_ChangeEmailVerifyPass_NextBtn: (action: OnClick_ChangeEmailVerifyPass_NextBtn_Action, effects: EffectsCommandMap) => void;
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
    onCancel_ChangePhoneVerifyPass: (action: OnCancel_ChangePhoneVerifyPass_Action, effects: EffectsCommandMap) => void;
    onClick_ChangePhoneVerifyPass_NextBtn: (action: OnClick_ChangePhoneVerifyPass_NextBtn_Action, effects: EffectsCommandMap) => void;
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

    onCancel_ChangePassword_Modal: (action: OnCancel_ChangePassword_Modal_Action, effects: EffectsCommandMap) => void;
    onChange_ChangePassword_Old_PasswordInput: (action: OnChange_ChangePassword_Old_PasswordInput_Action, effects: EffectsCommandMap) => void;
    onBlur_ChangePassword_Old_PasswordInput: (action: OnBlur_ChangePassword_Old_PasswordInput_Action, effects: EffectsCommandMap) => void;
    onChange_ChangePassword_New1_PasswordInput: (action: OnChange_ChangePassword_New1_PasswordInput_Action, effects: EffectsCommandMap) => void;
    onBlur_ChangePassword_New1_PasswordInput: (action: OnBlur_ChangePassword_New1_PasswordInput_Action, effects: EffectsCommandMap) => void;
    onChange_ChangePassword_New2_PasswordInput: (action: OnChange_ChangePassword_New2_PasswordInput_Action, effects: EffectsCommandMap) => void;
    onBlur_ChangePassword_New2_PasswordInput: (action: OnBlur_ChangePassword_New2_PasswordInput_Action, effects: EffectsCommandMap) => void;
    onClick_ChangePassword_ConfirmBtn: (action: OnClick_ChangePassword_ConfirmBtn_Action, effects: EffectsCommandMap) => void;

    onChange_NodeDate_CheckedAll: (action: OnChange_NodeDate_CheckedAll_Action, effects: EffectsCommandMap) => void;
    onChange_NodeDate_ItemChecked: (action: OnChange_NodeDate_ItemChecked_Action, effects: EffectsCommandMap) => void;
    onCancel_NodeDate_Drawer: (action: OnCancel_NodeDate_Drawer_Action, effects: EffectsCommandMap) => void;
    onClick_NodeDate_ConfirmBtn: (action: OnClick_NodeDate_ConfirmBtn_Action, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<SettingPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates_BindEmail: Pick<SettingPageModelState,
  'bindEmail_EmailInput' |
  'bindEmail_EmailInput_VerifyState' |
  'bindEmail_EmailInputError' |
  'bindEmail_CaptchaInput' |
  'bindEmail_CaptchaWait'> = {
  // bindEmail_ModalVisible: false,
  bindEmail_EmailInput: '',
  bindEmail_EmailInput_VerifyState: 'unverified',
  bindEmail_EmailInputError: '',
  bindEmail_CaptchaInput: '',
  bindEmail_CaptchaWait: 0,
};

const initStates_ChangeEmail: Pick<SettingPageModelState,
  // 'changeEmail_Old_ModalVisible' |
  'changeEmail_Old_CaptchaInput' |
  'changeEmail_Old_CaptchaWait' |
  // 'changeEmail_New_ModalVisible' |
  'changeEmail_New_EmailInput' |
  'changeEmail_New_EmailInput_VerifyState' |
  'changeEmail_New_EmailInputError' |
  'changeEmail_New_CaptchaInput' |
  'changeEmail_New_CaptchaWait'> = {
  // changeEmail_Old_ModalVisible: false,
  changeEmail_Old_CaptchaInput: '',
  changeEmail_Old_CaptchaWait: 0,

  // changeEmail_New_ModalVisible: false,
  changeEmail_New_EmailInput: '',
  changeEmail_New_EmailInput_VerifyState: 'unverified',
  changeEmail_New_EmailInputError: '',
  changeEmail_New_CaptchaInput: '',
  changeEmail_New_CaptchaWait: 0,
};

const initStates_BindPhone: Pick<SettingPageModelState,
  // 'bindPhone_ModalVisible' |
  'bindPhone_PhoneInput' |
  'bindPhone_PhoneInput_VerifyState' |
  'bindPhone_PhoneInputError' |
  'bindPhone_CaptchaInput' |
  'bindPhone_CaptchaWait'> = {
  // bindPhone_ModalVisible: false,
  bindPhone_PhoneInput: '',
  bindPhone_PhoneInput_VerifyState: 'unverified',
  bindPhone_PhoneInputError: '',
  bindPhone_CaptchaInput: '',
  bindPhone_CaptchaWait: 0,
};

const initStates_ChangePhone: Pick<SettingPageModelState,
  // 'changePhone_Old_ModalVisible' |
  'changePhone_Old_CaptchaInput' |
  'changePhone_Old_CaptchaWait' |

  // 'changePhone_New_ModalVisible' |
  'changePhone_New_PhoneInput' |
  'changePhone_New_PhoneInput_VerifyState' |
  'changePhone_New_PhoneInputError' |
  'changePhone_New_CaptchaInput' |
  'changePhone_New_CaptchaWait'> = {
  // changePhone_Old_ModalVisible: false,
  changePhone_Old_CaptchaInput: '',
  changePhone_Old_CaptchaWait: 0,

  // changePhone_New_ModalVisible: false,
  changePhone_New_PhoneInput: '',
  changePhone_New_PhoneInput_VerifyState: 'unverified',
  changePhone_New_PhoneInputError: '',
  changePhone_New_CaptchaInput: '',
  changePhone_New_CaptchaWait: 0,
};

const initStates_ChangePassword: Pick<SettingPageModelState,
  // 'changePassword_ModalVisible' |
  'changePassword_Old_PasswordInput' |
  'changePassword_Old_PasswordInput_Error' |
  'changePassword_New1_PasswordInput' |
  'changePassword_New1_PasswordInput_Error' |
  'changePassword_New2_PasswordInput' |
  'changePassword_New2_PasswordInput_Error'> = {
  // changePassword_ModalVisible: false,
  changePassword_Old_PasswordInput: '',
  changePassword_Old_PasswordInput_Error: '',
  changePassword_New1_PasswordInput: '',
  changePassword_New1_PasswordInput_Error: '',
  changePassword_New2_PasswordInput: '',
  changePassword_New2_PasswordInput_Error: '',
};

const initStates: SettingPageModelState = {
  showPage: 'profile',

  profile_state: 'normal',
  profile_avatar: FUtil.Tool.getAvatarUrl(),
  profileInfo: {
    gender: 'unknown',
    profileText: '',
    birthday: null,
    residenceOptions: [],
    residence: [],
    residenceText: '',
    career: '',
  },
  profile_gender: 'unknown',
  profile_profileText: '',
  profile_birthday: null,
  profile_residence: [],
  profile_residenceText: '',
  profile_career: '',

  username: '',
  email: '',
  phone: '',

  nodeDataSize: '',
  showModal: '',

  ...initStates_BindEmail,

  ...initStates_ChangeEmail,

  ...initStates_BindPhone,

  ...initStates_ChangePhone,

  ...initStates_ChangePassword,

  nodeDataDrawerVisible: false,
  nodeDataList: [],
};

const Model: SettingPageModelType = {
  namespace: 'settingPage',
  state: initStates,
  effects: {
    * onMount_Page({}: OnMount_Page_Action, { select, call, put }: EffectsCommandMap) {

      const { settingPage }: ConnectState = yield select(({ settingPage }: ConnectState) => ({
        settingPage,
      }));
      // console.log('onMountPage111111');
      const { data } = yield call(FServiceAPI.User.currentUserInfo);
      // console.log(data, 'data!@#$!@#$!@#$!21111');

      const { data: data1 } = yield call(FServiceAPI.User.areasProvinces);
      // console.log(data1, 'data1!@#$!@#$@#$');
      const userDetail = data.userDetail;

      const params2: Parameters<typeof FServiceAPI.Storage.bucketDetails>[0] = {
        bucketName: '.UserNodeData',
      };

      const { data: data2 } = yield call(FServiceAPI.Storage.bucketDetails, params2);

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          // profile_avatar: FUtil.,
          profileInfo: {
            ...settingPage.profileInfo,
            residenceOptions: data1.map((d1: any) => {
              return {
                value: d1.code,
                label: d1.name,
                children: d1.children.map((d2: any) => {
                  return {
                    value: d2.code,
                    label: d2.name,
                  };
                }),
              };
            }),
            gender: userDetail?.sex === 1 ? 'male' : userDetail?.sex === 2 ? 'female' : 'unknown',
            profileText: userDetail?.intro || '',
            birthday: userDetail?.birthday ? moment(userDetail?.birthday, FUtil.Predefined.momentDateFormat) : null,
            residence: userDetail?.areaCode
              ? [userDetail?.areaCode.substr(0, 2), userDetail?.areaCode]
              : [],
            residenceText: userDetail?.areaName || '',
            career: userDetail?.occupation || '',
          },

          username: data.username,
          email: data.email,
          phone: data.mobile,

          nodeDataSize: FUtil.Format.humanizeSize(data2?.totalFileSize || 0),
        },
      });
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
    * onChange_Avatar({ payload }: OnChange_Avatar_Action, { call }: EffectsCommandMap) {
      const params: Parameters<typeof FServiceAPI.User.uploadHeadImg>[0] = {
        file: payload.value,
      };
      const { data } = yield call(FServiceAPI.User.uploadHeadImg);

    },
    * onChange_Gender({ payload }: OnChange_Gender_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          profile_gender: payload.value,
        },
      });
    },
    * onChange_ProfileText({ payload }: OnChange_ProfileText_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          profile_profileText: payload.value,
        },
      });
    },
    * onChange_Birthday({ payload }: OnChange_Birthday_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          profile_birthday: payload.value,
        },
      });
    },
    * onChange_Residence({ payload }: OnChange_Residence_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          profile_residence: payload.value,
          profile_residenceText: payload.text,
        },
      });
    },
    * onChange_Career({ payload }: OnChange_Career_Action, { put }: EffectsCommandMap) {
      // console.log(payload, '(***(*UOIJOIJLKJLJ');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          profile_career: payload.value,
          // profile_careerError: payload.value.length > 20 ? '不超过20个字符' : '',
        },
      });
    },
    * onClick_SubmitUserInfoBtn({}: OnClick_SubmitUserInfoBtn_Action, { select, call, put }: EffectsCommandMap) {
      const { settingPage }: ConnectState = yield select(({ settingPage }: ConnectState) => ({
        settingPage,
      }));

      const params: Parameters<typeof FServiceAPI.User.updateDetailInfo>[0] = {
        areaCode: settingPage.profile_residence.length === 2 ? String(settingPage.profile_residence[settingPage.profile_residence.length - 1]) : undefined,
        occupation: settingPage.profile_career,
        birthday: settingPage.profile_birthday?.format(FUtil.Predefined.momentDateFormat) || undefined,
        sex: settingPage.profile_gender === 'male' ? 1 : settingPage.profile_gender === 'female' ? 2 : 0,
        intro: settingPage.profile_profileText,
      };

      const { ret, errCode, msg } = yield call(FServiceAPI.User.updateDetailInfo, params);
      if (ret !== 0 || errCode !== 0) {
        self._czc?.push(['_trackEvent', '个人中心页', '提交修改', '', 1]);
        return fMessage(msg, 'error');
      }

      self._czc?.push(['_trackEvent', '个人中心页', '提交修改', '', 0]);
      fMessage(FI18n.i18nNext.t('msg_updated_successfully'));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          profile_state: 'normal',
          profileInfo: {
            ...settingPage.profileInfo,
            residence: settingPage.profile_residence,
            residenceText: settingPage.profile_residenceText,
            career: settingPage.profile_career,
            birthday: settingPage.profile_birthday,
            gender: settingPage.profile_gender,
            profileText: settingPage.profile_profileText,
          },
        },
      });
    },
    * onClick_CancelEditUserInfoBtn({}: OnClick_CancelEditUserInfoBtn_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          profile_state: 'normal',
        },
      });
    },
    * onClick_EditUserInfoBtn({}: OnClick_EditUserInfoBtn_Action, { select, put }: EffectsCommandMap) {
      const { settingPage }: ConnectState = yield select(({ settingPage }: ConnectState) => ({
        settingPage,
      }));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          profile_state: 'editing',
          profile_gender: settingPage.profileInfo.gender,
          profile_profileText: settingPage.profileInfo.profileText,
          profile_birthday: settingPage.profileInfo.birthday,
          profile_residence: settingPage.profileInfo.residence,
          profile_residenceText: settingPage.profileInfo.residenceText,
          profile_career: settingPage.profileInfo.career,
        },
      });
    },
    * onClick_BindEmailBtn(action: OnClick_BindEmailBtn_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          // bindEmail_ModalVisible: true,
          showModal: 'bindEmail',
        },
      });
    },
    * onClick_ReplaceEmailBtn(action: OnClick_ReplaceEmailBtn_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          // changeEmail_Old_ModalVisible: true,
          // showModal: 'changeEmail_Old',
          showModal: 'changeEmail_VerifyPass',
        },
      });
    },
    * onClick_BindPhoneBtn(action: OnClick_BindPhoneBtn_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          // bindPhone_ModalVisible: true,
          showModal: 'bindPhone',
        },
      });
    },
    * onClick_ReplacePhoneBtn(action: OnClick_ReplacePhoneBtn_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          // changePhone_Old_ModalVisible: true,
          showModal: 'changePhone_VerifyPass',
        },
      });
    },
    * onClick_ChangePasswordBtn({}: OnClick_ChangePasswordBtn_Action, { put }: EffectsCommandMap) {
      //  changePassword_ModalVisible
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          // changePassword_ModalVisible: true,
          showModal: 'changePassword',
        },
      });
    },
    * onClick_DataCleaningBtn({}: OnClick_DataCleaningBtn_Action, { call, put }: EffectsCommandMap) {

      const params: Parameters<typeof FServiceAPI.Storage.userNodeDataList>[0] = {
        skip: 0,
        limit: 100,
      };

      const { data } = yield call(FServiceAPI.Storage.userNodeDataList, params);

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nodeDataDrawerVisible: true,
          nodeDataList: (data.dataList as any[]).map<SettingPageModelState['nodeDataList'][number]>((dl: any) => {
            return {
              checked: false,
              id: dl.nodeInfo.nodeId,
              domain: dl.nodeInfo.nodeDomain,
              name: dl.nodeInfo.nodeName,
              url: FUtil.Format.completeUrlByDomain(dl.nodeInfo.nodeDomain).replace(/^http(s)?:\/\//, ''),
              size: FUtil.Format.humanizeSize(dl.systemProperty.fileSize),
              dateTime: FUtil.Format.formatDateTime(dl.updateDate, true),
            };
          }),
        },
      });
    },

    * onCancel_BindEmail_Modal(action: OnCancel_BindEmail_Modal_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          showModal: '',
          ...initStates_BindEmail,
        },
      });
    },
    * onChange_BindEmail_EmailInput({ payload }: OnChange_BindEmail_EmailInput_Action, { put }: EffectsCommandMap) {
      // console.log(payload, 'payloadpayloadpayloadpayload12342134234234');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          bindEmail_EmailInput: payload.value,
        },
      });
    },
    * onBlur_BindEmail_EmailInput({}: OnBlur_BindEmail_EmailInput_Action, { select, call, put }: EffectsCommandMap) {
      const { settingPage }: ConnectState = yield select(({ settingPage }: ConnectState) => ({
        settingPage,
      }));

      let bindEmail_EmailInputError: string = '';
      if (settingPage.bindEmail_EmailInput === '') {
        bindEmail_EmailInputError = '请输入邮箱';
      } else if (!FUtil.Regexp.EMAIL_ADDRESS.test(settingPage.bindEmail_EmailInput)) {
        bindEmail_EmailInputError = '请输入正确格式的邮箱';
      }

      if (bindEmail_EmailInputError === '') {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            bindEmail_EmailInput_VerifyState: 'verifying',
          },
        });
        const params: Parameters<typeof FServiceAPI.User.userDetails>[0] = {
          email: settingPage.bindEmail_EmailInput,
        };
        const { data } = yield call(FServiceAPI.User.userDetails, params);
        if (data) {
          bindEmail_EmailInputError = '邮箱已被占用';
        }
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          bindEmail_EmailInputError,
          bindEmail_EmailInput_VerifyState: 'verified',
        },
      });
    },
    * onChange_BindEmail_CaptchaInput({ payload }: OnChange_BindEmail_CaptchaInput_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          bindEmail_CaptchaInput: payload.value,
        },
      });
    },
    * onChange_BindEmail_CaptchaWait({ payload }: OnChange_BindEmail_CaptchaWait_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          bindEmail_CaptchaWait: payload.value,
        },
      });
    },
    * onClick_BindEmail_SendCaptchaBtn(action: OnClick_BindEmail_SendCaptchaBtn_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap): any {
      const { settingPage }: ConnectState = yield select(({ settingPage }: ConnectState) => ({
        settingPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          bindEmail_CaptchaWait: 60,
        },
      });
      // console.log(settingPage.bindEmail_EmailInput, 'settingPage.bindEmail_CaptchaInput!@#$@#$#@$@#$');
      const params: Parameters<typeof sentVerificationCode>[0] = {
        loginName: settingPage.bindEmail_EmailInput,
      };
      const result = yield call(sentVerificationCode, params);
      if (!result) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            bindEmail_CaptchaWait: 0,
          },
        });
      }
    },
    * onClick_BindEmail_ConfirmBtn({}: OnClick_BindEmail_ConfirmBtn_Action, { select, call, put }: EffectsCommandMap) {
      const { settingPage }: ConnectState = yield select(({ settingPage }: ConnectState) => ({
        settingPage,
      }));

      if (!new RegExp(/^[0-9]*$/).test(settingPage.bindEmail_CaptchaInput)) {
        fMessage('验证码必须全部为数字', 'error');
        return;
      }

      const params: Parameters<typeof FServiceAPI.User.updateMobileOrEmail>[0] = {
        // oldAuthCod?: string;
        newAuthCode: settingPage.bindEmail_CaptchaInput,
        newLoginName: settingPage.bindEmail_EmailInput,
      };

      const { errCode, msg } = yield call(FServiceAPI.User.updateMobileOrEmail, params);

      if (errCode !== 0) {
        return fMessage(msg, 'error');
      }

      // fMessage('绑定成功', 'success');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          showModal: '',
          ...initStates_BindEmail,
          email: settingPage.bindEmail_EmailInput,
        },
      });

      yield put<FetchInfoAction>({
        type: 'user/fetchInfo',
      });

    },
    * onCancel_ChangeEmailVerifyPass({}: OnCancel_ChangeEmailVerifyPass_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          showModal: '',
        },
      });
    },
    * onClick_ChangeEmailVerifyPass_NextBtn({}: OnClick_ChangeEmailVerifyPass_NextBtn_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          showModal: 'changeEmail_Old',
        },
      });
    },
    * onCancel_ChangeEmail_Old_Modal(action: OnCancel_ChangeEmail_Old_Modal_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          showModal: '',
          ...initStates_ChangeEmail,
        },
      });
    },
    * onChange_ChangeEmail_Old_CaptchaInput({ payload }: OnChange_ChangeEmail_Old_CaptchaInput_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changeEmail_Old_CaptchaInput: payload.value,
        },
      });
    },
    * onClick_ChangeEmail_Old_SendCaptchaBtn({}: OnClick_ChangeEmail_Old_SendCaptchaBtn_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap): any {
      const { settingPage }: ConnectState = yield select(({ settingPage }: ConnectState) => ({
        settingPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changeEmail_Old_CaptchaWait: 60,
        },
      });

      const params: Parameters<typeof sentVerificationCode>[0] = {
        loginName: settingPage.email,
      };
      const result = yield call(sentVerificationCode, params);
      if (!result) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            changeEmail_Old_CaptchaWait: 0,
          },
        });
      }
    },
    * onChange_ChangeEmail_Old_CaptchaWait({ payload }: OnChange_ChangeEmail_Old_CaptchaWait_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changeEmail_Old_CaptchaWait: payload.value,
        },
      });
    },
    * onClick_ChangeEmail_Old_NextBtn({}: OnClick_ChangeEmail_Old_NextBtn_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {
      const { settingPage }: ConnectState = yield select(({ settingPage }: ConnectState) => ({
        settingPage,
      }));

      if (!new RegExp(/^[0-9]*$/).test(settingPage.changeEmail_Old_CaptchaInput)) {
        fMessage('验证码必须全部为数字', 'error');
        return;
      }

      const params: Parameters<typeof FServiceAPI.Captcha.verifyVerificationCode>[0] = {
        authCode: settingPage.changeEmail_Old_CaptchaInput,
        address: settingPage.email,
        authCodeType: 'updateMobileOrEmail',
      };

      const { data, errCode, ret, msg } = yield call(FServiceAPI.Captcha.verifyVerificationCode, params);
      if (ret !== 0 || errCode !== 0 || !data) {
        return fMessage('验证码错误', 'error');
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          // changeEmail_Old_ModalVisible: false,
          // changeEmail_New_ModalVisible: true,
          showModal: 'changeEmail_New',
        },
      });
    },
    * onCancel_ChangeEmail_New_Modal(action: OnCancel_ChangeEmail_New_Modal_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          showModal: '',
          ...initStates_ChangeEmail,
        },
      });
    },
    * onChange_ChangeEmail_New_EmailInput({ payload }: OnChange_ChangeEmail_New_EmailInput_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changeEmail_New_EmailInput: payload.value,
        },
      });
    },
    * onBlur_ChangeEmail_New_EmailInput(action: OnBlur_ChangeEmail_New_EmailInput_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {
      const { settingPage }: ConnectState = yield select(({ settingPage }: ConnectState) => ({
        settingPage,
      }));

      let changeEmail_New_EmailInputError: string = '';
      if (!settingPage.changeEmail_New_EmailInput) {
        changeEmail_New_EmailInputError = '请输入邮箱';
      } else if (!FUtil.Regexp.EMAIL_ADDRESS.test(settingPage.changeEmail_New_EmailInput)) {
        changeEmail_New_EmailInputError = '请输入正确格式的邮箱';
      }

      if (changeEmail_New_EmailInputError === '') {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            changeEmail_New_EmailInput_VerifyState: 'verifying',
          },
        });
        const params: Parameters<typeof FServiceAPI.User.userDetails>[0] = {
          email: settingPage.changeEmail_New_EmailInput,
        };
        const { data } = yield call(FServiceAPI.User.userDetails, params);
        if (data) {
          changeEmail_New_EmailInputError = '邮箱已被占用';
        }
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changeEmail_New_EmailInputError,
          changeEmail_New_EmailInput_VerifyState: 'verified',
        },
      });
    },
    * onChange_ChangeEmail_New_CaptchaInput({ payload }: OnChange_ChangeEmail_New_CaptchaInput_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changeEmail_New_CaptchaInput: payload.value,
        },
      });
    },
    * onClick_ChangeEmail_New_SendCaptchaBtn({}: OnClick_ChangeEmail_New_SendCaptchaBtn_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap): any {

      const { settingPage }: ConnectState = yield select(({ settingPage }: ConnectState) => ({
        settingPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changeEmail_New_CaptchaWait: 60,
        },
      });

      const params: Parameters<typeof sentVerificationCode>[0] = {
        loginName: settingPage.changeEmail_New_EmailInput,
      };
      const result = yield call(sentVerificationCode, params);
      if (!result) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            changeEmail_New_CaptchaWait: 0,
          },
        });
      }
    },
    * onChange_ChangeEmail_New_CaptchaWait({ payload }: OnChange_ChangeEmail_New_CaptchaWait_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changeEmail_New_CaptchaWait: payload.value,
        },
      });
    },
    * onClick_ChangeEmail_New_ConfirmBtn({}: OnClick_ChangeEmail_New_ConfirmBtn_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {
      const { settingPage }: ConnectState = yield select(({ settingPage }: ConnectState) => ({
        settingPage,
      }));

      if (!new RegExp(/^[0-9]*$/).test(settingPage.changeEmail_Old_CaptchaInput)) {
        fMessage('验证码必须全部为数字', 'error');
        return;
      }

      if (!new RegExp(/^[0-9]*$/).test(settingPage.changeEmail_New_CaptchaInput)) {
        fMessage('验证码必须全部为数字', 'error');
        return;
      }

      const params: Parameters<typeof FServiceAPI.User.updateMobileOrEmail>[0] = {
        oldAuthCode: settingPage.changeEmail_Old_CaptchaInput,
        newAuthCode: settingPage.changeEmail_New_CaptchaInput,
        newLoginName: settingPage.changeEmail_New_EmailInput,
      };

      const { ret, errCode, msg } = yield call(FServiceAPI.User.updateMobileOrEmail, params);

      if (ret !== 0 || errCode !== 0) {
        return fMessage(msg, 'error');
      }

      // fMessage('绑定成功', 'success');
      fMessage('邮箱修改成功', 'success');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          showModal: '',
          ...initStates_ChangeEmail,
          email: settingPage.changeEmail_New_EmailInput,
        },
      });

      yield put<FetchInfoAction>({
        type: 'user/fetchInfo',
      });
    },
    * onCancel_BindPhone_Modal(action: OnCancel_BindPhone_Modal_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          showModal: '',
          ...initStates_BindPhone,
        },
      });
    },

    * onChange_BindPhone_PhoneInput({ payload }: OnChange_BindPhone_PhoneInput_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          bindPhone_PhoneInput: payload.value,
        },
      });
    },
    * onBlur_BindPhone_PhoneInput({}: OnBlur_BindPhone_PhoneInput_Action, { select, call, put }: EffectsCommandMap) {
      const { settingPage }: ConnectState = yield select(({ settingPage }: ConnectState) => ({
        settingPage,
      }));

      let bindPhone_PhoneInputError: string = '';
      if (!settingPage.bindPhone_PhoneInput) {
        bindPhone_PhoneInputError = '请输入手机号';
      } else if (!FUtil.Regexp.MOBILE_PHONE_NUMBER.test(settingPage.bindPhone_PhoneInput)) {
        bindPhone_PhoneInputError = '请输入正确格式的手机号';
      }

      if (bindPhone_PhoneInputError === '') {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            bindPhone_PhoneInput_VerifyState: 'verifying',
          },
        });
        const params: Parameters<typeof FServiceAPI.User.userDetails>[0] = {
          mobile: settingPage.bindPhone_PhoneInput,
        };
        const { data } = yield call(FServiceAPI.User.userDetails, params);
        if (data) {
          bindPhone_PhoneInputError = '手机号已被占用';
        }
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          bindPhone_PhoneInputError,
          bindPhone_PhoneInput_VerifyState: 'verified',
        },
      });
    },
    * onChange_BindPhone_CaptchaInput({ payload }: OnChange_BindPhone_CaptchaInput_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          bindPhone_CaptchaInput: payload.value,
        },
      });
    },
    * onChange_BindPhone_CaptchaWait({ payload }: OnChange_BindPhone_CaptchaWait_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          bindPhone_CaptchaWait: payload.value,
        },
      });
    },
    * onClick_BindPhone_SendCaptchaBtn({}: OnClick_BindPhone_SendCaptchaBtn_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap): any {
      const { settingPage }: ConnectState = yield select(({ settingPage }: ConnectState) => ({
        settingPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          bindPhone_CaptchaWait: 60,
        },
      });

      const params: Parameters<typeof sentVerificationCode>[0] = {
        loginName: settingPage.bindPhone_PhoneInput,
      };
      const result = yield call(sentVerificationCode, params);
      if (!result) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            bindPhone_CaptchaWait: 0,
          },
        });
      }
    },
    * onClick_BindPhone_ConfirmBtn({}: OnClick_BindPhone_ConfirmBtn_Action, { select, call, put }: EffectsCommandMap) {
      const { settingPage }: ConnectState = yield select(({ settingPage }: ConnectState) => ({
        settingPage,
      }));

      if (!new RegExp(/^[0-9]*$/).test(settingPage.bindPhone_CaptchaInput)) {
        fMessage('验证码必须全部为数字', 'error');
        return;
      }

      const params: Parameters<typeof FServiceAPI.User.updateMobileOrEmail>[0] = {
        newAuthCode: settingPage.bindPhone_CaptchaInput,
        newLoginName: settingPage.bindPhone_PhoneInput,
      };

      const { ret, errCode, msg } = yield call(FServiceAPI.User.updateMobileOrEmail, params);

      if (ret !== 0 || errCode !== 0) {
        return fMessage(msg, 'error');
      }

      // fMessage('绑定成功', 'success');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          showModal: '',
          ...initStates_BindPhone,
          phone: settingPage.bindPhone_PhoneInput,
        },
      });

      yield put<FetchInfoAction>({
        type: 'user/fetchInfo',
      });

    },
    * onCancel_ChangePhoneVerifyPass({}: OnCancel_ChangePhoneVerifyPass_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          showModal: '',
        },
      });
    },
    * onClick_ChangePhoneVerifyPass_NextBtn({}: OnClick_ChangePhoneVerifyPass_NextBtn_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          showModal: 'changePhone_Old',
        },
      });
    },
    * onCancel_ChangePhone_Old_Modal(action: OnCancel_ChangePhone_Old_Modal_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          showModal: '',
          ...initStates_ChangePhone,
        },
      });
    },
    * onChange_ChangePhone_Old_CaptchaInput({ payload }: OnChange_ChangePhone_Old_CaptchaInput_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changePhone_Old_CaptchaInput: payload.value,
        },
      });
    },
    * onClick_ChangePhone_Old_SendCaptchaBtn(action: OnClick_ChangePhone_Old_SendCaptchaBtn_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap): any {

      const { settingPage }: ConnectState = yield select(({ settingPage }: ConnectState) => ({
        settingPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changePhone_Old_CaptchaWait: 60,
        },
      });

      const params: Parameters<typeof sentVerificationCode>[0] = {
        loginName: settingPage.phone,
      };
      const result = yield call(sentVerificationCode, params);
      if (!result) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            changePhone_Old_CaptchaWait: 0,
          },
        });
      }

    },
    * onChange_ChangePhone_Old_CaptchaWait({ payload }: OnChange_ChangePhone_Old_CaptchaWait_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changePhone_Old_CaptchaWait: payload.value,
        },
      });
    },
    * onClick_ChangePhone_Old_NextBtn({}: OnClick_ChangePhone_Old_NextBtn_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {

      const { settingPage }: ConnectState = yield select(({ settingPage }: ConnectState) => ({
        settingPage,
      }));

      if (!new RegExp(/^[0-9]*$/).test(settingPage.changePhone_Old_CaptchaInput)) {
        fMessage('验证码必须全部为数字', 'error');
        return;
      }

      const params: Parameters<typeof FServiceAPI.Captcha.verifyVerificationCode>[0] = {
        authCode: settingPage.changePhone_Old_CaptchaInput,
        address: settingPage.phone,
        authCodeType: 'updateMobileOrEmail',
      };

      const { data, errCode, ret, msg } = yield call(FServiceAPI.Captcha.verifyVerificationCode, params);
      if (ret !== 0 || errCode !== 0 || !data) {
        return fMessage('验证码错误', 'error');
      }
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          // changePhone_Old_ModalVisible: false,
          // changePhone_New_ModalVisible: true,
          showModal: 'changePhone_New',
        },
      });
    },
    * onCancel_ChangePhone_New_Modal({}: OnCancel_ChangePhone_New_Modal_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          showModal: '',
          ...initStates_ChangePhone,
        },
      });
    },
    * onChange_ChangePhone_New_PhoneInput({ payload }: OnChange_ChangePhone_New_PhoneInput_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changePhone_New_PhoneInput: payload.value,
        },
      });
    },
    * onBlur_ChangePhone_New_PhoneInput({}: OnBlur_ChangePhone_New_PhoneInput_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {

      // console.log('#######BGBBBBGGFG');
      const { settingPage }: ConnectState = yield select(({ settingPage }: ConnectState) => ({
        settingPage,
      }));

      let changePhone_New_PhoneInputError: string = '';
      if (settingPage.changePhone_New_PhoneInput === '') {
        changePhone_New_PhoneInputError = '请输入手机号';
      } else if (!FUtil.Regexp.MOBILE_PHONE_NUMBER.test(settingPage.changePhone_New_PhoneInput)) {
        changePhone_New_PhoneInputError = '请输入正确格式的手机号';
      }

      if (changePhone_New_PhoneInputError === '') {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            changePhone_New_PhoneInput_VerifyState: 'verifying',
          },
        });
        const params: Parameters<typeof FServiceAPI.User.userDetails>[0] = {
          mobile: settingPage.changePhone_New_PhoneInput,
        };
        const { data } = yield call(FServiceAPI.User.userDetails, params);
        if (data) {
          changePhone_New_PhoneInputError = '手机号已被占用';
        }
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changePhone_New_PhoneInputError,
          changePhone_New_PhoneInput_VerifyState: 'verified',
        },
      });
    },
    * onChange_ChangePhone_New_CaptchaInput({ payload }: OnChange_ChangePhone_New_CaptchaInput_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changePhone_New_CaptchaInput: payload.value,
        },
      });
    },
    * onClick_ChangePhone_New_SendCaptchaBtn({}: OnClick_ChangePhone_New_SendCaptchaBtn_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap): any {
      const { settingPage }: ConnectState = yield select(({ settingPage }: ConnectState) => ({
        settingPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changePhone_New_CaptchaWait: 60,
        },
      });

      const params: Parameters<typeof sentVerificationCode>[0] = {
        loginName: settingPage.changePhone_New_PhoneInput,
      };
      const result = yield call(sentVerificationCode, params);
      if (!result) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            changePhone_New_CaptchaWait: 0,
          },
        });
      }
    },
    * onChange_ChangePhone_New_CaptchaWait({ payload }: OnChange_ChangePhone_New_CaptchaWait_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changePhone_New_CaptchaWait: payload.value,
        },
      });
    },
    * onClick_ChangePhone_New_ConfirmBtn(action: OnClick_ChangePhone_New_ConfirmBtn_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {
      const { settingPage }: ConnectState = yield select(({ settingPage }: ConnectState) => ({
        settingPage,
      }));

      if (!new RegExp(/^[0-9]*$/).test(settingPage.changePhone_Old_CaptchaInput)) {
        fMessage('验证码必须全部为数字', 'error');
        return;
      }

      const params: Parameters<typeof FServiceAPI.User.updateMobileOrEmail>[0] = {
        oldAuthCode: settingPage.changePhone_Old_CaptchaInput,
        newAuthCode: settingPage.changePhone_New_CaptchaInput,
        newLoginName: settingPage.changePhone_New_PhoneInput,
      };

      const { ret, errCode, msg } = yield call(FServiceAPI.User.updateMobileOrEmail, params);

      if (ret !== 0 || errCode !== 0) {
        return fMessage(msg, 'error');
      }
      fMessage('手机号修改成功', 'success');
      // fMessage('绑定成功', 'success');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          showModal: '',
          ...initStates_ChangePhone,
          phone: settingPage.changePhone_New_PhoneInput,
        },
      });

      yield put<FetchInfoAction>({
        type: 'user/fetchInfo',
      });
    },
    * onCancel_ChangePassword_Modal(action: OnCancel_ChangePassword_Modal_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          showModal: '',
          ...initStates_ChangePassword,
        },
      });
    },
    * onChange_ChangePassword_Old_PasswordInput({ payload }: OnChange_ChangePassword_Old_PasswordInput_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changePassword_Old_PasswordInput: payload.value,
          changePassword_Old_PasswordInput_Error: '',
        },
      });
    },
    * onBlur_ChangePassword_Old_PasswordInput({}: OnBlur_ChangePassword_Old_PasswordInput_Action, {
      select,
      put,
    }: EffectsCommandMap) {
      const { settingPage }: ConnectState = yield select(({ settingPage }: ConnectState) => ({
        settingPage,
      }));

      // console.log(settingPage.changePassword_Old_PasswordInput, 'settingPage.changePassword_Old_PasswordInputio dsifjsdlkf');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changePassword_Old_PasswordInput_Error: settingPage.changePassword_Old_PasswordInput === '' ? '请输入密码' : '',
        },
      });
    },
    * onChange_ChangePassword_New1_PasswordInput({ payload }: OnChange_ChangePassword_New1_PasswordInput_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changePassword_New1_PasswordInput: payload.value,
          changePassword_New1_PasswordInput_Error: '',
        },
      });
    },
    * onBlur_ChangePassword_New1_PasswordInput(action: OnBlur_ChangePassword_New1_PasswordInput_Action, {
      select,
      put,
    }: EffectsCommandMap) {
      const { settingPage }: ConnectState = yield select(({ settingPage }: ConnectState) => ({
        settingPage,
      }));

      let changePassword_New1_PasswordInput_Error: string = '';
      let changePassword_New2_PasswordInput_Error: string = '';

      if (settingPage.changePassword_New1_PasswordInput === '') {
        changePassword_New1_PasswordInput_Error = '请输入新密码';
      } else if (settingPage.changePassword_New1_PasswordInput.length < 6 || settingPage.changePassword_New1_PasswordInput.length > 24) {
        changePassword_New1_PasswordInput_Error = FI18n.i18nNext.t('password_length');
      } else if (!FUtil.Regexp.PASSWORD.test(settingPage.changePassword_New1_PasswordInput)) {
        changePassword_New1_PasswordInput_Error = FI18n.i18nNext.t('password_include');
      }

      if (settingPage.changePassword_New1_PasswordInput !== '' && settingPage.changePassword_New2_PasswordInput !== '' && (settingPage.changePassword_New2_PasswordInput !== settingPage.changePassword_New1_PasswordInput)) {
        changePassword_New2_PasswordInput_Error = FI18n.i18nNext.t('changepassword_alarm_notmatch');
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changePassword_New1_PasswordInput_Error,
          changePassword_New2_PasswordInput_Error,
        },
      });
    },
    * onChange_ChangePassword_New2_PasswordInput({ payload }: OnChange_ChangePassword_New2_PasswordInput_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changePassword_New2_PasswordInput: payload.value,
          changePassword_New2_PasswordInput_Error: '',
        },
      });
    },
    * onBlur_ChangePassword_New2_PasswordInput(action: OnBlur_ChangePassword_New2_PasswordInput_Action, {
      select,
      put,
    }: EffectsCommandMap) {
      const { settingPage }: ConnectState = yield select(({ settingPage }: ConnectState) => ({
        settingPage,
      }));
      let changePassword_New2_PasswordInput_Error: string = '';
      if (settingPage.changePassword_New2_PasswordInput === '') {
        changePassword_New2_PasswordInput_Error = '请输入确认密码';
      } else if (settingPage.changePassword_New2_PasswordInput !== settingPage.changePassword_New1_PasswordInput) {
        changePassword_New2_PasswordInput_Error = FI18n.i18nNext.t('changepassword_alarm_notmatch');
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changePassword_New2_PasswordInput_Error,
        },
      });
    },
    * onClick_ChangePassword_ConfirmBtn({}: OnClick_ChangePassword_ConfirmBtn_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {
      const { settingPage }: ConnectState = yield select(({ settingPage }: ConnectState) => ({
        settingPage,
      }));

      if (!FUtil.Regexp.PASSWORD.test(settingPage.changePassword_Old_PasswordInput)) {
        fMessage(FI18n.i18nNext.t('password_incorrect'), 'error');
        return;
      }

      const params: Parameters<typeof FServiceAPI.User.updatePassword>[0] = {
        oldPassword: settingPage.changePassword_Old_PasswordInput,
        newPassword: settingPage.changePassword_New1_PasswordInput,
      };

      const { errCode, msg } = yield call(FServiceAPI.User.updatePassword, params);

      if (errCode !== 0) {
        return fMessage(msg, 'error');
      }

      fMessage('密码修改成功', 'success');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          showModal: '',
          ...initStates_ChangePassword,
        },
      });

    },
    * onChange_NodeDate_CheckedAll({ payload }: OnChange_NodeDate_CheckedAll_Action, {
      select,
      put,
    }: EffectsCommandMap) {
      const { settingPage }: ConnectState = yield select(({ settingPage }: ConnectState) => ({
        settingPage,
      }));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nodeDataList: settingPage.nodeDataList.map((nd) => {
            return {
              ...nd,
              checked: payload.value,
            };
          }),
        },
      });
    },
    * onChange_NodeDate_ItemChecked({ payload }: OnChange_NodeDate_ItemChecked_Action, {
      select,
      put,
    }: EffectsCommandMap) {
      const { settingPage }: ConnectState = yield select(({ settingPage }: ConnectState) => ({
        settingPage,
      }));
      // console.log(payload, '@#$@#$@#422222222');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nodeDataList: settingPage.nodeDataList.map((nd) => {
            if (nd.id !== payload.nodeID) {
              return nd;
            }
            return {
              ...nd,
              checked: payload.value,
            };
          }),
        },
      });
    },
    * onCancel_NodeDate_Drawer({}: OnCancel_NodeDate_Drawer_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nodeDataDrawerVisible: false,
        },
      });
    },
    * onClick_NodeDate_ConfirmBtn(action: OnClick_NodeDate_ConfirmBtn_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {
      const { settingPage }: ConnectState = yield select(({ settingPage }: ConnectState) => ({
        settingPage,
      }));

      const params: Parameters<typeof FServiceAPI.Storage.clearUserNodeData>[0] = {
        nodeDomains: settingPage.nodeDataList.filter((nd) => {
          return nd.checked;
        }).map((nd) => {
          return nd.domain;
        }),
      };

      // console.log(params, ' params2343432423fsdaasdfsd');
      const { data } = yield call(FServiceAPI.Storage.clearUserNodeData, params);

      if (!data) {
        return;
      }

      fMessage('数据清理成功', 'success');

      const params2: Parameters<typeof FServiceAPI.Storage.bucketDetails>[0] = {
        bucketName: '.UserNodeData',
      };

      const { data: data2 } = yield call(FServiceAPI.Storage.bucketDetails, params2);
      // console.log(data2, 'data2!@#$@!#$@#4');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nodeDataDrawerVisible: false,
          nodeDataList: [],
          nodeDataSize: FUtil.Format.humanizeSize(data2?.totalFileSize || 0),
        },
      });
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

interface SentVerificationCode {
  loginName: string;
}

async function sentVerificationCode({ loginName }: SentVerificationCode): Promise<boolean> {
  // console.log(loginName, 'loginName!!!!!!!');
  const params: Parameters<typeof FServiceAPI.Captcha.sendVerificationCode>[0] = {
    loginName: loginName,
    authCodeType: 'updateMobileOrEmail',
  };
  const { errCode, msg } = await FServiceAPI.Captcha.sendVerificationCode(params);
  if (errCode === 0) {
    return true;
  }
  fMessage(msg, 'error');
  return false;
}
