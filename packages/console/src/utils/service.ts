import { FUtil, FServiceAPI, FI18n } from '@freelog/tools-lib';

interface FileInfo {
  sha1: string;
  state: 'success' | 'fail' | 'nonentity';
  info: {
    [key: string]: any;
  }
}

interface GetFileInfosBySha1Params {
  sha1: string[];
}

export async function getFilesSha1Info({sha1}: GetFileInfosBySha1Params, cdPartially: (s: any[]) => void = () => undefined): Promise<{
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
    const {ret, errCode, data, msg}: any = await FServiceAPI.Storage.filesListInfo({
      sha1: needHandleSha1.join(','),
    });

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
      .filter((d: any) => {
        return d.metaAnalyzeStatus === 0 || d.metaAnalyzeStatus === 1;
      })
      .map((d: any) => {
        return d.sha1;
      });
    const finishedInfo: FileInfo[] = data
      .filter((d: any) => {
        return d.metaAnalyzeStatus !== 0 && d.metaAnalyzeStatus !== 1;
      })
      .map((d: any) => {
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
          info: d,
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
