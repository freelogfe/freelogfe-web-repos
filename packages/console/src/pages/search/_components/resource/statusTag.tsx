import * as React from 'react';

interface StatusTagProps {
  status: number;
  className?: string;
  children?: any;
}
export default function StatusTag(props: StatusTagProps) {
  return (
    <div
      className="px-5 py-3"
      style={{
        width: '46px',
        height: '23px',
        background: props.status ? '#FBF5EA' : '#E5F5EE',
        color: props.status ? '#DCA32D' : '#44C28C',
        borderRadius: '4px',
      }}
    >
      {props.status ? '已下线' : '已上线'}
    </div>
  );
}
