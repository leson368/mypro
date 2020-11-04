const success = (ctx, data) => {
    let body =  {
        ...data,
        success: true,
        msg: data.msg || '操作成功'
    };

    ctx.response.body = body;
};

const fail = (ctx, data) => {
    let body = {
        ...data,
        success: false,
        msg: data.msg || '操作失败'
    };

    ctx.response.body = body;
};

module.exports = {
    success,
    fail
}