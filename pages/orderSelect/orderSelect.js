// pages/orderSelect/orderSelect.js
const app=getApp({})
Page({

    /**
     * 页面的初始数据
     */
    data: {
        man_count:10,
        order_count:10,
        handIndex:0,
        orderIndex:0,
        location:''
    },
    /* 就餐人数选择 */
    bindManCount(e){
        var index=e.currentTarget.dataset.index
        this.data.location.num=index+1+"人"
        this.setData({
            handIndex:e.currentTarget.dataset.index,
            location:this.data.location
        })
        console.log(this.data.location);
    },
    /* 餐桌号选择 */
    bindOderCount(e){
        var index=e.currentTarget.dataset.index
        this.data.location.code=index+1+"号桌"
        this.setData({
            orderIndex:e.currentTarget.dataset.index,
            location:this.data.location
        })
        console.log(this.data.location);
    },
    bindNavOrder(){
        app.globalData.orderLocation=this.data.location
        wx.navigateTo({
          url: '/pages/orderDetail/orderDetail?style='+1,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.showLoading({
          title: '加载中',
        })
        var temp={}
        temp.num='1人'
        temp.code='1号桌'
        this.setData({
            location:temp
        })
        wx.cloud.callFunction({
            name:'roomBy',
            success:(res)=>{
                this.setData({
                    order_count:res.result.data.length
                })
                console.log(res.result.data.length);
                wx.hideLoading()
                console.log("初始化:",this.data.location);
            }
        })
    },
})