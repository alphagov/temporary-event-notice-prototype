var express = require('express')
var router = express.Router()

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

router.get('/task-list', function (req, res) {
  var taskListItems = [
    {index: '1', title: 'Local council', url: 'local-council', description: 'Find the council you need to apply to', values: ['local-council'], status: ''},
    {index: '2', title: 'Previous event details', url: 'previous-events', description: 'Provide details of any events you’ve held in the last year.', values: ['previousLicence'], status: ''},
    {index: '3', title: 'Event details', url: 'event-start-date', description: 'Confirm activites, dates and location for this application.', values: ['event-start-day'], status: ''},
    {index: '4', title: 'Applicant details', url: 'applicant-details', description: 'Supply contact information.', values: ['applicant-name'], status: ''},
    {index: '5', title: 'Complete application', url: 'check-your-answers', description: 'Check your application, agree to the terms and conditions, and pay the £21 fee.', values: [], status: ''}
  ]

  var lastCompleted = 1
  for (var i = 0; i < taskListItems.length; i++) {
    if (taskListItems[i].values) {
      var completed = false
      var partlyCompleted = false
      taskListItems[i].values.forEach((value, index) => {
        if (req.session.data[value]) {
          partlyCompleted = true
          completed = true
        } else {
          completed = false
        }
      })
      if (completed) {
        taskListItems[i].status = 'completed'
      } else if (partlyCompleted) {
        taskListItems[i].status = 'partlyCompleted'
      } else if (i === 0 || taskListItems[i-1].status === 'completed') {
        taskListItems[i].status = 'actionable'
      }
    }
  }
  res.render('task-list', {items: taskListItems})
})

router.get('/start-page', function (req, res) {
  req.session.destroy()
  res.render('start-page')
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
    res.redirect('task-list#event-start-date')
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
