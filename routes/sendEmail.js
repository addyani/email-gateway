var express = require('express');
var router = express.Router();

const UploadFilesMiddleware = require('../middlewares/uploadFilesMiddleware');
const SendMailController = require('../controllers/sendMailController');

router.post('/', UploadFilesMiddleware.array('attachments'), SendMailController.postSendMail )

module.exports = router;