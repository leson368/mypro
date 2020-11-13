
// const route = require('koa-route');

let ctxs = {};
let awaitPush = {};

function startSocket(app) {

    app.ws.use(ctx => {
        let from = ctx.url.substring(1);
        ctxs[from] = ctx;

        ctx.websocket.send(JSON.stringify({ message: '连接成功' }));
        if (awaitPush[from]) {
            ctx.websocket.send(awaitPush[from]);
            awaitPush[from] = null;
        }

        ctx.websocket.on("message", message => {
            let msg = JSON.parse(message);
            console.log(msg)
            let data = {
                from,
                content: msg.content
            }

            if (ctxs[msg.to]) {
                ctxs[msg.to].websocket.send(JSON.stringify(data));
            } else {
                awaitPush[msg.to] = JSON.stringify(data);
            }

            ctx.websocket.send(JSON.stringify({ mysend: msg.mysend, sended: true }));
        })

        ctx.websocket.on("close", () => {
            console.log('close');
            // let index = ctxs.indexOf(ctx);
            ctxs[from] = null;
        })
    });

    // app.ws.use(route.all('/:id', function (ctx) {
    //     // `ctx` is the regular koa context created from the `ws` onConnection `socket.upgradeReq` object.
    //     // the websocket is added to the context on `ctx.websocket`.

    //     ctx.websocket.on('message', function (message) {
    //         // do something with the message from client
    //         console.log(message);
    //     });
    // }));
}

module.exports = {
    ctxs,
    startSocket,
    awaitPush
}