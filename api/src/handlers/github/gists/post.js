const getAxios = require("../../../modules/github/getAxios");
const { getSuccessResponse, getErrorResponse } = require("../../../modules/apiResponse");

const defaultBase64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAD6CAIAAAAAxYYTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTgwREE1NThGMUI4MTFFNThBQTBDQkUyRjRFOEYxQkEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTgwREE1NTlGMUI4MTFFNThBQTBDQkUyRjRFOEYxQkEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBODBEQTU1NkYxQjgxMUU1OEFBMENCRTJGNEU4RjFCQSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBODBEQTU1N0YxQjgxMUU1OEFBMENCRTJGNEU4RjFCQSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pm83lg4AABRgSURBVHja7J3rT9vW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";

exports.handler = async (event) => {
    try {
        const token = event.headers["x-api-session-id"];
        const body = event.body ? JSON.parse(event.body) : {};
        const { image: imageBase64Encoded, ...data } = body;
        if (!token) {
          return getErrorResponse(401, "token is not valid", { headers: event.headers });
        }
        const ax = getAxios(token);
        try {
          const res1 = await ax.post("/gists", {
              description: "minimum-react-test-image",
              public: false,
              files: {
                "image.base64.txt": {
                  content: imageBase64Encoded,
                },
              }
            });
          const { id } = res1.data;
          const contentData = {
            title: "This is a dummy title from server.",
            ...(data || {}),
            image_id: id, 
          };
          const response = await ax.post("/gists", {
              description: "minimum-react-test",
              public: false,
              files: {
                "data.json": {
                  content: JSON.stringify(contentData),
                },
              }
            });
          return getSuccessResponse(picker(response.data));
      } catch(error) {
        return getErrorResponse(401, error.message);
      }
    } catch(error) {
      return getErrorResponse(500, error.message, { body: event.body });
    }
};

function picker(gist) {
  const { id, url, created_at, updated_at, description, files } = gist;
  return { id, url, created_at, updated_at, description, files };
}