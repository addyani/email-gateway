const request = require('request-promise');
const AuthHelper = require('../helpers/authHelper');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;
const cloudInstance = process.env.CLOUD_INSTANCE;
const scopes = ['user.read mail.send offline_access'];

class AuthController {
    static async getLogin(req, res, next) {
        const authUrl = `${cloudInstance}authorize?` +
            `client_id=${clientId}&` +
            `redirect_uri=${redirectUri}&` +
            `response_type=code&` +
            `scope=${encodeURIComponent(scopes.join(' '))}`;

        res.redirect(authUrl);
    };

    static async getAuthorize(req, res, next) {
        const code = req.query.code;

        const tokenResponse = await request.post({
            url: `${cloudInstance}token`,
            form: {
                code,
                redirect_uri: redirectUri,
                client_id: clientId,
                client_secret: clientSecret,
                scope: scopes.join(' '),
                grant_type: 'authorization_code'
            }
        });

        const tokens = JSON.parse(tokenResponse);
        req.session.access_token = tokens.access_token;
        req.session.refresh_token = tokens.refresh_token;
        req.session.expires_at = Date.now() + tokens.expires_in * 1000;

        res.redirect('/dashboard');
    };

    static async getLogout(req, res, next) {
        const logoutUrl = `${cloudInstance}logout?` +
            `post_logout_redirect_uri=http://localhost:3000/`;

        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            }
            res.redirect(logoutUrl);
        });
    };

    static async getUser(req, res, next) {
        const user = await AuthHelper.getUserDetail(req.session.access_token);
        res.json({
            info: user
        });
    };

    static async getSession(req, res, next) {
        res.json({
            info: "Middleware Successfully",
            refreshToken: req.session.refresh_token,
            accessToken: req.session.access_token,
            expires_at: req.session.expires_at
        });
    };

    static async getRefreshRoken(req, res, next) {
        const token = await AuthHelper.refreshToken(req.session.refresh_token);
        res.json({
            info: token
        });
    };
};

module.exports = AuthController