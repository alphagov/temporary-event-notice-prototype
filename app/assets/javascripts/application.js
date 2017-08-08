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

  // Task list
  // Check for completed tasks and allow access only to the next one
  var $previousTask
  $('.task-list-item').each(function () {
    var previousCompleted = false
    if ($previousTask) {
      previousCompleted = $previousTask.find('.task-completed').length
      var thisCompleted = $(this).find('.task-completed').length
      if (!thisCompleted && !previousCompleted) {
        $(this).html($(this).find('.task-name').html())
      }
    }
    $previousTask = $(this)
  })

  // Character Count component
  if ($('.js-character-counter').length) {
    var characterCount = new GOVUK.CharCount()
    characterCount.init({
      selector: 'js-character-counter',
      highlight: true
    })
  }

  // Add timeout modal
  // Set options in views/includes/timeout_modal.html
  GOVUK.modalDialog.init()

  // Mock address lookup
  if ($('#mock-address-lookup').length) {
    window.loaderTime = loaderTime || 5
    $('.address-lookup-step2').hide()
    $('#mock-address-lookup .js-launch-lookup').on('click', function (e) {
      e.preventDefault()
      $('.address-lookup-step1').hide()

      // Initialise loader
      var loader = new GOVUK.Loader()
      loader.init({
        container: 'address-lookup-loader',
        label: true,
        labelText: 'Finding address...'
      })
      $('#loader').focus()
      setTimeout(function () { loadContent(loader) }, loaderTime * 1000)

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

  // Loader component
  function loadContent (loader) {
    loader.stop()
    $('.address-lookup-step2').show()
    // $('#select-box').focus()
  }

  // Autocomplete component
  function suggest (query, syncResults) {
    // List of local authorities from https://local-authority-eng.register.gov.uk/records
    // Also available for Scotland https://local-authority-sct.register.gov.uk/
    // and Wales https://principal-local-authority.register.gov.uk/
    var results = [
      'Birmingham City Council',
      'Borough Council of King\'s Lynn and West Norfolk',
      'Greater London Authority',
      'Worthing Borough Council',
      'Mid Sussex District Council',
      'Horsham District Council',
      'Crawley Borough Council',
      'Chichester District Council',
      'Arun District Council',
      'Adur District Council',
      'West Sussex County Council',
      'Wyre Forest District Council',
      'Wychavon District Council',
      'Worcester City Council',
      'Redditch Borough Council',
      'Malvern Hills District Council',
      'Bromsgrove District Council',
      'Worcestershire County Council',
      'Warwick District Council',
      'Stratford-on-Avon District Council',
      'Rugby Borough Council',
      'Nuneaton and Bedworth Borough Council',
      'North Warwickshire Borough Council',
      'Warwickshire County Council',
      'Tamworth Borough Council',
      'Staffordshire Moorlands District Council',
      'Stafford Borough Council',
      'South Staffordshire Council',
      'Newcastle-under-Lyme Borough Council',
      'Lichfield District Council',
      'East Staffordshire Borough Council',
      'Cannock Chase District Council',
      'Staffordshire County Council',
      'Woking Borough Council',
      'Waverley Borough Council',
      'Tandridge District Council',
      'Surrey Heath Borough Council',
      'Spelthorne Borough Council',
      'Runnymede Borough Council',
      'Reigate and Banstead Borough Council',
      'Mole Valley District Council',
      'Guildford Borough Council',
      'Epsom and Ewell Borough Council',
      'Elmbridge Borough Council',
      'Surrey County Council',
      'West Somerset District Council',
      'Taunton Deane Borough Council',
      'South Somerset District Council',
      'Sedgemoor District Council',
      'Mendip District Council',
      'Somerset County Council',
      'Waveney District Council',
      'Suffolk Coastal District Council',
      'St Edmundsbury Borough Council',
      'Mid Suffolk District Council',
      'Ipswich Borough Council',
      'Forest Heath District Council',
      'Babergh District Council',
      'Suffolk County Council',
      'West Oxfordshire District Council',
      'Vale of White Horse District Council',
      'South Oxfordshire District Council',
      'Oxford City Council',
      'Cherwell District Council',
      'Oxfordshire County Council',
      'Selby District Council',
      'Scarborough Borough Council',
      'Ryedale District Council',
      'Richmondshire District Council',
      'Harrogate Borough Council',
      'Hambleton District Council',
      'Craven District Council',
      'North Yorkshire County Council',
      'Rushcliffe Borough Council',
      'Newark and Sherwood District Council',
      'Mansfield District Council',
      'Gedling Borough Council',
      'Broxtowe Borough Council',
      'Bassetlaw District Council',
      'Ashfield District Council',
      'Nottinghamshire County Council',
      'Wellingborough Borough Council',
      'South Northamptonshire Council',
      'Northampton Borough Council',
      'Kettering Borough Council',
      'East Northamptonshire Council',
      'Daventry District Council',
      'Corby Borough Council',
      'Northamptonshire County Council',
      'South Norfolk District Council',
      'Norwich City Council',
      'North Norfolk District Council',
      'Great Yarmouth Borough Council',
      'Broadland District Council',
      'Breckland District Council',
      'Norfolk County Council',
      'West Lindsey District Council',
      'South Kesteven District Council',
      'South Holland District Council',
      // London Borough Councils
      'Barnet Council',
      'Bexley Council',
      'Brent Council',
      'Bromley Council',
      'Camden Council',
      'City of London Council',
      'City of Westminster Council',
      'Croydon Council',
      'Ealing Council',
      'Enfield Council',
      'Greenwich Council',
      'Hackney Council',
      'Hammersmith and Fulham Council',
      'Haringey Council',
      'Harrow Council',
      'Havering Council',
      'Hillingdon Council',
      'Hounslow Council',
      'Islington Council',
      'Kensington and Chelsea Council',
      'Kingston Council',
      'Lambeth Council',
      'Lewisham Council',
      'Merton Council',
      'Newham Council',
      'Redbridge Council',
      'Richmond Council',
      'Southwark Council',
      'Sutton Council',
      'Tower Hamlets Council',
      'Waltham Forest Council',
      'Wandsworth Council'
    ]
    syncResults(query
      ? results.filter(function (result) {
          return result.toLowerCase().indexOf(query.toLowerCase()) !== -1
        })
      : []
    )
  }

  var element = document.querySelector('#local-council-autocomplete')
  var id = 'local-council'
  preact.render(
    preact.createElement(Autocomplete.default, {
      id: id,
      source: suggest,
      name: 'local-council',
      defaultValue: $(element).attr('data-default-value')
    }),
    element
  )

  // Location picker component
  // if ($('#local-council-autocomplete').length) {
  //   openregisterLocationPicker({
  //     defaultValue: '',
  //     selectElement: document.getElementById('local-council-autocomplete'),
  //     url: '/public/javascripts/location-picker-graph.json'
  //   })
  // }
})
