import React, {ChangeEvent, ChangeEventHandler} from 'react';
import styles from './index.less';
import {Layout, Dropdown, Affix} from 'antd';
import {DownOutlined} from '@ant-design/icons';
import FMenu from '@/components/FMenu';
import avatarSrc from '../../assets/avatar.png';
import {FCircleButton} from '@/components/FButton';
import FInput from '@/components/FInput';
import router from 'umi/router';
import {connect, Dispatch} from 'dva';
import {ConnectState, GlobalSearchingModelState} from '@/models/connect';

const discoverOptions = [
  {
    text: '发现市场',
    value: '1'
  },
  {
    text: '发现节点',
    value: '2'
  },
];

const resourcesOptions = [
  {
    text: '我的资源',
    value: '1'
  },
  {
    text: '我的收藏',
    value: '2'
  },
];

const creatorOptions = [
  {
    text: '创建资源',
    value: '1'
  },
  {
    text: '创建节点',
    value: '2'
  },
];

const languagesOptions = [{
  value: '1',
  text: '中文'
}, {
  value: '2',
  text: 'English'
}];

interface FLayoutProps {
  children: React.ReactNode | React.ReactNodeArray;
  structure?: 'center' | 'left-right';
  sider?: React.ReactNode | React.ReactNodeArray;
  dispatch: Dispatch;
  global: GlobalSearchingModelState;
}

function FLayout({children, sider, structure = 'center', dispatch, global}: FLayoutProps) {

  const [footerOffsetTop, setFooterOffsetTop] = React.useState<number>(window.innerHeight - 68);

  function onDiscoverClick(value: string) {
    // console.log(params, 'paramsparams');
    if (value === '1') {
      return router.push('/');
    }
    if (value === '2') {
      return router.push('/example');
    }
  }

  function onClickResource(value: string) {
    if (value === '1') {
      return router.push('/resource');
    }
    if (value === '2') {
      return router.push('/resource/collect');
    }
  }

  function onCreateClick(value: string) {
    // console.log(params, 'params');
    if (value === '1') {
      return router.push('/resource/creator');
    }
    if (value === '2') {

    }
  }

  React.useEffect(() => {
    window.onresize = () => {
      setFooterOffsetTop(window.innerHeight - 68);
    }
  }, []);

  return (
    <Layout className={styles.Layout}>
      <Layout.Header className={styles.header}>
        <div className={styles.headerLeft}>
          <a className={['freelog', 'fl-icon-logo-freelog', styles.logo].join(' ')}/>
          <div className={styles.MenuBar}>
            <Dropdown overlay={<FMenu
              onClick={onDiscoverClick}
              options={discoverOptions}
            />}>
              <a onClick={() => onDiscoverClick('1')} className={styles.Menu}>发现</a>
            </Dropdown>
            <a className={styles.Menu}>存储空间</a>
            <Dropdown overlay={<FMenu
              onClick={onClickResource}
              options={resourcesOptions}
            />}>
              <a onClick={() => onClickResource('1')} className={styles.Menu}>资源管理</a>
            </Dropdown>
            <a className={styles.Menu}>节点管理</a>
            <a className={styles.Menu}>合约管理</a>
          </div>
        </div>
        <div className={styles.headerRight}>
          <FInput
            value={global.input}
            className={styles.FInput}
            // placeholder="Search in Freelog"
            size="small"
            theme="dark"
            onChange={(event: ChangeEvent<HTMLInputElement>) => dispatch({
              type: 'globalSearching/onInputChange',
              payload: event.target.value,
            })}
            // disabled={true}
          />

          <Dropdown overlay={<FMenu
            onClick={onCreateClick}
            options={creatorOptions}
          />}
          >
            <a className={styles.create}>
              <FCircleButton/>
            </a>
          </Dropdown>

          <a className={styles.avatar}>
            <img src={avatarSrc} alt={'avatar'}/>
          </a>
        </div>
      </Layout.Header>
      {
        structure === 'center' &&
        (<Layout.Content className={styles.Content}>
          <div>{children}</div>
        </Layout.Content>)
      }

      {
        structure === 'left-right' &&
        (<Layout.Content className={styles.leftRight}>
          <div className={styles.Slider}>
            <div style={{height: 40}}/>
            <div>{sider}</div>
          </div>
          <div className={styles.rightContent}>
            <div>{children}</div>
          </div>
        </Layout.Content>)
      }

      <div style={{height: 100}}/>

      {/* window.onresize */}
      {
        !sider && (<Affix offsetTop={footerOffsetTop}>
          <Layout.Footer className={styles.Footer}>
            <div>
              <div>关于freelog</div>
              <div style={{width: 30}}/>
              <Dropdown overlay={<FMenu
                options={languagesOptions}/>}>
                <div style={{cursor: 'pointer'}}>中文<DownOutlined style={{marginLeft: 8}}/></div>
              </Dropdown>
              <div style={{width: 120}}/>
              <span>粤ICP备17085716号-1</span>
              <div style={{width: 30}}/>
              <span>Copyright© 2020 freelog freelog.com版权所有</span>
            </div>
          </Layout.Footer>
        </Affix>)
      }

    </Layout>
  );
}

export default connect(({globalSearching}: ConnectState) => ({
  global: globalSearching,
}))(FLayout);
