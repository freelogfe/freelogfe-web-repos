import createQIFetch from "../QI-fetch/index";
import generateAPIs from "../api";

export default function initQI(FreelogApp) {
  const QI = {
    fetch: createQIFetch({
      baseURL: window.FreelogApp.Env.qiOrigin
    }),
    create: createQIFetch
  }

  Object.assign(QI, extendQIFetch(QI), generateAPIs(QI))
  FreelogApp.QI = Object.freeze(QI)
}

function extendQIFetch(QI) {
  const _QI = {};
  ['get', 'delete', 'options'].forEach(method => {
    _QI[method] = function(url, options = {}) {
      return QI.fetch(url, Object.assign(options, { method }))
    }
  });

  ['post', 'put'].forEach(method => {
    _QI[method] = function(url, data, options = {}) {
      return QI.fetch(url, Object.assign(options, {
        method,
        'body': data
      }))
    }
  })
  return _QI
}
