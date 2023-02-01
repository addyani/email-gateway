const crypto = require('crypto');
const secretKey = process.env.ENCRYPT_KEY_SECRET;
const secretAlgorith = process.env.ENCRYPT_KEY_ALGORITHM;

class CryptoHelper {
    static encode(token) {
        try {
            const cipher = crypto.createCipher(secretAlgorith, secretKey);
            let encrypted = cipher.update(token, 'utf8', 'hex');
            encrypted += cipher.final('hex');

            return encrypted;
        } catch (err) {
            return err;
        };
    };

    static decode(token) {
        try {
            const decipher = crypto.createDecipher(secretAlgorith, secretKey);
            let decrypted = decipher.update(token, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        } catch (err) {
            return false;
        };
    };
};

module.exports = CryptoHelper