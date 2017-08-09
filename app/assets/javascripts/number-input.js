;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}
  var $ = global.jQuery

  // Number polyfill
  // How to use? Add below data attribute(s) to input field
  // When to use? See docs for guidance
  GOVUK.numberInput = {
    $suppressNonNumeric: $('[data-non-numeric]'),
    $suppressKeysNav: $('[data-no-keys-nav]'),
    $enforceMaxLength: $('[data-max-length]'),

    bindUIEvents: function () {
      // Suppress non-numeric characters
      GOVUK.numberInput.$suppressNonNumeric.keypress(function (event) {
        var $input = $(this)
        var e = event || window.event
        GOVUK.numberInput.removeNonNumeric($input, e)
      })

      // Suppress arrow up/down incrementation
      GOVUK.numberInput.$suppressKeysNav.keydown(function (event) {
        var $input = $(this)
        var e = event || window.event
        GOVUK.numberInput.preventUpDownArrows($input, e)
      })

      // Enforce max length
      GOVUK.numberInput.$enforceMaxLength.keydown(function (event) {
        var $input = $(this)
        var e = event || window.event
        GOVUK.numberInput.checkIfMaxLengthExceeded($input, e)
      })
    },
    removeNonNumeric: function ($el, e) {
      var numbers = []
      var key = e.keyCode || e.charCode

      if (!key) {
        return
      }

      for (var i = 48; i < 58; i++) { // Numeric characters
        numbers.push(i)
      }

      var allAllowed = GOVUK.numberInput.allowedKeys.concat(numbers)

      if (!($.inArray(key, allAllowed) >= 0)) {
        e.preventDefault()
      }
    },
    checkIfMaxLengthExceeded: function ($el, e) {
      var maxLength = $el.data('max-length')

      if (maxLength) {
        var value = $el.val()
        var isAllowed = true
        var key = e.keyCode || e.charCode

        if (!key) {
          return
        }

        if (maxLength !== undefined && maxLength > 0 && value && value.length >= maxLength) {
          isAllowed = false
        }

        $.each(GOVUK.numberInput.allowedKeys, function (i, e) {
          if (e === key) {
            isAllowed = true
          }
        })

        if (!isAllowed) {
          e.preventDefault()
          return false
        }
      }
    },
    preventUpDownArrows: function ($el, e) {
      var key = e.keyCode || e.charCode

      if (!key) {
        return
      }

      if (e.keyCode === 38 || e.keyCode === 40) { // Up and down arrow
        e.preventDefault()
      }
    },
    allowedKeys: [
      8, // Backspace
      9, // Tab
      13, // Enter
      27, // Escape
      33, // Pgup
      34, // Pgdown
      35, // End
      36, // Home
      37, // ArrowLeft
      38, // ArrowUp
      39, // ArrowRight
      40, // ArrowDown
      46 // Delete
    ],
    init: function ($element) {
      GOVUK.numberInput.bindUIEvents()
    }
  }
  global.GOVUK = GOVUK
})(window); // eslint-disable-line semi
