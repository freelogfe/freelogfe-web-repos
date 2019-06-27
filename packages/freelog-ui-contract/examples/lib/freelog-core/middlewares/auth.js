/* eslint-disable */
import MiddlewareBase from './base'

export default class MiddlewareAuth extends MiddlewareBase {
  transformResponse(resp) {
    return resp
  }
}

// export default function middlewareAuth (ctx, next){
//   return next().then(resp => transformResponse(resp))
// }

// function transformResponse (resp){
//   return resp
// }
