const { getSuccessResponse } = require("../../../modules/apiResponse");

const REQUEST_MESSAGE_CODE = "REQUEST_AUTH_CODE";
const REQUEST_MESSAGE_COMPLETE = "REQUEST_CLOSE_WINDOW";
const RESPONSE_MESSAGE_CODE = "AUTH_CODE";
const RESPONSE_MESSAGE_COMPLETE = "CLOSE_WINDOW";

exports.handler = async (event) => {
    const query = event.queryStringParameters || {};
    const { code, json = false } = query;
    if (json) {
        return getSuccessResponse({ code });
    }
    return {
        statusCode: 200,
        body: getContent(code),
        "headers": {
            'Content-Type': 'text/html',
        }
    };
};

function getContent(code) {
    return `
<html>
<head>
<script>
let messages = [];
let ready = false;
window.code = "${code}";

function echoMessage(message) {
    messages = [...messages, message];
    const elemLists = messages.map((text) => "<li>"+text+"</li>");
    document.getElementById("content").innerHTML = "<ul>"+elemLists.join('\\n')+"</ul>";
}

window.addEventListener("message", (event) => {
    console.log(event.data);
    const { type } = event.data;
    if (type) {
        echoMessage("received:" + type);
    }
    if (type === "${REQUEST_MESSAGE_CODE}") {
        event.source.postMessage({ type: "${RESPONSE_MESSAGE_CODE}", code: "${code}" }, event.origin);
        echoMessage("returned token");
    }
    if (type === "${REQUEST_MESSAGE_COMPLETE}") {
        echoMessage("closing window");
        event.source.postMessage({ type: "${RESPONSE_MESSAGE_COMPLETE}" }, event.origin);
        setInterval(() => {
            window.close(); 
        }, 100);
    }
});
document.addEventListener('DOMContentLoaded', function() {
    ready = true;
});

</script>
</head>
<body>
    <pre>
        <ul id="content">waiting...</div>
    </pre>
</body>
</html>
`;
}