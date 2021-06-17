import * as Format from './format';
import * as Regexp from './regexp';
import * as LinkTo from './linkTo';
import * as Predefined from './predefined';
import Axios, {request} from './axios';
import * as Tool from './tools';

const FUtil = {
  Format,
  Regexp,
  LinkTo,
  Predefined,
  Axios,
  Request: request,
  Tool,
};

export default FUtil;
