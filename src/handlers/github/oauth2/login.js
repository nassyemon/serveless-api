const { AuthorizationCode } = require('simple-oauth2');
const { config, scope, redirect_uri } = require("../../../modules/github/oauth2Config");
const getAxios = require("../../../modules/github/getAxios");
const { getSuccessResponse, getErrorResponse } = require("../../../modules/apiResponse");


exports.handler = async (event) => {
    try {
        const client = new AuthorizationCode(config);
        const body = event.body ? JSON.parse(event.body) : {};
        const { code } = body;
        const accessToken = await client.getToken({
            code,
            redirect_uri,
            scope: scope.join(","),
        });
        const token = accessToken.token.access_token;
        if (!token) {
          return getErrorResponse(401, "token is not valid", { accessToken });
        }
        try {
            const ax = getAxios(token);
            const response = await ax.get("/user");
            const result = response.data || {};
            if (!result || !result.login) {
                return getErrorResponse(401, "no user_id returned", { token, result });
            }
            return getSuccessResponse({
                session: token,
                user_id: result.login,
                user_name: result.name,
                token: accessToken,
            });
      } catch(error) {
        return getErrorResponse(401, error.message);
      }
    } catch(error) {
      return getErrorResponse(500, error.message);
    }
};
