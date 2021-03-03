const S3 = require('aws-sdk/clients/s3.js');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3-transform');
const uuid = require('node-uuid');
const config = require('../config/config');

const { accessKeyId } = config.wasabi;
const secretAccessKey = config.wasabi.secretKey;
const wasabiEndpoint = new AWS.Endpoint('s3.us-west-1.wasabisys.com');

const s3 = new S3({
  endpoint: wasabiEndpoint,
  region: 'us-west-1',
  accessKeyId,
  secretAccessKey,
});
const upload = multer({
  storage: multerS3({
    s3,
    bucket: config.wasabi.bucket,
    metadata(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key(req, file, cb) {
      const uid = uuid.v4();
      const ext = file.originalname.split('.')[1];
      cb(null, `${uid}.${ext}`);
    },
  }),
});

const getPublicUrl = async (Key) => {
  const params = { Bucket: config.wasabi.bucket, Key, Expires: 60 };
  const url = await new Promise((resolve, reject) => {
    s3.getSignedUrl('getObject', params, function (err, _url) {
      if (err) {
        reject(err);
      }
      resolve(_url);
    });
  });
  return url;
};

module.exports = { upload, getPublicUrl };
