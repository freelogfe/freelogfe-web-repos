import * as React from 'react';
import styles from './index.less';
import FCenterLayout from '@/layouts/FCenterLayout';
import { withRouter, router } from 'umi';
import RouterTypes from 'umi/routerTypes';
import { ChangeAction } from '@/models/global';
import { Dispatch, connect } from 'dva';
import { FUtil } from '@freelog/tools-lib';
import { RouteComponentProps } from 'react-router';
import { ChangeAction as DiscoverChangeAction } from '@/models/discoverPage';
import FResultTip from '@/components/FResultTip';
// import FGraph_Tree_Authorization_Exhibit from '@/components/FAntvG6/FGraph_Tree_Authorization_Exhibit';
// import FGraph_Tree_Relationship_Exhibit from '@/components/FAntvG6/FGraph_Tree_Relationship_Exhibit';
// import FGraph_State_Machine from '@/components/FAntvG6/FGraph_State_Machine';
import { PolicyFullInfo_Type } from '@/type/contractTypes';
import FTooltip from '@/components/FTooltip';
import { LoadingOutlined } from '@ant-design/icons';
// import FHeaderNavigation from '@/components/FHeaderNavigation';

// const fsmDescriptionInfo: PolicyFullInfo_Type['fsmDescriptionInfo'] = {
//   initial: {
//     transitions: [
//       {
//         toState: 'finish',
//         service: 'freelog',
//         name: 'RelativeTimeEvent',
//         args: { elapsed: 1, timeUnit: 'month' },
//         code: 'A103',
//         isSingleton: false,
//         eventId: '1b0662145c874a7fa9fba4a8a3479550',
//       },
//     ],
//     serviceStates: ['active'],
//     isInitial: true,
//     isAuth: true,
//     isTestAuth: false,
//   },
//   finish: {
//     transitions: [],
//     serviceStates: [],
//     isAuth: false,
//     isTestAuth: false,
//     isTerminate: true,
//   },
// };
const themeData = {
  ret: 0,
  errCode: 0,
  errcode: 0,
  msg: 'success',
  data: {
    skip: 0,
    limit: 100,
    totalItem: 6,
    dataList: [
      {
        resourceId: '62b01142d2bca6002e366f20',
        resourceType: ['主题'],
        latestVersion: '0.1.3',
        subjectType: 1,
        intro: '占位主题',
        coverImages: [
          'https://image.freelog.com/preview-image/d2d0609cd543c27af3c5b08aff342d0dc53eb4c4.jpg#x=0&y=0&r=0&w=1600&h=1200&width=1600&height=1200',
        ],
        tags: [],
        status: 1,
        resourceName: 'ZhuC/empty-theme',
        userId: 50060,
        username: 'ZhuC',
        resourceVersions: [
          {
            version: '0.1.0',
            versionId: 'cc9be01572ee6a66352396f5d2ee74fa',
            createDate: '2022-06-20T06:18:57.236Z',
          },
          {
            version: '0.1.1',
            versionId: 'bc0abfed746d2e43bf49d9fc2c5d1daf',
            createDate: '2022-06-20T06:25:11.659Z',
          },
          {
            version: '0.1.2',
            versionId: '12dd0b8dd05ab8e62401d2e20ca95b28',
            createDate: '2022-06-20T06:25:57.933Z',
          },
          {
            version: '0.1.3',
            versionId: '85cd73e98da73aa6858c7b1cefe43531',
            createDate: '2022-06-20T06:27:34.370Z',
          },
        ],
        baseUpcastResources: [],
        policies: [
          {
            policyId: 'f182dbabc6e4b24e88a9d1998cb13589',
            policyName: '免费',
            status: 1,
          },
        ],
        createDate: '2022-06-20T06:18:42.135Z',
        updateDate: '2022-06-30T07:43:03.149Z',
      },
      {
        resourceId: '61d6b5652ae3ac002eb85783',
        resourceType: ['主题'],
        latestVersion: '0.1.17',
        subjectType: 1,
        intro: '文档主题',
        coverImages: [
          'https://image.freelog.com/preview-image/87f2b07315822bc6e58dde1aac6a24902d427a51.jpg#x=107&y=0&w=427&h=320&width=640&height=320',
        ],
        tags: ['主题', '文档'],
        status: 1,
        resourceName: 'ZhuC/document-theme',
        userId: 50060,
        username: 'ZhuC',
        resourceVersions: [
          {
            version: '0.1.0',
            versionId: '165334ee621a47ecabd2866679c731fa',
            createDate: '2022-01-06T09:25:15.908Z',
          },
          {
            version: '0.1.1',
            versionId: 'e5117a2ffe0a59d9f7aeda0aa75d8f9a',
            createDate: '2022-01-12T09:52:09.599Z',
          },
          {
            version: '0.1.2',
            versionId: 'e2b80f76de4522db9c376e96bd8fa4d4',
            createDate: '2022-01-27T03:14:49.862Z',
          },
          {
            version: '0.1.3',
            versionId: 'c6d693a48cc43f445cfa13c6a781641d',
            createDate: '2022-01-28T06:23:00.058Z',
          },
          {
            version: '0.1.4',
            versionId: 'd7afa34513533a4321bbd7f215c24073',
            createDate: '2022-01-28T07:26:30.874Z',
          },
          {
            version: '0.1.5',
            versionId: '72b2b3e8b03f505841bc02ac05036de5',
            createDate: '2022-01-28T07:44:08.572Z',
          },
          {
            version: '0.1.6',
            versionId: '1b55916980fe6a7a6d738bd5ff3029aa',
            createDate: '2022-01-28T08:26:53.974Z',
          },
          {
            version: '0.1.7',
            versionId: 'ac375499a27af63489801d7fe02c709a',
            createDate: '2022-02-14T02:43:12.861Z',
          },
          {
            version: '0.1.8',
            versionId: 'ac29572fbcee38f6693eaf3cb8ded3c8',
            createDate: '2022-02-18T03:10:24.403Z',
          },
          {
            version: '0.1.9',
            versionId: 'b50458775545662225becf3d2be72f25',
            createDate: '2022-02-18T03:23:37.206Z',
          },
          {
            version: '0.1.10',
            versionId: '08a55a3758a24e298d50d2347b2ca332',
            createDate: '2022-03-01T09:47:20.877Z',
          },
          {
            version: '0.1.11',
            versionId: '0b9379a46348c99ed3299b83d6de5c46',
            createDate: '2022-03-08T09:44:36.600Z',
          },
          {
            version: '0.1.12',
            versionId: 'f2b453c3c7fbc9ff2524bac461495959',
            createDate: '2022-03-08T09:46:25.158Z',
          },
          {
            version: '0.1.13',
            versionId: '66e702d8bc9be5d3e989b192c81c189f',
            createDate: '2022-03-17T10:40:05.051Z',
          },
          {
            version: '0.1.14',
            versionId: 'f7231d2ace535c2dd11be4630d1f55ee',
            createDate: '2022-03-17T11:01:59.856Z',
          },
          {
            version: '0.1.15',
            versionId: '281385f25b8e54dee05d28ef5e01a3e9',
            createDate: '2022-06-07T09:49:55.474Z',
          },
          {
            version: '0.1.16',
            versionId: 'b4985bbdc211d815f396a8d352833c5f',
            createDate: '2022-06-08T03:08:17.197Z',
          },
          {
            version: '0.1.17',
            versionId: 'c51547ed254b40c95a2f870a2e5bb8a7',
            createDate: '2022-06-08T03:32:38.250Z',
          },
        ],
        baseUpcastResources: [],
        policies: [
          {
            policyId: '940ddbd29bfeb56474f56cbca83edcce',
            policyName: 'qq',
            status: 1,
          },
        ],
        createDate: '2022-01-06T09:24:53.847Z',
        updateDate: '2022-06-30T07:43:03.142Z',
      },
      {
        resourceId: '617654aae886b0003419469d',
        resourceType: ['主题'],
        latestVersion: '0.1.19',
        subjectType: 1,
        intro: '博客主题',
        coverImages: [
          'https://image.freelog.com/preview-image/560efd7d5ad851e854e62a3d83601e5ea7568f98.jpg',
        ],
        tags: ['主题', '博客'],
        status: 1,
        resourceName: 'ZhuC/blog-theme',
        userId: 50060,
        username: 'ZhuC',
        resourceVersions: [
          {
            version: '0.1.0',
            versionId: '889e57c010352e8e20c90215cb9357b1',
            createDate: '2021-10-25T08:03:48.104Z',
          },
          {
            version: '0.1.1',
            versionId: 'a0affc07acaa67562528da1bd5e764c6',
            createDate: '2021-12-10T09:51:11.881Z',
          },
          {
            version: '0.1.2',
            versionId: '5c3ea57e5ff8b8730751a87a81edd891',
            createDate: '2021-12-15T09:27:01.842Z',
          },
          {
            version: '0.1.3',
            versionId: '8e2f0a87294ea6dafacb676300bd24af',
            createDate: '2021-12-15T09:48:14.095Z',
          },
          {
            version: '0.1.4',
            versionId: '690d3aa2fe1688c1329ac7d0c6718c12',
            createDate: '2021-12-16T09:45:02.435Z',
          },
          {
            version: '0.1.5',
            versionId: '61b0a6d9ea29e7b824d88688dd1ae933',
            createDate: '2022-01-04T06:50:16.524Z',
          },
          {
            version: '0.1.6',
            versionId: 'dc088ceecc7afbbcfb0bf7d4cbee1f7b',
            createDate: '2022-01-04T06:55:59.874Z',
          },
          {
            version: '0.1.7',
            versionId: 'fe93a09f8a18db371af973bc2d9a5930',
            createDate: '2022-01-12T09:56:35.611Z',
          },
          {
            version: '0.1.8',
            versionId: '6a7005812a37cdc79775a87a20ed31cf',
            createDate: '2022-01-27T03:12:42.575Z',
          },
          {
            version: '0.1.9',
            versionId: '7a860a83d4a2cd024c32e83cabc12711',
            createDate: '2022-01-28T06:28:35.968Z',
          },
          {
            version: '0.1.10',
            versionId: 'f149b1530b8ec5180d584b3bf42877b1',
            createDate: '2022-01-28T07:26:13.635Z',
          },
          {
            version: '0.1.11',
            versionId: '166c080fd5c08efd14fa141d1a4d4856',
            createDate: '2022-01-28T07:43:53.373Z',
          },
          {
            version: '0.1.12',
            versionId: 'fb832e73ba3cfec3f8969d70d076e647',
            createDate: '2022-01-28T08:26:39.580Z',
          },
          {
            version: '0.1.13',
            versionId: '05c0dc3eeb07073e34c40f736e97823f',
            createDate: '2022-02-14T02:42:57.220Z',
          },
          {
            version: '0.1.14',
            versionId: '251f9aea133e6afeeb1bd38c3e3e8242',
            createDate: '2022-03-01T09:46:57.832Z',
          },
          {
            version: '0.1.15',
            versionId: 'ba701146d39e162a90c56a956dcd39e3',
            createDate: '2022-03-08T09:44:07.557Z',
          },
          {
            version: '0.1.16',
            versionId: '4607fb98037013da0f2356dc3dacbcd1',
            createDate: '2022-03-08T09:46:13.169Z',
          },
          {
            version: '0.1.17',
            versionId: 'a36b1c61c878d9cdcc23bb0b3984cd0a',
            createDate: '2022-03-17T10:39:47.636Z',
          },
          {
            version: '0.1.18',
            versionId: '3caa397359504fe340a871560bb1a86b',
            createDate: '2022-03-17T11:01:40.041Z',
          },
          {
            version: '0.1.19',
            versionId: '9cbf2246470475fc4ae65a297d832dac',
            createDate: '2022-06-17T02:41:51.960Z',
          },
        ],
        baseUpcastResources: [],
        policies: [
          {
            policyId: '940ddbd29bfeb56474f56cbca83edcce',
            policyName: '免费1年',
            status: 1,
          },
        ],
        createDate: '2021-10-25T06:54:34.804Z',
        updateDate: '2022-06-30T07:43:03.139Z',
      },
      {
        resourceId: '61400afcf27e48003f5e230c',
        resourceType: ['主题'],
        latestVersion: '0.1.15',
        subjectType: 1,
        intro: '图库主题',
        coverImages: [
          'https://image.freelog.com/preview-image/cb74b0d54ac4ebde7c8a8fb5cd322ed7fe70a20a.jpg',
        ],
        tags: ['主题', '图库'],
        status: 1,
        resourceName: 'ZhuC/gallery-theme',
        userId: 50060,
        username: 'ZhuC',
        resourceVersions: [
          {
            version: '0.1.0',
            versionId: 'adac1878530a97d53b7ccd9f8ef393c2',
            createDate: '2021-09-14T02:38:07.201Z',
          },
          {
            version: '0.1.1',
            versionId: '97306afc9a6a2e21aca6b9e394b73971',
            createDate: '2021-09-18T06:19:32.424Z',
          },
          {
            version: '0.1.2',
            versionId: '4c97993bfdf0e32b134566fd6f58a79f',
            createDate: '2021-10-27T07:30:35.075Z',
          },
          {
            version: '0.1.3',
            versionId: '6c33ac8d236dff108e7ac2f37b278b81',
            createDate: '2021-12-30T06:52:43.219Z',
          },
          {
            version: '0.1.4',
            versionId: '6a10fc7b84f46a21c6812adb8db7176a',
            createDate: '2022-01-04T06:49:22.259Z',
          },
          {
            version: '0.1.5',
            versionId: 'ed8fcab403387cce72994e30fd8f2c10',
            createDate: '2022-01-04T06:55:39.668Z',
          },
          {
            version: '0.1.6',
            versionId: 'c809da2e87319d59b435368eb2d54b12',
            createDate: '2022-01-12T09:50:23.928Z',
          },
          {
            version: '0.1.7',
            versionId: '364bbeed7b5d6c78ae7d68bf8c00cc03',
            createDate: '2022-01-27T03:11:12.148Z',
          },
          {
            version: '0.1.8',
            versionId: '027401d91cd0b46d45cacc7e3aa9a333',
            createDate: '2022-01-28T06:20:36.772Z',
          },
          {
            version: '0.1.9',
            versionId: '5bf66fdf380113b1483ac6a0821993fb',
            createDate: '2022-01-28T07:25:37.162Z',
          },
          {
            version: '0.1.10',
            versionId: '1a2795693282157d558e2112933fa74e',
            createDate: '2022-01-28T07:43:39.925Z',
          },
          {
            version: '0.1.11',
            versionId: 'df67d5b4748da3e33482c180af754e4f',
            createDate: '2022-01-28T08:26:24.983Z',
          },
          {
            version: '0.1.12',
            versionId: 'e67a8efb8daa4d7a0bffe6520ce647ee',
            createDate: '2022-02-14T02:42:38.987Z',
          },
          {
            version: '0.1.13',
            versionId: 'ae062c9c8077950fde3442fced59bd23',
            createDate: '2022-02-18T03:10:41.137Z',
          },
          {
            version: '0.1.14',
            versionId: '59d92b9b28d44090dbc405c8b0fdf4fc',
            createDate: '2022-03-01T09:49:07.881Z',
          },
          {
            version: '0.1.15',
            versionId: '3a7dd150dfcb0def3ef124ef285e2fcd',
            createDate: '2022-03-17T10:39:28.492Z',
          },
        ],
        baseUpcastResources: [],
        policies: [
          {
            policyId: '67b88f266da4973ecf98fb1042ce33f9',
            policyName: '免费订阅（包月）',
            status: 1,
          },
          {
            policyId: '940ddbd29bfeb56474f56cbca83edcce',
            policyName: '免费1年',
            status: 1,
          },
        ],
        createDate: '2021-09-14T02:37:48.232Z',
        updateDate: '2022-06-30T07:43:03.138Z',
      },
      {
        resourceId: '611372050938740039ad6df2',
        resourceType: ['主题'],
        latestVersion: '0.1.17',
        subjectType: 1,
        intro: '漫画主题',
        coverImages: [
          'https://image.freelog.com/preview-image/9ccaff81424cab4db88cc890c6cf5ff187ec306b.jpg',
        ],
        tags: ['主题', '漫画'],
        status: 1,
        resourceName: 'ZhuC/comic-theme',
        userId: 50060,
        username: 'ZhuC',
        resourceVersions: [
          {
            version: '0.1.0',
            versionId: '39a61ad696ed73325cfa969f654864d1',
            createDate: '2021-08-11T06:45:51.490Z',
          },
          {
            version: '0.1.1',
            versionId: '8ad08bfd750634f485642c972f016db0',
            createDate: '2021-08-18T08:26:28.872Z',
          },
          {
            version: '0.1.2',
            versionId: '174ba3feb8bb7ef8338ba8822d8a162e',
            createDate: '2021-08-19T09:25:14.293Z',
          },
          {
            version: '0.1.3',
            versionId: '412866fcb42afda7ab86d3f216b0c497',
            createDate: '2021-09-07T03:05:19.876Z',
          },
          {
            version: '0.1.4',
            versionId: '0e3f25771029d29a4bd785c1a4fda273',
            createDate: '2021-12-14T09:56:26.269Z',
          },
          {
            version: '0.1.5',
            versionId: '9ae764c2aaeca6bda9b94202c7cab9d8',
            createDate: '2021-12-15T09:45:04.776Z',
          },
          {
            version: '0.1.6',
            versionId: '01f6614d63a764c9a42236dc053e4891',
            createDate: '2021-12-16T09:43:48.650Z',
          },
          {
            version: '0.1.7',
            versionId: '471fc75830044d0cc028144824ab935d',
            createDate: '2022-01-04T06:50:40.608Z',
          },
          {
            version: '0.1.8',
            versionId: '246a52c1ddf7e382929467be2c7facae',
            createDate: '2022-01-12T09:53:41.726Z',
          },
          {
            version: '0.1.9',
            versionId: 'ed1c805a012a2955be1c76be5fa420ff',
            createDate: '2022-01-27T03:09:37.667Z',
          },
          {
            version: '0.1.10',
            versionId: '735e78a9e6cf01653387388a49969cbf',
            createDate: '2022-01-28T06:19:33.469Z',
          },
          {
            version: '0.1.11',
            versionId: 'bbc9f6d164a163db66e9681c383b7205',
            createDate: '2022-01-28T07:25:22.807Z',
          },
          {
            version: '0.1.12',
            versionId: '77ec18edd422563f1515a04ec317c09a',
            createDate: '2022-01-28T07:43:22.544Z',
          },
          {
            version: '0.1.13',
            versionId: '3dc92d394e28442a535af15c28a0ede4',
            createDate: '2022-01-28T08:26:11.433Z',
          },
          {
            version: '0.1.14',
            versionId: '6f3002aeba077eb3b04568e2f9260857',
            createDate: '2022-02-14T02:42:20.541Z',
          },
          {
            version: '0.1.15',
            versionId: 'ac87902b04ffd87c0158b438ab759e0b',
            createDate: '2022-03-01T09:46:43.016Z',
          },
          {
            version: '0.1.16',
            versionId: '77ced3c85e06f619d6578273b24a8349',
            createDate: '2022-03-17T10:39:09.542Z',
          },
          {
            version: '0.1.17',
            versionId: 'beef27465fdd26fcf5545413808b4c06',
            createDate: '2022-06-17T02:42:22.190Z',
          },
        ],
        baseUpcastResources: [],
        policies: [
          {
            policyId: 'e2ddfaa5787a3305c07acf7b3d20d1db',
            policyName: '免费策略',
            status: 0,
          },
          {
            policyId: '940ddbd29bfeb56474f56cbca83edcce',
            policyName: '免费1年',
            status: 1,
          },
        ],
        createDate: '2021-08-11T06:45:25.407Z',
        updateDate: '2022-06-30T07:43:03.135Z',
      },
      {
        resourceId: '60ef9c4ea11650002e840fcd',
        resourceType: ['主题'],
        latestVersion: '0.1.28',
        subjectType: 1,
        intro: '小说主题',
        coverImages: [
          'https://image.freelog.com/preview-image/98e67f1469ee12c09bbda9d414c45ae9119f7026.jpg',
        ],
        tags: ['主题', '小说'],
        status: 1,
        resourceName: 'ZhuC/novel-theme',
        userId: 50060,
        username: 'ZhuC',
        resourceVersions: [
          {
            version: '0.1.0',
            versionId: 'fe68308e046f91198d7350c9ff4c5696',
            createDate: '2021-07-15T02:25:01.727Z',
          },
          {
            version: '0.1.1',
            versionId: 'de75dc8559a7fb618b971f062aedcb8e',
            createDate: '2021-07-15T02:28:41.767Z',
          },
          {
            version: '0.1.2',
            versionId: 'cdf4c55cb8214bbbd1d2a1d99b0ee444',
            createDate: '2021-07-15T07:57:35.729Z',
          },
          {
            version: '0.1.3',
            versionId: 'a247fa8cb1cb9f9e08b541259f8b186c',
            createDate: '2021-07-15T09:43:21.439Z',
          },
          {
            version: '0.1.4',
            versionId: '9ff104ca1cbd282c86b2a6bb4fa718c3',
            createDate: '2021-07-16T09:16:38.366Z',
          },
          {
            version: '0.1.5',
            versionId: 'f40d00c69e25bc125ecea3c0c989783f',
            createDate: '2021-07-22T08:30:04.997Z',
          },
          {
            version: '0.1.6',
            versionId: 'f38888ee90c170b0ca966ad7e6d10b29',
            createDate: '2021-09-02T06:59:11.674Z',
          },
          {
            version: '0.1.7',
            versionId: '7a846c8107ece7e4de262586783282c3',
            createDate: '2021-09-07T02:48:15.587Z',
          },
          {
            version: '0.1.8',
            versionId: '9ef4f03dbee95fef0ff5d5368794e30f',
            createDate: '2021-10-20T06:29:29.040Z',
          },
          {
            version: '0.1.9',
            versionId: 'dced10d6e55ca26ccb99be8922592ac5',
            createDate: '2021-11-29T08:02:08.068Z',
          },
          {
            version: '0.1.10',
            versionId: '91ae1991632b19418060228dbb2ecb0e',
            createDate: '2021-12-03T02:13:10.999Z',
          },
          {
            version: '0.1.11',
            versionId: '53e83d4d2946bb41daf27a4914a9bd78',
            createDate: '2021-12-03T02:18:23.132Z',
          },
          {
            version: '0.1.12',
            versionId: '8ea3ca9b849f223bd5492c9906e0955a',
            createDate: '2021-12-09T07:43:55.313Z',
          },
          {
            version: '0.1.13',
            versionId: '2afdcda9fc86631c1b61c96800a4fedd',
            createDate: '2021-12-10T06:34:27.321Z',
          },
          {
            version: '0.1.14',
            versionId: 'e112f090842735d9ee9a49b79fdbe9a8',
            createDate: '2021-12-15T09:52:34.360Z',
          },
          {
            version: '0.1.15',
            versionId: '77d179beff644472682798e1fba8b944',
            createDate: '2021-12-16T09:45:25.219Z',
          },
          {
            version: '0.1.16',
            versionId: 'bab9662e3babf9dfe2ed29116c4184d7',
            createDate: '2022-01-04T06:49:54.388Z',
          },
          {
            version: '0.1.17',
            versionId: '1e1c41bc72649e92f02df37ca5f87451',
            createDate: '2022-01-06T02:55:25.687Z',
          },
          {
            version: '0.1.18',
            versionId: 'eb4959bd9fda73fb199a7b6e3b0e49a2',
            createDate: '2022-01-12T09:47:54.376Z',
          },
          {
            version: '0.1.19',
            versionId: '0e35849af34ea3329afc547d2b455d27',
            createDate: '2022-01-26T10:17:38.156Z',
          },
          {
            version: '0.1.20',
            versionId: 'fa0622baf2c920c0a2a4a3c11cd28c9d',
            createDate: '2022-01-27T03:07:45.984Z',
          },
          {
            version: '0.1.21',
            versionId: '2b4cadb69b60ec89a12088777d17cab2',
            createDate: '2022-01-28T06:17:57.952Z',
          },
          {
            version: '0.1.22',
            versionId: 'b631959a8b7ec525ac7b51e04c5bae00',
            createDate: '2022-01-28T07:25:07.124Z',
          },
          {
            version: '0.1.23',
            versionId: 'bb0f545708c3f33dc8ee0ee0a6b1c547',
            createDate: '2022-01-28T07:43:08.850Z',
          },
          {
            version: '0.1.24',
            versionId: 'd4136d6fc1794052d5b020180f8e7fdd',
            createDate: '2022-01-28T08:25:56.068Z',
          },
          {
            version: '0.1.25',
            versionId: '17a724a34ca0375ee5b0aee91ee3a0f9',
            createDate: '2022-02-14T02:42:01.407Z',
          },
          {
            version: '0.1.26',
            versionId: '1ffa2e6a85490c6c853d6169bcc0fb93',
            createDate: '2022-03-01T09:46:21.178Z',
          },
          {
            version: '0.1.27',
            versionId: '75138fdd62e6c2590e64b8f1a7917c1c',
            createDate: '2022-03-17T10:40:30.522Z',
          },
          {
            version: '0.1.28',
            versionId: '2cad77957da82508da4ee5bbc83b8351',
            createDate: '2022-06-17T02:42:08.639Z',
          },
        ],
        baseUpcastResources: [],
        policies: [
          {
            policyId: 'e2ddfaa5787a3305c07acf7b3d20d1db',
            policyName: '免费策略',
            status: 0,
          },
          {
            policyId: '940ddbd29bfeb56474f56cbca83edcce',
            policyName: '免费1年',
            status: 1,
          },
        ],
        createDate: '2021-07-15T02:24:14.937Z',
        updateDate: '2022-06-30T07:43:03.133Z',
      },
    ],
  },
};

interface SuccessProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
}

function Success({ match, route, dispatch }: RouterTypes & SuccessProps) {
  React.useEffect(() => {
    dispatch<ChangeAction>({
      type: 'global/change',
      payload: {
        route: route,
      },
    });
  }, [route]);

  const [activeId, setActiveId] = React.useState<null | string>(null);
  const [emptyPopupShow, setEmptyPopupShow] = React.useState(false);
  const [successPopupShow, setSuccessPopupShow] = React.useState(false);
  const [countdown, setCountdown] = React.useState(3);
  let interval: NodeJS.Timeout | null = null;

  // function goto() {
  //   dispatch<DiscoverChangeAction>({
  //     type: 'discoverPage/change',
  //     payload: {
  //       resourceType: 'theme',
  //     },
  //   });
  //   router.push(FUtil.LinkTo.market());
  // }

  /** 跳转资源详情页 */
  const toResourceDetail = (id: string) => {
    window.open(FUtil.LinkTo.resourceDetails({ resourceID: id }));
  };

  /** 跳转节点管理页 */
  const toNodeManagement = () => {
    interval && clearInterval(interval);
    router.push(
      FUtil.LinkTo.nodeManagement({ nodeID: Number(match.params.id), showPage: 'theme' }),
    );
  };

  /** 激活主题 */
  const activeTheme = (id: string) => {
    if (activeId) return;

    setActiveId(id);
    setTimeout(() => {
      let time = 3;
      setActiveId(null);
      setSuccessPopupShow(true);
      setCountdown(time);

      // interval = setInterval(() => {
      //   setCountdown(--time);
      //   if (time === 0) {
      //     interval && clearInterval(interval);
      //     router.push(
      //       FUtil.LinkTo.nodeManagement({ nodeID: Number(match.params.id), showPage: 'theme' }),
      //     );
      //   }
      // }, 1000);
    }, 1000);
  };

  /** 开关占位主题弹窗 */
  const operateEmptyPopup = () => {
    setEmptyPopupShow(!emptyPopupShow);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.tip}>
        <i className={`freelog fl-icon-a-chenggongzhengqueduigou1 ${styles['tip-icon']}`} />
        <div className={styles['tip-text']}>节点创建成功</div>
      </div>

      <div className={styles['recommend-area']}>
        <div className={styles.btns}>
          <div className={styles['develop-btn']} onClick={operateEmptyPopup}>
            我是主题/插件开发者
          </div>
          <div className={styles['skip-btn']} onClick={toNodeManagement}>
            稍后设置
          </div>
        </div>
        <div className={styles.title}>为你的节点选择一个主题</div>
        <div className={styles.desc}>
          主题决定了节点的整体外观和设计，你签约的展品将通过主题在节点陈列和展示。主题为节点提供了高度可定制话的可能，你可以根据需要随时更改节点的主题
        </div>
        <div className={styles.list}>
          {themeData.data.dataList.map((item) => {
            return (
              <div className={styles.theme} key={item.resourceId}>
                <div className={styles.cover}>
                  <img className={styles['cover-img']} src={item.coverImages[0]} />
                  <div className={styles.triangle}></div>
                  <div className={styles['free-text']}>免费</div>
                </div>
                <div className={styles['right-area']}>
                  <div className={styles['title-area']}>
                    <div className={styles.title}>{item.resourceName.split('/')[1]}</div>
                    <FTooltip title="查看资源详情">
                      <i
                        className={`freelog fl-icon-chakanziyuan ${styles['view-detail']}`}
                        onClick={() => toResourceDetail(item.resourceId)}
                      />
                    </FTooltip>
                  </div>
                  <div className={styles.intro}>{item.intro}</div>
                  <div className={styles.version}>最新版本 {item.latestVersion}</div>
                  <div
                    className={styles['active-btn']}
                    onClick={() => activeTheme(item.resourceId)}
                  >
                    {activeId === item.resourceId && <LoadingOutlined className={styles.loader} />}
                    激活主题
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {(emptyPopupShow || successPopupShow) && (
        <div className={styles.modal}>
          {emptyPopupShow && (
            <div className={styles['empty-popup']}>
              <div className={styles.title}>我是主题/插件开发者</div>
              <div className={styles.desc}>使用占位主题，可快速进行主题/插件的开发</div>
              <div className={styles.btns}>
                <div className={styles['cancel-btn']} onClick={operateEmptyPopup}>
                  取消
                </div>
                <div
                  className={styles['active-btn']}
                  onClick={() => activeTheme(themeData.data.dataList[0].resourceId)}
                >
                  {activeId === themeData.data.dataList[0].resourceId && (
                    <LoadingOutlined className={styles.loader} />
                  )}
                  使用占位主题
                </div>
              </div>
              <i
                className={`freelog fl-icon-guanbi ${styles['close-btn']}`}
                onClick={operateEmptyPopup}
              />
            </div>
          )}

          {successPopupShow && (
            <div className={styles['success-popup']}>
              <i
                className={`freelog fl-icon-a-chenggongzhengqueduigou1 ${styles['success-icon']}`}
              />
              <div className={styles.title}>主题激活成功</div>
              <div className={styles.desc}>
                即将进入节点管理页（{countdown}s）
                <div className={styles['enter-btn']} onClick={toNodeManagement}>
                  立即进入
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>

    // <FCenterLayout style={{ backgroundColor: 'white' }}>
    //   <div style={{ height: 100 }} />
    //   <div className={styles.modal}>
    //     <FResultTip
    //       // h1={FUtil1.I18n.message('msg_nodecreatedsuccessfully')}
    //       h1={'节点创建成功'}
    //       // h2={FUtil1.I18n.message('msg_nodecreatedsuccessfully')}
    //       h2={
    //         '主题决定节点的整体外观和设计，你可以通过激活不同的主题来更改节点的布局、配色方案等。'
    //       }
    //       // btnText={FUtil1.I18n.message('cta_btn_add_theme')}
    //       btnText={'添加主题'}
    //       onClickBtn={goto}
    //     />
    //   </div>
    // </FCenterLayout>
  );
}

export default withRouter(connect()(Success));
