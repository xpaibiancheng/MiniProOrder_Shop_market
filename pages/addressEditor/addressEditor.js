// pages/addressEditor/addressEditor.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        region: ['省', '市', '县'],
        nickName:'',
        phone:'',
        address:''
    },
    /* 省市县 */
    bindRegionChange: function (e) {
        console.log(1);
      console.log(e);
      this.setData({
        region: e.detail.value
      })
  },
  /* 姓名 */
  bindName(e){
      console.log(e.detail.value);
      this.setData({
          nickName:e.detail.value
      })
  },
  bindPhone(e){
    console.log(e.detail.value);
    this.setData({
        phone:e.detail.value
    })
    },
    bindAddressDetail(e){
        console.log(e.detail.value);
        this.setData({
            address:e.detail.value
        })
    },
    /* 地址 */
    subaddress(){
        if(this.data.nickName.length!=0 && this.data.phone.length!=0&&this.data.address.length!=0&&this.data.region.length!=0){
            wx.showLoading({
                title:'保存中'
            })
            wx.cloud.database().collection('address').add({
                data:{
                    name:this.data.nickName,
                    phonne:this.data.phone,
                    address:this.data.address,
                    region:this.data.region
                },success:()=>{
                    wx.hideLoading()
                    wx.showToast({
                      title: '保存成功',
                    })
                    wx.navigateBack({})
                }
            })
        }else{
            wx.showToast({
              title: '请检查是否完整',
              icon:'none'
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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