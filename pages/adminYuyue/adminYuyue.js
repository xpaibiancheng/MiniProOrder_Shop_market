// pages/adminUserEnd/adminUserEnd.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        valueList:['预约新订单','已处理'],
        handIndex:0,
        waitReplay:[],
        haveReplay:[]
    },
    /* 点击筛选 */
    bindClick(e){
        var index = e.currentTarget.dataset.index
        this.setData({
            handIndex:index
        })
        if(index == '0'){
            wx.showLoading({})
            /* 审核 */
            wx.cloud.callFunction({
                name:'adminYuyueReplay',
                data:{
                    value:'等待确认'
                },success:(res)=>{
                    console.log(res);
                    this.setData({
                        waitReplay:res.result.data
                    })
                    wx.hideLoading()
                },fail:(res)=>{
                    console.log(res);
                    wx.hideLoading()
                }
        })
        }else{
            wx.showLoading({})
            /* 审核 */
            wx.cloud.callFunction({
                name:'adminYuyueReplay',
                data:{
                    value:'已处理'
                },success:(res)=>{
                    console.log(res);
                    this.setData({
                        haveReplay:res.result.data
                    })
                    wx.hideLoading()
                },fail:(res)=>{
                    console.log(res);
                    wx.hideLoading()
                }
            })
        }
    },
    /* 审核通过 */
    bindPass(e){
        var index = e.currentTarget.dataset.index
        var temp = this.data.waitReplay[index]
        var openid = temp._openid
        var name = temp.name
        var code =temp.oderCode
        var time = temp.date+' '+temp.time
        var money = temp.order_price
        wx.showModal({
            title:'确定通过?',
            success:(res)=>{
                if(res.confirm){
                    wx.showLoading({
                        title:'通过中'
                    })
                    wx.cloud.database().collection('dingzhuo').doc(temp._id).update({
                        data:{
                            replay:'已为您保留座位',
                            beizhu:'座位为您保留30分钟'
                        },
                        success:()=>{
                            var delTemp = this.data.waitReplay
                            delTemp.splice(index,1)
                            this.setData({
                                waitReplay:delTemp
                            })
                            wx.hideLoading()
                            wx.showToast({
                              title: 'Success!',
                            })
                            wx.cloud.callFunction({
                                name:'sendMsgDz',
                                data:{
                                    openid:openid,
                                    name : name,
                                    code :code,
                                    time :time,
                                    money:money
                                },success:(res)=>{
                                    console.log(res);
                                    console.log("发送成功");
                                }
                            })
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
    bindRefuse(e){
        var index = e.currentTarget.dataset.index
        var temp = this.data.waitReplay[index]
        console.log('未审核申请拒绝操作',temp);
        wx.showModal({
            title:'确定拒绝?',
            content:'拒绝理由',
            editable:true,
            success:(res)=>{
                if(res.confirm){
                    wx.showLoading({
                        title:'通过中'
                    })
                    wx.cloud.database().collection('ygRegisterTemp').doc(temp._id).update({
                        data:{
                            replay:'商家拒绝',
                            beizhu:res.content
                        },
                        success:()=>{
                            var delTemp = this.data.waitReplay
                            delTemp.splice(index,1)
                            this.setData({
                                waitReplay:delTemp
                            })
                            wx.hideLoading()
                            wx.showToast({
                              title: 'Success!',
                            })
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
    /* 超时取消 */
    bindQvxiao(e){
        var index = e.currentTarget.dataset.index
        var temp = this.data.haveReplay[index]
        wx.showModal({
            title:'确定操作?',
            success:(res)=>{
                if(res.confirm){
                    wx.showLoading({
                        title:'通过中'
                    })
                    wx.cloud.database().collection('dingzhuo').doc(temp._id).update({
                        data:{
                            replay:'超时取消',
                            beizhu:'超时取消'
                        },
                        success:()=>{
                            wx.hideLoading()
                            this.data.haveReplay[index].replay="超时取消"
                            this.setData({
                                haveReplay:this.data.haveReplay
                            })
                            wx.showToast({
                              title: 'Success!',
                            })
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
    /* 删除订单 */
    bindDel(e){
        var index = e.currentTarget.dataset.index
        var temp = this.data.haveReplay[index]
        wx.showModal({
            title:'确定删除?',
            success:(res)=>{
                if(res.confirm){
                    wx.showLoading({
                        title:'删除中'
                    })
                    wx.cloud.database().collection('dingzhuo').doc(temp._id).remove({
                        success:()=>{
                            wx.hideLoading()
                            this.data.haveReplay.splice(index,1)
                            this.setData({
                                haveReplay:this.data.haveReplay
                            })
                            wx.showToast({
                              title: 'Success!',
                            })
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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.showLoading({})
        /* 审核 */
        wx.cloud.callFunction({
            name:'adminYuyueReplay',
            data:{
                value:'等待确认'
            },success:(res)=>{
                console.log(res);
                this.setData({
                    waitReplay:res.result.data
                })
                wx.hideLoading()
            },fail:(res)=>{
                console.log(res);
                wx.hideLoading()
            }
        })
    },
})