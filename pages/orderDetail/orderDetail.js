// pages/orderDetail/orderDetail.js
const app=getApp({})
Page({

    /**
     * 页面的初始数据
     */
    data: {
        class:['店长力推','畅销好品','精选套餐','一点差点','红茶','绿茶','白茶'],
        handIndex:0,
        orderRows:[],
        orderTable:[],
        orderGroups:[],
        showModalStatus:false,
        tangshi:true,
        styleFlag:[
            {flag:true},
            {flag:false}
        ],
        styleFlagwhice:1,
        paySelectFlag:false
    },
    /* 时间点击 */
    bindIndex(res){
        wx.showLoading({
          title: '加载中',
        })
        /* console.log(res.currentTarget.dataset.index);
        console.log(res.currentTarget.dataset.value); */
        var value=res.currentTarget.dataset.value
        this.setData({
            handIndex:res.currentTarget.dataset.index
        })
        wx.cloud.database().collection("orderDetail").where({
            shopClass:value,
            status:true
        }).get({
            success:(e)=>{
                /* console.log("对应饮品:",e); */
                this.setData({
                    orderRows:e.data
                })
                wx.hideLoading()
            }
        })
    },
    /* 进入详情页 */
    bindOrderDeatil(res){
        var index=res.currentTarget.dataset.index
        var id=this.data.orderRows[index]._id
        console.log("您点击的是",id);
        wx.navigateTo({
          url: '/pages/diandanDetail/diandanDetail?id='+id+'&style=堂食',
        })
    },  

    /**
     * 生命周期函数--监听页面加载
     */
    
    onLoad(options) {
        console.log(options);
        console.log('1',app.globalData.orderLocation);
        this.setData({
            orderTable:app.globalData.orderLocation,
            orderGroups:app.globalData.orderTemp,
        })
        /* 调用云函数，点单的类 */
        wx.showLoading({
          title: '正在加载中',
        })
        wx.cloud.callFunction({
            name:'orderClass',
            success:(res)=>{
                console.log(res);
                this.setData({
                    class:res.result.list[0].categories
                })
                wx.cloud.database().collection('orderDetail').where({
                    shopClass:this.data.class[0],
                    status:true
                }).get({
                    success:(event)=>{
                        console.log(event);
                        this.setData({
                            orderRows:event.data
                        })
                        wx.hideLoading()
                    }
                })
            }
        })
    },
    /* 加入购物车 */
    //点击我显示底部弹出框
    bindShopCar: function (res) {
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
    /* 清空全部的购物车内容 */
    bindClearAll(){
        this.setData({
            orderGroups:[]
        })
        app.globalData.orderTemp=[]
    },
    bindClearRow(e){
        console.log("您要删除的购物车的索引是:",e.currentTarget.dataset.index);
        var index=e.currentTarget.dataset.index
        var temp=this.data.orderGroups
        temp.splice(index,1)
        this.setData({
            orderGroups:temp
        })
        app.globalData.orderTemp=temp
    },
    /* 清除购物车单独的内容 */
    bindClearRow(e){
        console.log("您要删除的购物车的索引是:",e.currentTarget.dataset.index);
        var index=e.currentTarget.dataset.index
        var temp=this.data.orderGroups
        temp.splice(index,1)
        this.setData({
            orderGroups:temp
        })
        app.globalData.orderTemp=temp
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
            this.bindNavXiaDan()
        }
    },
    /* 微信支付 */
    bindNavXiaDan(){  
        if(this.data.orderGroups.length!=0){
             
            // //计算价格
            var tempPriceGroups = this.data.orderGroups
            var tempPrice = 0
            for(var i =0 ;i<tempPriceGroups.length;i++){
                tempPrice=tempPrice + parseFloat(tempPriceGroups[i].priceAll) 
                console.log("订单总价格:",tempPrice);
            }
            wx.showModal({
                title:'确定下单？',
                success:(res)=>{
                    /* 
                        预留位置写支付接口
                    */
                    if(res.confirm){
                        wx.showLoading({
                            title:'下单中'
                        })
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
                                orderRows:this.data.orderRows,
                                orderTable:this.data.orderTable,//餐桌
                                orderGroups:this.data.orderGroups,//点单详情
                                status:'正在备餐中', // 出餐情况
                                style:'堂食', //用餐方式
                                pre_title:this.data.orderTable.code+'的点单',//订单号
                                pay_status:'wait', //交易状态
                                orderNumber:orderNumber, //交意单号
                                order_price:tempPrice //价格
                            },success:(event)=>{
                                //支付接口
                                wx.cloud.callFunction({
                                    name:'payPre',
                                    data:{
                                        pro_name:this.data.orderTable.code+'的点单',
                                        pro_codeNum:orderNumber,
                                        pro_price:tempPrice*100,
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
                                                wx.showLoading({
                                                  title: '请稍后',
                                                })
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

        
                                                var str = this.data.orderTable.code
                                                console.log(str);                                       
                                                var number = str.match(/\d+/)[0];
                                                number=number.toString()
                                               
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
        }else{
            wx.showToast({
              title: '您当前没有点单',
              icon:'none'
            })
        }
    },
    /* 账户余额支付 */
    bindMyMoney(){
        /*  

            首席判断是否登录：
            首先查看钱包余额
            然后调起wx.showModal
            点击确定:比较钱包余额和待付款的大小
            --->余额充足:调起订单并扣费
            --->余额不足:提醒充值

        */
       if(wx.getStorageSync('userInfo').loginFlag==1){
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
                                // //计算价格
                            var tempPriceGroups = this.data.orderGroups
                            var tempPrice = 0
                            for(var i =0 ;i<tempPriceGroups.length;i++){
                                tempPrice=tempPrice + parseFloat(tempPriceGroups[i].priceAll) 
                            }
                            /* 对比订单与余额的大小 */
                            if(parseFloat(yue)>parseFloat(tempPrice)){
                                wx.showLoading({
                                    title: '订单准备中',
                                }) 
                                /* 先扣款 再下单 */
                                // 扣款后的余额
                                var yueTemp = parseFloat(yue)-parseFloat(tempPrice)
                                //更新数据库
                                wx.cloud.database().collection('userinfo').doc(id).update({
                                    data:{
                                        userAccount:yueTemp
                                    },success:(res_2)=>{
                                        console.log("扣款成功");
                                        // 发起订单
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
                                                orderRows:this.data.orderRows,
                                                orderTable:this.data.orderTable,//餐桌
                                                orderGroups:this.data.orderGroups,//点单详情
                                                status:'正在备餐中', // 出餐情况
                                                style:'堂食', //用餐方式
                                                pre_title:this.data.orderTable.code+'的点单',//订单号
                                                pay_status:'wait', //交易状态
                                                orderNumber:orderNumber, //交意单号
                                                order_price:tempPrice //价格
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
                                               
                                                var str = this.data.orderTable.code                               
                                                var number = str.match(/\d+/)[0];
                                                number=number.toString()
                                                
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
       }else{
           wx.showModal({
               title:'您似乎还没登录',
               content:'点击确定现在登录',
               success(res_4){
                    wx.switchTab({
                        url: '/pages/user/user',
                    })
               }
           })
       }
    },
    /*调起支付之口 */
    bindConfirm(){
        if(this.data.orderGroups.length!=0){
            this.setData({
                paySelectFlag:!this.data.paySelectFlag
            })
        }else{
            wx.showToast({
              title: '不能为空',
              icon:'none'
            })
        }
       
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