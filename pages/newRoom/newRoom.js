// pages/newRoom/newRoom.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        rommRows:[]
    },

    /* 新建桌面 */
    bindNew(){
        wx.showModal({
          title: '请输入桌子编号,例如:1,16,10',
          content: '',
          editable:true,
          complete: (res) => {
            if (res.confirm) {
                console.log(res.content);
                wx.showLoading({
                  title: '新建中',
                })
                /* 查询是否重复 */
                wx.cloud.database().collection('room').where({
                    code:res.content
                }).get({
                    success:(event)=>{
                        if(event.data.length==0){
                            wx.cloud.database().collection('room').add({
                                data:{
                                    code:res.content,
                                    status:"空闲",
                                    updateTime:''
                                },success:()=>{
                                    wx.hideLoading()
                                    wx.showToast({
                                    title: '新建成功',
                                    })
                                    this.onLoad()
                                },fail:()=>{
                                    wx.hideLoading()
                                    console.log("新建失败");
                                }
                            })
                        }else{
                            wx.showToast({
                              title: '已有此编号',
                              icon:'none'
                            })
                        }
                    }
                })
                
            }
          }
        })
    },
    /* 空闲与忙碌 */
    bindRoom(e){
        console.log(e.currentTarget.dataset.index);
        var index = e.currentTarget.dataset.index
        var id = this.data.rommRows[index]._id
        var status = this.data.rommRows[index].status
        if(status=='空闲'){
            wx.showLoading({
              title: '切换中',
            })
            wx.cloud.database().collection('room').doc(id).update({
                data:{
                    status:'有客',
                },success:()=>{

                    this.onLoad()
                }
            })
        }else{
            wx.showLoading({
              title: '切换中',
            })
            wx.cloud.database().collection('room').doc(id).update({
                data:{
                    status:'空闲',
                },success:()=>{
                    this.onLoad()
                }
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.showLoading({
          title: '加载中',
        })
        wx.cloud.callFunction({
            name:'roomBy',
            success:(res)=>{
                wx.hideLoading()
                console.log(res.result);
                this.setData({
                    rommRows:res.result.data
                })
            },fail:(res)=>{
                wx.hideLoading()
                console.log(res);
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