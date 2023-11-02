// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    const value = event.value
    if(value == '等待确认'){
        return await db.collection('dingzhuo').where({
            replay:value
        }).get({})
    }else{
        return await db.collection('dingzhuo').where({
            replay:db.command.neq('等待确认')
        }).get({})
    }
}   