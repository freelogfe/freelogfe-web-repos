import * as React from 'react';

interface InfoProps {
  name: string;
  type: string;
  version: string;
  className?: string;
  children?: any;
}

export default function Info(props: InfoProps) {
  return (
    <div className='pt-12 pb-15 w-100x'>
      <div
        className='text-ellipsis mb-6'
        style={{
          height: '20px',
          fontSize: '14px',
          fontWeight: 400,
          color: '#222222',
          lineHeight: '20px',
        }}
      >
        {props.name}
      </div>
      <div className='flex-row space-between'>
        <div
          style={{
            fontSize: '13px',
            fontWeight: 400,
            color: '#999999',
            lineHeight: '18px',
          }}
        >
          {props.type}
        </div>
        <div
          style={{
            fontSize: '13px',
            fontWeight: 400,
            color: '#999999',
            lineHeight: '18px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            maxWidth: 120,
          }}
        >
          最新版本 &nbsp;{props.version}
        </div>
      </div>
    </div>
  );
}
