import i18n from '../../lib/i18n';

export const name = [
    {
        min: 2, max: 40,
        // message: '长度在 2 到 40 个字符',
        message: i18n.t('policy.in2To40Length'),
        trigger: 'blur'
    },
    {
        required: true,
        // message: '模板描述必填',
        message: i18n.t('policy.descriptionRequired'),
        trigger: 'blur'
    }
]


export const template = [
    {
        required: true,
        message: i18n.t('policy.templateRequired'),
        trigger: 'blur'
    }
]

export default {
    name,
    template
}
