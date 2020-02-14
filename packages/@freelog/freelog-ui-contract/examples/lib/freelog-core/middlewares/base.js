/* eslint-disable */
export default class MiddlewareBase {
  constructor() {
    this.next = window
  }

  transformRequest(url, req) {
    return [url, req]
  }

  transformResponse(resp) {
    return resp
  }

  setNext(mw) {
    this.next = mw
  }

  fetch(url, req) {
    [url, req] = this.transformRequest(url, req)
    return this.next.fetch.apply(this.next, [url, req])
      .then(resp => this.transformResponse(resp, { url, req }))
  }
}

