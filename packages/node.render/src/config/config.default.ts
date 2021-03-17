import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export type DefaultConfig = PowerPartial<EggAppConfig>;

export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig;

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1612158870164_9011';
  config.cors = {
    origin: '*', // 表示允许的源
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH' // 表示允许的http请求方式
  };
  // add your config here
  config.middleware = [];
  
  config.midwayFeature = {
    // true 代表使用 midway logger
    // false 或者为空代表使用 egg-logger
    replaceEggLogger: true      
  }

  return config;
};
