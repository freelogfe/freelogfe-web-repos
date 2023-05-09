import * as React from 'react';
import styles from './index.less';
import { Space, Tooltip } from 'antd';
import * as AHooks from 'ahooks';

interface FNoviceGuiderProps {
  windowInfo: {
    top: number;
    left: number;
    width: number;
    height: number;
  };

  title: string;
  step: number;
  total: number;

  onClickNext?(): void;

  onClickSkip?(): void;
}

function FNoviceGuider({ windowInfo, title, step, total, onClickNext, onClickSkip }: FNoviceGuiderProps) {
  const ref = React.useRef<any>();

  AHooks.useMount(() => {
    ref.current.addEventListener('mousewheel', (e: Event) => {
      e.stopPropagation();
      e.preventDefault();
    });
  });

  return (<div
      ref={ref}
      className={styles.overlay}
    >
      <Tooltip
        visible
        placement='bottomRight'
        title={<div>
          <div style={{ fontWeight: 600 }}>{title}</div>
          <div style={{ height: 30 }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {
              step >= total
                ? <div />
                : (<div
                  style={{
                    cursor: 'pointer',
                    opacity: .4,
                  }}
                  onClick={() => {
                    onClickSkip && onClickSkip();
                  }}
                >跳过
                </div>)
            }

            <Space size={15}>
              <div style={{ opacity: .4 }}>{step}/{total}</div>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 4,
                  padding: '6px 15px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  color: '#2784FF',
                }}
                onClick={() => {

                  onClickNext && onClickNext();
                }}
              >{step >= total ? '完成' : '下一步'}
              </div>
            </Space>
          </div>
        </div>}
        color='#FFFFFF linear-gradient(135deg, #4568DC 0%, #B06AB3 100%)'
        overlayInnerStyle={{
          padding: '12px 20px',
          borderRadius: 8,
          // maxWidth: 450,
          boxShadow: '0 0 10px 0 rgba(255,255,255,0.2)'
        }}
        // style={{ boxShadow: '0px 0px 10px 0px rgba(255,255,255,0.2)' }}
        getPopupContainer={() => ref.current}
        overlayStyle={{
          zIndex: 100000,
          maxWidth: 500,
        }}
      >
        <div
          className={styles.helperLayer}
          style={{
            top: windowInfo.top,
            left: windowInfo.left,
            width: windowInfo.width,
            height: windowInfo.height,
          }}
        />
      </Tooltip>
    </div>
  );
}

export default FNoviceGuider;
