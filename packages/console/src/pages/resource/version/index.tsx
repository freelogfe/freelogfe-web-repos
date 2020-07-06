import * as React from 'react';

import styles from './index.less';
import FInfoLayout from '@/pages/resource/layouts/FInfoLayout';
import {FContentText, FTitleText} from '@/components/FText';
import FEditorCard from '@/components/FEditorCard';
import {FTextButton} from '@/components/FButton';
import FInput from '@/components/FInput';
import {FNormalButton, FCircleButton} from '@/components/FButton';
import {Space} from 'antd';
import {CopyOutlined, LoadingOutlined} from '@ant-design/icons';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import FSelectObjectModal from '@/pages/resource/components/FSelectObjectModal';
import FObjectCard from '@/pages/resource/components/FObjectCard';
import FCustomProperties from '@/pages/resource/components/FCustomProperties';


export default function () {
  return (<FInfoLayout>
    <div style={{height: 36}}/>
    <FTitleText text={'创建版本'} type={'h2'}/>
    <div style={{height: 36}}/>
    <div className={styles.content}>
      <FEditorCard dot={true} title={'版本号'}>
        <FInput className={styles.versionInput}/>
      </FEditorCard>
      <FEditorCard dot={true} title={'对象'}>
        {
          true && (<div className={styles.object}>
            {/*<div className={styles.objectErrorInfo}>所选文件格式和资源类型不匹配，请重新选择。</div>*/}
            {/*<div className={styles.objectErrorInfo}>文件大小不能超过50MB，请重新选择。</div>*/}
            <div className={styles.objectErrorInfo}>该资源已存在，不能重复创建，请重新选择。&nbsp;&nbsp;<FTextButton theme="primary">查看</FTextButton></div>

            <Space size={30}>
              <FNormalButton theme={'weaken'}>从存储空间选择</FNormalButton>
              <FNormalButton theme={'weaken'}>本地上传</FNormalButton>
            </Space>


          </div>)
        }
        {false && (<div className={styles.checking}>校验中 <LoadingOutlined/></div>)}
        {false && (<FObjectCard/>)}
      </FEditorCard>

      <FEditorCard dot={false} title={'依赖'}>
        <Space size={80}>
          <Space size={10}>
            <FCircleButton theme="weaken"/>
            <FContentText text={'添加'}/>
          </Space>
          {true && <Space size={10}>
            <FCircleButton theme="weaken" icon={<CopyOutlined/>}/>
            <FContentText text={'从上一版本导入'}/>
          </Space>}

        </Space>
      </FEditorCard>
      <FEditorCard dot={false} title={'自定义属性'}>
        <Space size={80}>
          <Space size={10}>
            <FCircleButton theme="weaken"/>
            <FContentText text={'添加'}/>
          </Space>
          <Space size={10}>
            <FCircleButton theme="weaken" icon={<CopyOutlined/>}/>
            <FContentText text={'从上一版本导入'}/>
          </Space>
        </Space>
        <FCustomProperties/>
      </FEditorCard>
      <FEditorCard dot={false} title={'版本描述'}>
        <div className={styles.description}>
          <BraftEditor
            controls={['bold', 'italic', 'underline', 'media', 'blockquote', 'code', 'list-ul', 'list-ol', 'headings', 'text-color', 'link']}
            // value={editorState}
            // onChange={this.handleEditorChange}
            // onSave={this.submitContent}
          />
        </div>
      </FEditorCard>
    </div>

    <FSelectObjectModal/>
  </FInfoLayout>);
}
