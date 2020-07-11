const getAxios = require("../../../modules/github/getAxios");
const { getSuccessResponse, getErrorResponse } = require("../../../modules/apiResponse");

exports.handler = async (event) => {
    try {
        const token = event.headers["x-api-session-id"];
        const { id } = event.pathParameters;
        if (!token) {
          return getErrorResponse(401, "token is not valid", { headers: event.headers });
        }
        if (!id) {
            return getErrorResponse(400, "id must be provided", { id, token });
        }
        try {
            const ax = getAxios(token);
            const image_id = await getImageId(ax)(id);
          const deleteResponses = await Promise.all([
              deleteGist(ax, token)(id),
              deleteGist(ax, token)(image_id),
           ]);
          return getSuccessResponse({
            results: [id, image_id],
            response: deleteResponses,
            token,
          });
      } catch(error) {
        return getErrorResponse(400, error.message);
      }
    } catch(error) {
      return getErrorResponse(500, error.message);
    }
};

function getImageId(ax) {
  return async(id) => {
    const resposne = await ax.get("/gists/"+id);
    const { files = {}, created_at, updated_at } = resposne.data;
    const data = JSON.parse(files["data.json"].content) || {};
    const { image_id } = data;
    return image_id;
  }
}

function deleteGist(ax) {
  return async(id) => {
    const resposne = await ax.delete("/gists/"+id);
    return resposne.data;
  }
}