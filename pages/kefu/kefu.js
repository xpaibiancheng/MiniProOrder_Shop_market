// pages/serviceCenter/serviceCenter.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgs:'',
        weChatNum:'',
        phoneNum:'',
     
    },
     /* 接入客服 */
     methods: {
        handleContact(e) {
          console.log(e.detail.path)
          console.log(e.detail.query)
        }
    },
    /* 预览图片 */
    bindPreviewImg(res){
        var value = res.currentTarget.dataset.info
        wx.previewImage({
          urls: [value],
        })
    
    },
    /* 复制微信 */
    bindPrevieWechat(res){
        var value = res.currentTarget.dataset.info
        console.log(value);
        wx.setClipboardData({
            data: value,
            success:()=>{
                wx.getClipboardData({
                    success:()=>{
                        wx.showToast({
                          title: 'Success',
                          icon:'success',
                          duration:'2000',
                          mask:"ture"//是否设置点击蒙版，防止点击穿透
                        })
                    }
                })
            },fail(e){
                console.log(e);
            }
        })
    },
    /* 复制手机号 */
    bindPreviewPhone(res){
        var value = res.currentTarget.dataset.info
        wx.setClipboardData({
            data: value,
            success:()=>{
                wx.getClipboardData({
                    success:()=>{
                        wx.showToast({
                          title: 'Success',
                          icon:'success',
                          duration:'2000',
                          mask:"ture"//是否设置点击蒙版，防止点击穿透
                        })
                    }
                })
            },fail(e){
                console.log(e);
            }
          })
    },
    /* 复制QQ号 */
    bindPreviewQQ(res){
        var value = res.currentTarget.dataset.info
        wx.setClipboardData({
            data: value,
            success:()=>{
                wx.getClipboardData({
                    success:()=>{
                        wx.showToast({
                          title: 'Success',
                          icon:'success',
                          duration:'2000',
                          mask:"ture"//是否设置点击蒙版，防止点击穿透
                        })
                    }
                })
            },fail(e){
                console.log(e);
            }
          })
    },
    /* 打电话 */
    callPhoneNum(res){
        var phone = res.currentTarget.dataset.phone
        wx.makePhoneCall({
            phoneNumber: phone,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.showLoading({
          title: '加载中',
        })
        wx.cloud.database().collection('kefu').get({
            success:(res)=>{
                console.log(res.data[0]);
                this.setData({
                    imgs:res.data[0].image,
                    weChatNum:res.data[0].weChatAccount,
                    phoneNum:res.data[0].phoneNum,
                 
                })
                wx.hideLoading()
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