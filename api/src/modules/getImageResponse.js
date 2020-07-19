module.exports = (base64Image, contentType) => {
    return {
        statusCode: 200,
        headers: {
          "Content-Type": contentType,
        },
        isBase64Encoded: true,
        body: base64Image,
    };
};
