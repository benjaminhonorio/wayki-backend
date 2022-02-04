var cloudinary = require("cloudinary").v2;

const config = require("../config");

console.log("Cloudinary config:", config.cloudinary);
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true,
});

const uploadToCloudinary = ({ file, path, allowedExts }) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.tempFilePath,
      { folder: path, allowedFormats: allowedExts },
      function (error, result) {
        if (error) {
          return reject(error);
        }
        resolve(result.public_id);
      }
    );
  });
};
module.exports = uploadToCloudinary;
