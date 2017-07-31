/* global $ */
/* global GOVUK */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () {
  // Use GOV.UK shim-links-with-button-role.js to trigger a link styled to look like a button,
  // with role="button" when the space key is pressed.
  GOVUK.shimLinksWithButtonRole.init()

  // Show and hide toggled content
  // Where .multiple-choice uses the data-target attribute
  // to toggle hidden content
  var showHideContent = new GOVUK.ShowHideContent()
  showHideContent.init()

  // Deselect main checkboxes when none ticked
  // Deselect none when main checkboxes ticked
  var $selectButtons = $('.js-select-choice')
  var $deSelectButtons = $('.js-deselect-choice')

  $selectButtons.on('click', function () {
    $deSelectButtons.attr('checked', false)
  })
  $deSelectButtons.on('click', function () {
    $selectButtons.attr('checked', false)
  })
})
