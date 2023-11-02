// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env:'*******'}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const res = await cloud.cloudPay.unifiedOrder({
        "body" :event.pro_name,
        "outTradeNo" :event.pro_codeNum,
        "spbillCreateIp" : "127.0.0.1",
        "subMchId" : "********",
        "totalFee" : event.pro_price,
        "envId": "*********",
        "functionName": "pay_cb"
      })
      return res
}