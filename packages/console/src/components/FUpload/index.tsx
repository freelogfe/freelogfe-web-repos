import * as React from 'react';
import {Upload} from 'antd';
import {UploadProps} from 'antd/lib/upload';

interface FUploadProps extends UploadProps {
  children?: React.ReactNode;
}

function FUpload({children, ...props}: FUploadProps) {
  return <Upload {...props}>{children}</Upload>
}

export default FUpload;
