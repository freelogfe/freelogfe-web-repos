
import { setStyle } from './dom'

export interface ILoading {
  show(): void
  hide(): void
}

export function showLoading(): void {
  const $loading: HTMLElement = document.querySelector('#f-loading')
  if($loading) {
    setStyle($loading, 'display', 'block')
  }
}

export function hideLoading(): void {
  const $loading: HTMLElement = document.querySelector('#f-loading')
  if($loading) {
    setStyle($loading, 'display', 'none')
  }
}

export default function initLoading(): ILoading {
  return { show: showLoading, hide: hideLoading }
}
