// pages/adminUserEnd/adminUserEnd.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        valueList:['待发货','已处理'],
        handIndex:0,
        waitReplay:[],
        haveReplay:[],
        fahuoFlag:false,
        kdCode:'',
        kdName:'',
        fhIndex:''
    },
    /* 点击筛选 */
    bindClick(e){
        var index = e.currentTarget.dataset.index
        this.setData({
            handIndex:index
        })
        if(index == '0'){
            wx.showLoading({})
            /* 审核 */
            wx.cloud.callFunction({
                name:'adminPs',
                data:{
                    value:'等待商家发货'
                },success:(res)=>{
                    console.log(res);
                    this.setData({
                        waitReplay:res.result.data
                    })
                    wx.hideLoading()
                },fail:(res)=>{
                    console.log(res);
                    wx.hideLoading()
                }
            })
        }else{
            wx.showLoading({})
            /* 审核 */
            wx.cloud.callFunction({
                name:'adminPs',
                data:{
                    value:'已处理'
                },success:(res)=>{
                    console.log(res);
                    this.setData({
                        haveReplay:res.result.data
                    })
                    wx.hideLoading()
                },fail:(res)=>{
                    console.log(res);
                    wx.hideLoading()
                }
            })
        }
    },
    /* 商家确定 */
    bindPass(e){
        
        var index = e.currentTarget.dataset.index
        this.setData({
            fahuoFlag:!this.data.fahuoFlag,
            fhIndex:index
        })
        
    },
    /* 删除订单 */
    bindDel(e){
        var index = e.currentTarget.dataset.index
        var temp = this.data.haveReplay[index]
        wx.showModal({
            title:'确定删除?',
            success:(res)=>{
                if(res.confirm){
                    wx.showLoading({
                        title:'删除中'
                    })
                    wx.cloud.database().collection('shopTongCheng').doc(temp._id).remove({
                        success:()=>{
                            wx.hideLoading()
                            this.data.haveReplay.splice(index,1)
                            this.setData({
                                haveReplay:this.data.haveReplay
                            })
                            wx.showToast({
                              title: 'Success!',
                            })
                        },fail:(event)=>{
                            wx.showToast({
                              title: 'error',
                              icon:'error'
                            })
                            console.log(event);
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
        wx.showLoading({})
        /* 审核 */
        wx.cloud.callFunction({
            name:'adminPs',
            data:{
                value:'等待商家发货'
            },success:(res)=>{
                console.log(res);
                this.setData({
                    waitReplay:res.result.data
                })
                wx.hideLoading()
            },fail:(res)=>{
                console.log(res);
                wx.hideLoading()
            }
        })
    },
    /* 关闭窗口 */
    bindClose(){
        this.setData({
            fahuoFlag:false
        })
    },
    /* 配送员昵称 */
    bindKdName(e){
        console.log(e.detail.value);
        this.setData({
            kdName:e.detail.value
        })
    },
    /* 配送员手机号 */
    bindKdCode(e){
        console.log(e.detail.value);
        this.setData({
            kdCode:e.detail.value
        })
    },
    bottonRows(e){
        /* 
            检查快递单号和快递昵称是否正确
            更新云数据库
        */
        var index = this.data.fhIndex
        var id = this.data.waitReplay[index]._id
       if(this.data.kdCode.length==0 || this.data.kdName.length==0)
       {
           wx.showToast({
             title: '请填写完整',
             icon:'none'
           })
       }else{
           wx.cloud.database().collection('shopTongCheng').doc(id).update({
               data:{
                   peiSongNum:this.data.kdCode,
                   peiSongName:this.data.kdName,
                   status:'待收货'
               },success:(res)=>{
                    wx.showToast({
                      title: '完成成功',
                    })
                    var tempRe = this.data.waitReplay
                    tempRe.splice(index,1)
                    this.setData({
                        waitReplay:tempRe,
                        fahuoFlag:false,
                        kdCode:'',
                        kdName:'',
                        fhIndex:''
                    })
               }
           })
       }
    }
})