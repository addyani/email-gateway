var express = require('express');
var router = express.Router();

const AuthMiddleware = require('../middlewares/authMiddleware');
const AuthController = require('../controllers/authController');

router.get('/', AuthController.getAuthorize )
router.get('/login', AuthController.getLogin )
router.get('/logout', AuthController.getLogout )
router.get('/user', AuthMiddleware.verifyLogin, AuthController.getUser )
router.get('/session', AuthMiddleware.verifyLogin, AuthController.getSession )
router.get('/refresh', AuthMiddleware.verifyLogin, AuthController.getRefreshRoken )

module.exports = router;