import * as React from 'react';
import styles from './index.less';
import {FContentText, FTitleText} from '@/components/FText';
import * as imgSrc from '@/assets/default-resource-cover.jpg';
import {FClose, FDelete, FEdit, FSwap} from '@/components/FIcons';
import {Space} from 'antd';
import FInput from '@/components/FInput';
import {FNormalButton, FTextButton, FCircleButton} from '@/components/FButton';
import FSelect from '@/components/FSelect';
import FModal from '@/components/FModal';
import {connect, Dispatch} from 'dva';
import {ConnectState, ExhibitInfoPageModelState} from '@/models/connect';
import {ChangeAction, UpdateBaseInfoAction, UpdateRewriteAction} from '@/models/exhibitInfoPage';
import FUploadImage from '@/components/FUploadImage';
// import {RcFile, UploadChangeParam} from 'antd/lib/upload/interface';
import FRedo from '@/components/FIcons/FRedo';
import FLabelEditor from "@/pages/resource/components/FLabelEditor";
import FDropdown from "@/components/FDropdown";
import FDropdownMenu from "@/components/FDropdownMenu";
import Info from './Info';
import Relation from './Relation';
import Setting from './Setting';

interface SideProps {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState,
}

function Side({dispatch, exhibitInfoPage}: SideProps) {


  return (<div className={styles.side}>
    <div className={styles.base}>

      <Info/>

      <Setting/>
    </div>

    <div style={{height: 10}}/>

    <Relation/>


  </div>);
}

export default connect(({exhibitInfoPage}: ConnectState) => ({
  exhibitInfoPage,
}))(Side);
