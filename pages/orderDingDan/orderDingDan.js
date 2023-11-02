// pages/orderDingDan/orderDingDan.js
const app=getApp({})
Page({

    /**
     * 页面的初始数据
     */
    data: { 
        rows:[]

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.showLoading({
            title:'加载中'
        })
        wx.cloud.database().collection('orderUser').orderBy('subTime','desc').where({
            _openid:app.globalData.openid
        }).get({
            success:(res)=>{
                /* console.log(res); */
                var temp=res.data
                var price=0
                for(var i=0;i<res.data.length;i++){
                    for(var j=0;j<res.data[i].orderGroups.length;j++){
                        price=price+parseFloat(res.data[i].orderGroups[j].priceAll)
                    }
                    temp[i].priceOrder=price.toFixed(2)
                    /* console.log("temp:",temp); */
                }
                this.setData({
                    rows:temp
                })
                wx.hideLoading()
                /* console.log(this.data.rows); */
            }
        })
    },
    bindOrderFirst(){
        wx.navigateTo({
          url: '/pages/orderSelect/orderSelect',
        })
    },
    /* 再来一单 */
    bindAagin(){
        wx.switchTab({
          url: '/pages/index/index',
        })
    },
    /* 开具发票 */
    bindGetFa(){
        wx.showModal({
          title: '请联系店主',
          content: '开具发票',
        })
    },
})