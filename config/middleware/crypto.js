const CryptoJS = require('crypto-js');

const SECRET_KEY_STRING = 'nasipadangdiamaksama123456789012';
const IV_STRING         = '1234567890123456';

const SECRET_KEY = CryptoJS.enc.Utf8.parse(SECRET_KEY_STRING);
const IV         = CryptoJS.enc.Utf8.parse(IV_STRING);

function encryptData(data) {
    const payload = JSON.stringify(data);
    return CryptoJS.AES.encrypt(payload, SECRET_KEY, {
        iv: IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).toString();
    }

function decryptData(encryptedData) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY, {
        iv: IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedStr) throw new Error('Failed to decrypt data');
    return JSON.parse(decryptedStr);
}

module.exports = { encryptData, decryptData };
