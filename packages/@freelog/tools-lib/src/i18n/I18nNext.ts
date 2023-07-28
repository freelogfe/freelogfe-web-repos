import i18next, {Resource} from 'i18next';
import axios from "axios";
import Cookies from 'js-cookie';
import FUtil from '../utils';
// import * as React from 'react';
import htmlReactParser from 'html-react-parser';

type LanguageKeyType = 'zh_CN' | 'en_US';

const ossJsonUrl: string = 'https://freelog-i18n.oss-cn-shenzhen.aliyuncs.com/configs/i18n.json';
const ossJsonUrl_Test: string = 'https://freelog-i18n.oss-cn-shenzhen.aliyuncs.com/configs-test/i18n.json';
const localStorage_i18nextLng_key: string = 'locale';
const localStorage_i18nextResources_key: string = 'i18nextResources';

const allLanguage = [
  {value: 'en_US', label: 'English'},
  {value: 'zh_CN', label: '简体中文'},
];

class I18nNext {

  private _loadingData: 'NotStart' | 'Start' | 'End' = 'NotStart';
  private _taskQueue: Function[] = [];
  // private _currentLanguage: LanguageKeyType = window.localStorage.getItem(localStorage_i18nextLng_key) as null || 'zh_CN';
  private _currentLanguage: LanguageKeyType = Cookies.get(localStorage_i18nextLng_key) as undefined || 'zh_CN';

  constructor() {
    this.ready();

    this.ready = this.ready.bind(this);
    this.t = this.t.bind(this);
    this.changeLanguage = this.changeLanguage.bind(this);
    this.getAllLanguage = this.getAllLanguage.bind(this);
    this.getCurrentLanguage = this.getCurrentLanguage.bind(this);
  }

  async ready(this: I18nNext): Promise<void> {
    const exc = () => {
      while (this._taskQueue.length > 0) {
        const task = this._taskQueue.shift();
        task && task();
      }
    };
    const handleTasks = async () => {
      // console.log(this._loadingData, 'this._loadingData90iowejflksdfjlsdk');
      if (this._loadingData === 'End') {
        exc();
        return;
      }
      if (this._loadingData === 'Start') {
        return;
      }

      // NO_START
      this._loadingData = 'Start';

      await this._handleData();
      // console.log('######');
      exc();
    };
    const promise = new Promise<void>((resolve) => {
      this._taskQueue.push(resolve);
    });
    handleTasks();
    return promise;
  }

  t(this: I18nNext, key: string, options?: { [key: string]: any }): string {
    return i18next.t(key.trim(), options);
  }

  tJSXElement(this: I18nNext, key: string, options?: { [key: string]: any }): string | JSX.Element | JSX.Element[] {
    return htmlReactParser(i18next.t(key.trim(), options));
  }


  changeLanguage(this: I18nNext, lng: LanguageKeyType): void {
    // return i18next.changeLanguage(lng);
    // window.localStorage.setItem(localStorage_i18nextLng_key, lng)
    Cookies.set(localStorage_i18nextLng_key, lng, {
      expires: 36525,
      domain: FUtil.Format.completeUrlByDomain('').replace(/http(s)?:\/\//, ''),
    });
  }

  getAllLanguage(this: I18nNext): typeof allLanguage {
    return allLanguage;
  }

  getCurrentLanguage(this: I18nNext): LanguageKeyType {
    return this._currentLanguage;
  }

  private async _handleData(this: I18nNext): Promise<void> {

    const lng: string = this._currentLanguage;
    const resource: string | null = window.localStorage.getItem(localStorage_i18nextResources_key);
    // const resource: string | undefined = Cookies.get(decodeURIComponent(localStorage_i18nextResources_key));
    let i18nextResources: Resource | null = resource ? JSON.parse(resource) : null;

    if (!i18nextResources) {
      // console.log('######892io3jlkl')
      i18nextResources = await this._fetchData();
    } else {
      this._fetchData();
    }

    await i18next
      .init({
        // the translations
        // (tip move them in a JSON file and import them,
        // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
        resources: i18nextResources,
        lng: lng, // if you're using a language detector, do not define the lng option
        fallbackLng: 'zh_CN',

        interpolation: {
          escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
          prefix: '{',
          suffix: '}',
        },
      });
    this._loadingData = 'End';
  }

  private async _fetchData(this: I18nNext): Promise<Resource> {
    const url: string = window.location.origin.includes('.freelog.com') ? ossJsonUrl : ossJsonUrl_Test;
    const res: any = await axios.get(url + '?timestamp=' + Date.now(), {
      withCredentials: false,
    });
    // console.log(res, 'data09oiw3qjelsfkdfjlsdkfjl');

    const en_US: { [key: string]: string } = {};
    const zh_CN: { [key: string]: string } = {};

    for (const [key, value] of Object.entries(res)) {
      // console.log(key, value, 'key, value90iowsldfjlsdkj');
      en_US[key] = (value as any)['en_US'];
      zh_CN[key] = (value as any)['zh_CN'];
    }

    const result: Resource = {
      en_US: {
        translation: en_US,
      },
      zh_CN: {
        translation: zh_CN,
      },
    };

    // console.log(result, 'result093sdolkfjlsdkjl');
    window.localStorage.setItem(localStorage_i18nextResources_key, JSON.stringify(result));
    // Cookies.set(localStorage_i18nextResources_key, encodeURIComponent(JSON.stringify(result)), {
    //   expires: 36525,
    //   domain: FUtil.Format.completeUrlByDomain('').replace(/http(s)?:\/\//, ''),
    // });

    return result;
  }
}

export default I18nNext;
