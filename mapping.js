const Sequelize = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    pool: {
        max: 20,
        min: 0,
        idle: 30000
    }
});

sequelize.authenticate().then(()=>{
    console.log('Connection has been established successfully.');
}).catch(err=>{
    console.log('Unable to connect to the database:',err);
});

// 定义模型
const User = sequelize.define('user',{
    userid:{
        type:Sequelize.NUMBER,
        primaryKey:true
    },
    name:{
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    createtime: {
        type: Sequelize.DATE
    },
    updatetime: {
        type: Sequelize.DATE
    }
},{
    tableName:'user',
    timestamps: false
});

const UserRelation = sequelize.define('user',{
    userid:{
        type:Sequelize.NUMBER,
        primaryKey:true
    },
    friendid:{
        type: Sequelize.NUMBER
    },
    mark_user: {
        type: Sequelize.STRING
    },
    mark_friend: {
        type: Sequelize.STRING
    },
    createtime: {
        type: Sequelize.DATE
    },
    updatetime: {
        type: Sequelize.DATE
    }
},{
    tableName:'user_relation',
    timestamps: false
});

module.exports = {
    User,
    UserRelation
}
