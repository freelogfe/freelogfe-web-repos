import * as React from 'react';
import styles from './index.less';
import {FTitleText, FContentText} from '@/components/FText';
import {CopyOutlined, DownloadOutlined} from '@ant-design/icons';
import {FTextButton, FCircleButton} from '@/components/FButton';
import {Space, Divider} from 'antd';
import FEditorCard from '@/components/FEditorCard';
import FSelect from '@/components/FSelect';

interface DetailsProps {

}

function Details({}: DetailsProps) {
  return (<div>
    <div style={{height: 10}}/>
    <Space size={15}>
      <FTitleText text={'bucket-001/2309737.png'} type="h3"/>
      <FTextButton theme="primary"><CopyOutlined/></FTextButton>
      <FTextButton theme="primary"><DownloadOutlined/></FTextButton>
    </Space>
    <div style={{height: 17}}/>
    <div className={styles.size}>3 M</div>
    <div style={{height: 25}}/>
    <FEditorCard title={'资源类型'}>
      <FSelect
        className={styles.FSelect}
        value={'image'}
        dataSource={[{value: 'image', title: 'image'}]}
      />
    </FEditorCard>
    <FEditorCard title={'依赖'}>
      <Space size={10}>
        <FCircleButton theme="weaken"/>
        <FContentText text={'添加'}/>
      </Space>
      <div style={{height: 30}}/>
      <FContentText text={'添加'}/>
      <div className={styles.resources}>
        <div className={styles.resource}>
          <div className={styles.resourceLeft}>
            <div className={styles.resourceTitle}>
              <FContentText
                singleRow={true}
                text={'stefan/image2image2image2image2image2'}
                className={styles.resourceName}
              />
              <span className={styles.notOnline}>未上线</span>
            </div>
            <div style={{height: 9}}/>
            <div className={styles.resourceInfo}>
              <FContentText type="additional2">image</FContentText>
              <Divider type="vertical"/>
              <FContentText type="additional2">版本范围：xxx</FContentText>
              <Divider type="vertical"/>
              <FContentText type="additional2">3个基础上抛</FContentText>
            </div>
          </div>
        </div>
      </div>
    </FEditorCard>
    <FEditorCard title={'自定义属性'}>
      <Space size={10}>
        <FCircleButton theme="weaken"/>
        <FContentText text={'添加'}/>
      </Space>
    </FEditorCard>
  </div>);
}

export default Details;
