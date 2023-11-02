// 云函数代码
const cloud = require('wx-server-sdk')
exports.main = async (event, context) => {
  const ids = event.ids 
  const db = cloud.database()
  const collection = db.collection('shopCar') // 替换成你的集合名称
  const res = await collection.where({
    shopAll:{
        _id:_in(ids)
    }
  }).remove({
      success(res){
          wx.showToast({
            title: ids,
          })
      }
  })
  return ids
}
