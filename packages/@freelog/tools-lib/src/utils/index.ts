import * as Format from './format';
import * as Regexp from './regexp';
import * as LinkTo from './linkTo';
import * as Predefined from './predefined';
import Axios, {request} from './axios';
import * as Tool from './tools';
import * as Hook from './hooks';
// import I18n from '../i18n';

const FUtil = {
  Format,
  Regexp,
  LinkTo,
  Predefined,
  Axios,
  Request: request,
  Tool,
  Hook,
  // i18n: new I18n(),
};

export default FUtil;
