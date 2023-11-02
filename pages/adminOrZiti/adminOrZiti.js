// pages/adminUserEnd/adminUserEnd.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        valueList:['点单自提新单','已处理'],
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
                name:'orderInfo',
                data:{
                    value:'自提',
                    info:'正在备餐中'
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
                name:'orderInfo',
                data:{
                    value:'已处理',
                    info:'完成'
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
    /* 商家确定 */
    bindPass(e){
        var index = e.currentTarget.dataset.index
        var temp = this.data.waitReplay[index]
        var opneid=this.data.waitReplay[index]._openid
        wx.showModal({
            title:'确定通过?',
            success:(res)=>{
                if(res.confirm){
                    wx.showLoading({
                        title:'通过中'
                    })
                    wx.cloud.database().collection('orderUser').doc(temp._id).update({
                        data:{
                           status:'待取餐',
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
                                name:'sendMsgZiti',
                                data:{
                                    openid:opneid
                                },success:()=>{
                                    
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
                    wx.cloud.database().collection('orderUser').doc(temp._id).remove({
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
            name:'orderInfo',
            data:{
                value:'自提',
                info:'正在备餐中'
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