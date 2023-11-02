// pages/diandanDetail/diandanDetail.js
const app=getApp({})
Page({

    /**
     * 页面的初始数据
     */
    data: {
          rows:'',
          handleIndex:{},
          tempOrderDetail:[],
          priceAll:0,
          orderNum:1,
          styleFlag:[
              {flag:true},
              {flag:false}
          ],
          styleFlagwhice:1,
          paySelectFlag:false,
          detailStyle:'',
          detaiOrder:''
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(options);
        
        wx.showLoading({
          title: '加载中',
        })
        this.setData({
            rows:'',
            handleIndex:{},
            tempOrderDetail:[],
            priceAll:0,
            orderNum:1,
            styleFlag:[
                {flag:true},
                {flag:false}
            ],
            detailStyle:options.style
        })
        wx.cloud.database().collection('orderDetail').doc(options.id).get({
            success:(res)=>{
                this.setData({
                    rows:res.data
                })
                /* 建立数组存储价格和value */
                var tempOrderDetail=[]
                var sumOrder=parseFloat(this.data.rows.shopPrice)
                var colorFlag = this.data.rows.shopShuXing
                for(var i=0;i<colorFlag.length;i++){
                    var temp={}
                    temp.value=colorFlag[i].detail[0].value
                    temp.price=colorFlag[i].detail[0].price
                    tempOrderDetail.push(temp)
                    /* 价格计算 */
                    sumOrder=sumOrder+parseFloat(colorFlag[i].detail[0].price)
                    console.log('sumOrder:',sumOrder);
                    this.setData({
                        tempOrderDetail:tempOrderDetail,
                        priceAll:sumOrder.toFixed(2)
                    })
                    for(var j=0;j<colorFlag[i].detail.length;j++){
                        if(j==0){
                            colorFlag[i].detail[j].flag=true
                            this.setData({
                                handleIndex:colorFlag
                            })
                        }else{
                            colorFlag[i].detail[j].flag=false
                            this.setData({
                                handleIndex:colorFlag
                            })
                        }
                        console.log(colorFlag);
                    }
                }
                console.log(this.data.rows);
                console.log(this.data.handleIndex);
                console.log("点单存储单元:",this.data.tempOrderDetail);
                wx.hideLoading()
            }
        })
    },
    /* 属性选择 */
    bindIndexDouble(e) {
        console.log(e);
        var indexFather = e.currentTarget.dataset.indexfather;
        var indexSoon = e.currentTarget.dataset.indexsoon;
        console.log("父亲索引:", indexFather + "子索引:", indexSoon);
      
        var temp = this.data.handleIndex[indexFather].detail;
        for (var i = 0; i < temp.length; i++) {
          temp[i].flag = (i === indexSoon);
        }
        this.data.handleIndex[indexFather].detail = temp;
        this.setData({
          handleIndex: this.data.handleIndex
        });
        var tempObj = this.data.tempOrderDetail;
        tempObj[indexFather].price = this.data.rows.shopShuXing[indexFather].detail[indexSoon].price;
        tempObj[indexFather].value = this.data.rows.shopShuXing[indexFather].detail[indexSoon].value;
        this.setData({
            tempOrderDetail: tempObj
        });
      
        var sumOrder = parseFloat(this.data.rows.shopPrice);
        console.log();
        for (var p = 0; p < tempObj.length; p++) {
            sumOrder += parseFloat(tempObj[p].price) * this.data.orderNum;
        }
        this.setData({
          priceAll: sumOrder.toFixed(2)
        });
      },
    /* 价格增加 */
    bindAddNum() {
    var priceTemp = this.data.priceAll / this.data.orderNum;
    this.setData({
        orderNum: this.data.orderNum + 1,
        priceAll: (priceTemp * (this.data.orderNum + 1)).toFixed(2)
    });
    },
      
    /* 价格减少 */
    bindMulNum() {
    var options ={}
    var id = this.data.rows._id
    options.id=id
    wx.showToast({
        title: '请重新选择',
        icon:'none',
        success:()=>{
        this.onLoad(options)
        }
    })
    
    },      
    /* 加入到购物车 */
    bindAddToShopCar(){
        wx.showModal({
            title:"确定加入购物车",
            success:(res)=>{
                if(res.confirm){
                    var temp={}
                    temp.priceAll=this.data.priceAll
                    temp.orderNum=this.data.orderNum
                    temp.orderShuXing=this.data.tempOrderDetail
                    temp.goodGroups=this.data.rows
                    if( app.globalData.orderStyle ==1){
                        app.globalData.orderTemp.push(temp)
                        wx.navigateTo({
                        url: '/pages/orderDetail/orderDetail',
                        })
                    }if(app.globalData.orderStyle==2){
                        app.globalData.orderTempZiti.push(temp)
                        wx.navigateTo({
                            url: '/pages/takeOut/takeOut',
                        })
                    }
                    
                }
            }
        })
        
    },
    /* 支付选择完成 */
    bindPaySelectNow(){
        if(this.data.styleFlagwhice==1){
            this.setData({
                paySelectFlag:false
            })
            this.bindMyMoney()
        }else{
            this.setData({
                paySelectFlag:false
            })
            this.bindPayNow()
        }
    },

    /* 立刻支付微信支付 */
    bindPayNow(){
        /* 判断内容 */
        if(this.data.detailStyle=='自提'){
           this.data.detaiOrder = ''
        }if(this.data.detailStyle=='堂食'){
          this.data.detaiOrder =app.globalData.orderLocation
        }
        wx.showModal({
            title:'确定下单？',
            content:'信息:'+app.globalData.orderLocation.code,
            success:(res)=>{
                if(res.confirm){
                    wx.showLoading({
                        title:'下单中'
                    })
                    /* 订单信息 */
                    var tempInfo = []
                    var tempInfoObj = {}
                    tempInfoObj.goodGroups=this.data.rows
                    tempInfoObj.orderNum = this.data.orderNum
                    tempInfoObj.priceAll = this.data.priceAll
                    tempInfoObj.orderShuXing=this.data.tempOrderDetail
                    tempInfo.push(tempInfoObj)
                    const now = new Date();
                    const yearNow = now.getFullYear();   // 获取年份
                    const monthNow = now.getMonth() + 1; // 获取月份（注意月份从 0 开始，所以需要加 1）
                    const dayNow = now.getDate();        // 获取日期
                    const hoursNow = now.getHours();     // 获取小时
                    const minutesNow = now.getMinutes(); // 获取分钟
                    const secondsNow = now.getSeconds(); // 获取秒钟
                    /* 核销码 */
                    var  orderCode=parseInt(Math.random()*1000000)
                    //创建订单
                    const timestamp = Date.now().toString(); // 获取当前时间戳
                    const randomStr = Math.random().toString(36).substr(2, 8); // 生成8位随机字符串
                    const orderNumber = timestamp + randomStr; // 组合订单号
                    wx.cloud.database().collection('orderUser').add({
                        data:{
                            subTime:yearNow+'-'+monthNow+'-'+dayNow+' '+hoursNow+':'+minutesNow+':'+secondsNow,/* 下单时间 */
                            subDate:yearNow+'-'+monthNow+'-'+dayNow,/* 下单日期 */
                            orderCode:orderCode,//核销码
                            orderRows:[this.data.rows],
                            orderTable: this.data.detaiOrder ,//餐桌
                            orderGroups:tempInfo,//点单详情
                            status:'正在备餐中', // 出餐情况
                            style:this.data.detailStyle, //用餐方式
                            pre_title:this.data.detailStyle+'点单',//订单号
                            pay_status:'wait', //交易状态
                            orderNumber:orderNumber, //交意单号
                            order_price:this.data.priceAll //价格
                        },success:(event)=>{
                            //支付接口
                            /* 价格处理 */
                            var price = parseFloat(this.data.priceAll)
                            // 订单处理
                            wx.cloud.callFunction({
                                name:'payPre',
                                data:{
                                    pro_name:app.globalData.orderLocation.code+'的点单',
                                    pro_codeNum:orderNumber,
                                    pro_price:price*100,
                                },
                                success:(res_3)=>{
                                    console.log("res_3支付函数返回的信息",res_3);
                                    wx.hideLoading()
                                    // 调起支付
                                    wx.requestPayment({
                                        timeStamp: res_3.result.payment.timeStamp,
                                        nonceStr: res_3.result.payment.nonceStr,
                                        package: res_3.result.payment.package,
                                        signType: 'MD5',
                                        paySign: res_3.result.payment.paySign,
                                        success (res_4) {
                                            wx.cloud.database().collection('orderUser').where({
                                                orderNumber:orderNumber
                                            }).update({
                                                data:{
                                                    pay_status:'订单完成'
                                                },success:()=>{
                                                    wx.showToast({
                                                        title: '下单成功！',
                                                    })
                                                    wx.reLaunch({
                                                        url: '/pages/orderDingDan/orderDingDan',
                                                    })
                                                }
                                            })
                                            },
                                        fail (res_4) {
                                            console.log('发起支付窗口失败');
                                            }
                                        })
                                },fail(res_3){
                                    console.log('调用payPre失败：',res_3);
                                }
                            })
                                
                            }
                    })
                }if(res.content){
                    wx.showToast({
                    title: '您已取消！',
                    icon:'none'
                    })
                }
            }
        })    
    },
    /* 立刻钱包支付 */
    bindMyMoney(){
        /* 

            首先查看钱包余额
            然后调起wx.showModal
            点击确定:比较钱包余额和待付款的大小
            --->余额充足:调起订单并扣费
            --->余额不足:提醒充值

        */
       if(this.data.detailStyle=='自提'){
            this.data.detaiOrder = ''
        }if(this.data.detailStyle=='堂食'){
            this.data.detaiOrder =app.globalData.orderLocation
        }
       wx.showLoading({
         title: '准备中',
       })
        wx.cloud.database().collection('userinfo').where({
            _openid:app.globalData.openid
        }).get({
            success:(res)=>{
                wx.hideLoading()
                console.log(res.data[0].userAccount);
                var yue=res.data[0].userAccount
                const id=res.data[0]._id
                wx.showModal({
                  title: '确定用会员账户余额支付？',
                  complete: (res) => {
                    if (res.cancel) {
                       wx.showToast({
                         title: '您取消了支付',
                         icon:'none'
                       })
                    }
                    if (res.confirm) {
                        /* 对比订单与余额的大小 */
                        if(parseFloat(yue)>parseFloat(this.data.priceAll)){
                           wx.showLoading({
                             title: '订单准备中',
                           }) 
                           /* 先扣款 再下单 */
                           // 扣款后的余额
                           var yueTemp = parseFloat(yue)-parseFloat(this.data.priceAll)
                           //更新数据库
                           wx.cloud.database().collection('userinfo').doc(id).update({
                               data:{
                                   userAccount:yueTemp
                               },success:(res_2)=>{
                                    console.log("扣款成功");
                                    // 发起订单
                                    /* 订单信息 */
                                    var tempInfo = []
                                    var tempInfoObj = {}
                                    tempInfoObj.goodGroups=this.data.rows
                                    tempInfoObj.orderNum = this.data.orderNum
                                    tempInfoObj.priceAll = this.data.priceAll
                                    tempInfoObj.orderShuXing=this.data.tempOrderDetail
                                    tempInfo.push(tempInfoObj)
                                    const now = new Date();
                                    const yearNow = now.getFullYear();   // 获取年份
                                    const monthNow = now.getMonth() + 1; // 获取月份（注意月份从 0 开始，所以需要加 1）
                                    const dayNow = now.getDate();        // 获取日期
                                    const hoursNow = now.getHours();     // 获取小时
                                    const minutesNow = now.getMinutes(); // 获取分钟
                                    const secondsNow = now.getSeconds(); // 获取秒钟
                                    /* 核销码 */
                                    var  orderCode=parseInt(Math.random()*1000000)
                                    //创建订单
                                    const timestamp = Date.now().toString(); // 获取当前时间戳
                                    const randomStr = Math.random().toString(36).substr(2, 8); // 生成8位随机字符串
                                    const orderNumber = timestamp + randomStr; // 组合订单号
                                    wx.cloud.database().collection('orderUser').add({
                                        data:{
                                            subTime:yearNow+'-'+monthNow+'-'+dayNow+' '+hoursNow+':'+minutesNow+':'+secondsNow,/* 下单时间 */
                                            subDate:yearNow+'-'+monthNow+'-'+dayNow,/* 下单日期 */
                                            orderCode:orderCode,//核销码
                                            orderRows:[this.data.rows],
                                            orderTable:this.data.detaiOrder,//餐桌
                                            orderGroups:tempInfo,//点单详情
                                            status:'正在备餐中', // 出餐情况
                                            style:this.data.detailStyle, //用餐方式
                                            pre_title:this.data.detailStyle+'的点单',//订单号
                                            pay_status:'wait', //交易状态
                                            orderNumber:orderNumber, //交意单号
                                            order_price:this.data.priceAll //价格
                                        },success:(event)=>{
                                            wx.cloud.database().collection('orderUser').where({
                                                orderNumber:orderNumber
                                            }).update({
                                                data:{
                                                    pay_status:'订单完成'
                                                },success:()=>{
                                                    wx.hideLoading()
                                                    wx.showToast({
                                                        title: '下单成功！',
                                                    })
                                                    wx.reLaunch({
                                                        url: '/pages/orderDingDan/orderDingDan',
                                                    })
                                                }
                                            })
                                        }
                                    })
                               },fail:(res_2)=>{
                                   wx.hideLoading()
                                    console.log("扣款失败");
                               }
                           })
                        }else{
                            wx.showModal({
                              title: '对不起主人,余额不足',
                              content: '是否充值?',
                              complete: (res) => {
                                if (res.cancel) {
                                    wx.showToast({
                                        title: '请重新选择',
                                        icon:'none'
                                    })
                                    this.setData({
                                        paySelectFlag:true
                                    })
                                }
                                if (res.confirm) {
                                    wx.navigateTo({
                                      url: '/pages/pay/pay',
                                    })
                                }
                              }
                            })
                        }
                    }
                  }
                })
            }
        })
    },
    /*调起支付之口 */
    bindConfirm(){
        this.setData({
            paySelectFlag:!this.data.paySelectFlag
        })
    },
    /* 支付选择 */
    bindSelectStyle(e){
        console.log(e);
        if(e.detail.value==1){
            this.setData({
                styleFlagwhice:1
            })
            
        }else{
            this.setData({
                styleFlagwhice:2
            })
            
        }
    },
    /* 关闭支付窗口 */
    bindCanel(){
        this.setData({
            paySelectFlag:false
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})