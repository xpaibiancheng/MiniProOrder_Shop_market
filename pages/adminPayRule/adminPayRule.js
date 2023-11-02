// pages/adminPayRule/adminPayRule.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        result:[]
    },
    /*提交规则 */
    formSubmit(e){
        console.log(e.detail.value);
        var obj =e.detail.value
        if(obj.value.length==0 || obj.key.length==0){
            wx.showToast({
              title: '请填写完整',
              icon:'none'
            })
        }else{
            wx.showLoading({
                title:'请稍等'
            })
            wx.cloud.database().collection('adminPayRule').add({
                data:{
                    rule:obj,
                    status:true
                },success:(res)=>{
                    wx.hideLoading()
                    wx.showToast({
                      title: 'Success!',
                    })
                    this.onLoad()
                },fail:(res)=>{
                    wx.hideLoading()
                    console.log(res);
                }
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.showLoading({
            title:'稍等'
        })
        wx.cloud.database().collection('adminPayRule').get({
            success:(res)=>{

                this.setData({
                    result:res.data
                })
                wx.hideLoading()
            },fail:(res)=>{
                wx.hideLoading()
                console.log(res);
            }
        })
    },
    /* 上架下架 */
    changeStatus(e){
        console.log(e);
        var id = e.currentTarget.dataset.id
        var status=e.currentTarget.dataset.status
        console.log(id,status);
        wx.showLoading({
            title:'加载中'
        })
        wx.cloud.database().collection('adminPayRule').doc(id).update({
            data:{
                status:!status
            },success:(res)=>{
                wx.hideLoading()
                this.onLoad()
            }
        })
        
    },
    /* 删除 */
    delRule(e){
        var id = e.currentTarget.dataset.id
        wx.showLoading({
            title:'删除中'
        })
        wx.cloud.database().collection('adminPayRule').doc(id).remove({
            success:(res)=>{
                wx.hideLoading()
                this.onLoad()
            }
        })
        
    }
})