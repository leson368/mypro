const Koa = require('koa');
const KoaStatic = require('koa-static');
const bodyParser = require('koa-bodyparser');
const router = require('koa-router')();
const websocket = require('koa-websocket');

const addControllers = require('./router');

const { User } = require('./mapping');


// 查询
User.findAll().then(users=>{
    console.log('All users:',JSON.stringify(users,null,4));
})

const app = websocket(new Koa());

(() => {
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
    
                ctxs[i].websocket.send(JSON.stringify(data));
            }
        })
    
        ctx.websocket.on("close", () => {
            console.log('close');
            let index = ctxs.indexOf(ctx);
            ctxs.splice(index, 1);
        })
    })
})();

app.use(async (ctx, next) => {
    try {
       await next(); 
    } catch(err) {
        // console.log(err)
        // console.log(ctx.status)
        // console.log(ctx.response.status)
        // ctx.response.status = 500;
        // ctx.body = err.errors;
        ctx.status = 500;
        ctx.body = err;
    }
})


addControllers(router);

app.use(bodyParser());
app.use(router.routes());
app.use(KoaStatic('views'));



app.listen(3000, () => {
    console.log('server is running 3000...')
});
