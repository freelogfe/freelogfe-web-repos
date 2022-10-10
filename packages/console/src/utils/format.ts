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
    const time = value / 1000;
    const h = parseInt(String(time / 3600));
    const minute = parseInt(String(time / 60 % 60));
    const second = Math.ceil(time % 60);

    const hours = h < 10 ? '0' + h : h;
    const formatSecond = second > 59 ? 59 : second;
    return `${hours > 0 ? `${hours}:` : ''}${minute < 10 ? '0' + minute : minute}:${formatSecond < 10 ? '0' + formatSecond : formatSecond}`;
  },
  frameRate(value: number): string {
    return value + 'fps';
  },
  bitRate(value: number): string {
    return value + 'kbps';
  },
};
