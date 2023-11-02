// pages/adminPsRule/adminPsRule.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        result:{}
    },
    /*提交规则 */
    formSubmit(e){
        console.log(e.detail.value);
        var obj =e.detail.value
        if(obj.value.length==0 || obj.key.length==0 ||obj.morethan.length==0){
            wx.showToast({
              title: '请填写完整',
              icon:'none'
            })
        }else{
            wx.showLoading({
                title:'请稍等'
            })
            wx.cloud.database().collection('shangmen').doc('233d13796539bafc08505c983bb21c9f').update({
                data:{
                    base:obj.key,
                    km:obj.value,
                    more_than:obj.morethan
                },success:(res)=>{
                    wx.hideLoading()
                    wx.showToast({
                      title: 'Success!',
                    })
                   this.onLoad()
                },fail:(res)=>{
                    wx.hideLoading()
                    console.log(res);
                }
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.showLoading({
            title:'稍等'
        })
        wx.cloud.database().collection('shangmen').doc('233d13796539bafc08505c983bb21c9f').get({
            success:(res)=>{
                this.setData({
                    result:res.data
                })
                wx.hideLoading()
            },fail:(res)=>{
                wx.hideLoading()
                console.log(res);
            }
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