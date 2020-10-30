const login = ctx => {
    let { name, password } = ctx.request.body;
    console.log(`login:${name}, ${password}`)
}

const register = ctx => {
    console.log(ctx)
    let { name, password } = ctx.request.body;
    // ctx.response.status = 200;
    // ctx.response.message = 'success';
    let data = {
        success: true,
        msg: 'success',
        data: {
            name,
            password
        }
    }
    ctx.response.body = JSON.stringify(data);
}

module.exports = {
    'POST /login': login,
    'POST /register': register
}