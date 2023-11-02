// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'teacloud-4gtuflp13ff3ebb7'}) // 使用当前云环境

const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    // 上传服务器所有的微信内支付服务返回的信息
    db.collection("orderFinish").add({
        data:{
            finishTime:new Date().getTime(),
            return_info:event
        }
    })
    // 更新订单
    db.collection('orderUser').where({
        pay_status:"wait",
        orderNumber:event.outTradeNo
    }).update({
        data:{
            pay_status:'订单完成',
            update_time:new Date().getTime()
        }
    })
    // 返回指定格式的对象
    return {
        errcode:0,
        errmsg:"支付处理完成"
    }
    
}