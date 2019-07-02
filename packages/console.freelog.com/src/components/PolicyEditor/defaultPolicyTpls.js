import i18n from '@/lib/i18n'

const freePolicy = `for public:
  initial:
    active
    recontractable
    presentable
    terminate
  `

const PresentableFreePolicy = `for public:
  initial:
    active
    terminate
  `

export const resource = [
  {
    template: freePolicy,
    name: i18n.t('components.policyEditor.defaultPolicyNames.free')
  },
  {
    template: `for public:
  escrow account acct
  custom event acceptor.customEvent

  initial:
    recontractable
    proceed to auth on acct exceed 1 feather
  auth:
    presentable
    recontractable
    active
    proceed to refund on acct.confiscated
  refund:
    recontractable
    proceed to finish on acct.refunded
  finish:
    recontractable
    terminate
  `,
    name: i18n.t('components.policyEditor.defaultPolicyNames.charge')
  }
]

export const presentable = [
  {
    template: PresentableFreePolicy,
    name: i18n.t('components.policyEditor.defaultPolicyNames.free')
  },
  {
    template: `for public:
  escrow account acct
  custom event acceptor.customEvent

  initial:
    proceed to auth on acct exceed 1 feather
  auth:
    presentable
    active
    proceed to refund on acct.confiscated
  refund:
    proceed to finish on acct.refunded
  finish:
    terminate`,
    name: i18n.t('components.policyEditor.defaultPolicyNames.charge')
  }
]

export default {
  resource,
  presentable
}
