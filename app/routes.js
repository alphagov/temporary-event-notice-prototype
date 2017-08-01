var express = require('express')
var router = express.Router()

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

router.get('/existing-premises-licence', function (req, res) {
  // get the answer from the query string
  var licensableActivities = req.query.licensableActivities
  if (licensableActivities == 'no') { // use == for checkboxes
    // redirect to the relevant page
    res.redirect('no-licence-needed')
  } else {
    // render the page requested
    res.render('existing-premises-licence')
  }
})

router.get('/ten-required', function (req, res) {
  // get the answer from the query string
  var existingLicence = req.query.existingLicence
  var licenceCover = req.query.licenceCover
  if (existingLicence === 'yes' && licenceCover === 'yes') {
    // redirect to the relevant page
    res.redirect('no-licence-needed')
  } else {
    // render the page requested
    res.render('ten-required')
  }
})

module.exports = router
