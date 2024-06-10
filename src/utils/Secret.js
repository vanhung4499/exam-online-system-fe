import CryptoJS from 'crypto-js';

/**
 * AES encryption
 * @param plainText Plain text
 * @param keyInBase64Str Base64-encoded key
 * @returns {string} Base64-encoded ciphertext
 */
export function encryptByAES(plainText, keyInBase64Str) {
  let key = CryptoJS.enc.Base64.parse(keyInBase64Str);
  let encrypted = CryptoJS.AES.encrypt(plainText, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  // Here, encrypted is not a string but a CipherParams object
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

/**
 * AES decryption
 * @param cipherText Ciphertext
 * @param keyInBase64Str Base64-encoded key
 * @return Plain text
 */
export function decryptByAES(cipherText, keyInBase64Str) {
  let key = CryptoJS.enc.Base64.parse(keyInBase64Str);
  // Returns a Word Array Object, which is essentially a byte array in Java
  let decrypted = CryptoJS.AES.decrypt(cipherText, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}
