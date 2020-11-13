const returnstatus = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        console.log(err)
        ctx.status = 500;
        ctx.body = err;
    }
}

module.exports = {
    returnstatus
};