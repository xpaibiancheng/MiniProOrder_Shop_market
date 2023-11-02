// pages/shopcar/shopcar.js
const app=getApp({})
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hideNotice: false,
        notice:'温馨提醒您你：长按商品图片可以删除',

        shopGroups:[],
        priceTotal:0,

        selectAll:false,
        selectShop:[],
        selectFlag:[],

        address:'',
        addrDefault:'',

        showModalStatus:false

    },
    /* 获取选中的购物车 */
    handleChange(e) { 
        var index = e.currentTarget.dataset.index
        var price = e.currentTarget.dataset.value
        price=parseFloat(price)
        /* console.log(index,price); */
        // 更改
        if(this.data.selectFlag[index].flag){
            this.data.selectFlag[index].flag=!this.data.selectFlag[index].flag
            var priceTemp = parseFloat(this.data.priceTotal);
            priceTemp=priceTemp-price
            priceTemp=priceTemp.toFixed(2)
            /* console.log(priceTemp); */
            this.setData({
                selectFlag:this.data.selectFlag,
                priceTotal:priceTemp
            })
           /*  console.log(this.data.selectFlag); */
        }else{
            this.data.selectFlag[index].flag=!this.data.selectFlag[index].flag
            this.data.selectFlag[index].buyFlag=price
            //计算合计价格
            var priceTemp = parseFloat(this.data.priceTotal);
            priceTemp=priceTemp+price
            priceTemp=priceTemp.toFixed(2)
            /* console.log(priceTemp); */
            this.setData({
                selectFlag:this.data.selectFlag,
                priceTotal:priceTemp
            })
            /* console.log(this.data.selectFlag); */
        }
    },
    switchNotice(){
        this.setData({
            hideNotice:true
        })
    },
    /* 全选 */
    bindSelectAll(e){
        // 取反
        this.setData({
            selectAll:!this.data.selectAll
        })
        //选择所有的物品信息
        /* this.data.selectFlag[i].buyFlag=this.data.shopGroups[i].shopAll.shopPrice */
        if(this.data.selectAll==false){
            for(var i =0;i<this.data.shopGroups.length;i++){
                this.data.selectFlag[i].flag=false
                this.data.selectFlag[i].buyFlag=0
                this.setData({
                    selectFlag:this.data.selectFlag,
                    priceTotal:0
                })
            }
            console.log(this.data.selectFlag);
        }else{
            var priceTotalTemp=0
            for(var i =0;i<this.data.shopGroups.length;i++){
                this.data.selectFlag[i].flag=true
                var tempNum=parseFloat(this.data.shopGroups[i].shopAll.shopPrice)
                this.data.selectFlag[i].buyFlag=tempNum
                priceTotalTemp=priceTotalTemp+tempNum
                this.setData({
                    selectFlag:this.data.selectFlag,
                    priceTotal:priceTotalTemp
                })
            }
            console.log(this.data.selectFlag);
        }
        
    },
    /* 购物车删除 */
    bindDelShop(e){
        var index = e.currentTarget.dataset.index
        console.log(index);
        var id = this.data.shopGroups[index]._id
        wx.showModal({
          title: '确定删除？',
          complete: (res) => {
            if (res.confirm) {
                wx.showLoading({
                    title:'删除中'
                })
              wx.cloud.database().collection('shopCar').doc(id).remove({
                  success:()=>{
                      wx.hideLoading()
                      wx.showToast({
                        title: '删除成功',
                      })
                      this.onLoad()
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
        /* 判断是否登陆状态 */
        if(wx.getStorageSync('userInfo').loginFlag==1){
            wx.showLoading({
              title: '购物车',
            })
            console.log(app.globalData.openid);
            wx.cloud.callFunction({
                name:'shopCarColl',
                data:{
                    value:app.globalData.openid
                },success:(res)=>{
                    wx.hideLoading()
                    console.log(res);
                    this.setData({
                        shopGroups:res.result.data
                    })
                    //创建radioFlag和价格
                    var temp= []
                    for(var i=0;i<res.result.data.length;i++){
                        var obj = {}
                        obj.flag = false
                        obj.buyFlag=0
                        temp.push(obj)
                        this.setData({
                            selectFlag:temp
                        })
                    }
                },fail:(res)=>{
                    wx.hideLoading()
                    console.log("获取购物车失败",res);
                }
            })
            // 收货地址
            wx.cloud.database().collection('address').where({
                _openid:app.globalData.openid
            }).get({
                success:(res_3)=>{
                    console.log('地址',res_3);
                    this.setData({
                        address:res_3.data,
                        addrDefault:res_3.data[0]
                    })
                }
            })
              
        }else{
            wx.showToast({
              title: '请先登录',
              icon:'error'
            })
        }
        
    },
    /* 提交订单并支付 */
    bindPay(){
       /* 
        计算价格--> 全局
        订单详情--> 计算订单
       */
      
        var arrayShopSelect = []

        for(var i =0 ;i<this.data.selectFlag.length;i++){
            if(this.data.selectFlag[i].flag==true){
                    var tempObj = this.data.shopGroups[i].shopAll
                    arrayShopSelect.push(tempObj)
                    /* console.log(arrayShopSelect); */
            }
        }
        /* console.log(arrayShopSelect); */
        if(arrayShopSelect.length!=0){
            /* 判断是否有地址 */
            if(this.data.addrDefault.length==0){
                wx.showModal({
                    title:'暂无收货地址',
                    content:'点击确定进行完善',
                    success:(res_2)=>{
                        if(res_2.confirm){
                            wx.navigateTo({
                            url: '/pages/address/address',
                            })
                        }
                    }
                })
            }else{
                wx.showModal({
                    title: '确定提交'+arrayShopSelect.length+'笔订单',
                    content: '点击确定提交',
                    complete: (res) => {
                        if (res.confirm) {
                            var temp = {}
                            //处理收货地址
                            var address = this.data.addrDefault.region
                            /*  console.log(address); */
                            address.push(this.data.addrDefault.address)
                            temp.address=address
                            temp.buyInfo = arrayShopSelect
                            app.globalData.buy_Info_Addr = temp
                            console.log('传递全局',app.globalData.buy_Info_Addr);
                            wx.navigateTo({
                                url: '/pages/buyStyle/buyStyle',
                            })
                             
                        }
                    }
                })
            }
        }else{
            wx.showToast({
              title: '订单不能为空',
              icon:'none',
            })
        }

    },
    /* 添加收货地址 */
    addAdrress(){
        /* 
            判断是否登录

            添加新的地址
        */
       if(wx.getStorageSync('userInfo').loginFlag==1){
            wx.navigateTo({
                url: '/pages/address/address',
            })
       }else{
           wx.showModal({
               title:'您似乎还没登录,确定开始登录',
               success:(res)=>{
                   if(res.confirm){
                       wx.switchTab({
                         url: '/pages/user/user',
                       })
                   }
               }
           })
       }
    },
    /* 加入购物车 */
    //点击我显示底部弹出框
    bindShopCar: function (res) {
        wx.showModal({
            title: '确定加入购物车？',
            content: '点击确定加入',
            complete: (res_3) => {
            if (res_3.cancel) {
                wx.showToast({
                    title: '购买取消',
                    icon:'error'
                })
            }
            if (res_3.confirm) {
                    /* 判断是否领取了优惠券*/
                    wx.showLoading({
                        title:'检查中'
                    })
                    var id = this.data.shopRows._id
                    wx.cloud.database().collection('youhuiQuan').where({
                        _openid:app.globalData.openid,
                        shopId:id
                    }).get({
                        success:(res_6)=>{
                            wx.hideLoading()
                            console.log(res_6);
                            if(res_6.data.length>0){
                                wx.showLoading({
                                  title: '加入购物车中',
                                })
                                //处理优惠券与商品之间的关系
                                var tempRows = this.data.shopRows
                               /*  console.log(tempRows); */
                                tempRows.quanFlag = true
                                tempRows.quanJian =0
                                /* console.log('效果',temRows); */
                                wx.cloud.database().collection('shopCar').add({
                                    data:{
                                        shopAll:tempRows,
                                    },success(){
                                        wx.hideLoading()
                                        wx.reLaunch({
                                          url: '/pages/shopcar/shopcar',
                                        })
                                    }
                                })
                            }if(res_6.data.length==0){
                                wx.showLoading({
                                    title: '加入购物车中',
                                  })
                                var tempRows = this.data.shopRows
                                console.log(tempRows);
                                tempRows.quanFlag = false
                                tempRows.quanJian =0
                                console.log('优惠券处理',tempRows);
                                wx.cloud.database().collection('shopCar').add({
                                    data:{
                                        shopAll:tempRows,
                                    },success(){
                                        wx.hideLoading()
                                        wx.reLaunch({
                                          url: '/pages/shopcar/shopcar',
                                        })
                                    }
                                })
                            }
                        },fail:(res_6)=>{
                            console.log(res_6);
                        }
                    })
                    
            }
            }
        })
        
    },
    /* 加入购物车 */
    //点击我显示底部弹出框
    SelectNewAAddr: function (res) {
        /* 判断是否登录 */
        this.showModal();
    },
    //显示对话框
    showModal: function () {
        // 显示遮罩层
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()
        this.setData({
        animationData: animation.export(),
            showModalStatus: true
        })
        setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
            animationData: animation.export()
        })
        }.bind(this), 200)
    },
    //隐藏对话框
    hideModal: function () {
        // 隐藏遮罩层
        var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()
        this.setData({
        animationData: animation.export(),
        })
        setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
            animationData: animation.export(),
            showModalStatus: false
        })
        }.bind(this), 200)
    },
    /* 选择地址 */
    selectThis(e){
        var index = e.currentTarget.dataset.index
        var temp = this.data.address[index]
        this.setData({
            addrDefault:temp
        })
        this.hideModal()
    },
})