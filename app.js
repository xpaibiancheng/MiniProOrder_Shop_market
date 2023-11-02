// app.js
App({
    
    onLaunch(){
        var that=this
        wx.cloud.init({
            env:'********'
        })
        /* 获取唯一标识openid */
        wx.cloud.callFunction({
            name:'openid',
            success(res){
                that.globalData.openid=res.result.openid
                console.log('用户openid:'+that.globalData.openid);
                if(wx.getStorageSync('userInfo').loginFlag==1){
                    wx.showLoading({
                        title: '加载中',
                      })

                      wx.cloud.database().collection('userinfo').where({
                          _openid:res.result.openid
                      }).get({
                          success:(res_2)=>{
                              var account = parseFloat(res_2.data[0].userAccount)
                        
                              that.globalData.userAccount = account.toFixed(2)
                             /*  console.log(that.globalData.userAccount); */
                              wx.hideLoading()
                          },fail:(res_2)=>{
                              console.log(res_2);
                              wx.hideLoading()
                          }
                    })
                }
            }
        })
        
        
    },
    globalData:{
        openid:'',
        shopKind:'',
        shopDetail:'',
        dingdan:'',
        orderDetail:'',/* 点单详情 */
        orderLocation:'',/* 点单位置 */
        orderTemp:[],
        orderStyle:'',
        orderTempZiti:[],
        userAccount:0,
        buy_Info_Addr:''
    }
})
