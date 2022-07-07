import * as Tool from '../../utils/tools';
import * as Storage from '../storages';

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

export async function getFilesSha1Info({sha1}: GetFileInfosBySha1Params, cdPartially: (s: any[]) => void = () => undefined): Promise<FileInfo[]> {
  if (sha1.length === 0) {
    return [];
  }

  let delay: number = 500;

  let needHandleSha1: string[] = [...sha1];

  let allData: FileInfo[] = [];

  while (true) {
    // console.log(needHandleSha1.join(','), 'needHandleSha1.join()90ojlskdfjsdlk')
    const {data} = await Storage.filesListInfo({
      sha1: needHandleSha1.join(','),
    });
    needHandleSha1 = data
      .filter((d: any) => {
        return d.metaAnalyzeStatus && d.metaAnalyzeStatus === 1;
      })
      .map((d: any) => {
        return d.sha1;
      });
    const finishedInfo: FileInfo[] = data
      .filter((d: any) => {
        return !d.metaAnalyzeStatus || d.metaAnalyzeStatus !== 1;
      })
      .map((d: any) => {
        let state: 'success' | 'fail' | 'nonentity' = 'fail';
        if (!d.metaAnalyzeStatus) {
          state = 'nonentity';
        } else if (d.metaAnalyzeStatus === 2) {
          state = 'success';
        }
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
    await Tool.promiseSleep(delay);
    delay += 500;
  }
  return allData;
}
