import i18next, {Resource} from 'i18next';
import axios from "axios";

const ossJsonUrl: string = 'https://freelog-i18n.oss-cn-shenzhen.aliyuncs.com/configs/i18n.json';
const localStorage_i18nextLng_key: string = 'i18nextLng';
const localStorage_i18nextResources_key: string = 'i18nextResources';
const allLanguage = [
  {value: 'en_US', label: 'English'},
  {value: 'zh_CN', label: '简体中文'},
];

let self: FI18nNext;

class FI18nNext {

  private _loadingData: 'NotStart' | 'Start' | 'End' = 'NotStart';
  private _taskQueue: Function[] = [];
  private _currentLanguage: 'zh_CN' | 'en_US' = window.localStorage.getItem(localStorage_i18nextLng_key) as null || 'zh_CN';

  constructor() {
    self = this;
    self.ready();
  }

  async ready() {
    const exc = () => {
      while (self._taskQueue.length > 0) {
        const task = self._taskQueue.shift();
        task && task();
      }
    };
    const handleTasks = async () => {
      if (self._loadingData === 'End') {
        exc();
        return;
      }
      if (self._loadingData === 'Start') {
        return;
      }

      // NO_START
      self._loadingData = 'Start';

      await self._handleData();
      // console.log('######');
      exc();
    };
    const promise = new Promise((resolve) => {
      self._taskQueue.push(resolve);
    });
    handleTasks();
    return promise;
  }

  t(key: string, options?: { [key: string]: any }) {
    return i18next.t(key, options);
  }

  changeLanguage(lng: string) {
    // return i18next.changeLanguage(lng);
    window.localStorage.setItem(localStorage_i18nextLng_key, lng)
  }

  getAllLanguage(): { [key: string]: string }[] {
    return allLanguage;
  }

  getCurrentLanguage(): string {
    return self._currentLanguage;
  }

  private async _handleData() {

    const lng: string = self._currentLanguage;
    const resource: string | null = window.localStorage.getItem(localStorage_i18nextResources_key);
    let i18nextResources: Resource | null = resource ? JSON.parse(resource) : null;

    if (!i18nextResources) {
      // console.log('######892io3jlkl')
      i18nextResources = await self._fetchData();
    } else {
      self._fetchData();
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
        },
      });
  }

  private async _fetchData(): Promise<Resource> {
    const res: any = await axios.get(ossJsonUrl, {
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

    return result;
  }
}

export default FI18nNext;
