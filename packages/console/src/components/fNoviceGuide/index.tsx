import * as React from 'react';
import styles from './index.less';
import * as ReactDOM from 'react-dom/client';
// import FHotspotTooltip from '../../../../@freelog/components-lib/src/FHotspotTooltip';
import { Space, Tooltip } from 'antd';
import * as AHooks from 'ahooks';

interface fNoviceGuideProps {

}

function fNoviceGuide({}: fNoviceGuideProps): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    const root = ReactDOM.createRoot(document.getElementById('novice-guide-root') as HTMLDivElement);
    return root.render(<NoviceGuide
      windowInfo={{
        top: 100,
        left: 200,
        width: 400,
        height: 100,
      }}
      title={'您可以通过此菜单快速创建资源和节点您可以通过此菜单快速创建资源和节点您可以通过此菜单快速'}
      step={5}
      total={5}
      onClickNext={() => {
        resolve(true);
        root.unmount();
      }}
      onClickSkip={() => {
        resolve(false);
        root.unmount();
      }}
    />);
  });
}

export default fNoviceGuide;


interface NoviceGuideProps {
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

function NoviceGuide({ windowInfo, title, step, total, onClickNext, onClickSkip }: NoviceGuideProps) {
  const ref = React.useRef<any>();

  AHooks.useMount(() => {
    // ref.current.add
    setTimeout(() => {
      ref.current.addEventListener('mousewheel', (e) => {
        // console.log('mousewheelsdfoksd;lk;');
        e.stopPropagation();
        e.preventDefault();
      });
    }, 300);

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
                    onClickNext && onClickNext();
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
                  onClickSkip && onClickSkip();
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
        }}
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

