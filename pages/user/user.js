// pages/user/user.js
const app=getApp({})
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loginFlag:0,
        userFace:'',
        userName:'',
        userNum:'',
        userAccount:'',
        showModalStatus:false,
        adminFlag:false,
        errorCount:'',
        inputPass:'',
        password:'',
        quanLen:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        /* console.log(wx.getStorageSync('userInfo')); */
        if(wx.getStorageSync('userInfo').loginFlag==1){
            this.setData({
                loginFlag:1,
                userName:wx.getStorageSync('userInfo').userName,
                userFace:wx.getStorageSync('userInfo').userFace,
                userNum:wx.getStorageSync('userInfo').userNum,
                phone:wx.getStorageSync('userInfo').phone
            })
        }
        /* 账户余额 */
        wx.showLoading({
          title: '用户余额',
        })
        wx.cloud.database().collection('userinfo').where({
            _openid:app.globalData.openid
        }).get({
            success:(res)=>{
                console.log('用户余额:',parseFloat(res.data[0].userAccount).toFixed(2));
                this.setData({
                    userAccount:parseFloat(res.data[0].userAccount).toFixed(2)
                })
                wx.hideLoading()
            }
        })
        /* 优惠券 */
        wx.cloud.database().collection('youhuiQuan').where({
            _openid:app.globalData.openid
        }).get({
            success:(res)=>{
                this.setData({
                    quanLen:res.data.length
                })
            }
        })
    },
    /* 登录检查 */
    toLogin(){
        console.log(app.globalData.openid);
        wx.cloud.database().collection('userinfo').where({
            _openid:app.globalData.openid
        }).get({
            success(res){
                console.log(res);
                if(res.data.length==0){
                    wx.navigateTo({
                      url: '/pages/login/login',
                    })
                }else{
                    wx.showToast({
                      title: '老用户自动登录',
                    })
                    /* 再次将数据更新到缓存当中 */
                    const userInfo={}
                    userInfo.userName=res.data[0].userName
                    userInfo.userFace=res.data[0].userFace
                    userInfo.userNum=res.data[0].userNum
                    userInfo.phone=res.data[0].phone
                    userInfo.loginFlag=1
                    /* 存储到本地缓存中 */
                    wx.setStorageSync('userInfo', userInfo)
                    console.log(wx.getStorageSync('userInfo'));
                    wx.reLaunch({
                        url: '/pages/index/index',
                    })
                }
            }
        })
    },
    /* 退出等了 */
    bindExit(){
        wx.showModal({
          title: '确定退出登录？',
          content: '点击确定退出',
          complete: (res) => {
            
            if (res.confirm) {
                wx.clearStorageSync()
                wx.reLaunch({
                  url: '/pages/user/user',
                })
            }
          }
        })
        
    },
    /* 收货地址 */
    bindMyAddress(){
        wx.navigateTo({
          url: '/pages/address/address',
        })
    },
    /* 商城订单页面 */
    bindOrderShop(){
        wx.navigateTo({
          url: '/pages/shopDingdan/shopDingdan',
        })
    },
    /* 留言 */
    bindToLiuyan(){
        wx.navigateTo({
          url: '/pages/fankui/fankui',
        })
    },
    orderInfo(){
        wx.navigateTo({
          url: '/pages/dingzhuoInfo/dingzhuoInfo',
        })
    },
    bindKefu(){
        wx.navigateTo({
          url: '/pages/kefu/kefu',
        })
    },
    bindToEditor(){
        wx.navigateTo({
          url: '/pages/editor/editor',
        })
    },
    //点击我显示底部弹出框
    bindShopCar: function (res) {
        /* 判断是否登录 */
        this.showModal();
    },
    //显示对话框
    showModal: function () {
        // 显示遮罩层
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()
        this.setData({
        animationData: animation.export(),
            showModalStatus: true
        })
        setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
            animationData: animation.export()
        })
        }.bind(this), 200)
    },
    //隐藏对话框
    hideModal: function () {
        // 隐藏遮罩层
        var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()
        this.setData({
        animationData: animation.export(),
        })
        setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
            animationData: animation.export(),
            showModalStatus: false
        })
        }.bind(this), 200)
    },
    /* 进入管理员 */
    bindNavAdmin(){
        if(wx.getStorageSync('adminValue')){
            wx.navigateTo({
              url: '/pages/houtaiIndex/houtaiIndex',
            })
        }else{
            if(wx.getStorageSync('errorPass')<=3 || !wx.getStorageSync('errorPass'))
            {
                this.setData({
                    adminFlag:true
                })
                wx.showLoading({
                    title:'准备中'
                })
                wx.cloud.database().collection('adminPassword').get({
                    success:(res)=>{
                        console.log(res.data[0].password);
                        this.setData({
                            password:res.data[0].password
                        })
                        wx.hideLoading()
                    }
                })
            }else{
                wx.showModal({
                  title: '账户被锁定',
                  content: '请联系管理员',
                })
            }
            
        }
        
        
    },
    /* 关闭 */
    bindAdminClose(){
        this.setData({
            adminFlag:false
        })
    },
    /* 管理员 */
    bindInputadmin(e){
        this.setData({
            inputPass:e.detail.value
        })
    },
    /* 确定 */
    bindQueDing(){
        /* 密码输错记录值 */
        if(this.data.inputPass==this.data.password){
            this.setData({
                adminFlag:false
            })
            wx.setStorageSync('adminValue', true)
            wx.navigateTo({
              url: '/pages/houtaiIndex/houtaiIndex',
            })
        }else{
            wx.showModal({
                title:'输入密码错误',
                content:'输错密码记录一次,输错三次账户将被锁定'
            })
            var count = this.data.errorCount
            count=count+1
            this.setData({
                errorCount:count,
                adminFlag:false
            })
            wx.setStorageSync('errorPass', count)
        }
    },
    /* 暂不开放 */
    bindYouhui(){
       wx.showModal({
           title:'您有'+this.data.quanLen+'张优惠券',
           content:'暂且不支持开放'
       })
    },
    bindPay(){
        wx.navigateTo({
          url: '/pages/pay/pay',
        })
    },
    editorInfo(){
        wx.navigateTo({
          url: '/pages/editor/editor',
        })
    },
    /* 我的订单 */
    NavMyOrder(){
        wx.navigateTo({
          url: '/pages/myorder/myorder',
        })
    },
    /* 待付款 */
    noPay(){
        wx.navigateTo({
            url: '/pages/myorder/myorder?index='+1,
          })
    },
    /* 待发货 */
    noSend(){
        wx.navigateTo({
            url: '/pages/myorder/myorder?index='+2,
          })
    },
    /*待收货*/
    noGet(){
        wx.navigateTo({
            url: '/pages/myorder/myorder?index='+3,
          })
    },
    /* 已完成 */
    ok(){
        wx.navigateTo({
          url: '/pages/myorder/myorder?index='+4,
        })
    }
})