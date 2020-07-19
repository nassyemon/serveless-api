const { AuthorizationCode } = require('simple-oauth2');
const { config, scope, redirect_uri } = require("../../../modules/github/oauth2Config");
 
exports.handler = async (event) => {
  const client = new AuthorizationCode(config);
  const json = event && event.queryStringParameters && event.queryStringParameters.json;
  const authorizationUri = client.authorizeURL({
      redirect_uri: redirect_uri + (json ? "?json=1" : ""),
      scope: scope.join(","),
  });

  const response = {
      statusCode: 302,
      headers: {
          Location: authorizationUri,
      },
  };
  return response;
};
