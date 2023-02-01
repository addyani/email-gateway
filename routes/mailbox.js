var express = require('express');
var router = express.Router();

const MailboxController = require('../controllers/mailboxController');

router.get('/', MailboxController.getAll )
router.get('/users', MailboxController.getAllUsers )
router.get('/:id', MailboxController.getById )
router.get('/delete/:id', MailboxController.getDelete )
router.post('/', MailboxController.postCreate )
router.post('/update/:id', MailboxController.postUpdate )

module.exports = router;