const AuthHelper = require('../helpers/authHelper');
const request = require('request-promise');

class AuthMiddleware {
  static async verifyLogin(req, res, next) {
    try {
      if (req.session.access_token) {
        if (req.cookies.expires_at < Date.now()) {
          const relog = AuthHelper.refreshToken(req.session.refresh_token);
          req.session.access_token = relog.access_token;
          req.session.refresh_token = relog.refresh_token;
          req.session.expires_at = Date.now() + relog.expires_in * 1000;
        }

        const data = await AuthHelper.getUserDetail(req.session.access_token);
        if (data.statusCode === 401) {
          res.redirect('/authorize/login');
        } else {
          next();
        }; 
      } else res.redirect('/authorize/login');
    } catch (error) {
      res.redirect('/authorize/login');
    };
  };
  
};

module.exports = AuthMiddleware