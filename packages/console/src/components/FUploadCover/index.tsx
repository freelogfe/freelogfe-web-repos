import * as React from 'react';
import styles from './index.less';
import { RcFile, UploadChangeParam } from 'antd/lib/upload/interface';
import { Upload } from 'antd';
import FCropperModal from '@/components/FUploadCover/FCropperModal';

interface FUploadCoverProps {
  children: React.ReactNode;

  onUploadSuccess?(url: string): void;

  onError?(error: string): void;
}

function FUploadCover({ children, onUploadSuccess, onError }: FUploadCoverProps) {
  const [image, setImage] = React.useState('');
  return (<div className={styles.styles}>
    <Upload
      // accept={'image/gif,image/png,.jpg'}
      accept={'.gif,.png,.jpg,.jpeg,.jpe'}
      beforeUpload={(file: RcFile, FileList: RcFile[]) => {
        console.log(file, 'file20934u23');
        // setImage(file)
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result as any);
        };
        reader.readAsDataURL(file);
        return false;
        // upload(file);
        // return false;
      }}
      onChange={(info: UploadChangeParam) => {
        // console.log(info, '########');
      }}
      multiple={false}
      showUploadList={false}
    >
      {children}
    </Upload>
    {console.log(image, 'image9320iojsfdlkf')}
    <FCropperModal imgSrc={image}/>
  </div>);
}

export default FUploadCover;
