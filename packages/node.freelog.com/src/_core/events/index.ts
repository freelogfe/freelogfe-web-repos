import { toArray } from '../utils'

if ( typeof window.CustomEvent !== "function" ) {
  class CustomEvent {
    constructor(event: string, params: plainObject) {
      params = params || { bubbles: false, cancelable: false, detail: null }
      var evt = document.createEvent( 'CustomEvent' )
      evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail )
      return evt
    }
  }
  // @ts-ignore
  window.CustomEvent = CustomEvent
}

type Listener = (...args: Array<any>) => any
export default class EventEmitter {
  _elem: Element
  private listenerMap: Map<any, any> = new Map()

  constructor(elem: Element) {
    this._elem = elem
  }

  on(type: string, listener: Listener): this {
    const self = this
    function _cb(event: CustomEvent): any {
      listener.apply(self._elem, event.detail)
    }
    this._elem.addEventListener(type, _cb, false)
    const listeners: Array<Listener> = this.listenerMap.get(type) || []
    listeners.push(_cb)
    this.listenerMap.set(type, listeners)
    this.listenerMap.set(listener, _cb) 
    return this
  }

  once(type: string, listener: Listener): this {
    const self = this
    function on() {
      self.off(type, on)
      on.listener.apply(self, arguments)
    }
    on.listener = listener
    self.on(type, on)
    return this
  }

  off(type: string, listener?: Listener): this {
    if (listener == null) {
      const listeners: Array<Listener> = this.listenerMap.get(type)
      for (const fn of listeners) {
        this._elem.removeEventListener(type, fn)
      }
    } else if (typeof listener === 'function') {
      const _cb = this.listenerMap.get(listener)
      this._elem.removeEventListener(type, _cb)
    } 
    
    return this
  }

  trigger(type: string, ...args: Array<any>): this {
    const event = new CustomEvent(type, { detail: args })
    this._elem.dispatchEvent(event)
    return this
  }
}

