// https://github.com/surmon-china/vue-quill-editor/blob/master/src/editor.vue
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'
import screenfull from 'screenfull'
import { quillEditor } from 'vue-quill-editor'

// https://quilljs.com/docs/modules/toolbar/
export default {
  name: 'fl-rich-editor',

  data() {
    const self = this
    return {
      editor: null,
      showImgUploader: false,
      content: '',
      isFullscreen: false,
      editorOption: {
        // some quill options
        placeholder: this.placeholder,
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ size: ['small', false, 'large', 'huge'] }],
              // [{'script': 'sub'}, {'script': 'super'}],
              // [{'indent': '-1'}, {'indent': '+1'}],
              // [{'direction': 'rtl'}],
              // [{'header': [1, 2, 3, 4, 5, 6, false]}],
              [{ color: [] }, { background: [] }],
              // [{'font': []}],
              // [{'align': []}],
              // ['clean'],
              ['link', 'image', 'video'],
              ['omega']
            ],
            handlers: {
              image() {
                self.showImgUploader = true
                self.uploadImgState = {
                  cursorIndex: this.quill.selection.savedRange.index
                }
              }
            }
          }
        }
      }
    }
  },

  props: {
    value: {
      type: String,
      default() {
        return ''
      }
    },
    config: {
      type: Object,
      default() {
        return {}
      }
    },
    placeholder: String
  },

  watch: {},

  computed: {
    qiHostname(){
      return ((window.FreelogApp && window.FreelogApp.Env.qiOrigin) || '') + '/v1/resources/uploadPreviewImage'
    }
  },

  mounted() {
    this.createEditor()
    // if (this.$route.params.resourceId) {
      const unwatch = this.$watch('value', () => {
        if (this.value) {
          this.content = this.value
        }
        unwatch()
      })
    // }
  },
  components: {
    'quill-rich-editor': quillEditor
  },
  methods: {
    uploadImageSuccessHandler(res, file) {
      this.$emit('load', { file, data: res })
      this.resetImgUploaderState()
    },
    uploadImageErrorHandler() {
      this.resetImgUploaderState()
    },
    resetImgUploaderState() {
      this.$refs.imgUploader.clearFiles()
      this.uploadImgState.cursorIndex = ''
      this.showImgUploader = false
    },
    createEditor() {
      this.editor = this.$refs.richEditor.quill

      const customButton = this.$el.querySelector('.ql-omega')
      if (screenfull.enabled) {
        customButton.addEventListener('click', () => {
          screenfull.toggle(this.$el)
        })

        screenfull.on('change', () => {
          this.isFullscreen = screenfull.isFullscreen
        })
      } else {
        customButton.remove()
      }

      this.setHtml(this.value || '')
    },
    getHtml() {
      return this.content
    },
    setHtml(html) {
      if (this.editor) {
        this.editor.setContents(html)
      } else {
        console.warn('还未创建编辑器')
      }
    },
    insertImg(url) {
      this.editor.insertEmbed(this.uploadImgState.cursorIndex, 'image', url)
    },
    getEditor() {
      return this.editor
    },
    onEditorChange({ html }) {
      this.$emit('input', html)
    }
  }
}
