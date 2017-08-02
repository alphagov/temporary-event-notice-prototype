;(function (global) {
  'use strict'

  var $ = global.jQuery
  var GOVUK = global.GOVUK || {}

  function CharCount () { }

  CharCount.prototype.defaults = {
    charCountAttribute: 'maxlength',
    wordCountAttribute: 'data-maxwords'
  }

  // Escape tags and ampersand
  String.prototype.escape = function () {
    var tagsToReplace = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;'
    }
    return this.replace(/[&<>]/g, function (tag) {
      return tagsToReplace[tag] || tag
    })
  }

  // Wrap element in a div with a specified wrapper class
  CharCount.prototype.wrapElement = function (element, wrapperClass) {
    var wrapper = document.createElement('div')
    wrapper.className = wrapperClass
    element.parentNode.insertBefore(wrapper, element)
    element.parentNode.removeChild(element)
    wrapper.appendChild(element)
    return wrapper
  }

  // Get style attribute of an element
  CharCount.prototype.getStyle = function (element, attributeName) {
    var attributeValue = ''
    if (document.defaultView && document.defaultView.getComputedStyle) {
      attributeValue = document.defaultView.getComputedStyle(element, '').getPropertyValue(attributeName)
    } else if (element.currentStyle) {
      attributeName = attributeName.replace(/-(\w)/g, function (strMatch, p1) {
        return p1.toUpperCase()
      })
      attributeValue = element.currentStyle[attributeName]
    }
    return attributeValue
  }

  // Browser sniffing is bad, but there are browser-specific quirks to handle that are not a matter of feature detection
  CharCount.prototype.isIOS = function () {
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
      return true
    } else {
      return false
    }
  }

  // Fix iOS default padding
  // iOS adds 3px of (unremovable) padding to the left and right of a textarea, so adjust highlights div to match
  CharCount.prototype.fixIOSInput = function (element) {
    var paddingLeft = parseInt(CharCount.prototype.getStyle(element, 'padding-left'))
    var paddingRight = parseInt(CharCount.prototype.getStyle(element, 'padding-right'))
    element.style.paddingLeft = paddingLeft + 3 + 'px'
    element.style.paddingRight = paddingRight + 3 + 'px'
  }

  // Attach count to the field
  CharCount.prototype.attach = function (options) {
    // Determine the limit attribute
    var countAttribute = (options && options.wordCount) ? this.defaults.wordCountAttribute : this.defaults.charCountAttribute

    // Iterate through each `character count` element
    var countElements = document.getElementsByClassName(options.selector)
    if (countElements) {
      for (var i = 0, len = countElements.length; i < len; i++) {
        var countElement = countElements[i]

        // Highlights
        if (options && options.highlight) {
          var wrapper = CharCount.prototype.wrapElement(countElement, 'form-control-wrapper')
          var elementId = countElement.getAttribute('id')
          var countHighlightClass = (countElement.type === 'text') ? 'backdrop-highlights-input' : 'backdrop-highlights'
          wrapper.insertAdjacentHTML('afterbegin', '<div id="' + elementId + '-hl" class="form-control ' + countHighlightClass + '" aria-hidden="true" role="presentation"></div>')

          var countHighlight = document.getElementById(elementId + '-hl')
          // countHighlight.style.height = CharCount.prototype.getHeight(countElement) + 'px'
          // countHighlight.style.height = countElement.getBoundingClientRect().height + 'px'
          countHighlight.style.height = countElement.offsetHeight + 'px'

          // We have to disable resize on highlighted components to avoid the async scroll and boundaries
          countElement.style.resize = 'none'

          // Fix iOS
          if (CharCount.prototype.isIOS()) {
            CharCount.prototype.fixIOSInput(countHighlight)
          }
        }

        // Set the element limit
        var maxLength = countElement.getAttribute(countAttribute)

        // Generate and reference message
        var countMessage = CharCount.prototype.createCountMessage(countElement)

        // Bind the on change events
        if (maxLength && countMessage) {
          // Extend countElement with attributes in order to pass it through the EventListener
          var countElementExtended = {
            countElement: countElement,
            countMessage: countMessage,
            maxLength: maxLength,
            options: options
          }
          if (options && options.highlight) {
            countElementExtended.countHighlight = countHighlight
          }

          // Bind input
          CharCount.prototype.bindChangeEvents(countElementExtended)

          // Trigger the proper event in order to display initial message
          // $(countElement).trigger('input')
          // CharCount.prototype.updateMessage.call(countElement)
          CharCount.prototype.updateCountMessage(countElementExtended)
          countElement.setAttribute('maxlength', '')
        } else {
          if (!countMessage) window.console.warn('Make sure you set an id for each of your field(s)')
          if (!maxLength) window.console.warn('Make sure you set the ' + countAttribute + ' for each of your field(s)')
        }
      }
    }
  }

  // Counts characters or words in text
  CharCount.prototype.count = function (text, options) {
    var length
    if (options && options.wordCount) {
      // var tokens = text.split(' ')
      // length = tokens.length-1
      var tokens = text.match(/\S+/g) || [] // Matches consecutive non-whitespace chars
      length = tokens.length
    } else {
      length = text.length
    }
    return length
  }

  // Highlight text from a specific limit to end
  CharCount.prototype.highlight = function (text, limit) {
    text = text.replace(/\n$/g, '\n\n')
    var textBeforeLimit = text.slice(0, limit).escape()
    var textAfterLimit = text.slice(limit).escape()
    text = [textBeforeLimit, '<mark>', textAfterLimit, '</mark>'].join('')
    return text
  }

  // Generate count message and bind it to the input
  // returns reference to the generated element
  CharCount.prototype.createCountMessage = function (countElement) {
    var elementId = countElement.getAttribute('id')
    // Check for existing info count message
    var countMessage = document.getElementById(elementId + '-info')
    // If there is no existing info count message we add one right after the field
    if (elementId && !countMessage) {
      countElement.insertAdjacentHTML('afterend', '<span id="' + elementId + '-info" class="form-hint js-count-message" aria-live="polite"></span>')
      countElement.setAttribute('aria-describedby', elementId + '-info')
      countMessage = document.getElementById(elementId + '-info')
    }
    return countMessage
  }

  // Bind input propertychange to the elements and update based on the change
  CharCount.prototype.bindChangeEvents = function (countElementExtended) {
    if (countElementExtended.countElement.addEventListener) {
      // W3C event model
      countElementExtended.countElement.addEventListener('input', CharCount.prototype.handleInput.bind(countElementExtended))
      // countElementExtended.countElement.addEventListener('onpropertychange', CharCount.prototype.updateCountMessage.bind(countElementExtended))
      // IE 9 does not fire an input event when the user deletes characters from an input (e.g. by pressing Backspace or Delete, or using the "Cut" operation).
      // countElementExtended.countElement.addEventListener('keyup', CharCount.prototype.updateCountMessage.bind(countElementExtended))
    } else {
      // Microsoft event model: onpropertychange/onkeyup
      countElementExtended.countElement.attachEvent('onkeyup', CharCount.prototype.handleInput.bind(countElementExtended))
    }

    // Bind scroll event if highlight is set
    if (countElementExtended.options.highlight === true) {
      countElementExtended.countElement.addEventListener('scroll', CharCount.prototype.handleScroll.bind(countElementExtended))
      window.addEventListener('resize', CharCount.prototype.handleResize.bind(countElementExtended))
    }

    // Bind focus/blur events for polling
    countElementExtended.countElement.addEventListener('focus', CharCount.prototype.handleFocus.bind(countElementExtended))
    countElementExtended.countElement.addEventListener('blur', CharCount.prototype.handleBlur.bind(countElementExtended))
  }

  // Applications like Dragon NaturallySpeaking will modify the fields by directly changing its `value`.
  // These events don't trigger in JavaScript, so we need to poll to handle when and if they occur.
  CharCount.prototype.checkIfValueChanged = function (countElementExtended) {
    if (!countElementExtended.countElement.oldValue) countElementExtended.countElement.oldValue = ''
    if (countElementExtended.countElement.value !== countElementExtended.countElement.oldValue) {
      countElementExtended.countElement.oldValue = countElementExtended.countElement.value
      CharCount.prototype.updateCountMessage(countElementExtended)
    }
  }

  // Update message box
  CharCount.prototype.updateCountMessage = function (countElementExtended) {
    var countElement = countElementExtended.countElement
    var options = countElementExtended.options
    var countMessage = countElementExtended.countMessage
    var countHighlight = countElementExtended.countHighlight
    // var countMessage = document.getElementById(countElement.getAttribute('aria-describedby'))

    // Determine the remainingNumber
    var currentLength = CharCount.prototype.count(countElement.value, options)
    var maxLength = countElementExtended.maxLength
    var remainingNumber = maxLength - currentLength

    // Set threshold if presented in options
    var threshold = 0
    if (options && options.threshold) {
      threshold = options.threshold
    }
    var thresholdValue = maxLength * threshold / 100
    if (thresholdValue > currentLength) {
      countMessage.classList.add('error-message-hidden')
    } else {
      countMessage.classList.remove('error-message-hidden')
    }

    if (!options.defaultBorder) {
      // Update styles
      if (remainingNumber < 0) {
        countElement.classList.add('form-control-error')
        countMessage.classList.add('error-message')
      } else {
        countElement.classList.remove('form-control-error')
        countMessage.classList.remove('error-message')
      }
    }

    // Update message
    var charVerb = 'remaining'
    var charNoun = 'character'
    if (options && options.wordCount) {
      charNoun = 'word'
    }
    charNoun = charNoun + ((remainingNumber === -1 || remainingNumber === 1) ? '' : 's')
    // charVerb = (remaining < 0)?'too many':'remaining'
    countMessage.innerHTML = remainingNumber + ' ' + charNoun + ' ' + charVerb

    // Update Highlight
    if (countHighlight) {
      var highlightedText = CharCount.prototype.highlight(countElement.value, maxLength)
      countHighlight.innerHTML = highlightedText
    }
  }

  // Check if value changed after input triggered
  CharCount.prototype.handleInput = function (event) {
    CharCount.prototype.checkIfValueChanged(this)
  }

  // Check if value changed on focus
  CharCount.prototype.handleFocus = function (event) {
    this.valueChecker = setInterval(CharCount.prototype.checkIfValueChanged, 100, this)
  }

  // Cancel valaue checking on blur
  CharCount.prototype.handleBlur = function (event) {
    clearInterval(this.valueChecker)
  }

  // Sync field scroll with the backdrop highlight scroll
  CharCount.prototype.handleScroll = function (event) {
    this.countHighlight.scrollTop = this.countElement.scrollTop
    this.countHighlight.scrollLeft = this.countElement.scrollLeft
  }

  // Update element's height after window resize
  CharCount.prototype.handleResize = function (event) {
    this.countHighlight.style.height = this.countElement.getBoundingClientRect().height + 'px'
  }

  // Initialize component
  CharCount.prototype.init = function (options) {
    if (options && options.selector) {
      CharCount.prototype.attach(options)
      CharCount.options = options
    } else {
      window.console.warn('Please specify the selector for the char/word count field')
    }
  }

  GOVUK.CharCount = CharCount
  global.GOVUK = GOVUK
})(window); // eslint-disable-line semi
