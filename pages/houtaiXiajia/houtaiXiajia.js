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
                value:1
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
        wx.showLoading({
            title: '删除中',
          })
          
          var index = e.currentTarget.dataset.index
          var temp = this.data.shopAll
          var id = temp[index]._id
          
          wx.cloud.database().collection('orderDetail').doc(id).remove({
            success: (res) => {
              wx.hideLoading({
                success: () => {
                  wx.showToast({
                    title: '删除成功',
                    success: () => {
                      this.onLoad()
                    }
                  })
                }
              })
            },
            fail: (error) => {
              wx.hideLoading()
              console.log(error);
              wx.showToast({
                title: '删除失败',
                icon: 'none' // 可以显示一个错误提示图标
              })
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
                wx.cloud.database().collection('orderDetail').doc(id).update({
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