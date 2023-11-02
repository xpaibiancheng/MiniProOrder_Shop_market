// pages/dingzhuoInfo/dingzhuoInfo.js
const app=getApp({})
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userOderInfo:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.showLoading({
            title:'加载中'
        })
        var that=this
        console.log(app.globalData.openid);
        wx.cloud.database().collection('dingzhuo').where({
            _openid:app.globalData.openid
        }).get({
            success(res){
                console.log(res);
                that.setData({
                    userOderInfo:res.data
                })
                console.log(that.data.userOderInfo);
                wx.hideLoading()
            }
        })
    },
    bindToOderTable(){
        wx.navigateTo({
          url: '/pages/dingzuo/dingzuo',
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})