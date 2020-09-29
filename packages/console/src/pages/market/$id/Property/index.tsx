import * as React from "react";
import {FTitleText, FContentText} from "@/components/FText";
import styles from './index.less';

function Property() {
  return (<div>
    <FTitleText text={'基础属性'} type={'h3'}/>
    <div style={{height: 20}}/>
    <div className={styles.content}>
      <div>
        <table>
          <tr>
            <td><FContentText text={'类型'} type="negative"/></td>
            <td><FContentText text={'audio'}/></td>
          </tr>
          <tr>
            <td><FContentText text={'语言'} type="negative"/></td>
            <td><FContentText text={'英语'}/></td>
          </tr>
        </table>
      </div>
      <div style={{width: 10}}/>
      <div>
        <table>
          <tr>
            <td><FContentText text={'最新版本'} type="negative"/></td>
            <td><FContentText text={'1.1.3'}/></td>
          </tr>
          <tr>
            <td><FContentText text={'唱片公司'} type="negative"/></td>
            <td><FContentText text={'Geffen'}/></td>
          </tr>
        </table>
      </div>
      <div style={{width: 10}}/>
      <div>
        <table>
          <tr>
            <td><FContentText text={'专辑'} type="negative"/></td>
            <td><FContentText text={'Nevermind'}/></td>
          </tr>
          <tr>
            <td><FContentText text={'唱片类型'} type="negative"/></td>
            <td><FContentText text={'录音室专辑'}/></td>
          </tr>
        </table>
      </div>
    </div>
  </div>);
}

export default Property;
