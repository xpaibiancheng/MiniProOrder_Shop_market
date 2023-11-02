// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
// 云函数入口函数
exports.main = async (event, context) => {
    /* const openid = event.valueOpen */
    try {
        const result = await cloud.openapi.subscribeMessage.send({
            "touser":event.openid,
             page: '/pages/orderDingDan/orderDingDan',
            "lang": 'zh_CN',
            data: {
            short_thing13: {
                value:'自提'
              },
              thing6: {
                value:'待取餐提醒'
              },
            },
            "templateId": 'wZcW8xLCNuavgHMo9WB2bZ3NLSgZ1rzxf4OF81zi3LI'
          })
        return result
      } catch (err) {
        return err
      }
}