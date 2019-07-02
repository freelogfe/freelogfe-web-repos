import { codemirror } from 'vue-codemirror'

import 'codemirror/lib/codemirror.css'

import 'codemirror/theme/dracula.css'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/xml-fold'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/indent-fold'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/selection/selection-pointer'

import 'codemirror/addon/search/match-highlighter'
import 'codemirror/addon/search/searchcursor'
import 'codemirror/addon/display/placeholder'

// import 'codemirror/keymap/sublime'

export const codeMirrorOptions = {
  tabSize: 4,
  mode: 'text/html',
  theme: 'dracula',
  lineNumbers: true,
  line: true,

  // 高级配置（需要引入对应的插件包）,codemirror advanced options(You need to manually introduce the corresponding codemirror function script code)
  // sublime、emacs、vim三种键位模式，支持你的不同操作习惯
  // keyMap: 'sublime',
  // 按键映射，比如Ctrl键映射autocomplete，autocomplete是hint代码提示事件
  extraKeys: { Ctrl: 'autocomplete' },
  lineWrapping: true,
  // 代码折叠
  foldGutter: true,
  gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
  // 选中文本自动高亮，及高亮方式
  styleSelectedText: true,
  highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
}

export { codemirror }
