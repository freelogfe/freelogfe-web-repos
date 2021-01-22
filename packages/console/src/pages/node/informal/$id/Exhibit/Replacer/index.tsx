import * as React from 'react';
import styles from './index.less';
import FInput from "@/components/FInput";
import {Radio, Space} from "antd";
import {FContentText, FTitleText} from "@/components/FText";
import FVersionHandlerPopover from "@/components/FVersionHandlerPopover";
import {FTextButton} from "@/components/FButton";
import {connect, Dispatch} from 'dva';
import {ConnectState, InformalNodeManagerPageModelState} from "@/models/connect";
import {ChangeAction} from "@/models/informalNodeManagerPage";

interface ReplacerProps {
  dispatch: Dispatch,
  informalNodeManagerPage: InformalNodeManagerPageModelState;
}

function Replacer({dispatch, informalNodeManagerPage}: ReplacerProps) {

  function onChange(value: Partial<InformalNodeManagerPageModelState>) {
    dispatch<ChangeAction>({
      type: 'informalNodeManagerPage/change',
      payload: {
        ...value,
      },
    });
  }

  return (<>
    <div className={styles.replacerHeader}>
      <a
        className={informalNodeManagerPage.replacerActivatedTab === 'market' ? styles.activated : ''}
        onClick={() => {
          onChange({replacerActivatedTab: 'market'});
        }}
      >资源市场</a>
      <div style={{width: 20}}/>
      <a
        className={informalNodeManagerPage.replacerActivatedTab === 'resource' ? styles.activated : ''}
        onClick={() => {
          onChange({replacerActivatedTab: 'resource'});
        }}
      >我的资源</a>
      <div style={{width: 20}}/>
      <a
        className={informalNodeManagerPage.replacerActivatedTab === 'collection' ? styles.activated : ''}
        onClick={() => {
          onChange({replacerActivatedTab: 'collection'});
        }}
      >我的收藏</a>
    </div>
    <div style={{height: 15}}/>
    <div className={styles.replacerBody}>
      <div className={styles.replacerFilter}>
        <FInput
          theme="dark"
          wrapClassName={styles.replacerFilterInput}
        />
      </div>
      <div style={{height: 15}}/>
      <Space size={10} direction="vertical" className={styles.replacerList}>
        {
          informalNodeManagerPage.replacerList.map((rl) => {
            return (<div key={rl.id} className={styles.replacerListItem}>
              <Radio checked={rl.checked}/>
              <div className={styles.replacerListItemContent}>
                <div>
                  <div>
                    <FTitleText text={rl.name} type="h5"/>
                  </div>
                  <div style={{height: 2}}/>
                  <div>
                    <FContentText
                      text={`${rl.type} | ${rl.latestVersion || '暂无版本'} | ${rl.date}`}
                      type="additional2"
                    />
                    <FVersionHandlerPopover
                      value={'1.1.1'}
                      versionOptions={['1.1.1']}>
                      <FTextButton style={{fontSize: 12}}>选择版本</FTextButton>
                    </FVersionHandlerPopover>
                  </div>
                </div>

              </div>
            </div>);
          })
        }

      </Space>
    </div>
  </>);
}

export default connect(({informalNodeManagerPage}: ConnectState) => ({
  informalNodeManagerPage,
}))(Replacer);
