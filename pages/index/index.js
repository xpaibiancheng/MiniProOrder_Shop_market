// index.js
const app =getApp({})
Page({
    data: {
        indicatorDots: true,  // 是否显示指示点
        autoplay: true,  // 是否自动切换
        interval: 3000,  // 自动切换时间间隔，单位为毫秒
        duration: 500,  // 滑动动画时长，单位为毫秒
        imageUrls: [  // 轮播图图片地址列表
            'https://7465-teacloud-4gtuflp13ff3ebb7-1319677774.tcb.qcloud.la/swiper/02.jpg?sign=ac620eeab8a894cf323cb836c21bce3c&t=1697871274',
            'https://7465-teacloud-4gtuflp13ff3ebb7-1319677774.tcb.qcloud.la/swiper/01.jpg?sign=99d33c433987bc3a3c2950d1406f2312&t=1697871261',
            'https://7465-teacloud-4gtuflp13ff3ebb7-1319677774.tcb.qcloud.la/swiper/03.jpg?sign=fe74bef609768f590dfeef7f44d7a09e&t=1697871283'
        ],
        loginFlag:'',
        userAccount:''
      },
      onLoad(){
        if(wx.getStorageSync('userInfo').loginFlag==1){
            this.setData({
                loginFlag:1,
                userName:wx.getStorageSync('userInfo').userName,
                userFace:wx.getStorageSync('userInfo').userFace,
                userNum:wx.getStorageSync('userInfo').userNum
            })
            
        }
      },
      onReady(){
          var that =this 
        if(wx.getStorageSync('userInfo').loginFlag==1){
            /* 获取唯一标识openid */
        wx.cloud.callFunction({
            name:'openid',
            success(res){
                
                    wx.showLoading({
                        title: '加载中',
                      })
                      wx.cloud.database().collection('userinfo').where({
                          _openid:res.result.openid
                      }).get({
                          success:(res_2)=>{
                              var account = parseFloat(res_2.data[0].userAccount)
                              that.setData({
                                  userAccount: account.toFixed(2)
                              })
                             
                              wx.hideLoading()
                          },fail:(res_2)=>{
                              console.log(res_2);
                              wx.hideLoading()
                          }
                    })
                }
            
        })
        }

         
          
      },
      /* 立即登录 */
      bindLogin(){
          wx.switchTab({
            url: '/pages/user/user',
          })
      },
      /* 转到Vip */
      bindToVip(){
        wx.requestSubscribeMessage({
            tmplIds: ['g-oT7S3EUnp2HdjKo79Ue1pd3TViMOrAv9j_c4xLgcQ'],
            success(res){
                /* console.log('授权成功',res); */
                wx.showToast({
                title: '订阅成功',
                })
            },fail:(res)=>{
                console.log("订阅失败",res);
            }
        })
         wx.navigateTo({
           url: '/pages/dingzuo/dingzuo',
         })
      },
      bindToShop(){
          wx.switchTab({
            url: '/pages/market/market',
          })
      },
      /* 点单 */
      bindToOrder(){
          app.globalData.orderStyle = 1
          wx.navigateTo({
            url: '/pages/orderSelect/orderSelect'
          })
      },
      bindNavToStyle(){
          wx.switchTab({
            url: '/pages/market/market',
          })
      },
      bindMyself(){
        app.globalData.orderStyle = 2
        wx.requestSubscribeMessage({
            tmplIds: ['wZcW8xLCNuavgHMo9WB2bZ3NLSgZ1rzxf4OF81zi3LI'],
            success(res){
                /* console.log('授权成功',res); */
                wx.showToast({
                title: '订阅成功',
                })
            },fail:(res)=>{
                console.log("订阅失败",res);
            }
        })
          /* 自提 */
          wx.navigateTo({
            url: '/pages/takeOut/takeOut',
          })

      },
      bindPay(){
          wx.navigateTo({
            url: '/pages/pay/pay',
          })
      },
      bindKaiFangNo(){
          wx.showToast({
            title: '暂未开放',
            icon:'none'
          })
      },
      /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage']
        });
        return {
            title:'小茶馆点餐',
            path: 'pages/index/index',
        };
    },
    onShareTimeline(){
        
        return {
            title:'小茶馆点餐',
            
            success: function (res) {
                // 分享成功回调
                console.log('分享成功', res);
            },
            fail: function (res) {
                // 分享失败回调
                console.log('分享失败', res);
            }
        };
    }
})
