var express = require('express');
var router = express.Router();

const DashboardController = require('../controllers/dashboardController');

//Frontend routes
router.get('/', DashboardController.getIndex )
router.get('/login', DashboardController.getLogin )
router.get('/dashboard', DashboardController.getDashboard )
router.get('/company-contact', DashboardController.getCompanyContact )

//Send Mailbox
router.get('/send', DashboardController.getMailbox )
router.post('/send', DashboardController.postMailbox )

//Upload Excel
router.get('/excel', DashboardController.getMailbox )
router.post('/excel', DashboardController.postMailbox )

//CRUD Company
router.get('/companys', DashboardController.getCompanyAll )
router.get('/companys/:id', DashboardController.getCompanyDetail )
router.get('/companys/delete/:id', DashboardController.getCompanyDelete )
router.post('/companys', DashboardController.postCompanyCreate )
router.post('/companys/update/:id', DashboardController.postCompanyUpdate )

//CRUD Contact
router.get('/contacts', DashboardController.getContactAll )
router.get('/contacts/:id', DashboardController.getContactDetail )
router.get('/contacts/delete/:id', DashboardController.getContactDelete )
router.post('/contacts', DashboardController.postContactCreate )
router.post('/contacts/update/:id', DashboardController.postContactUpdate )

//RUD MAILBOX Schedule
router.get('/mailbox-schedule/:id', DashboardController.getMailboxScheduleDetail )
router.get('/mailbox-schedule/delete/:id', DashboardController.getMailboxScheduleDelete )
router.post('/mailbox-schedule/update/:id', DashboardController.postMailboxScheduleUpdate )

//CRUD Mailbox Template
router.get('/template', DashboardController.getTemplateMailboxAll )
router.get('/template/:id', DashboardController.getTemplateMailboxDetail )
router.get('/template/delete/:id', DashboardController.getTemplateMailboxDelete )
router.post('/template', DashboardController.postTemplateMailboxCreate )
router.post('/template/update/:id', DashboardController.postTemplateMailboxUpdate )

module.exports = router;