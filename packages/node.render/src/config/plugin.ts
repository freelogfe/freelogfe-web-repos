import { EggPlugin } from 'egg';
export default {
  static: true, // default is true
  cors:{
    enable: true,
    package: 'egg-cors',
  }
} as EggPlugin;
