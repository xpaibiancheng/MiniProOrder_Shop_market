// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
/* 连接云数据库 */
const db =cloud.database()
const $ = db.command.aggregate
// 云函数入口函数
exports.main = async (event, context) => {
    return await db.collection('orderDetail')
    .aggregate()
    .group({
      _id:null,
      categories: $.addToSet('$shopClass')
    })
    .end()
    console.log('调用成功');
}