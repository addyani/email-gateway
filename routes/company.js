var express = require('express');
var router = express.Router();

const CompanyController = require('../controllers/companyController');

router.get('/', CompanyController.getAll )
router.get('/:id', CompanyController.getById )
router.get('/contact/:id', CompanyController.getByIdInclude )
router.get('/include/contact', CompanyController.getAllInclude )
router.get('/delete/:id', CompanyController.getDelete )
router.post('/', CompanyController.postCreate )
router.post('/update/:id', CompanyController.postUpdate )

module.exports = router;