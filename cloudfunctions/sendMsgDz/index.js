// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
// 云函数入口函数
exports.main = async (event, context) => {
    /* const openid = event.valueOpen */
    try {
        const result = await cloud.openapi.subscribeMessage.send({
            "touser":event.openid,
             page: '/pages/user/user',
            "lang": 'zh_CN',
            data: {
                thing10: {
                    value:event.name
                },
                character_string2: {
                    value:event.code
                },
                time17: {
                    value:event.time
                },
                amount9: {
                    value:event.money
                },
            },
            "templateId": 'g-oT7S3EUnp2HdjKo79Ue1pd3TViMOrAv9j_c4xLgcQ'
          })
        return result
      } catch (err) {
        return err
      }
}