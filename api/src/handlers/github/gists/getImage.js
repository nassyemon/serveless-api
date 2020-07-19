const getAxios = require("../../../modules/github/getAxios");
const getImageResponse= require("../../../modules/getImageResponse");

exports.handler = async (event) => {
    const { id } = event.pathParameters || {};
    const { key: token } = event.queryStringParameters || {};
    const resposne = await getAxios(token).get("/gists/"+id);
    const { files = {} } = resposne.data;
    const data = files["image.base64.txt"].content;
    const [header, base64Image] = data.split(';base64,');
    const contentType = header ? header.split('data:')[1] : "image/jpeg";
    return getImageResponse(base64Image, contentType);
};