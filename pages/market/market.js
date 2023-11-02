// pages/market/market.js
const app=getApp({})
Page({

    /**
     * 页面的初始数据
     */
    data: {
        teaClass:'',
        handIndex:0,
        shopKind:''
    },
    /* 颜色变换 */
    bindHandIndex(res){
        console.log(res.currentTarget.dataset.index);
        console.log(res.currentTarget.dataset.name);
        wx.showLoading({
            title:'加载中'
        })
        this.setData({
            handIndex:res.currentTarget.dataset.index
        })
        wx.cloud.database().collection('marketShop').where({
            shopClass:res.currentTarget.dataset.name,
            status:true
        }).get({
            success:(e)=>{
                console.log(e);
                this.setData({
                    shopKind:e.data
                })
                wx.hideLoading()
            }
        })
    },
    /* search */
    bindSearch(){
        wx.navigateTo({
          url: '/pages/search/search',
        })
    },
    /* 转到详情页 */
    bindNavDtail(e){
        console.log(e.currentTarget.dataset.name);
        app.globalData.shopKind=e.currentTarget.dataset.name
        wx.navigateTo({
          url: '/pages/orderClass/orderClass',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.showLoading({})
        wx.cloud.callFunction({
            name:'marketClass',
            success:(res)=>{
                console.log(res.result.list[0].categories);
                var temp=res.result.list[0].categories[0]
                console.log(temp);
                this.setData({
                    teaClass:res.result.list[0].categories
                })
                wx.cloud.database().collection('marketShop').where({
                    shopClass:temp,
                    status:true
                }).get({
                    success:(e)=>{
                        console.log(e);
                        this.setData({
                            shopKind:e.data
                        })
                        wx.hideLoading()

                    }
                })
                
            }
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
            title:'小茶馆商城',
            path: 'pages/index/index',
        };
    },
    onShareTimeline(){
        
        return {
            title:'小茶馆商城',
            
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