export default {
  name: 'fl-nav-menu',
  props: {
    navList: Array,
    activeClass: Boolean,
    shouldShowTitle: {
      type: Boolean,
      default() {
        return true
      }
    }
  }
}
