const jwt = require('jsonwebtoken');

const verifyjwt = async (ctx, next) => {
    const url = ctx.url.split("?")[0];
    if (url === '/login.html' || url === '/register.html') {
        await next();
    } else {
        let token = ctx.request.headers["authorization"];
        if (token) {
            // 如果有token的话就开始解析
            const tokenItem = jwt.verify(token, 'token')
            // 将token的创建的时间和过期时间结构出来
            const { time, timeout } = tokenItem
            // 拿到当前的时间
            let data = new Date().getTime();
            // 判断一下如果当前时间减去token创建时间小于或者等于token过期时间，说明还没有过期，否则过期
            if (data - time <= timeout) {
                // token没有过期
                await next();
            } else {
                ctx.body = {
                    status: 405,
                    message: 'token 已过期，请重新登陆'
                }
            }
        } else {
            await next();
        }
    }
}


module.exports = {
    verifyjwt
};