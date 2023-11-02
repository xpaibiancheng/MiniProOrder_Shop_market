// pages/editor/editor.js
const defaultAvatarUrl = 'https://636c-cloud01-5gci5yp03a100130-1317739072.tcb.qcloud.la/bg/ava.png?sign=6156aab32b6bad6a040cbbeb834770e0&t=1681138034'
const app=getApp({})
Page({

    /**
     * 页面的初始数据
     */
    data: {
        avatarUrl:'',
        userName:wx.getStorageSync('userInfo').userName,
        phone:wx.getStorageSync('userInfo').phone
    },
    /* 自定义头像 */
    onChooseAvatar(e){
        const {avatarUrl}=e.detail
        this.setData({
            avatarUrl,
        })
        this.upLoadImages() 
    },
    /* 将头像上传 */
    upLoadImages(){
        var that=this
        wx.showLoading({
        title:'头像上传云端中'
        })
        wx.cloud.uploadFile({
        cloudPath:`userimage/${Math.random()}_${Date.now()}.${that.data.avatarUrl.match(/\.(\w+)$/)[1]}`,
            filePath: that.data.avatarUrl,
            success(res){
            console.log(res);
            wx.cloud.getTempFileURL({
                fileList:[res.fileID],
                success(e){
                    wx.hideLoading()
                    console.log(e.fileList[0].tempFileURL);
                    that.setData({
                        avatarUrl:e.fileList[0].tempFileURL
                    })
                }
            })
            }
        })
    },
    /* 名称 */
    bindNickname(e){
        console.log(e.detail.value);
        this.setData({
            userName:e.detail.value
        })
    },
    /* 手机 */
    bindPhone(e){
        console.log(e.detail.value);
        this.setData({
            phone:e.detail.value
        })
    },
    /* 账户提交 */
    bindSubmit(){
        var that=this
        
        if(this.data.userName.length>0){
            //修改手机号
            //检查手机号格式
            var pattern = /^1[1-9][0-9]{9}$/
            if(pattern.test(that.data.phone)){
                wx.showLoading({
                    title: '修改检查',
                  })
                wx.cloud.database().collection('userinfo').where({
                    _openid:app.globalData.openid
                }).update({
                    data:{
                         userName:this.data.userName,
                         userFace:this.data.avatarUrl,
                         phone:this.data.phone
                    },
                     success:(res)=>{
                         const userInfo=wx.getStorageSync('userInfo')
                         userInfo.userName=this.data.userName
                         userInfo.userFace=this.data.avatarUrl
                         userInfo.phone = this.data.phone
                         /* 存储到本地缓存中 */
                         wx.setStorageSync('userInfo', userInfo)
                         wx.showToast({
                             title: '更新成功！',
                             success(){
                                 wx.reLaunch({
                                 url: '/pages/user/user',
                                 })
                             }
                         })
     
                     }
                })
            }else{
                wx.showToast({
                  title: '手机号格式错误',
                  icon:'none'
                })
            }
           
        }else{
            wx.showToast({
              title: '完善昵称',
              icon:'error'
            })
        }
        
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            userName:wx.getStorageSync('userInfo').userName,
            avatarUrl:wx.getStorageSync('userInfo').userFace,
            phone:wx.getStorageSync('userInfo').phone
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