// pages/orderDetail/orderDetail.js
const app=getApp({})
Page({

    /**
     * 页面的初始数据
     */
    data: {
        class:['店长力推','畅销好品','精选套餐','一点差点','红茶','绿茶','白茶'],
        handIndex:0,
        orderRowsZiti:[],
        orderTableZiti:[],
        orderGroupsZiti:[],
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
                    orderRowsZiti:e.data
                })
                wx.hideLoading()
            }
        })
    },

    /* 进入详情页 */
    bindOrderDeatil(res){
        var index=res.currentTarget.dataset.index
        var id=this.data.orderRowsZiti[index]._id
        console.log("您点击的是",id);
        wx.navigateTo({
          url: '/pages/diandanDetail/diandanDetail?id='+id+'&style=自提',
        })
    }, 
    /**
     * 生命周期函数--监听页面加载
     */
    
    onLoad(options) {
        console.log(options);
        this.setData({
            orderGroupsZiti:app.globalData.orderTempZiti,
        })
        /* 调用云函数，点单的类 */
        wx.showLoading({
          title: '正在加载中',
        })
        wx.cloud.callFunction({
            name:'orderClass',
            success:(res)=>{
                /* console.log(res); */
                this.setData({
                    class:res.result.list[0].categories
                })
                console.log(res.result.list[0].categories);
                wx.cloud.database().collection('orderDetail').where({
                    shopClass:this.data.class[0],
                    status:true
                }).get({
                    success:(event)=>{
                        console.log(event);
                        this.setData({
                            orderRowsZiti:event.data
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
            orderGroupsZiti:[]
        })
        app.globalData.orderTempZiti=[]
    },
    bindClearRow(e){
        console.log("您要删除的购物车的索引是:",e.currentTarget.dataset.index);
        var index=e.currentTarget.dataset.index
        var temp=this.data.orderGroupsZiti
        temp.splice(index,1)
        this.setData({
            orderGroupsZiti:temp
        })
        app.globalData.orderTempZiti=temp
    },
    /* 清除购物车单独的内容 */
    bindClearRow(e){
        console.log("您要删除的购物车的索引是:",e.currentTarget.dataset.index);
        var index=e.currentTarget.dataset.index
        var temp=this.data.orderGroupsZiti
        temp.splice(index,1)
        this.setData({
            orderGroupsZiti:temp
        })
        app.globalData.orderTempZiti=temp
    },
    /* 立即下单 */
    bindNavXiaDan(){
        if(this.data.orderGroupsZiti.length!=0){
            // //计算价格
            var tempPriceGroups = this.data.orderGroupsZiti
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
                                orderRows:this.data.orderRowsZiti,
                                orderTable:'',//餐桌
                                orderGroups:this.data.orderGroupsZiti,//点单详情
                                status:'正在备餐中', // 出餐情况
                                style:'自提', //用餐方式
                                pre_title:'自提的点单',//订单号
                                pay_status:'wait', //交易状态
                                orderNumber:orderNumber, //交意单号
                                order_price:tempPrice //价格
                            },success:(event)=>{
                                wx.cloud.callFunction({
                                    name:'payPre',
                                    data:{
                                        pro_name:'自提的点单',
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
        }else{
            wx.showToast({
              title: '您当前没有点单',
              icon:'none'
            })
        }
    },
})