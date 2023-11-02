// pages/houtaiXiajia/houtaiXiajia.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        shopAll:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.showLoading({
            title:'商品加载中'
        })
        wx.cloud.callFunction({
            name:'adminOd',
            data:{
                value:0
            },success:(res)=>{
                wx.hideLoading()
                console.log(res);
                this.setData({
                    shopAll:res.result.data
                })
            }
        })
    },
    /* 删除商品 */
    bindDelShop(e){
        wx.showModal({
          title: '确定删除？',
          complete: (res) => {
            if (res.confirm) {
                wx.showLoading({
                  title: '删除中',
                })
                console.log(e.currentTarget.dataset.index);
                var index=e.currentTarget.dataset.index
                var temp=this.data.shopAll
                var id=temp[index]._id
                temp.splice(index,1)
                this.setData({shopAll:temp})
                wx.cloud.database().collection('marketShop').doc(id).remove({
                    success(res){
                        wx.hideLoading({})
                        wx.showToast({
                            title: '删除成功',
                        })
                    }
                })
            }
          }
        }) 
    },
    /* 下架商品 */
    bindOnOff(e){
        console.log(e);
        var index = e.currentTarget.dataset.index
        var id = this.data.shopAll[index]._id
        var temp = this.data.shopAll
        var statusTemp = this.data.shopAll[index].status
        temp[index].status = !temp[index].status
        this.setData({
            shopAll:temp
        })
        wx.showModal({
          title: '确定下架/上架？',
          complete: (res) => {
            if (res.confirm) {
                wx.cloud.database().collection('marketShop').doc(id).update({
                    data:{
                        status:!statusTemp
                    },
                    success:(res)=>{
                        wx.showToast({
                          title: 'Success!',
                        })
                    },fail(){
                        wx.showToast({
                          title: 'error',
                        })
                    }
                })
            }
          }
        })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

})