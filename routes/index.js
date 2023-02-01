var express = require('express');
var router = express.Router();

const DashboardController = require('../controllers/dashboardController');

//Frontend routes
router.get('/', DashboardController.getIndex )
router.get('/dashboard', DashboardController.getDashboard )
router.get('/company-contact', DashboardController.getCompanyContact )
router.get('/send', DashboardController.getMailbox )
router.post('/send', DashboardController.postMailbox )

router.get('/mailbox-schedule', DashboardController.getMailboxScheduleDelete )
router.get('/mailbox-schedule/:id', DashboardController.getMailboxScheduleDetail )
router.post('/mailbox-schedule', DashboardController.postMailboxScheduleUpdate )

module.exports = router;

/*  -- Template Mailboxes --

router.get('/template', DashboardController.getTemplateMailboxAll )
router.get('/template/:id', DashboardController.getTemplateMailboxDetail )
router.get('/template/delete/:id', DashboardController.getTemplateMailboxDelete )
router.post('/template', DashboardController.postTemplateMailboxCreate )
router.post('/template/update/:id', DashboardController.postTemplateMailboxUpdate )

*/