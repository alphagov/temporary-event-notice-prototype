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

  // Go to the previous page
  $('.link-back').on('click', function () {
    window.history.back()
  })

  // Mock address lookup
  if ($('#mock-address-lookup').length) {
    $('.address-lookup-step2').hide()
    $('#mock-address-lookup .js-launch-lookup').on('click', function (e) {
      e.preventDefault()
      $('.address-lookup-step1').hide()
      $('.address-lookup-step2').show()
      // Copy the postcode and place it into a span on the second step
      var postcode = $('.address-lookup-step1 input').val()
      $('.address-lookup-step2 .postcode').html(postcode)
    })
    $('.change-postcode').on('click', function (e) {
      e.preventDefault()
      $('.address-lookup-step2').hide()
      $('.address-lookup-step1').show()
    })
  }

  // Character Count
  var characterCount = new GOVUK.CharCount()
  characterCount.init({
    selector: 'js-character-counter',
    highlight: true
  })
})
