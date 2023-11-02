// pages/payOrder/payOrder.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        price:0
    },
    bindColl(e){
        console.log(e.detail.value);
        this.setData({
            price:e.detail.value
        })
    },
    /* 提交 */
    bindSubPrice(){
        wx.showLoading({
            title:'设置中'
        })
        console.log(111);
        var num =parseFloat(this.data.price)
        wx.cloud.database().collection('preOrder').doc('233d13796535102607f155b82ff946a8').update({
            data:{
                price:num
            },success:()=>{
                wx.hideLoading()
                wx.showToast({
                  title: '设置成功',
                })
            },fail:(res)=>{
                wx.hideLoading()
                console.log(res);
            }
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