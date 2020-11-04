const { User } = require('../mapping');
const { success, fail } = require('../status');

const login = async ctx => {
    const { name, password } = ctx.request.body;
    const user = await User.findOne({
        where: {
            name,
            password
        }
    });
    if(user) {
        success(ctx, {});
    }else {
        fail(ctx, {msg: '账号或密码不正确'})
    }
    
}

const register = async ctx => {
    const { name, password } = ctx.request.body;
    console.log(1)

    const user = await findOne({
        where: {
            name
        }
    });

    console.log(2)

    console.log(user)

    if(user) {
        fail(ctx, {msg: '该账号已被注册'})
    } else {
        await User.create({
            name,
            password
        });
        success(ctx, {msg: '注册成功'});
    }
}

module.exports = {
    'POST /login': login,
    'POST /register': register
}