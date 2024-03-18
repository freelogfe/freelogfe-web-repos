import { FUtil, FServiceAPI, FI18n } from '@freelog/tools-lib';
import { ResourceVersionCreatorPageModelState } from '@/models/resourceVersionCreatorPage';

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

    if (ret !== 0 || errCode !== 0) {
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
  }
  return {
    error: '',
    result: allData,
  };
}

interface HandleData_By_Sha1_And_ResourceTypeCode_And_InheritData_Params {
  sha1: string;
  // resourceID: string;
  resourceTypeCode: string;
  inheritData: {
    additionalProperties: {
      key: string;
      name: string;
      value: string;
      description: string;
    }[];
    customProperties: {
      key: string;
      name: string;
      value: string;
      description: string;
    }[];
    customConfigurations: {
      key: string;
      name: string;
      description: string;
      type: 'input' | 'select';
      input: string;
      select: string[];
    }[];
  };
}

interface HandleData_By_Sha1_And_ResourceTypeCode_And_InheritData_Return {
  state: 'failed' | 'success';
  failedMsg: string;
  rawProperties: {
    key: string;
    name: string;
    value: string;
    description: string;
  }[];
  additionalProperties: {
    key: string;
    name: string;
    value: string;
    description: string;
  }[];
  customProperties: {
    key: string;
    name: string;
    value: string;
    description: string;
  }[];
  customConfigurations: {
    key: string;
    name: string;
    description: string;
    type: 'input' | 'select';
    input: string;
    select: string[];
  }[];
}

export async function handleData_By_Sha1_And_ResourceTypeCode_And_InheritData({
                                                                                sha1,
                                                                                resourceTypeCode,
                                                                                inheritData,
                                                                              }: HandleData_By_Sha1_And_ResourceTypeCode_And_InheritData_Params): Promise<HandleData_By_Sha1_And_ResourceTypeCode_And_InheritData_Return> {
  const params0: Parameters<typeof getFilesSha1Info>[0] = {
    sha1: [sha1],
    resourceTypeCode: resourceTypeCode,
  };
  const {
    result,
    error,
  }: Awaited<ReturnType<typeof getFilesSha1Info>> = await getFilesSha1Info(params0);

  if (error !== '') {
    return {
      state: 'failed',
      failedMsg: error,
      rawProperties: [],
      additionalProperties: [],
      customProperties: [],
      customConfigurations: [],
    };
  }

  if (result[0].state === 'fail') {
    return {
      state: 'failed',
      failedMsg: '文件解析失败',
      rawProperties: [],
      additionalProperties: [],
      customProperties: [],
      customConfigurations: [],
    };
  }

  if (result[0].state === 'success') {

    let additionalProperties_availableData = [
      ...inheritData.additionalProperties,
      ...inheritData.customProperties,
    ];

    const rawProperties: HandleData_By_Sha1_And_ResourceTypeCode_And_InheritData_Return['rawProperties'] = result[0].info
      .filter((i) => {
        return i.insertMode === 1;
      })
      .map<ResourceVersionCreatorPageModelState['rawProperties'][number]>((i) => {
        return {
          key: i.key,
          name: i.name,
          value: i.valueDisplay,
          description: i.remark,
        };
      });
    const rawProperties_allKeys: string[] = rawProperties.map((i) => {
      return i.key;
    });
    const rawProperties_allNames: string[] = rawProperties.map((i) => {
      return i.name;
    });

    let additionalProperties: HandleData_By_Sha1_And_ResourceTypeCode_And_InheritData_Return['additionalProperties'] = result[0].info
      .filter((i) => {
        return i.insertMode === 2;
      })
      .map<ResourceVersionCreatorPageModelState['additionalProperties'][number]>((i) => {
        return {
          key: i.key,
          name: i.name,
          value: i.valueDisplay,
          description: i.remark,
        };
      })
      .filter((i) => {
        return !rawProperties_allKeys.includes(i.key) && !rawProperties_allNames.includes(i.name);
      })
      .map((i) => {
        const item = additionalProperties_availableData.find((ap) => {
          return ap.key === i.key;
        });
        additionalProperties_availableData = additionalProperties_availableData.filter((ad) => {
          return ad.key !== i.key;
        });
        return {
          key: i.key,
          name: i.name,
          value: item?.value || i.value,
          description: i.description,
        };
      })
      .map((i) => {
        const item = additionalProperties_availableData.find((ap) => {
          return ap.name === i.name;
        });
        additionalProperties_availableData = additionalProperties_availableData.filter((ad) => {
          return ad.name !== i.name;
        });
        return {
          key: i.key,
          name: i.name,
          value: item?.value || i.value,
          description: i.description,
        };
      });
    const additionalProperties_allKeys: string[] = additionalProperties.map((i) => {
      return i.key;
    });
    const additionalProperties_allNames: string[] = additionalProperties.map((i) => {
      return i.name;
    });

    const customProperties: HandleData_By_Sha1_And_ResourceTypeCode_And_InheritData_Return['customProperties'] = inheritData.customProperties
      .filter((cp) => {
        return !rawProperties_allKeys.includes(cp.key) && !rawProperties_allNames.includes(cp.name)
          && !additionalProperties_allKeys.includes(cp.key) && !additionalProperties_allNames.includes(cp.name);
      });

    const customProperties_allKeys: string[] = customProperties.map((i) => {
      return i.key;
    });
    const customProperties_allNames: string[] = customProperties.map((i) => {
      return i.name;
    });

    const customConfigurations: HandleData_By_Sha1_And_ResourceTypeCode_And_InheritData_Return['customConfigurations'] = inheritData.customConfigurations
      .filter((cc) => {
        return !rawProperties_allKeys.includes(cc.key) && !rawProperties_allNames.includes(cc.name)
          && !additionalProperties_allKeys.includes(cc.key) && !additionalProperties_allNames.includes(cc.name)
          && !customProperties_allKeys.includes(cc.key) && !customProperties_allNames.includes(cc.name);
      });

    return {
      state: 'success',
      failedMsg: '',
      rawProperties: rawProperties,
      additionalProperties: additionalProperties,
      customProperties: customProperties,
      customConfigurations: customConfigurations,
    };
  }

  return {
    state: 'failed',
    failedMsg: '未知原因',
    rawProperties: [],
    additionalProperties: [],
    customProperties: [],
    customConfigurations: [],
  };
}
