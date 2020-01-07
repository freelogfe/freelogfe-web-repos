
import Router from 'vue-router'
import { Vue } from '@freelog/freelog-common-lib'
import UserLayout from '@/views/layout/user.vue'
import MyContractsView from '@/views/contracts/index.vue'
import MyAccountsView from '@/views/accounts/index.vue'
import MyProfileView from '@/views/profile/index.vue'
import MyCollectionsView from '@/views/collections/index.vue'
import AccountCreateView from '@/views/accounts/create.vue'
import AccountRechargeView from '@/views/accounts/recharge.vue'
import AccountTransactionRecordsView from '@/views/accounts/records.vue'
import AccountResetPayPasswordView from '@/views/accounts/reset.vue'
import AccountWithdrawView from '@/views/accounts/withdraw.vue'
import AccountTransferView from '@/views/accounts/transfer.vue'
import AccountListManagerView from '@/views/accounts/list.vue'
import AddPayAccountView from '@/views/accounts/add-pay-account.vue'
import ResourceContractDetailView from '@/views/contracts/detail.vue'
import ErrorView from '@/views/error/index.vue'

Vue.use(Router)
const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition
  }
  const position = {}
  if (to.hash) {
    position.selector = to.hash
  }

  if (to.meta.scrollToTop !== false) {
    position.x = 0
    position.y = 0
  }
  return position
}

const routerConfig = {
  mode: 'history',
  scrollBehavior,
  base: '/',
  routes: [
    {
      path: '/',
      redirect: '/user/accounts'
    },
    {
      path: '/user',
      meta: {
        title: '我的账户'
      },
      component: UserLayout,
      children: [{
        path: 'accounts',
        meta: {
          title: '钱包',
          theme: 'transparent'
        },
        component: MyAccountsView
      }, {
        path: 'create',
        name: 'accountCreate',
        meta: {
          title: '创建账户'
        },
        component: AccountCreateView
      }, {
        path: 'recharge',
        name: 'accountRecharge',
        meta: {
          title: '账户充值'
        },
        component: AccountRechargeView
      }, {
        path: 'records',
        name: 'accountRecords',
        meta: {
          title: '账户交易记录'
        },
        component: AccountTransactionRecordsView
      }, {
        path: 'accounts-manager',
        name: 'accountsManager',
        meta: {
          title: '账号管理'
        },
        component: AccountListManagerView
        // AddPayAccountView
      }, {
        path: 'accounts/add',
        name: 'addPayAccount',
        meta: {
          title: '添加支付账号'
        },
        component: AddPayAccountView
        // AddPayAccountView
      }, {
        path: 'reset',
        name: 'accountReset',
        meta: {
          title: '账户充值密码'
        },
        component: AccountResetPayPasswordView
      }, {
        path: 'withdraw',
        name: 'accountWithdraw',
        meta: {
          title: '账户提现'
        },
        component: AccountWithdrawView
      },
      {
        path: 'transfer',
        name: 'accountTransfer',
        meta: {
          title: '账户转账'
        },
        component: AccountTransferView
      },
      {
        path: 'profile',
        meta: { title: '资料与账号' },
        component: MyProfileView
      }, {
        path: 'collections',
        meta: { title: '我的关注' },
        component: MyCollectionsView
      }, {
        path: 'contracts',
        meta: { title: '合约管理' },
        component: MyContractsView
      },
      {
        path: 'contracts/detail',
        meta: { title: '合约详情', hideAside: true },
        component: ResourceContractDetailView
      }]
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    // },
  ]
}
const notFoundRouteConfig = {
  path: '/*',
  meta: {
    requiresAuth: false,
    title: 'not found',
    error: true
  },
  component: ErrorView,
}
const router = new Router(routerConfig)
export function registerNotFoundRouete() {
  // 延迟执行挂载404页面路由
  setTimeout(() => {
    router.addRoutes([notFoundRouteConfig])
  }, 0)
}

export default router

