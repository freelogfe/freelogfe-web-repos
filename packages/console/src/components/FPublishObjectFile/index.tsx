import * as React from 'react';
import styles from './index.less';

interface FPublishObjectFileProps {
  fileInfo: {
    name: string;
    sha1: string;
    from: string;
  };

  onSucceed_UploadFile?(file: {
    fileName: string;
    sha1: string;
  }): void;

  onSucceed_ImportObject?(obj: {
    objID: string;
    objName: string;
    sha1: string;
  }): void;
}

function FPublishObjectFile({}: FPublishObjectFileProps) {
  return (<div></div>);
}

export default FPublishObjectFile;
