// pages/adminChongzhi/adminChongzhi.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone:'',
        result:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
    /* 充值 */
    bindPayIt(e){
        wx.showModal({
          title: '输入金额,小于1',
          content: '',  
          editable:true,
          complete: (res) => {
            if (res.cancel) {
              wx.showToast({
                title: '取消支付',
                icon:'none'
              })
            }
            if (res.confirm) {
                var index = e.currentTarget.dataset.index
                var id = this.data.result[index]._id
                var addPrice =parseFloat(res.content )
                wx.showLoading({
                    title:'充值中'
                })
                wx.cloud.database().collection('userinfo').doc(id).get({
                    success:(res_2)=>{
                        console.log(res_2);
                        var tempPrice =parseFloat(res_2.data.userAccount)
                        var newPrice =tempPrice+addPrice
                        this.data.result[index].userAccount=newPrice
                        this.setData({
                            result:this.data.result
                        })
                        wx.cloud.database().collection('userinfo').doc(id).update({
                            data:{
                                userAccount:newPrice
                            },success:(res_3)=>{
                                const now = new Date();
                                const yearNow = now.getFullYear();   // 获取年份
                                const monthNow = now.getMonth() + 1; // 获取月份（注意月份从 0 开始，所以需要加 1）
                                const dayNow = now.getDate();        // 获取日期
                                const hoursNow = now.getHours();     // 获取小时
                                const minutesNow = now.getMinutes(); // 获取分钟
                                const secondsNow = now.getSeconds(); // 
                                wx.cloud.database().collection('payDocument').add({
                                    data:{
                                        subTime:yearNow+'-'+monthNow+'-'+dayNow+' '+hoursNow+':'+minutesNow+':'+secondsNow,
                                        name:this.data.result[index].userName,
                                        phone:this.data.result[index].phone,
                                        money:addPrice
                                    },success:()=>{
                                        wx.hideLoading()
                                        wx.showToast({
                                          title: 'Success!',
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }   
          }
        })
    },
    /* 手机号 */
    searchInput(e){
        var phone = e.detail.value
        this.setData({
            phone:phone
        })
    },
    /* 手机号搜 */
    searchBtn(){
        if(this.data.phone.length==0){
            wx.showToast({
              title: '手机号不为空',
              icon:'none'
            })
        }else{
            wx.showLoading({
              title: '加载',
            })
            wx.cloud.database().collection('userinfo').where({
                phone:this.data.phone
            }).get({
                success:(res)=>{
                    console.log(res);
                    if(res.data.length==0){
                        wx.hideLoading()
                        wx.showToast({
                          title: '暂无该用户',
                          icon:'none'
                        })
                    }else{
                        wx.hideLoading()
                        this.setData({
                            result:res.data
                        })
                    }
                    
                }
            })
        }
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