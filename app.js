const Koa = require('koa');
const fs = require('fs');
const KoaStatic = require('koa-static');
const websocket = require('koa-websocket');

const app = websocket(new Koa());

let ctxs = [];

app.ws.use(ctx => {
    ctx.websocket.send(JSON.stringify({content: '连接成功'}));

    ctxs.push(ctx);
    ctx.websocket.on("message", message => {
        for(let i = 0; i < ctxs.length; i++) {
            if (ctx == ctxs[i]) {
                console.log(message)
                ctxs[i].websocket.send(message);
                continue;
            }

            
            let msg = JSON.parse(message);
            let data = {
                from: msg.from,
                content: msg.content
            }
            console.log(JSON.stringify(data))

            ctxs[i].websocket.send(JSON.stringify(data));
        }
    })

    ctx.websocket.on("close", () => {
        console.log('close');
        let index = ctxs.indexOf(ctx);
        ctxs.splice(index, 1);
    })
})


app.use(KoaStatic('./'));

app.listen(3000, () => {
    console.log('server is running 3000...')
});
