import * as React from 'react';
import styles from './index.less';
import {FTitleText, FContentText} from '@/components/FText';
import {CopyOutlined, DownloadOutlined, ArrowUpOutlined} from '@ant-design/icons';
import {FTextButton, FCircleButton} from '@/components/FButton';
import {Space, Divider, Popover, Drawer} from 'antd';
import FEditorCard from '@/components/FEditorCard';
import FSelect from '@/components/FSelect';
import {ImportPreVersionAction} from "@/models/resourceVersionCreatorPage";
import FCustomProperties from "@/components/FCustomProperties";
import SelectDeps from "@/pages/storage/Content/SelectDeps";


interface DetailsProps {

}

function Details({}: DetailsProps) {
  // const divContainer = React.useRef<HTMLDivElement>(null);
  const [depInfoVisible, setDepInfoVisible] = React.useState<boolean>(true);

  return (<div className={styles.divContainer}>
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
        <FCircleButton onClick={() => setDepInfoVisible(true)} theme="weaken"/>
        <FContentText text={'添加'}/>
      </Space>
      <DepsCards/>
      <DepsCards/>
    </FEditorCard>
    <FEditorCard title={'自定义属性'}>
      <Space size={10}>
        <FCircleButton theme="weaken"/>
        <FContentText text={'添加'}/>
      </Space>
      <FCustomProperties
        noHeaderButton={true}
        colNum={2}
        stubborn={false}
        // dataSource={version.properties}
        dataSource={[
          //   {
          //   key: '',
          //   value: '',
          //   description: '',
          //   allowCustom: true,
          //   custom: 'select',
          //   customOption: ''
          // }
        ]}
        // onChange={(value) => onChange({properties: value})}
        // onImport={() => dispatch<ImportPreVersionAction>({
        //   type: 'resourceVersionCreatorPage/importPreVersion',
        // })}
      />
    </FEditorCard>

    <Drawer
      title="添加依赖"
      width={640}
      visible={depInfoVisible}
      // closable={}
      // onClose={this.onChildrenDrawerClose}
      // visible={this.state.childrenDrawer}
    >
      <SelectDeps/>
    </Drawer>
  </div>);
}

export default Details;

function BasisUpthrows() {
  return (
    <Space direction="vertical" size={10}>
      <div>
        <Space size={10}>
          <ArrowUpOutlined style={{color: '#EA7171'}}/>
          <span>stefan/image9</span>
        </Space>
      </div>
      <div>
        <Space size={10}>
          <ArrowUpOutlined style={{color: '#EA7171'}}/>
          <span>stefan/image9</span>
        </Space>
      </div>
    </Space>
  );
}

interface Interface {

}

function DepsCards() {
  const [ref, setRef] = React.useState<HTMLDivElement | null>(null);

  const [visibleIndex, setVisibleIndex] = React.useState<number>(-1);
  // React.useEffect(() => {
  //   console.log(ref, 'RRRRRR');
  // }, [ref]);

  return (<div
    className={styles.DepsCards}
    ref={(div) => setRef(div)}
  >
    <div style={{height: 30}}/>
    <FContentText text={'添加'}/>
    <div style={{height: 15}}/>
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
            {/*{console.log(divContainer, 'divContainer')}*/}
            {ref && <Popover
              // trigger={'hover'}
              // onVisibleChange={(visible: boolean) => console.log(visible, 'VVVVV')}
              // visible={visibleIndex === 0}
              getPopupContainer={(triggerNode) => {
                return ref || document.body;
              }}
              content={<BasisUpthrows/>}
            >
              <div><FContentText type="additional2">3个基础上抛</FContentText></div>
            </Popover>
            }
          </div>
        </div>
      </div>
    </div>
  </div>);
}
