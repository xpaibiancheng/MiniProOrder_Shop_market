// pages/login/login.js
const defaultAvatarUrl = 'https://636c-cloud01-5gci5yp03a100130-1317739072.tcb.qcloud.la/bg/ava.png?sign=6156aab32b6bad6a040cbbeb834770e0&t=1681138034'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        avatarUrl:defaultAvatarUrl,
        nickname:"",
        phone:''
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
        nickname:e.detail.value
    })
    },
    /* 手机号 */
    bindPhone(e){
        console.log(e.detail.value);
        this.setData({
            phone:e.detail.value
        })
    },
    /* 账户提交 */
    bindSubmit(){
        var that=this
        wx.showLoading({
          title: '登录检查中',
        })
        if(this.data.nickname.length>0){
            //检查手机号格式
            var pattern = /^1[1-9][0-9]{9}$/
            if(pattern.test(this.data.phone)){
                //检测手机号是否存在
                wx.cloud.database().collection('userinfo').where({
                    phone:this.data.phone
                }).get({
                    success:(res_3)=>{
                        console.log(res_3);
                        if(res_3.data.length>0){
                            wx.showToast({
                              title: '已有该用户',
                              icon:'none'
                            })
                        }else{
                            /* 创建编号 */
                            var userNum=parseInt(Math.random()*100000000)
                            /* 提交数据库 */
                            wx.cloud.database().collection('userinfo').add({
                                    data:{
                                        userName:that.data.nickname,
                                        userFace:that.data.avatarUrl,
                                        phone:that.data.phone,
                                        userNum:userNum,
                                        jifen:0,
                                        userAccount:0
                                    },success(res){
                                        wx.hideLoading()
                                        /* 建立对象 */
                                        const userInfo={}
                                        userInfo.userName=that.data.nickname
                                        userInfo.userFace=that.data.avatarUrl
                                        userInfo.userNum=userNum
                                        userInfo.phone =that.data.phone
                                        userInfo.loginFlag=1
                                        /* 存储到本地缓存中 */
                                        wx.setStorageSync('userInfo', userInfo)
                                        wx.showToast({
                                            title: 'Success！',
                                            success(){
                                                wx.reLaunch({
                                                    url: '/pages/index/index',
                                                })
                                            }
                                        })
                                    }
                            })
                        }
                    }
                })
            }else{
                wx.showToast({
                  title: '手机号错误',
                  icon:'none'
                })
            }
           
        }else{
            wx.showToast({
              title: '完善昵称',
            })
        }
        
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