import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import FCoverImage from '@/components/FCoverImage';

interface ResourceListProps {

}

function ResourceList({}: ResourceListProps) {
  return (<>
    <div className={styles.container3}>
      <div style={{ width: 920 }}>
        <div style={{ height: 35 }} />
        <div className={styles.nav}>
          <div className={styles.left}>批量发行资源</div>
          <div style={{ width: 10 }} />
          <div className={styles.other}>{'>'}</div>
          <div style={{ width: 7 }} />
          <div className={styles.other}>完善资源信息</div>
        </div>
        <div style={{ height: 35 }} />
        <div className={styles.header}>
          <Space size={10}>
            <FComponentsLib.FContentText text={'资源类型'} type={'additional2'} />
            <FComponentsLib.FContentText text={'图片/照片'} type={'highlight'} style={{ fontSize: 12 }} />
          </Space>

          <FComponentsLib.FContentText text={'共 3 个资源'} type={'additional2'} />

        </div>
        <div style={{ height: 40 }} />

        <div className={styles.resourceContainer}>
          <div className={styles.resourceOrder}>
            <FComponentsLib.FContentText text={'资源1'} type={'highlight'} style={{ fontSize: 12 }} />
            <FComponentsLib.FTextBtn style={{ fontSize: 12 }} type={'danger'}>
              <FComponentsLib.FIcons.FDelete style={{ fontSize: 12 }} />
              &nbsp;删除
            </FComponentsLib.FTextBtn>
          </div>
          <div style={{ height: 5 }} />
          <div className={styles.whiteCard}>
            <div className={styles.whiteCardLeft}>
              <FCoverImage src={''} width={240} style={{ display: 'block' }} />
              <div style={{ height: 10 }} />
              <FComponentsLib.FTextBtn type={'primary'}>上传封面</FComponentsLib.FTextBtn>
            </div>
            <div className={styles.whiteCardRight}>
              <div className={styles.whiteCardRightRow}>
                <FComponentsLib.FContentText text={'文件名'} type={'negative'} />
                <FComponentsLib.FContentText text={'WechatIMG25248.jpg'} type={'normal'} style={{ width: 540 }} />
              </div>
              <div style={{ height: 15 }} />
              <div className={styles.whiteCardRightRow}>
                <FComponentsLib.FContentText text={'授权标识'} type={'negative'} />
                <div style={{
                  height: 38,
                  borderRadius: 4,
                  border: '1px solid #D4D4D4',
                  width: 540,
                }}>

                </div>
              </div>
              <div style={{ height: 15 }} />

              <div className={styles.whiteCardRightRow}>
                <FComponentsLib.FContentText text={'资源标题'} type={'negative'} />
                <FComponentsLib.FInput.FSingleLine
                  lengthLimit={-1}
                  value={''}
                  style={{
                    height: 38,
                    borderRadius: 4,
                    border: '1px solid #D4D4D4',
                    width: 540,
                  }}
                />
              </div>
              <div style={{ height: 15 }} />

              <div className={styles.whiteCardRightRow}>
                <FComponentsLib.FContentText text={'资源标签'} type={'negative'} />
                <div style={{
                  minHeight: 38,
                  borderRadius: 4,
                  border: '1px solid #D4D4D4',
                  width: 540,
                }}>

                </div>
              </div>
              <div style={{ height: 15 }} />

              <div className={styles.whiteCardRightRow}>
                <FComponentsLib.FContentText text={'资源策略'} type={'negative'} />
                <div style={{ width: 540 }}>
                  <Space size={5}>
                    <FComponentsLib.FTextBtn onClick={() => {
                    }}><FComponentsLib.FIcons.FAdd /></FComponentsLib.FTextBtn>
                    <FComponentsLib.FTextBtn onClick={() => {
                    }}>添加策略</FComponentsLib.FTextBtn>
                  </Space>

                </div>
              </div>
            </div>
          </div>

          <div style={{ height: 10 }} />
          <Space size={10}>
            <FComponentsLib.FTextBtn
              onClick={() => {
              }}
            >更多设置</FComponentsLib.FTextBtn>
            <FComponentsLib.FContentText text={'可以为资源文件添加属性，或进行依赖资源的声明'} type={'negative'} />
          </Space>
        </div>

        <div style={{ height: 40 }} />

        <div className={styles.resourceContainer}>
          <div className={styles.resourceOrder}>
            <FComponentsLib.FContentText text={'资源1'} type={'highlight'} style={{ fontSize: 12 }} />
            <FComponentsLib.FTextBtn style={{ fontSize: 12 }} type={'danger'}>
              <FComponentsLib.FIcons.FDelete style={{ fontSize: 12 }} />
              &nbsp;删除
            </FComponentsLib.FTextBtn>
          </div>
          <div style={{ height: 5 }} />
          <div className={styles.whiteCard}>
            <div className={styles.whiteCardLeft}>
              <FCoverImage src={''} width={240} style={{ display: 'block' }} />
              <div style={{ height: 10 }} />
              <FComponentsLib.FTextBtn type={'primary'}>上传封面</FComponentsLib.FTextBtn>
            </div>
            <div className={styles.whiteCardRight}>
              <div className={styles.whiteCardRightRow}>
                <FComponentsLib.FContentText text={'文件名'} type={'negative'} />
                <FComponentsLib.FContentText text={'WechatIMG25248.jpg'} type={'normal'} style={{ width: 540 }} />
              </div>
              <div style={{ height: 15 }} />
              <div className={styles.whiteCardRightRow}>
                <FComponentsLib.FContentText text={'授权标识'} type={'negative'} />
                <div style={{
                  height: 38,
                  borderRadius: 4,
                  border: '1px solid #D4D4D4',
                  width: 540,
                }}>

                </div>
              </div>
              <div style={{ height: 15 }} />

              <div className={styles.whiteCardRightRow}>
                <FComponentsLib.FContentText text={'资源标题'} type={'negative'} />
                <FComponentsLib.FInput.FSingleLine
                  lengthLimit={-1}
                  value={''}
                  style={{
                    height: 38,
                    borderRadius: 4,
                    border: '1px solid #D4D4D4',
                    width: 540,
                  }}
                />
              </div>
              <div style={{ height: 15 }} />

              <div className={styles.whiteCardRightRow}>
                <FComponentsLib.FContentText text={'资源标签'} type={'negative'} />
                <div style={{
                  minHeight: 38,
                  borderRadius: 4,
                  border: '1px solid #D4D4D4',
                  width: 540,
                }}>

                </div>
              </div>
              <div style={{ height: 15 }} />

              <div className={styles.whiteCardRightRow}>
                <FComponentsLib.FContentText text={'资源策略'} type={'negative'} />
                <div style={{ width: 540 }}>
                  <Space size={5}>
                    <FComponentsLib.FTextBtn onClick={() => {
                    }}><FComponentsLib.FIcons.FAdd /></FComponentsLib.FTextBtn>
                    <FComponentsLib.FTextBtn onClick={() => {
                    }}>添加策略</FComponentsLib.FTextBtn>
                  </Space>

                </div>
              </div>
            </div>
          </div>

          <div style={{ height: 10 }} />
          <Space size={10}>
            <FComponentsLib.FTextBtn
              onClick={() => {
              }}
            >更多设置</FComponentsLib.FTextBtn>
            <FComponentsLib.FContentText text={'可以为资源文件添加属性，或进行依赖资源的声明'} type={'negative'} />
          </Space>
        </div>

        <div style={{ height: 40 }} />

        <div className={styles.resourceContainer}>
          <div className={styles.resourceOrder}>
            <FComponentsLib.FContentText text={'资源1'} type={'highlight'} style={{ fontSize: 12 }} />
            <FComponentsLib.FTextBtn style={{ fontSize: 12 }} type={'danger'}>
              <FComponentsLib.FIcons.FDelete style={{ fontSize: 12 }} />
              &nbsp;删除
            </FComponentsLib.FTextBtn>
          </div>
          <div style={{ height: 5 }} />
          <div className={styles.whiteCard}>
            <div className={styles.whiteCardLeft}>
              <FCoverImage src={''} width={240} style={{ display: 'block' }} />
              <div style={{ height: 10 }} />
              <FComponentsLib.FTextBtn type={'primary'}>上传封面</FComponentsLib.FTextBtn>
            </div>
            <div className={styles.whiteCardRight}>
              <div className={styles.whiteCardRightRow}>
                <FComponentsLib.FContentText text={'文件名'} type={'negative'} />
                <FComponentsLib.FContentText text={'WechatIMG25248.jpg'} type={'normal'} style={{ width: 540 }} />
              </div>
              <div style={{ height: 15 }} />
              <div className={styles.whiteCardRightRow}>
                <FComponentsLib.FContentText text={'授权标识'} type={'negative'} />
                <div style={{
                  height: 38,
                  borderRadius: 4,
                  border: '1px solid #D4D4D4',
                  width: 540,
                }}>

                </div>
              </div>
              <div style={{ height: 15 }} />

              <div className={styles.whiteCardRightRow}>
                <FComponentsLib.FContentText text={'资源标题'} type={'negative'} />
                <FComponentsLib.FInput.FSingleLine
                  lengthLimit={-1}
                  value={''}
                  style={{
                    height: 38,
                    borderRadius: 4,
                    border: '1px solid #D4D4D4',
                    width: 540,
                  }}
                />
              </div>
              <div style={{ height: 15 }} />

              <div className={styles.whiteCardRightRow}>
                <FComponentsLib.FContentText text={'资源标签'} type={'negative'} />
                <div style={{
                  minHeight: 38,
                  borderRadius: 4,
                  border: '1px solid #D4D4D4',
                  width: 540,
                }}>

                </div>
              </div>
              <div style={{ height: 15 }} />

              <div className={styles.whiteCardRightRow}>
                <FComponentsLib.FContentText text={'资源策略'} type={'negative'} />
                <div style={{ width: 540 }}>
                  <Space size={5}>
                    <FComponentsLib.FTextBtn onClick={() => {
                    }}><FComponentsLib.FIcons.FAdd /></FComponentsLib.FTextBtn>
                    <FComponentsLib.FTextBtn onClick={() => {
                    }}>添加策略</FComponentsLib.FTextBtn>
                  </Space>

                </div>
              </div>
            </div>
          </div>

          <div style={{ height: 10 }} />
          <Space size={10}>
            <FComponentsLib.FTextBtn
              onClick={() => {
              }}
            >更多设置</FComponentsLib.FTextBtn>
            <FComponentsLib.FContentText text={'可以为资源文件添加属性，或进行依赖资源的声明'} type={'negative'} />
          </Space>
        </div>
      </div>
    </div>

    <div className={styles.submit}>
      <div>
        <div>
          <FComponentsLib.FIcons.FInfo style={{ fontSize: 12 }} />
          &nbsp;已添加授权策略的资源将会自动上架
        </div>
        <Space size={20}>
          <FComponentsLib.FRectBtn>继续添加</FComponentsLib.FRectBtn>
          <FComponentsLib.FRectBtn>现在发行</FComponentsLib.FRectBtn>
        </Space>

      </div>
    </div>
  </>);
}

export default ResourceList;
