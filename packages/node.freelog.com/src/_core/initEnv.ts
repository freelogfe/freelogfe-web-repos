import { getEnvType, getEnvLanguage, getMainDomain, getQIoringin, getNodeType } from '@freelog/freelog-common-lib/src/initEnv'
export interface IEnv {
  leaguage: string;
  type: string;
  mainDomain: string;
  qiOrigin: string;
  nodeType: string;
  isTest: boolean;
  isMobile: boolean;
}

export default function initEnv(): IEnv {
  const type: string = getEnvType()
  const isTest = type !== 'prod'

  return {
    leaguage: getEnvLanguage(),
    mainDomain: getMainDomain(),
    qiOrigin: getQIoringin(),
    nodeType: getNodeType(),
    type,
    isTest,
    isMobile: /Android|webOS|iPhone|iPod|BlackBerry/i.test(window.navigator.userAgent),
  }
}

export { getEnvType, getEnvLanguage, getMainDomain, getQIoringin, getNodeType }


