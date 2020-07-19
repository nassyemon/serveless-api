const AWS = require('aws-sdk');
const { getSuccessResponse, getErrorResponse } = require("../../../modules/apiResponse");

exports.handler = async (event) => {
  const s3 = new AWS.S3({
    signatureVersion: 'v4'
  });
  try {
    const imagesList = await s3.listObjectsV2({
      Bucket: process.env.S3_UPLOADED_IMAGES_BUCKET,
      MaxKeys: 100,
    }).promise();
    const { Contents } = imagesList;
    const signedUrls = await Promise.all(
      Contents.map(
        async ({ Key }) => {
          const signedUrl = await s3.getSignedUrlPromise('getObject', {
            Bucket: process.env.S3_UPLOADED_IMAGES_BUCKET,
            Key,
            Expires: 60 * 60 * 2,
          });
          return { key: Key, url: signedUrl };
        }
      )
    );
    return getSuccessResponse({
      contents: Contents,
      signedUrls,
    });
  } catch (error) {
    console.error(error);
    return getErrorResponse(400, error.message);
  }
};
