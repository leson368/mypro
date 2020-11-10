
// const route = require('koa-route');

let ctxs = {};
let awaitPush = {};

function startSocket(app) {

    app.ws.use(ctx => {
        let url = ctx.url.substring(1);
        ctxs[url] = ctx;

        ctx.websocket.send(JSON.stringify({ message: '连接成功' }));
        if(awaitPush[url]) {
            ctx.websocket.send(awaitPush[url]);
            awaitPush[url] = null;
        }

        ctx.websocket.on("message", message => {
            console.log(url)
            let msg = JSON.parse(message);
            let data = {
                from: url,
                content: msg.content
            }
            ctxs[msg.to].websocket.send(JSON.stringify(data));
        })

        ctx.websocket.on("close", () => {
            console.log('close');
            // let index = ctxs.indexOf(ctx);
            ctxs[url] = null;
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