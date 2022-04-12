// @ts-ignore
import enUSCommon from '../../../@freelog/freelog-i18n/common/en/index.json';
import enUSConsole_new from '../../../@freelog/freelog-i18n/console_new/en/index.json';

const obj: any = {};

for (const k of Object.keys({
  ...enUSCommon,
  ...enUSConsole_new,
})) {
  obj[k] = k;
}

export default obj;
