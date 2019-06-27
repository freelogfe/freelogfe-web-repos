
import { setStyle } from "../utils/dom.js"
export default function initLoading(FreelogApp) {
  var $loading = document.querySelector('#f-loading')
  FreelogApp.$loading = {
    show(){
      if($loading) {
        setStyle($loading, 'display', 'block')
      }
    },
    hide(){
      if($loading) {
        setStyle($loading, 'display', 'none')
      }
    }
  }
}
