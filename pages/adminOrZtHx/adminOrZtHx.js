// pages/adminYyHexiao/adminYyHexiao.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        code:'',
        result:'',
    },

     /* 核销码 */
     searchInput(e){
        var code = e.detail.value
        console.log(code);
        this.setData({
            code:code
        })
    },
    /* 核销码 */
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
            var code = parseInt(this.data.code)
            wx.cloud.database().collection('orderUser').where({
               style:'自提',
               orderCode:code
            }).get({
                success:(res)=>{
                    console.log(res);
                    if(res.data.length==0){
                        wx.hideLoading()
                        wx.showToast({
                          title: '暂无订单',
                          icon:'none'
                        })
                    }else{
                        wx.hideLoading()
                        if(res.data.status=="正在备餐中"){
                            wx.showToast({
                              title: '备餐中，稍后',
                              icon:'none'
                            })
                        }else{
                            this.setData({
                                result:res.data
                            })
                        }
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
                wx.cloud.database().collection('orderUser').doc(temp._id).update({
                    data:{
                        status:'完成'
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