const Koa = require('koa');
const KoaStatic = require('koa-static');
const bodyParser = require('koa-bodyparser');
const router = require('koa-router')();
const websocket = require('koa-websocket');

const addControllers = require('./router');

const { User } = require('./mapping');

const { startSocket } = require('./websocket');


// 查询
User.findAll().then(users=>{
    console.log('All users:',JSON.stringify(users,null,4));
})

const app = websocket(new Koa());

startSocket(app);

app.use(async (ctx, next) => {
    try {
       await next(); 
    } catch(err) {
        console.log(err)
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
