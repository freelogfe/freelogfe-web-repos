import { FUtil, FServiceAPI, FI18n } from '@freelog/tools-lib';

interface FileInfo {
  sha1: string;
  state: 'success' | 'fail' | 'nonentity';
  fileSize: number;
  info: {
    key: string;
    name: string;
    remark: string;
    value: string | number;
    valueDisplay: string;
    valueUnit: string;
    insertMode: 1 | 2;
  }[];
}

interface GetFileInfosBySha1Params {
  sha1: string[];
  resourceTypeCode: string;
}

export async function getFilesSha1Info({
                                         sha1,
                                         resourceTypeCode,
                                       }: GetFileInfosBySha1Params,
                                       cdPartially: (s: any[]) => void = () => undefined): Promise<{
  error: string;
  result: FileInfo[],
}> {
  if (sha1.length === 0) {
    return {
      error: '',
      result: [],
    };
  }

  let delay: number = 500;

  let needHandleSha1: string[] = [...sha1];

  let allData: FileInfo[] = [];

  while (true) {
    // console.log(needHandleSha1.join(','), 'needHandleSha1.join()90ojlskdfjsdlk')
    const { ret, errCode, data, msg }: {
      ret: number,
      errCode: number,
      msg: string;
      data: {
        sha1: string;
        fileSize: number;
        metaAnalyzeStatus: number;
        metaInfoArray: FileInfo['info'];
      }[];
    } = await FServiceAPI.Storage.filesListInfo({
      sha1: needHandleSha1.join(','),
      resourceTypeCode: resourceTypeCode,
    });

    // console.log(data, 'dataiosdjflksjdflk;jsdlkfjlksdjflksdjlkfj');

    if (ret !== 0 || errCode !== 0) {
      // console.log({
      //   ret, errCode, data, msg
      // }, '09iowksdjaklfjs;oalijflskdjflsdkjflkj');
      return {
        error: msg,
        result: allData,
      };
    }

    needHandleSha1 = data
      .filter((d) => {
        return d.metaAnalyzeStatus === 0 || d.metaAnalyzeStatus === 1;
      })
      .map((d) => {
        return d.sha1;
      });
    const finishedInfo: FileInfo[] = data
      .filter((d) => {
        return d.metaAnalyzeStatus !== 0 && d.metaAnalyzeStatus !== 1;
      })
      .map((d) => {
        let state: 'success' | 'fail' | 'nonentity' = 'fail';
        if (!d.metaAnalyzeStatus) {
          state = 'nonentity';
        } else if (d.metaAnalyzeStatus === 2) {
          state = 'success';
        } else if (d.metaAnalyzeStatus === 3) {
          state = 'fail';
        }
        // console.log(d, '90wieojiksdjf;lkasdjf;lksdjflksjdflkjsdlfkjsdlkj');
        return {
          sha1: d.sha1,
          state,
          fileSize: d.fileSize,
          info: d.metaInfoArray,
        };
      });
    cdPartially && cdPartially(finishedInfo);
    allData = [
      ...allData,
      ...finishedInfo,
    ];

    if (needHandleSha1.length === 0) {
      break;
    }
    await FUtil.Tool.promiseSleep(delay);
    // delay += 500;
  }
  return {
    error: '',
    result: allData,
  };
}
