var express = require('express')
var router = express.Router()

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

router.get('/start-page', function (req, res) {
  req.session.destroy()
  res.render('start-page')
})

// Router to settings page
router.get('/prototype-settings', function (req, res) {
  // Display all variables
})

router.get('/existing-premises-licence', function (req, res) {
  // get the answer from the query string
  var licensableActivities = req.session.data['licensableActivities']
  if (licensableActivities == 'None') { // use == for checkboxes
    // redirect to the relevant page
    res.redirect('no-licence-needed')
  } else {
    // render the page requested
    res.render('existing-premises-licence')
  }
})

router.get('/ten-required', function (req, res) {
  // get the answer from the query string
  var existingLicence = req.session.data['existingLicence']
  var licenceCover = req.session.data['licenceCover']
  if (existingLicence === 'yes' && licenceCover === 'yes') {
    // redirect to the relevant page
    res.redirect('no-licence-needed')
  } else {
    // render the page requested
    res.render('ten-required')
  }
})

router.get('/previous-event-description', function (req, res) {
  // get the answer from the query string
  var previousLicence = req.session.data['previousLicence']
  if (previousLicence == 'no') { // use == for checkboxes
    // redirect to the relevant page
    res.redirect('task-list')
  } else {
    // render the page requested
    res.render('previous-event-description')
  }
})

router.get('/timeout', function (req, res) {
  req.session.destroy()
  res.render('timeout')
})

module.exports = router
