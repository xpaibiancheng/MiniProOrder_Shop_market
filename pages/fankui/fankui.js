// pages/fankui/fankui.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userName:'',
        userTalkStyle:'',
        userSchool:'',
        score:'',
        subject:''
    },
    /* name */
    bindName(e){
        console.log(e.detail.value);
        this.setData({
            userName:e.detail.value
        })
    },
    bindTalkstyle(e){
        console.log(e.detail.value);
        this.setData({
            userTalkStyle:e.detail.value
        })
    },
    bindSchool(e){
        console.log(e.detail.value);
        this.setData({
            userSchool:e.detail.value
        })
    },
    
    bindSubject(e){
        console.log(e.detail.value);
        this.setData({
            subject:e.detail.value
        })
    },
    /* 反馈提交 */
    bindSub(){
        var temp={}
        temp.name=this.data.userName
        temp.talkStyle=this.data.userTalkStyle
        temp.school=this.data.userSchool
        temp.score=this.data.score
        temp.subject=this.data.subject
        if(temp.name.length==0 || temp.talkStyle.length==0||temp.school.length==0||temp.score.length==0){
            wx.showToast({
              title: '请填写完整',
              icon:'error'
            })
        }else{
           
           wx.showToast({
             title: '感谢您的反馈',
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