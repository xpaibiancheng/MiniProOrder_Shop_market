// pages/order/order.js
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderList:[
            '全部',
            '待付款',
            '待发货',
            '待收货',
            '已完成'
        ],
        handIndex:0,
        orderInfo:[]
    },

    /* 绑定事件点击样式改变 */
    bindClick(e){
        var index = e.currentTarget.dataset.index
        this.setData({
            handIndex:index
        })
        console.log("所售商品",this.data.orderInfo);
        if(index == 0){
            this.onLoad()
        }if(index == 1){
            /* 快递 */
            this.setData({
                orderInfo:[]
            })
            wx.showLoading({
                title: '加载中',
            })
            db.collection('shopKuaiDi').orderBy('subTime','desc').where({
                pay_status:'wait'
            }).get({
                success:(res)=>{
                    console.log('快递',res.data);
                    if(res.data.length>0)
                    {
                        var temp = this.data.orderInfo
                        temp= temp.concat(res.data)
                        this.setData({
                            orderInfo:temp
                        })
                    }
                }
            })
            /* 同城 */
            db.collection('shopTongCheng').orderBy('subTime','desc').where({
                pay_status:'wait'
            }).get({
                success:(res)=>{
                    console.log('同城',res.data);
                    if(res.data.length>0)
                    {
                        var temp = this.data.orderInfo
                        temp=temp.concat(res.data)
                        this.setData({
                            orderInfo:temp
                        })
                    }
                }
            })
            /* 自提 */
            db.collection('shopZiti').orderBy('subTime','desc').where({
                pay_status:'wait'
            }).get({
                success:(res)=>{
                    wx.hideLoading()
                    console.log('自提',res.data);
                    if(res.data.length>0)
                    {   
                        var temp = this.data.orderInfo
                        temp=temp.concat(res.data)
                        this.setData({
                            orderInfo:temp
                        })
                    }
                }
            })
        }if(index == 2){
            /* 快递 */
            this.setData({
                orderInfo:[]
            })
            wx.showLoading({
                title: '加载中',
            })
            db.collection('shopKuaiDi').orderBy('subTime','desc').where({
                status:'等待商家发货'
            }).get({
                success:(res)=>{
                    console.log('快递',res.data);
                    if(res.data.length>0)
                    {
                        var temp = this.data.orderInfo
                        temp= temp.concat(res.data)
                        this.setData({
                            orderInfo:temp
                        })
                    }
                }
            })
            /* 同城 */
            db.collection('shopTongCheng').orderBy('subTime','desc').where({
                status:'等待商家发货'
            }).get({
                success:(res)=>{
                    console.log('同城',res.data);
                    if(res.data.length>0)
                    {
                        var temp = this.data.orderInfo
                        temp=temp.concat(res.data)
                        this.setData({
                            orderInfo:temp
                        })
                    }
                }
            })
            /* 自提 */
            db.collection('shopZiti').orderBy('subTime','desc').where({
                status:'等待商家发货'
            }).get({
                success:(res)=>{
                    wx.hideLoading()
                    console.log('自提',res.data);
                    if(res.data.length>0)
                    {   
                        var temp = this.data.orderInfo
                        temp=temp.concat(res.data)
                        this.setData({
                            orderInfo:temp
                        })
                    }
                }
            })
        }if(index ==3){
            /* 快递 */
            this.setData({
                orderInfo:[]
            })
            wx.showLoading({
                title: '加载中',
            })
            db.collection('shopKuaiDi').orderBy('subTime','desc').where({
                status:'待收货'
            }).get({
                success:(res)=>{
                    console.log('快递',res.data);
                    if(res.data.length>0)
                    {
                        var temp = this.data.orderInfo
                        temp= temp.concat(res.data)
                        this.setData({
                            orderInfo:temp
                        })
                    }
                }
            })
            /* 同城 */
            db.collection('shopTongCheng').orderBy('subTime','desc').where({
                status:'待收货'
            }).get({
                success:(res)=>{
                    console.log('同城',res.data);
                    if(res.data.length>0)
                    {
                        var temp = this.data.orderInfo
                        temp=temp.concat(res.data)
                        this.setData({
                            orderInfo:temp
                        })
                    }
                }
            })
            /* 自提 */
            db.collection('shopZiti').orderBy('subTime','desc').where({
                status:'待收货'
            }).get({
                success:(res)=>{
                    wx.hideLoading()
                    console.log('自提',res.data);
                    if(res.data.length>0)
                    {   
                        var temp = this.data.orderInfo
                        temp=temp.concat(res.data)
                        this.setData({
                            orderInfo:temp
                        })
                    }
                }
            })
        }if(index ==4){
            /* 快递 */
            this.setData({
                orderInfo:[]
            })
            wx.showLoading({
                title: '加载中',
            })
            db.collection('shopKuaiDi').orderBy('subTime','desc').where({
                status:'已完成'
            }).get({
                success:(res)=>{
                    console.log('快递',res.data);
                    if(res.data.length>0)
                    {
                        var temp = this.data.orderInfo
                        temp= temp.concat(res.data)
                        this.setData({
                            orderInfo:temp
                        })
                    }
                }
            })
            /* 同城 */
            db.collection('shopTongCheng').orderBy('subTime','desc').where({
                status:'已完成'
            }).get({
                success:(res)=>{
                    console.log('同城',res.data);
                    if(res.data.length>0)
                    {
                        var temp = this.data.orderInfo
                        temp=temp.concat(res.data)
                        this.setData({
                            orderInfo:temp
                        })
                    }
                }
            })
            /* 自提 */
            db.collection('shopZiti').orderBy('subTime','desc').where({
                status:'已完成'
            }).get({
                success:(res)=>{
                    wx.hideLoading()
                    console.log('自提',res.data);
                    if(res.data.length>0)
                    {   
                        var temp = this.data.orderInfo
                        temp=temp.concat(res.data)
                        this.setData({
                            orderInfo:temp
                        })
                    }
                }
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if(options.index)
        {
            var e ={}
            e.currentTarget={}
            e.currentTarget.dataset={}
            e.currentTarget.dataset.index=options.index
            console.log(e)
            this.bindClick(e)
        }else{
            const db = wx.cloud.database()
            /* 快递 */
            wx.showLoading({
            title: '加载中',
            })
            db.collection('shopKuaiDi').orderBy('subTime','desc').get({
                success:(res)=>{
                    console.log('快递',res.data);
                    if(res.data.length>0)
                    {
                        var temp = this.data.orderInfo
                        temp= temp.concat(res.data)
                        this.setData({
                            orderInfo:temp
                        })
                    }
                }
            })
            /* 同城 */
            db.collection('shopTongCheng').orderBy('subTime','desc').get({
                success:(res)=>{
                    console.log('同城',res.data);
                    if(res.data.length>0)
                    {
                        var temp = this.data.orderInfo
                        temp=temp.concat(res.data)
                        this.setData({
                            orderInfo:temp
                        })
                    }
                }
            })
            /* 自提 */
            db.collection('shopZiti').orderBy('subTime','desc').get({
                success:(res)=>{
                    wx.hideLoading()
                    console.log('自提',res.data);
                    if(res.data.length>0)
                    {   
                        var temp = this.data.orderInfo
                        temp=temp.concat(res.data)
                        this.setData({
                            orderInfo:temp
                        })
                    }
                }
            }) 
        }
        
    },
  /* 打电话 */
  callPhone(e){
      var phone = e.currentTarget.dataset.phone
      wx.makePhoneCall({
        phoneNumber: phone,
      })
  },
  /* 复制订单号 */
  copyIt(e){
    var num = e.currentTarget.dataset.num
    wx.setClipboardData({
        data: num,
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
  }
})