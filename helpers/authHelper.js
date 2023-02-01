const request = require('request-promise');
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const cloudInstance = process.env.CLOUD_INSTANCE;
const scopes = ['user.read mail.send offline_access'];

async function getUserDetail(accessToken) {
    try {
        const options = {
            method: 'GET',
            uri: `https://graph.microsoft.com/v1.0/me`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            json: true
        };
        const user = await request(options);
        return user;
    } catch (err) {
        return err;
    };
};

async function refreshToken(refreshToken) {
    try {
        const tokenResponse = await request.post({
            url: `${cloudInstance}token`,
            form: {
                refresh_token: refreshToken,
                client_id: clientId,
                client_secret: clientSecret,
                scope: scopes.join(' '),
                grant_type: 'refresh_token'
            }
        });
        const tokens = JSON.parse(tokenResponse);

        return {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_at: Date.now() + tokens.expires_in * 1000
        };
    } catch (err) {
        return false;
    };
};

module.exports = {
    getUserDetail: getUserDetail,
    refreshToken: refreshToken
};
