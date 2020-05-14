declare module '@freelog/freelog-ui-login/src/core' {
  export function getUserInfo(): Promise<any>
}
declare module '@freelog/freelog-ui-login/src/shared/getUserInfo'

declare module '@freelog/freelog-common-lib/src/initEnv' {
  export function getEnvType(): string 
  export function getEnvLanguage(): string
  export function getMainDomain(): string
  export function getQIoringin(): string
  export function getNodeType(): string
}

interface Window {
  FreelogApp: plainObject;
  __auth_info__: plainObject;
}

interface plainObject extends Object {
  [propName: string]: any;
}


