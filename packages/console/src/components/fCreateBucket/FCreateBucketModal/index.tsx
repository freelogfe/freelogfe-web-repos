import * as React from 'react';
import styles from './index.less';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import FInput from '@/components/FInput';
import FModal from '@/components/FModal';
import fMessage from '@/components/fMessage';

interface FCreateBucketModalProps {
  onOk?(value: string): void;

  onClose?(): void;
}

function FCreateBucketModal({ onOk, onClose }: FCreateBucketModalProps) {

  const [visible, set_visible] = React.useState<boolean>(true);
  const [newBucketName, set_newBucketName] = React.useState<string>('');
  const [newBucketNameError, set_newBucketNameError] = React.useState<string>('');

  return (<FModal
    title={null}
    open={visible}
    width={640}
    okButtonProps={{
      disabled: newBucketName === '' || newBucketNameError !== '',
    }}
    cancelText={FI18n.i18nNext.t('btn_cancel')}
    onOk={async () => {
      const params: Parameters<typeof FServiceAPI.Storage.createBucket>[0] = {
        bucketName: newBucketName,
      };
      const { ret, errCode, msg } = await FServiceAPI.Storage.createBucket(params);

      if (ret !== 0 || errCode !== 0) {
        fMessage(msg, 'error');
        return;
      }
      onOk && onOk(newBucketName);
      set_visible(false);
    }}
    onCancel={() => {
      set_visible(false);
    }}
    afterClose={() => {
      console.log('afterClose FFSDFAsdfsdf');
      onClose && onClose();
    }}
  >
    <div style={{ padding: 20 }}>
      <FComponentsLib.FTitleText text={FI18n.i18nNext.t('create_bucket_popup_title')} type='h2' />
    </div>

    <div className={styles.FModalBody}>
      <div style={{ height: 50 }} />
      <div className={styles.tip}>
        {
          FI18n.i18nNext.t('create_bucket_popup_msg')
            .split('\n')
            .map((s, i) => {
              return (<div key={i}>{s}</div>);
            })
        }
      </div>
      <div style={{ height: 10 }} />
      <FInput
        value={newBucketName}
        placeholder={FI18n.i18nNext.t('enter_bucket_name')}
        onChange={(e) => {
          set_newBucketName(e.target.value);
          set_newBucketNameError('');
        }}
        onBlur={async () => {

          if (!FUtil.Regexp.BUCKET_NAME.test(newBucketName)) {
            set_newBucketNameError(FI18n.i18nNext.t('naming_convention_bucket_name'));
            return;
          }

          const params: Parameters<typeof FServiceAPI.Storage.bucketIsExist>[0] = {
            bucketName: newBucketName,
          };
          const { data } = await FServiceAPI.Storage.bucketIsExist(params);
          // console.log(data, '@@@@@Dddddddddddd====');
          if (data) {
            set_newBucketNameError(FI18n.i18nNext.t('bucket_createbucket_err_notavailable'));
            return;
          }

          set_newBucketNameError('');
        }}
        wrapClassName={styles.wrapClassName}
        className={styles.FInput}
      />
      <div style={{ height: 10 }} />
      <div className={styles.errorTip}>
        {
          newBucketNameError ? (<div>
            {
              // FI18n.i18nNext.t('naming_convention_bucket_name')
              newBucketNameError
                .split('\n')
                .map((s, i) => {
                  return (<div key={i}>{s}</div>);
                })
            }

          </div>) : ''
        }
      </div>
      <div style={{ height: 50 }} />
    </div>
  </FModal>);
}

export default FCreateBucketModal;
