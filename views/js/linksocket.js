
function createWebsocket(url) {
    if (window.WebSocket) return new WebSocket(url);
    if (window.MozWebSocket) return new MozWebSocket(url);
    return false;
}

function linkWebsocket({ onmessage, onclose, userid }) {
    const webSocket = createWebsocket("ws://localhost:3000/" + userid);

    webSocket.onmessage = onmessage;

    webSocket.onclose = onclose;
}

