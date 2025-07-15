// src/utils/common/decrypt.js
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.ENCRYPTION_SECRET || 'PABS_SECRET_KEY_123';

export const decryptPassword = (encryptedText) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || null;
  } catch (error) {
    console.error('[DECRYPTION ERROR]', error.message);
    return null;
  }
};
