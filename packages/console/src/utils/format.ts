import { FUtil } from '@freelog/tools-lib';

export const fileAttrUnits: any = {
  fileSize(value: number): string {
    return FUtil.Format.humanizeSize(value);
  },
  imageWidth(value: number): string {
    return value + 'px';
  },
  imageHeight(value: number): string {
    return value + 'px';
  },
  duration(value: number): string {
    const time = Math.ceil(value / 1000);
    const h = Math.floor(time / 3600);
    const minute = Math.floor(time / 60 % 60);
    const second = Math.floor(time % 60);

    const hours = h < 10 ? '0' + h : h;
    return `${hours > 0 ? `${hours}:` : ''}${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second : second}`;
  },
  frameRate(value: number): string {
    return value + 'fps';
  },
  bitRate(value: number): string {
    return value + 'kbps';
  },
};
