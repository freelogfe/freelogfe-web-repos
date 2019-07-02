// A custom Nightwatch assertion.
// The assertion name is the filename.
// Example usage:
//
//   browser.assert.containElements(selector, childSelector)
//
// For more information on custom assertions see:
// http://nightwatchjs.org/guide#writing-custom-assertions

exports.assertion = function containElements(selector, childSelector) {
  this.message = `Testing if element <${selector}> has children elements: ${childSelector}`
  this.expected = true
  this.pass = val => val === true
  this.value = res => res.value
  function evaluator(_selector, _child) {
    const $el = document.querySelector(_selector)
    return $el.contains($el.querySelector(_child))
  }

  this.command = cb => this.api.execute(evaluator, [selector, childSelector], cb)
}
