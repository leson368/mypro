
function createWebsocket(url) {
    if (window.WebSocket) return new WebSocket(url);
    if (window.MozWebSocket) return new MozWebSocket(url);
    return false;
}

function linkWebsocket(param, { onmessage, onclose }) {
    const webSocket = createWebsocket("ws://localhost:3000/" + param);

    webSocket.onmessage = onmessage;

    webSocket.onclose = onclose;

    return webSocket;
}

