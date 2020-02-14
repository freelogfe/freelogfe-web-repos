export default (Vue) => {
  const eventBus = new Vue()

  Object.defineProperties(Vue, {
    eventBus: { get: () => eventBus }
  })

  Object.defineProperties(Vue.prototype, {
    $eventBus: { get: () => eventBus }
  })
}

