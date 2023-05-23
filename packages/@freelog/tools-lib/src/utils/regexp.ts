// 展品名称
export const EXHIBIT_NAME: RegExp = new RegExp(/^(?!.*(\\|\/|:|\*|\?|"|<|>|\||\s|@|\$|#)).{1,60}$/);

// 资源名称
export const RESOURCE_NAME: RegExp = new RegExp(/^(?!.*(\\|\/|:|\*|\?|"|<|>|\||\s|@|\$|#)).{1,60}$/);

// 资源类型
export const RESOURCE_TYPE: RegExp = new RegExp('^[\u4e00-\u9fefa-zA-Z0-9\\-&.,]{1,40}$');

// 自定义属性键
// export const CUSTOM_KEY: RegExp = new RegExp(/^[a-zA-Z_]([a-zA-Z0-9_]{1,19})?$/);
export const CUSTOM_KEY: RegExp = new RegExp('^[a-zA-Z]([a-zA-Z0-9_]{1,19})?$');

// 节点名称
export const NODE_NAME: RegExp = new RegExp(/^[\u4E00-\u9FA5|a-zA-Z0-9]{2,24}$/);

// 节点地址
// export const NODE_DOMAIN: RegExp = new RegExp(/^(?!-)[a-z0-9-]{4,24}(?<!-)$/);
export const NODE_DOMAIN: RegExp = new RegExp(/^[a-z0-9][a-z0-9-]{2,22}[a-z0-9]$/);

// 支付密码
export const PAY_PASSWORD: RegExp = new RegExp(/^\d{6}$/);

// 手机号码
export const MOBILE_PHONE_NUMBER = new RegExp(/^1[345789]\d{9}$/);
// export const TELEPHONE_NUMBER = /^((13[0-9])|(14[5-9])|(15([0-3]|[5-9]))|(16[6-7])|(17[1-8])|(18[0-9])|(19[1|3])|(19[5|6])|(19[8|9]))\d{8}$/

// 邮箱地址
export const EMAIL_ADDRESS: RegExp = new RegExp(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);

// 用户名
// export const USERNAME: RegExp = new RegExp(/^(?!-)[A-Za-z0-9-]{1,30}(?<!-)$/);
export const USERNAME: RegExp = new RegExp(/^([A-Za-z0-9][A-Za-z0-9-]{0,28})?[A-Za-z0-9]$/);

// 用户密码
// export const PASSWORD = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,24}$/;
export const PASSWORD: RegExp = new RegExp(/^(?=.*[0-9])(?=.*[a-zA-Z])(.{6,24})$/);

// 自然数
export const NATURAL_NUMBER: RegExp = new RegExp(/^[0-9]*$/);

// 正整数
export const POSITIVE_INTEGER = new RegExp(/^[1-9]\d*$/);

// 最多两位小数的正数
// export const MAX_2_DECIMAL_POSITIVE_NUMBER = new RegExp(/^\d+(.\d{1,2})?$/);
export const MAX_2_DECIMAL_POSITIVE_NUMBER = new RegExp(/^\d+(\.\d{1,2})?$/);

// 对象的Bucket名称
export const BUCKET_NAME: RegExp = new RegExp(/^([a-z0-9][a-z0-9-]{0,61})?[a-z0-9]$/);

// JS变量名称
export const JS_VARIABLE_NAME: RegExp = new RegExp(/^[A-Za-z$_][\w$_]*$/);
