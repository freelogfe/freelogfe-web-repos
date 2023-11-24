import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { OnChange_FilterInput_Action, StorageHomePageModelState } from '@/models/storageHomePage';
import { ConnectState } from '@/models/connect';
import { FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import fReadLocalFiles from '@/components/fReadLocalFiles';
import { getStorageUploadTasksPanel } from '@/components/FStorageUploadTasksPanel';
import * as AHooks from 'ahooks';

interface HeaderProps {
  dispatch: Dispatch;
  storageHomePage: StorageHomePageModelState;
}

function Header({ dispatch, storageHomePage }: HeaderProps) {

  const [filterInput, setFilterInput] = React.useState<string>('');

  AHooks.useDebounceEffect(() => {
    dispatch<OnChange_FilterInput_Action>({
      type: 'storageHomePage/onChange_FilterInput',
      payload: {
        value: filterInput,
      },
    });
  }, [filterInput], {
    wait: 300,
  });

  const bucket = storageHomePage.bucketList?.find((b) => b.bucketName === storageHomePage.activatedBucket);

  if (!bucket) {
    return null;
  }

  const isUserDataBucket = storageHomePage.activatedBucket === '.UserNodeData';

  return (<div className={styles.header}>
    <div className={styles.headerLeft}>
      <FComponentsLib.FTitleText type='h1' text={bucket.bucketName} />
      <div style={{ height: 5 }} />
      <Space size={40}>
        <div>{FI18n.i18nNext.t('created_time')} {bucket.createDate}</div>
        <div>{FI18n.i18nNext.t('object_quantity')} {bucket.totalFileQuantity}</div>
      </Space>
    </div>
    {
      !isUserDataBucket && (storageHomePage.total > 0 || storageHomePage.filterInput !== '') && (<Space size={30}>
        <FComponentsLib.FInput.FSearch
          value={filterInput}
          style={{ width: 300 }}
          onChange={(value) => {
            setFilterInput(value);
          }}
          placeholder={FI18n.i18nNext.t('storage_search_objects_hint')}
        />
        <FComponentsLib.FRectBtn
          onClick={async () => {
            // console.time('fReadLocalFiles');
            const files = await fReadLocalFiles({
              multiple: true,
            });

            if (!files) {
              return;
            }

            (await getStorageUploadTasksPanel()).addTask(files);
          }}
          type='primary'
        >{FI18n.i18nNext.t('upload_object')}</FComponentsLib.FRectBtn>
      </Space>)
    }
  </div>);
}

export default connect(({ storageHomePage }: ConnectState) => ({
  storageHomePage: storageHomePage,
}))(Header);
