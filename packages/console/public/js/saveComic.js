self.addEventListener('message', async (e) => {
  const invalidImgIndex = imgList.findIndex(
    (item) => item.size > MAX_IMG_SIZE,
  );
  if (invalidImgIndex !== -1) {
    // 存在无效图片
    if (!saveFailTipShow && !auto) {
      setSaveFailTipShow(true);
      setTimeout(() => {
        setSaveFailTipShow(false);
      }, 2000);
    }
    return;
  }

  if (!resource.current.draftData) return;

  if (stopTimer.current) {
    clearTimeout(stopTimer.current);
    stopTimer.current = null;
  }
  if (!auto) {
    setSaveLoaderShow(true);
    setSaveProgress(0);
    setSaveStep(1);
    saveProgressList.current = [];
    saveTotalList.current = [];
  }
  setSaveTipType(1);
  const saveTime = Date.now();
  const list: ImgInOutput[] = [];
  const listInTool: any[] = [];
  const formDataList: FormData[] = [];
  const sha1Mapping: any = {};
  let currentIndex = 0; // 当前图片序号

  /** 上传图片 */
  imgList.forEach((img, index) => {
    const { name, base64, children, sha1 } = img;
    if (!children && sha1) return;
    const [, suffix] = separateFileName(name);
    const newImgName = `${String(index + 1).padStart(3, '0')}.${suffix}`;
    if (!children) {
      // 非切图
      const formDataIndex = Math.floor(
        currentIndex / MAX_REQUEST_BATCH_COUNT,
      );
      if (!formDataList[formDataIndex]) {
        formDataList[formDataIndex] = new FormData();
      }
      const file = base64ToFile(base64, newImgName);
      formDataList[formDataIndex].append('files', file);
      currentIndex++;
    } else {
      // 切图
      children.forEach((child, i) => {
        if (child.sha1) return;

        const formDataIndex = Math.floor(
          currentIndex / MAX_REQUEST_BATCH_COUNT,
        );
        if (!formDataList[formDataIndex]) {
          formDataList[formDataIndex] = new FormData();
        }
        const { base64 } = child;
        const newName = String(i + 1).padStart(2, '0');
        const newChildName = newImgName.replace(
          `.${suffix}`,
          `_${newName}.${suffix}`,
        );
        const file = base64ToFile(base64, newChildName);
        formDataList[formDataIndex].append('files', file);
        currentIndex++;
      });
    }
  });

  const requestArr: Promise<any>[] = [];
  formDataList.forEach((item, index) => {
    requestArr.push(uploadFile(item, index, 0));
  });
  const imgResArr = await Promise.all(requestArr);
  const err = imgResArr.findIndex((item) => item.errCode !== 0) !== -1;
  if (err) {
    if (!auto) {
      errorMessage('createversion_state_networkabnormal2');
      setSaveTipType(3);
      setSaveLoaderShow(false);
    }
    return;
  }

  /** 上传图片完成，整理数据 */
  const resList = imgResArr.map((item) => item.data).flat();
  imgList.forEach((img, index) => {
    const { name, size, children, sha1 = '', width, height } = img;
    const [, suffix] = separateFileName(name);
    const newImgName = `${String(index + 1).padStart(3, '0')}.${suffix}`;
    const imgInTool: any = { name, sha1, size, width, height };
    if (children) {
      // 切图，处理子集
      imgInTool.children = [];
      children.forEach((child, i) => {
        const newName = String(i + 1).padStart(2, '0');
        const newChildName = newImgName.replace(
          `.${suffix}`,
          `_${newName}.${suffix}`,
        );
        const childItem = {
          name: newChildName,
          size: child.size,
          width,
          height,
        };
        const childInTool = {
          name: child.name,
          sha1: child.sha1,
          size: child.size,
          width,
          height,
        };
        if (!child.sha1) {
          const res = resList.find((res) => res.filename === newChildName);
          child.sha1 = res.sha1;
          childInTool.sha1 = child.sha1;
        }
        sha1Mapping[newChildName] = child.sha1;
        list.push(childItem);
        imgInTool.children.push(childInTool);
      });
      listInTool.push(imgInTool);
    } else {
      // 非切图，处理自身
      if (sha1) {
        // 已上传过的图片，使用现有数据
        const item = { name: newImgName, size, width, height, sha1 };
        sha1Mapping[newImgName] = sha1;
        list.push(item);
        listInTool.push(imgInTool);
      } else {
        // 未上传过的图片，结合上传后得到的数据进行整理
        const res = resList.find((res) => res.filename === newImgName);
        const item = {
          name: newImgName,
          size,
          width,
          height,
          sha1: res.sha1,
        };
        list.push(item);
        imgInTool.sha1 = res.sha1;
        sha1Mapping[newImgName] = res.sha1;
        listInTool.push(imgInTool);
      }
    }
  });

  if (!auto) {
    setSaveStep(2);
    saveProgressList.current = [];
    saveTotalList.current = [];
  }

  /** 整理上传 json 和 xml */
  // 文件名称命名规则为{资源名称 最后保存时间}
  let name =
    resource.current.resourceData.resourceName.split('/')[1] +
    formatDate(saveTime, 'YYYYMMDDhhmm').substring(2);
  const jsonFormData = new FormData();
  const json = {
    name,
    mode: comicMode,
    list,
    config: comicConfig,
    custom: { list: listInTool },
  };
  const jsonFile = new File([JSON.stringify(json)], 'index.json', {
    type: 'application/json',
  });
  jsonFormData.append('files', jsonFile);
  if (comicConfig) {
    const xml = json2Xml(comicConfig);
    const xmlFile = new File([xml], 'ComicInfo.xml', {
      type: 'text/xml',
    });
    jsonFormData.append('files', xmlFile);
  }

  const res = await uploadFile(jsonFormData, 0, 25);
  if (res.errCode !== 0) {
    if (!auto) {
      errorMessage('createversion_state_networkabnormal2');
      setSaveTipType(3);
      setSaveLoaderShow(false);
    }
    return;
  }

  if (!auto) {
    setSaveStep(3);
  }

  /** 打包漫画文件 */
  const sha1Array: { fileName: string; sha1: string }[] = [];
  res.data.forEach((item: { filename: string; sha1: string }) => {
    const { filename, sha1 } = item;
    sha1Array.push({ fileName: filename, sha1 });
  });
  list.forEach((item) => {
    const { name } = item;
    const sha1Item = { fileName: name, sha1: sha1Mapping[name] };
    sha1Array.push(sha1Item);
  });
  const compressRes = await compressFiles(sha1Array);
  if (compressRes.errCode !== 0) {
    if (!auto) {
      errorMessage('createversion_state_networkabnormal2');
      setSaveTipType(3);
      setSaveLoaderShow(false);
    }
    return;
  }

  if (!auto) {
    setSaveStep(4);
  }

  /** 保存资源文件草稿 */
  resource.current.draftData.selectedFileInfo = {
    name,
    sha1: compressRes.data.sha1,
    from: `最近编辑时间 ${formatDate(saveTime)}`,
  };
  if (comicConfig) {
    const attrs = await settleAttrs();
    const { additionalProperties } = resource.current.draftData;
    attrs.forEach((item) => {
      const index = additionalProperties.findIndex(
        (prop: { key: string; value: string }) => prop.key === item.key,
      );
      if (index === -1) {
        // 不存在此属性
        resource.current.draftData.additionalProperties.push(item);
      } else {
        resource.current.draftData.additionalProperties[index].value =
          item.value;
      }
    });
  }
  const saveDraftRes = await saveDrafts({
    resourceId,
    draftData: resource.current.draftData,
  });
  if (saveDraftRes.errCode !== 0) {
    if (!auto) {
      errorMessage('createversion_state_networkabnormal2');
      setSaveTipType(3);
      setSaveLoaderShow(false);
    }
    return;
  }

  if (!auto) {
    setTimeout(() => {
      setSaveLoaderShow(false);
    }, 100);
  }
  setSaveTipType(2);
  setLastSaveTime(saveTime);
  setEdited(false);
});