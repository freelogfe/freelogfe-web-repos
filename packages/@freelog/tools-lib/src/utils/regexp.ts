// 展品名称
export const EXHIBIT_NAME: RegExp = /^(?!.*(\\|\/|:|\*|\?|"|<|>|\||\s|@|\$|#)).{1,60}$/;

// 资源名称
export const RESOURCE_NAME: RegExp = /^(?!.*(\\|\/|:|\*|\?|"|<|>|\||\s|@|\$|#)).{1,60}$/;

// 资源类型
export const RESOURCE_TYPE: RegExp = /^(?!_)[a-z0-9_]{3,20}(?<!_)$/;

// 自定义属性键
export const CUSTOM_KEY: RegExp = /^[a-zA-Z0-9_]{1,20}$/;

// 节点名称
export const NODE_NAME: RegExp = /^[\u4E00-\u9FA5|a-zA-Z0-9]{2,24}$/;

// 节点地址
export const NODE_DOMAIN: RegExp = /^(?!-)[a-z0-9-]{4,24}(?<!-)$/;

// 支付密码
export const PAY_PASSWORD: RegExp = /^\d{6}$/;

// 手机号码
export const MOBILE_PHONE_NUMBER = /^1[345789]\d{9}$/;
// export const TELEPHONE_NUMBER = /^((13[0-9])|(14[5-9])|(15([0-3]|[5-9]))|(16[6-7])|(17[1-8])|(18[0-9])|(19[1|3])|(19[5|6])|(19[8|9]))\d{8}$/

// 邮箱地址
export const EMAIL_ADDRESS: RegExp = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

// 用户名
// export const USERNAME = /^(?!-)[A-Za-z0-9-]{1,30}(?<!-)$/;
export const USERNAME: RegExp = /^(?!-)[A-Za-z0-9-]{1,30}(?<!-)$/;

// 用户密码
// export const PASSWORD = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,24}$/;
export const PASSWORD: RegExp = /^(?=.*[0-9])(?=.*[a-zA-Z])(.{6,24})$/;

// 自然数
export const NATURAL_NUMBER: RegExp = /^[0-9]*$/;
