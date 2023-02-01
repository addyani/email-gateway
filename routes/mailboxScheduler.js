var express = require('express');
var router = express.Router();

const MailboxScheduleController = require('../controllers/mailboxScheduleController');

router.get('/', MailboxScheduleController.getAll )
router.get('/users', MailboxScheduleController.getAllUsers )
router.get('/:id', MailboxScheduleController.getById )
router.get('/delete/:id', MailboxScheduleController.getDelete )
router.post('/', MailboxScheduleController.postCreate )
router.post('/update/:id', MailboxScheduleController.postUpdate )

module.exports = router;