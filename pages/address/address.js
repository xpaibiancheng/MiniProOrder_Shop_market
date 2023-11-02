// pages/address/address.js
const app =getApp({})
Page({

    /**
     * 页面的初始数据
     */
    data: {
        delFlag:false,
        addressRows:[]
    },
    /*  */
    onLoad(){
        wx.showLoading({
            title:'收货地址'
        })
        wx.cloud.database().collection('address').where({
            _openid:app.globalData.openid
        }).get({
            success:(res)=>{
                this.setData({
                    addressRows:res.data
                })
                wx.hideLoading()
            },fail:(res)=>{
                console.log(res);
                wx.hideLoading()
            }
        })
    },
    /* 设置 */
    bindDelWith(){
        this.setData({
            delFlag:!this.data.delFlag
        })
    },
    /* 删除 */
    bindDel(e){
        var index = e.currentTarget.dataset.index
        var id = this.data.addressRows[index]._id
        wx.showModal({
          title: '确定删除？',
          content: '如果删除请点击确定',
          complete: (res) => {
            if (res.confirm) {
                wx.showLoading({
                    title:'删除中'
                })
              wx.cloud.database().collection('address').doc(id).remove({
                  success:()=>{
                      wx.hideLoading()
                    this.onLoad()
                  }
              })
              
            }
          }
        })
    },
    /* 添加收   货地址 */
    bindNavAdd(){
        wx.navigateTo({
          url: '/pages/addressEditor/addressEditor',
        })
    },    
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        this.onLoad()
    },
})