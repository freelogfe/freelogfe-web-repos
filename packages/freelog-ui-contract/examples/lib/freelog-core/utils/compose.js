
/**
 * koa-compose : https://github.com/koajs/compose/blob/master/index.js
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */
export default function compose(middlewares) {
  if (!Array.isArray(middlewares)) throw new TypeError('middlewares stack must be an array!')
  middlewares.forEach((fn) => {
    if (typeof fn !== 'function') throw new TypeError('middlewares must be composed of functions!')
  })

  /**
     * @param {Object} context
     * @return {Promise}
     * @api public
     */

  return function middlewareFn(context, next) {
    // last called middlewares #
    let index = -1
    return dispatch(0)
    function dispatch(i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middlewares[i]
      if (i === middlewares.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)))
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
