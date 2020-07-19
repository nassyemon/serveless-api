const getAxios = require("../../../modules/github/getAxios");
const { getSuccessResponse, getErrorResponse } = require("../../../modules/apiResponse");

exports.handler = async (event) => {
    try {
        const token = event.headers["x-api-session-id"];
        if (!token) {
          return getErrorResponse(401, "token is not valid", { headers: event.headers });
        }
        try {
          const response = await getAxios(token).get("/user");
          const result = response.data;
          if (!result || !result.login) {
            return getErrorResponse(401, "no user_id returned", { token, result });
          }
          return getSuccessResponse({
            session: token,
            user_id: result.login,
            user_name: result.name,
            token,
          });
      } catch(error) {
        return getErrorResponse(401, error.message);
      }
    } catch(error) {
      return getErrorResponse(500, error.message);
    }
};
