var express = require('express');
var router = express.Router();

const ContactController = require('../controllers/contactController');

router.get('/', ContactController.getAll )
router.get('/recipient', ContactController.getAllIncludeTo )
router.get('/cc', ContactController.getAllIncludeCC )
router.get('/:id', ContactController.getById )
router.get('/delete/:id', ContactController.getDelete )
router.post('/', ContactController.postCreate )
router.post('/update/:id', ContactController.postUpdate )

module.exports = router;