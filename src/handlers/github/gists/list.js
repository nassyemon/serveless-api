const getAxios = require("../../../modules/github/getAxios");
const { getSuccessResponse, getErrorResponse } = require("../../../modules/apiResponse");

exports.handler = async (event) => {
    try {
        const token = event.headers["x-api-session-id"];
        const { domainName, path } = event.requestContext;
        const [_, stage] = path.split("/");
        const imageApiEndpoint = `https://${domainName}/${stage || ""}/github/image`
        if (!token) {
          return getErrorResponse(401, "token is not valid", { headers: event.headers });
        }
        const ax = getAxios(token);
        const fetchData = getData(ax, token, imageApiEndpoint);
        const mapData = ({ id }) => fetchData(id);
        try {
          const response = await ax.get("/gists");
          const results = response.data || [];
          const filtered = results.filter(gistFilter);
          const data = await Promise.all(filtered.map(mapData));
          return getSuccessResponse({ event, data, token });
      } catch(error) {
        return getErrorResponse(401, error.message);
      }
    } catch(error) {
      return getErrorResponse(500, error.message);
    }
};

function gistFilter(gist) {
  const { files = {}, description } = gist || {};
  if (description !== "minimum-react-test") {
    return false;
  }
  return files && files["data.json"];
}

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