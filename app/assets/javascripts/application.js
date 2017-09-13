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

  // Prevent browsers from storing/caching input data-target
  $('form').attr('autocomplete', 'off')

  // Disable autocorret, autocapitalize and spellcheck
  $('input, textarea').attr('autocorrect', 'off').attr('autocapitalize', 'off').attr('spellcheck', 'false')

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
  $('.link-back').on('click', function (event) {
    window.history.go(-1)
    event.preventDefault()
  })

  // Character Count component
  if ($('.js-character-counter').length) {
    var characterCount = new GOVUK.CharCount()
    characterCount.init({
      selector: 'js-character-counter',
      highlight: true,
      validation: true
    })
  }

  // Character Count component
  if ($('.js-character-counter2').length) {
    var characterCount2 = new GOVUK.CharCount()
    characterCount2.init({
      selector: 'js-character-counter2',
      highlight: true,
      validation: true
    })
  }

  // Add timeout modal
  // Set options in views/includes/timeout_modal.html
  GOVUK.modalDialog.init()

  // Add number input polyfill
  // For options and data attributes, see number-input.js
  GOVUK.numberInput.init()

  // Check if query string in URL specifies the next page
  var nextPage = getQueryStringByName('next')
  if (nextPage && $('input[type=submit]').length > 0) {
    $('form.form').attr('action', '/' + nextPage)
  }

  // Mock address lookup
  if ($('#mock-address-lookup').length) {
    // window.loaderTime = loaderTime || 5 // globaly defined in scripts.html
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
      // setTimeout(function () { $('#loader').focus() }, 2 * 1000)
      setTimeout(function () { loadContent(loader) }, 7 * 1000)

      // Copy the postcode and place it into a span on the second step
      var postcode = $('.address-lookup-step1 input').val()
      $('.address-lookup-step2 .postcode').html(postcode)
      return false
    })
    $('.change-postcode').on('click', function (e) {
      e.preventDefault()
      $('.address-lookup-step2').hide()
      $('.address-lookup-step1').show()
    })
  }

  // Loader component
  function loadContent (loader) {
    loader.updateMessage('5 addresses found')
    loader.stop()
    $('.address-lookup-step2').show()
    // $('#event-address').focus() // needed for AT
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
    results.sort() // sort the councils alphabetically

    // add postcodes to councils
    var councilPostcodes = [
      {council: 'Hammersmith and Fulham Council', postcodes: ['W6']},
      {council: 'Rugby Borough Council', postcodes: ['CV21', 'CV22', 'CV23', 'CV225QQ']},
      {council: 'Nuneaton and Bedworth Borough Council', postcodes: ['CV10', 'CV12']},
      {council: 'Warwick District Council', postcodes: ['CV2']},
      {council: 'Stratford-on-Avon District Council', postcodes: ['CV']},
      {council: 'Warwickshire County Council', postcodes: ['CV']},
      {council: 'North Warwickshire Borough Council', postcodes: ['CV']},
      {council: 'City of Westminster Council', postcodes: ['SW1A2AA']}
    ]

    syncResults(query
      ? results.filter(function (result) {
        if (result.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
          return true
        }
        for (var council in councilPostcodes) {
          if (councilPostcodes[council].council === result) {
            var matches = councilPostcodes[council].postcodes.filter(function (postcode) {
              // return query.toLowerCase().indexOf(postcode.toLowerCase()) !== -1
              return postcode.toLowerCase().indexOf(query.toLowerCase().replace(' ', '')) !== -1
            })
            if (matches.length) return true
          }
        }
        return false
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
      minLength: 2,
      defaultValue: $(element).attr('data-default-value'),
      autoselect: true
    }),
    element
  )

  // accessibleAutocomplete.enhanceSelectElement({
  //   selectElement: document.querySelector('#local-council-autocomplete'),
  //   source: suggest,
  //   name: 'local-council',
  //   defaultValue: $(element).attr('data-default-value'),
  //   autoselect: true
  // })

  // If passed query string is present in URL, returns its value
  function getQueryStringByName (name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search)
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
  }
  // Location picker component
  // if ($('#local-council-autocomplete').length) {
  //   openregisterLocationPicker({
  //     defaultValue: '',
  //     selectElement: document.getElementById('local-council-autocomplete'),
  //     url: '/public/javascripts/location-picker-graph.json'
  //   })
  // }
})
