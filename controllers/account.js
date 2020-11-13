const { Op, QueryTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
const { sequelize, User, UserRelation } = require('../mapping');
const { success, fail } = require('../status');

const { ctxs, awaitPush } = require('../websocket');

// 登录
const login = async ctx => {
    const { name, password } = ctx.request.body;
    const user = await User.findOne({
        where: {
            name,
            password
        }
    });
    if (user) {
        let now = new Date().getTime();

        // cookie验证
        ctx.cookies.set('userid', user.userid, {
            expires: new Date(now + 1000 * 60 * 60),
            httpOnly: false
        });

        // token验证
        const token = jwt.sign({
            //token的创建日期
            time: Date.now(),
            //token的过期时间
            timeout: Date.now() + 60000,
            username: user.name,
            id: user.userid
        
        // token：解析token的标识
        
        }, 'token');
        

        success(ctx, { token });
    } else {
        fail(ctx, { msg: '账号或密码不正确' })
    }

}

// 注册
const register = async ctx => {
    const { name, password } = ctx.request.body;

    const user = await User.findOne({
        where: {
            name
        }
    });

    if (user) {
        fail(ctx, { msg: '该账号已被注册' })
    } else {
        await User.create({
            name,
            password
        });
        success(ctx, { msg: '注册成功' });
    }
}

// 获取好友列表
const friendList = async ctx => {
    const userid = ctx.cookies.get('userid');
    let sqlword = 'r.userid as add_from, r.friendid as add_to, r.createtime, r.updatetime, u.userid, u.name,';
    const friends = await sequelize.query(`select ${sqlword} r.mark_user as mark from user_relation r inner join user u on r.userid=${userid} and r.friendid=u.userid union all select ${sqlword} r.mark_friend as mark from user_relation r inner join user u on r.friendid=${userid} and r.userid=u.userid`, { type: QueryTypes.SELECT });
    success(ctx, { data: friends });
};

// 添加好友
const addFriend = async ctx => {
    const userid = ctx.cookies.get('userid');
    const { name } = ctx.request.body;
    if (!userid) {
        fail(ctx, { msg: '请先登录' });
    } else {
        const friend = await User.findOne({
            where: {
                name
            }
        });

        if (friend) {
            const relate = await UserRelation.findOne({
                where: {
                    [Op.or]: [
                        { userid, friendid: friend.userid },
                        { friendid: userid, userid: friend.userid }
                    ]
                }
            });

            if (relate) {
                fail(ctx, { msg: '已是好友' })
            } else {

                const username = await User.findOne({
                    attributes: ['name'],
                    where: {
                        userid
                    }
                });

                let data = {
                    push: true,
                    from: {
                        userid: userid,
                        name: username.name
                    }
                };

                if (ctxs[friend.userid]) {
                    ctxs[friend.userid].websocket.send(JSON.stringify(data));
                } else {
                    awaitPush[friend.userid] = JSON.stringify(data);
                }


                success(ctx, { msg: '已发送' });
            }
        } else {
            fail(ctx, { msg: '未找到该用户' })
        }

    }
};

// 接受添加好友请求
const accessFriend = async ctx => {
    const friendid = ctx.cookies.get('userid');
    const { userid } = ctx.request.body;

    await UserRelation.create({
        userid,
        friendid
    });

    const user = await User.findOne({
        where: {
            userid: friendid
        }
    })

    let data = {
        access: true,
        from: {
            userid: friendid,
            name: user.name
        }
    };

    if (ctxs[userid]) {
        ctxs[userid].websocket.send(JSON.stringify(data));
    } else {
        awaitPush[userid] = JSON.stringify(data);
    }

    success(ctx, { msg: '添加成功' });
}

module.exports = {
    'POST /login': login,
    'POST /register': register,
    'GET /friendList': friendList,
    'POST /addFriend': addFriend,
    'POST /access_friend': accessFriend,
}