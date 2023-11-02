// pages/shopDingdan/shopDingdan.js
const app=getApp({})
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tixing:['商城快递','商城自提','商城同城'],
        handell:0,
        kuaidi:[],
        ziti:[],
        tongcheng:[]
    },
    /* 题型分类 */
   bindClassOne(res){
        var index=res.currentTarget.dataset.index
        var _this=this
        if(index==0){
            wx.showLoading({
                title:'商城快递'
            })
            wx.cloud.database().collection('shopKuaiDi').where({
                _openid:app.globalData.openid
            }).get({
                success(res){
                    console.log('商城快递',res);
                    _this.setData({
                        kuaidi:res.data,
                        ziti:[],
                        tongcheng:[]
                    })
                    wx.hideLoading()
                },fail(res){
                    wx.showToast({
                      title: 'Erro',
                    })
                }
            })
        }if(index==1){
            wx.showLoading({
                title:'商城快递'
            })
            wx.cloud.database().collection('shopZiti').where({
                _openid:app.globalData.openid
            }).get({
                success(res){
                    console.log('商城自提',res);
                    _this.setData({
                        kuaidi:[],
                        ziti:res.data,
                        tongcheng:[]
                    })
                    wx.hideLoading()
                },fail(res){
                    wx.showToast({
                      title: 'Erro',
                    })
                }
            })
        }if(index==2){
            wx.showLoading({
                title:'商城快递'
            })
            wx.cloud.database().collection('shopTongCheng').where({
                _openid:app.globalData.openid
            }).get({
                success(res){
                    console.log('商城同城',res);
                    _this.setData({
                        kuaidi:[],
                        ziti:[],
                        tongcheng:res.data
                    })
                    wx.hideLoading()
                },fail(res){
                    wx.showToast({
                      title: 'Erro',
                    })
                }
            })
        }
        this.setData({
            handell:index
            })
    },
    /* 快递删除 */
    bindDelKuaiDi(e){
        wx.showModal({
            title:'确定删除？',
            success:(event)=>{
                if(event.confirm){
                    var index=e.currentTarget.dataset.index
                    var id=e.currentTarget.dataset.id
                    var temp=this.data.kuaidi
                    temp.splice(index,1)
                    this.setData({
                        kuaidi:temp
                    })
                    wx.cloud.database().collection("shopKuaiDi").where({
                        _id:id
                    }).remove({
                        success(){
                            wx.showToast({
                            title: '删除成功',
                            })
                        }
                    })
                }
            }
        })
        
        
    }, 
    /* 自提删除 */
    bindDelZiti(e){
        wx.showModal({
            title:'确定删除？',
            success:(event)=>{
                if(event.confirm){
                    var index=e.currentTarget.dataset.index
                    var id=e.currentTarget.dataset.id
                    var temp=this.data.ziti
                    temp.splice(index,1)
                    this.setData({
                        ziti:temp
                    })
                    wx.cloud.database().collection("shopZiti").where({
                        _id:id
                    }).remove({
                        success(){
                            wx.showToast({
                            title: '删除成功',
                            })
                        }
                    })
                }
            }
        })
    },
    /* 同城删除 */
    bindDelTongcheng(e){
        var _this=this
        wx.showModal({
            title:'确定删除？',
            success:(event)=>{
                if(event.confirm){
                    var index=e.currentTarget.dataset.index
                    var id=e.currentTarget.dataset.id
                    var temp=this.data.tongcheng
                    temp.splice(index,1)
                    this.setData({
                        tongcheng:temp
                    })
                    wx.cloud.database().collection("shopTongCheng").where({
                        _id:id
                    }).remove({
                        success(){
                            wx.showToast({
                            title: '删除成功',
                            })
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
        wx.showLoading({
            title:'商城快递'
        })
        wx.cloud.database().collection('shopKuaiDi').where({
            _openid:app.globalData.openid
        }).get({
            success:(res)=>{
                console.log('商城快递',res);
                this.setData({
                    kuaidi:res.data,
                    ziti:[],
                    tongcheng:[]
                })
                wx.hideLoading()
            },fail(res){
                wx.showToast({
                  title: 'Erro',
                })
            }
        })
    },
    /* 复制 */
    bindCopyCode(e){
        var text=e.currentTarget.dataset.code
        wx.setClipboardData({
            data: text,
            success: function(res) {
              wx.showToast({
                title: '复制成功',
                icon: 'success',
                duration: 2000
              })
            }
          })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})