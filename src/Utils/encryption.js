var CryptoJS = require("crypto-js");

exports.encrypt = (myDataObj) => {
  const myData = JSON.stringify(myDataObj);
  ////console.log(process.env.REACT_APP_ENCRYPTION_KEY)
  try {
    const enData = CryptoJS.AES.encrypt(myData, process.env.REACT_APP_ENCRYPTION_KEY).toString();
    return enData;
  } catch (err) {
    // ////console.log(err);
  }
};

exports.decrypt = (data) => {
  try {
    var bytes = CryptoJS.AES.decrypt(data, process.env.REACT_APP_ENCRYPTION_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
  } catch (error) {
    console.error("AES decryption error:", error);
    return null;
  }

};