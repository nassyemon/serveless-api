const defaultHeaders = {
    "Access-Control-Allow-Origin": "*",
};

function getSuccessResponse(body, headers) {
    return {
        statusCode: 200,
        headers: Object.assign({}, defaultHeaders, headers),
        body: JSON.stringify(body),
    }
}

function getErrorResponse(statusCode, message, options) {
  return {
      statusCode: statusCode,
      headers: defaultHeaders,
      body: JSON.stringify({ message: message, ...options }),
  };
}

module.exports = {
    getSuccessResponse,
    getErrorResponse,
};
