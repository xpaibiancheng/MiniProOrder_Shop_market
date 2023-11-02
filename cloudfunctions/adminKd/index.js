// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    const value = event.value
    if(value == '等待商家发货'){
        return await db.collection('shopKuaiDi').orderBy('subTime','desc').where({
            status:value
        }).get({})
    }else{
        return await db.collection('shopKuaiDi').orderBy('subTime','desc').where({
            status:db.command.neq('等待商家发货')
        }).get({})
    }
}   