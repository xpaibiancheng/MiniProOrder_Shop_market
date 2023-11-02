// pages/adminUser/adminUser.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userinfo:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var len = this.data.userinfo.length
        wx.showLoading({
          title: '用户',
        })
        wx.cloud.callFunction({
            name:'adminUser',
            data:{
                value:len
            },success:(res)=>{
                console.log(res);
                wx.hideLoading()
                var temp = this.data.userinfo; // temp []
                var tempRes = res.result.data; // tempRes = [{}, {}]
                temp = temp.concat(tempRes);
                console.log(temp);
                this.setData({
                    userinfo:temp
                })
            },fail:(res)=>{
                wx.hideLoading()
                console.log(res);
            }
        })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        var len = this.data.userinfo.length
        wx.showLoading({
          title: '加载中',
        })
        wx.cloud.callFunction({
            name:'adminUser',
            data:{
                value:len
            },success:(res)=>{
                console.log(res);
                wx.hideLoading()
                var temp = this.data.userinfo
                temp.concat(res.result.data)
                this.setData({
                    userinfo:temp
                })
            },fail:(res)=>{
                wx.hideLoading()
                console.log(res);
            }
        })
    },

})