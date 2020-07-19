const { AuthorizationCode } = require('simple-oauth2');
const { config, scope } = require("../../../modules/github/oauth2Config");
const { getSuccessResponse, getErrorResponse } = require("../../../modules/apiResponse");

exports.handler = async (event) => {
  try {
    const client = new AuthorizationCode(config);
    const headerToken = event.headers["x-api-session-id"];
    let accessToken = client.createToken({
      access_token: headerToken,
      scope: scope.join(","),
      token_type: "bearer",
    });
    accessToken.revokeAll();
    return getSuccessResponse({ success: true });
  } catch (error) {
    console.error(error);
    return getErrorResponse(500, error.message);
  }
};
