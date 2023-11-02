// pages/adminYyHexiao/adminYyHexiao.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        code:'',
        result:'',
    },

     /* 手机号 */
     searchInput(e){
        var code = e.detail.value
        console.log(code);
        this.setData({
            code:code
        })
    },
    /* 手机号搜 */
    searchBtn(){
        if(this.data.code.length==0){
            wx.showToast({
              title: '核销码不为空',
              icon:'none'
            })
        }else{
            wx.showLoading({
              title: '加载',
            })
            wx.cloud.database().collection('dingzhuo').where({
               oderCode:this.data.code
            }).get({
                success:(res)=>{
                    console.log(res);
                    if(res.data.length==0){
                        wx.hideLoading()
                        wx.showToast({
                          title: '暂无该订桌',
                          icon:'none'
                        })
                    }else{
                        wx.hideLoading()
                        this.setData({
                            result:res.data
                        })
                    }
                    
                }
            })
        }
    },
    /* 核销成功 */
   bindPass(e){
    var index = e.currentTarget.dataset.index
    var temp = this.data.result[index]
    wx.showModal({
        title:'确定核销?',
        success:(res)=>{
            if(res.confirm){
                wx.showLoading({
                    title:'通过中'
                })
                wx.cloud.database().collection('dingzhuo').doc(temp._id).update({
                    data:{
                        replay:'订单完成',
                        beizhu:'订单完成'
                    },
                    success:()=>{
                        wx.navigateBack()
                    },fail:(event)=>{
                        wx.showToast({
                          title: 'error',
                          icon:'error'
                        })
                        console.log(event);
                    }
                })
            }
        }
    })
   },
})