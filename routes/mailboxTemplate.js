var express = require('express');
var router = express.Router();

const TemplateMailController = require('../controllers/templateMailController');

router.get('/', TemplateMailController.getAll )
router.get('/users', TemplateMailController.getAllUsers )
router.get('/:id', TemplateMailController.getById )
router.get('/delete/:id', TemplateMailController.getDelete )
router.post('/', TemplateMailController.postCreate )
router.post('/update/:id', TemplateMailController.postUpdate )

module.exports = router;