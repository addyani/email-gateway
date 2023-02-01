var express = require('express');
var router = express.Router();

const UploadExcelMiddleware = require('../middlewares/uploadExcelMiddleware');
const ImportExcelController = require('../controllers/importExcelController');

router.post('/', UploadExcelMiddleware.single('excel'), ImportExcelController.postImport )

module.exports = router;