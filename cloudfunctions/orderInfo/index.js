// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    const value = event.value
    const status=event.info
    if(value == '堂食'){
        if(status=='正在备餐中'){
            return await db.collection('orderUser').orderBy('subTime','desc').where({
                style:'堂食',
                status:'正在备餐中'
            }).get({})
        }else{
            return await db.collection('orderUser').orderBy('subTime','desc').where({
                style:'堂食',
                status:db.command.neq('正在备餐中')
            }).get({})
        }
        
    }else{
        if(status=='正在备餐中'){
            return await db.collection('orderUser').orderBy('subTime','desc').where({
                style:'自提',
                status:'正在备餐中'
            }).get({})
        }else{
            return await db.collection('orderUser').orderBy('subTime','desc').where({
                style:'自提',
                status:db.command.neq('正在备餐中')
            }).get({})
        }
        
    }
}   