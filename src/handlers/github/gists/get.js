const getAxios = require("../../../modules/github/getAxios");
const { getSuccessResponse, getErrorResponse } = require("../../../modules/apiResponse");

exports.handler = async (event) => {
    try {
        const token = event.headers["x-api-session-id"];
        const { domainName, path } = event.requestContext;
        const [_, stage] = path.split("/");
        const imageApiEndpoint = `https://${domainName}/${stage || ""}/github/image`
        const { id } = event.pathParameters;
        if (!token) {
          return getErrorResponse(401, "token is not valid", { headers: event.headers });
        }
        if (!id) {
            return getErrorResponse(400, "id must be provided", { id, token });
        }
        try {
          const data = await getData(getAxios(token), token, imageApiEndpoint)(id);
          return getSuccessResponse({
            data,
            token,
          });
      } catch(error) {
        return getErrorResponse(401, error.message);
      }
    } catch(error) {
      return getErrorResponse(500, error.message);
    }
};

function getData(ax, token, imageApiEndpoint) {
  return async(id) => {
    const resposne = await ax.get("/gists/"+id);
    const { files = {}, created_at, updated_at } = resposne.data;
    const data = JSON.parse(files["data.json"].content) || {};
    const { image_id } = data;
    const image_url = imageApiEndpoint + "/" + image_id + "?key=" + token ;
    return { id, ...data, image_url, created_at, updated_at, dummy_flag: false };
  }
}