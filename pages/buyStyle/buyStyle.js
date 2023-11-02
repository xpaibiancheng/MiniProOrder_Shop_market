// pages/buyStyle/buyStyle.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hideNotice: false,
        notice:'快递计费规则--省内:消费满68包邮，省外:消费满168包邮;上门送货--3km内免费；超过3Km每超过1km加送运费块',
    },
    bindNavZiti(){
        wx.navigateTo({
          url: '/pages/ziti/ziti',
        })
    },
    bindKuaiDi(){
        wx.navigateTo({
          url: '/pages/kuaidi/kuaidi',
        })
    },
    bindTongcheng(){
        wx.navigateTo({
          url: '/pages/kdAddress/kdAddress',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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