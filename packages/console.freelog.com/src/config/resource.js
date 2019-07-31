import i18n from '@/lib/i18n'

export const RESOURCE_TYPES = {
  json: 'json',
  widget: 'widget',
  image: 'image',
  audio: 'audio',
  markdown: 'markdown',
  page_build: 'page_build',
  reveal_slide: 'reveal_slide',
  license: 'license',
  video: 'video',
  catalog: 'catalog',
}


export const RESOURCE_STATUS_MAP = {
  unknown: 0,
  unpublished: 1,
  published: 2,
  freeze: 3
}

export const RESOURCE_STATUS = [
  {
    desc: i18n.t('config.resource.states[0]'),
    type: 'danger',
    status: RESOURCE_STATUS_MAP.unknown
  }, {
    desc: i18n.t('config.resource.states[1]'),
    type: 'warning',
    status: RESOURCE_STATUS_MAP.unpublished
  }, {
    desc: i18n.t('config.resource.states[2]'),
    type: 'success',
    status: RESOURCE_STATUS_MAP.published
  }, {
    desc: i18n.t('config.resource.states[3]'),
    type: 'danger',
    status: RESOURCE_STATUS_MAP.freeze
  }
]
