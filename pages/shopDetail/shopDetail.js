//show.js  
//获取应用实例    
var app = getApp()    
Page({  
    data:{
        images: [
            'https://img.fht360.com/content/image/20180705/50a0068c1fbc4088b57f999ad8fe0d94.jpg',
            'https://img2.baidu.com/it/u=1056662899,2476456169&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500',
            'https://img0.baidu.com/it/u=3946990387,1123559415&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
          ],
          collFlag:0,
          shopRows:'',
          address:'',
          showModalStatus:false,
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
    /* 选项 */
    radioChange: function(e) {
        this.setData({
            shopPrice:e.detail.value
        })
    },
    /* 查看轮播图 */
    bindPreView(){
        wx.previewImage({
          urls:this.data.images,
        })
    },
    /* 查看详情图片 */
    bindLookIImga(res){
        var url=res.currentTarget.dataset.url
        wx.previewImage({
          urls: [url],
        })
    },
    /* 获取选中的购物车 */
    handleChange(e) {
        /* console.log(e); */
        wx.showLoading({
            title:'计算中'
        })
        var index=e.currentTarget.dataset.index
        var priceTmp=e.currentTarget.dataset.value
        /* console.log(this.data.checked); */
        var checking=this.data.checked[index].checked
        checking=!checking
        this.data.checked[index].checked=checking
        if(checking==false){
            this.data.checked[index].price=0
        }if(checking==true){
            this.data.checked[index].price=priceTmp
        }
        this.setData({
            checked:this.data.checked
        })
        /* console.log(this.data.checked); */
        /* 计算价格 */
        this.sumPirceFun()
       /*  console.log(sumPrice); */
    },
    /* kefu */
    /* 接入客服 */
    methods: {
        handleContact(e) {
          console.log(e.detail.path)
          console.log(e.detail.query)
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
    /* 收藏 */
    bindCollected(res){
        if(this.data.collFlag==0){
            wx.showToast({
                title: '收藏成功',
              })
              this.setData({
                  collFlag:1
              })
        }else{
            wx.showToast({
                title: '取消收藏',
              })
              this.setData({
                  collFlag:0
              })
        }
    },
    bindShare(){
        wx.showModal({
            title:'请点击右上角...'
        })
    },
    /* 领券 */
    bindGetQuan(){
        /* 
            判断是否登录

            判断是否有优惠券

            

            判断是否已经领过此券
                用户opeid、商品appid

            加入到数据库：
                加入的信息-->
                    商品id
                    优惠券信息
        */
       var id = this.data.shopRows._id
      /*  console.log('商品id',id); */
       if(wx.getStorageSync('userInfo').loginFlag==1){
           /* 判断商品有无优惠券 */
           if(this.data.shopRows.youhui[0].detail.length==0){
            wx.showToast({
                title: '无优惠券可领',
                icon:'none'
              })
           }else{  
               wx.showLoading({
                    title:'领取中'
                })
                wx.cloud.database().collection('youhuiQuan').where({
                    _openid:app.globalData.openid,
                    shopId:id
                }).get({
                    success:(res)=>{
                        console.log(res);
                        wx.showLoading()
                        if(res.data.length>0){
                            
                            wx.showToast({
                            title: '您已领取过',
                            icon:'none'
                            })
                        }else{
                            /* 添加到数据库 */
                            wx.showLoading({
                                title:'添加'
                            })
                            wx.cloud.database().collection('youhuiQuan').add({
                                data:{
                                    shopId:id,
                                    time:Date.now()
                                },success:(res_2)=>{
                                    wx.hideLoading()
                                    wx.showToast({
                                        title: '领取成功',
                                    })
                                }
                            })
                        }
                    }
                })
               
           }
       }else{
           wx.showToast({
             title: '未登录',
             icon:'none'
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
    onLoad(options){
        console.log(options.id);
        wx.showLoading({
            title:'加载中'
        })
        /* 商品信息 */
        wx.cloud.database().collection('marketShop').doc(options.id).get({
            success:(res)=>{
                wx.hideLoading()
                this.setData({
                    shopRows:res.data,
                    images:res.data.goodPhotosLast,
                })
            }
        
        })
        /*收货地址 */
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
        
        
    },
    /* 下拉刷新 */
    onPullDownRefresh(){
        var options = {}
        options.id=this.data.shopRows._id
        this.onLoad(options)
    },
    /* 立即购买 */
    bindBuyNow(){
        /* 
            购买业务流程：
            1、判断是否有地址

            2、购买方式

            3、传参内容:
                3.1地址
                3.基本信息
        */
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
                title: '确定现在购买？',
                content: '购买点击确定',
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
                            success:(res)=>{
                                wx.hideLoading()
                                if(res.data.length>0){
                                    var shopArray = []
                                    var temp = {}
                                    //处理收货地址
                                    var address = this.data.addrDefault.region
                                    /*  console.log(address); */
                                    address.push(this.data.addrDefault.address)
                                    /* console.log(address); */
                                    //处理优惠券与商品之间的关系
                                    var tempRows = this.data.shopRows
                                    tempRows.quanFlag = true
                                    tempRows.quanJian =0
                                    /* console.log('优惠券处理',tempRows); */
                                    shopArray.push(tempRows)
                                    // 以json传给app   
                                    temp.address=address
                                    temp.buyInfo = shopArray
                                    app.globalData.buy_Info_Addr = temp
                                    console.log('传递全局',app.globalData.buy_Info_Addr);
                                    wx.navigateTo({
                                        url: '/pages/buyStyle/buyStyle',
                                    })
                                }if(res.data.length==0){
                                    var shopArray = []
                                    var temp = {}
                                    //处理收货地址
                                    var address = this.data.addrDefault.region
                                    /*  console.log(address); */
                                    address.push(this.data.addrDefault.address)
                                    /* console.log(address); */
                                    //处理优惠券与商品之间的关系
                                    var tempRows = this.data.shopRows
                                    tempRows.quanFlag = false
                                    tempRows.quanJian =0
                                    console.log('优惠券处理',tempRows);
                                    shopArray.push(tempRows)
                                    // 以json传给app   
                                    temp.address=address
                                    temp.buyInfo = shopArray
                                    app.globalData.buy_Info_Addr = temp
                                    console.log('传递全局',app.globalData.buy_Info_Addr);
                                    wx.navigateTo({
                                        url: '/pages/buyStyle/buyStyle',
                                    })
                                }
                            },fail:(res)=>{
                                console.log(res);
                            }
                        })
                        
                }
                }
            })
        }
       

    }
})  