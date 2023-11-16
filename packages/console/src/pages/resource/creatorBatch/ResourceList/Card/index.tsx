import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import FCoverImage from '@/components/FCoverImage';
import FResourceNameInput from '@/components/FResourceNameInput';
import FResourceLabelEditor2 from '@/components/FResourceLabelEditor2';
import { Space } from 'antd';

interface CardProps {
  order: number;
  info: {
    fileUID: string;
    fileName: string;
    sha1: string;
    cover: string;
    resourceName: string;
    resourceTitle: string;
    resourceLabels: string[];
    resourcePolicies: {
      title: string;
      text: string;
    }[];
    showMore: boolean;
    additionalProperties: {
      key: string;
      value: string;
    }[];
    customProperties: {
      key: string;
      name: string;
      value: string;
      description: string;
    }[];
    customConfigurations: {
      key: string;
      name: string;
      description: string;
      type: 'input' | 'select';
      input: string;
      select: string[];
    }[];
    directDependencies: {
      id: string;
      name: string;
      type: 'resource' | 'object';
      versionRange?: string;
    }[];
    baseUpcastResources: {
      resourceID: string;
      resourceName: string;
    }[];
  };
}

function Card({order, info}: CardProps) {
  return (<div className={styles.resourceContainer}>
    <div className={styles.resourceOrder}>
      <FComponentsLib.FContentText text={`资源${order}`} type={'highlight'} style={{ fontSize: 12 }} />
      <FComponentsLib.FTextBtn style={{ fontSize: 12 }} type={'danger'}>
        <FComponentsLib.FIcons.FDelete style={{ fontSize: 12 }} />
        &nbsp;删除
      </FComponentsLib.FTextBtn>
    </div>
    <div style={{ height: 5 }} />
    <div className={styles.whiteCard}>
      <div className={styles.whiteCardLeft}>
        <FCoverImage src={info.cover} width={240} style={{ display: 'block' }} />
        <div style={{ height: 10 }} />
        <FComponentsLib.FTextBtn type={'primary'}>上传封面</FComponentsLib.FTextBtn>
      </div>
      <div className={styles.whiteCardRight}>
        <div className={styles.whiteCardRightRow}>
          <FComponentsLib.FContentText text={'文件名'} type={'negative'} />
          <FComponentsLib.FContentText text={info.fileName} type={'normal'} style={{ width: 540 }} />
        </div>
        <div style={{ height: 15 }} />
        <div className={styles.whiteCardRightRow}>
          <FComponentsLib.FContentText text={'授权标识'} type={'negative'} />
          <FResourceNameInput value={info.resourceName} />
        </div>
        <div style={{ height: 15 }} />

        <div className={styles.whiteCardRightRow}>
          <FComponentsLib.FContentText text={'资源标题'} type={'negative'} />
          <FComponentsLib.FInput.FSingleLine
            lengthLimit={-1}
            value={info.resourceTitle}
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
          <FResourceLabelEditor2 value={info.resourceLabels} />
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
  </div>);
}

export default Card;
