/**
 * Services
 * freelog文档：http://doc.freelog.com/
 * http://www.ruanyifeng.com/blog/2014/05/restful_api.html
 */
import UserService from './user'

import PolicyService from './policy'
import ResourceService from './resource'
import MockService from './mock'
import ReleaseService from './release'
import AllResourcesService from './g_resources'
import PresentablesService from './presentables'
import ContractService from './contract'
import NodesService from './nodes'
import PagebuildService from './pagebuild'
import OtherService from './other'
import PbContract from './pbcontract'
import ContractRecords from './contractRecords'
import Accounts from './accounts'
import Pay from './pay' // 支付接口
import orderInfo from './orderInfo' // 支付接口
import SigningLicenses from './signingLicenses'
import groupsService from './groups'
import policyTemplateService from './policyTemplates'
import pbStatics from './pbStatics' // pb签约情况统计
import authSchemes from './authSchemes'
import collectionsService from './collections'

export {
  UserService,
  PolicyService,
  ResourceService,
  MockService,
  ReleaseService,
  AllResourcesService,
  PresentablesService,
  NodesService,
  ContractService,
  PagebuildService,
  OtherService,
  orderInfo,
  PbContract,
  ContractRecords,
  Accounts,
  Pay,
  SigningLicenses,
  groupsService,
  policyTemplateService,
  pbStatics,
  authSchemes,
  collectionsService
}
