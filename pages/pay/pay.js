// pages/pay/pay.js
const app = getApp({})
Page({

    /**
     * 页面的初始数据
     */
    data: {
        moneyRule:[2000,1000,800,500,200],
        money:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.showLoading({
          title: '加载中',
        })
        /* 获取价格 */
        wx.cloud.database().collection('adminPayRule').get({
            success:(res)=>{
                this.setData({
                    moneyRule:res.data
                })
                console.log(this.data.moneyRule);
            }
        })
        /* 获取余额 */
        wx.cloud.database().collection('userinfo').where({
            _openid:app.globalData.openid
        }).get({
            success:(res)=>{
                console.log(res.data);
                this.setData({
                    money:parseFloat(res.data[0].userAccount).toFixed(2)
                })
                wx.hideLoading()
            }
        })
    },
    /*  */
    payTips(){
        wx.showToast({
          title: '暂未开放',
          icon:'none'
        })
    },
    /*  充值 */
    bindPayNum(e){
       var index = e.currentTarget.dataset.index
       var priceNum = this.data.moneyRule[index]
       wx.showModal({
         title: '确定充值',
         content: '额度'+priceNum+'元',
         complete: (res) => {
           if (res.confirm) {
            wx.showLoading({
                title:'充值中'
            })
            const now = new Date();
            const yearNow = now.getFullYear();   // 获取年份
            const monthNow = now.getMonth() + 1; // 获取月份（注意月份从 0 开始，所以需要加 1）
            const dayNow = now.getDate();        // 获取日期
            const hoursNow = now.getHours();     // 获取小时
            const minutesNow = now.getMinutes(); // 获取分钟
            const secondsNow = now.getSeconds(); // 获取秒钟
           
            //创建订单
            const timestamp = Date.now().toString(); // 获取当前时间戳
            const randomStr = Math.random().toString(36).substr(2, 8); // 生成8位随机字符串
            const orderNumber = timestamp + randomStr; // 组合订单号
            wx.cloud.database().collection('userPay').add({
                data:{
                    subTime:yearNow+'-'+monthNow+'-'+dayNow+' '+hoursNow+':'+minutesNow+':'+secondsNow,/* 下单时间 */
                    subDate:yearNow+'-'+monthNow+'-'+dayNow,/* 下单日期 */
                    pre_title:'冲卡的点单',//订单号
                    pay_status:'wait', //交易状态
                    orderNumber:orderNumber, //交意单号
                    order_price:priceNum, //价格
                    userid:app.globalData.openid // 用户openid
                },success:(event)=>{
                    //支付接口
                    wx.cloud.callFunction({
                        name:'payPre',
                        data:{
                            pro_name:'小茶馆充值卡',
                            pro_codeNum:orderNumber,
                            pro_price:priceNum*100,
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
                                        title:'请稍后'
                                    })
                                    wx.cloud.database().collection('userPay').where({
                                        pay_status:'wait', 
                                        orderNumber:orderNumber, 
                                    }).update({
                                        data:{
                                            pay_status:'支付完成', 
                                        },success:()=>{
                                            //更新user数据库
                                            var oldMoney =parseFloat(this.data.money)
                                            var newMoney = oldMoney+priceNum
                                            newMoney =newMoney.toFixed(2)
                                            wx.cloud.database().collection('userinfo').where({
                                                _openid:app.globalData.openid
                                            }).update({
                                                data:{
                                                    userAccount:newMoney
                                                },success:()=>{
                                                    wx.hideLoading()
                                                    wx.showToast({
                                                      title: '充值成功',
                                                    })
                                                    wx.reLaunch({
                                                      url: '/pages/index/index',
                                                    })
                                                },fail:()=>{
                                                    wx.hideLoading()
                                                }
                                            })
                                        },fail:()=>{
                                            wx.hideLoading()
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
           }
         }
       }) 
    },
    /* 自定义金额 */
    bindpaySelf(){
        var that =this
        wx.showModal({
            title:'请输入要充值的金额(不小于1元)',
            content:'',
            editable:true,
            success:(res)=>{
                if(res.confirm){
                    // 检验是数字 //不小于1 //必须是数字
                    if(res.content<1){
                        wx.showToast({
                          title: '不能小于1元',
                          icon:'none'
                        })
                    }else{
                        var pattern = /^\d+$/;
                        if(pattern.test(res.content)){
                            wx.showLoading({
                                title:'充值中'
                            })
                            var priceNum = res.content
                            const now = new Date();
                            const yearNow = now.getFullYear();   // 获取年份
                            const monthNow = now.getMonth() + 1; // 获取月份（注意月份从 0 开始，所以需要加 1）
                            const dayNow = now.getDate();        // 获取日期
                            const hoursNow = now.getHours();     // 获取小时
                            const minutesNow = now.getMinutes(); // 获取分钟
                            const secondsNow = now.getSeconds(); // 获取秒钟
                            //创建订单
                            const timestamp = Date.now().toString(); // 获取当前时间戳
                            const randomStr = Math.random().toString(36).substr(2, 8); // 生成8位随机字符串
                            const orderNumber = timestamp + randomStr; // 组合订单号
                            wx.cloud.database().collection('userPay').add({
                                data:{
                                    subTime:yearNow+'-'+monthNow+'-'+dayNow+' '+hoursNow+':'+minutesNow+':'+secondsNow,/* 下单时间 */
                                    subDate:yearNow+'-'+monthNow+'-'+dayNow,/* 下单日期 */
                                    pre_title:'冲卡的点单',//订单号
                                    pay_status:'wait', //交易状态
                                    orderNumber:orderNumber, //交意单号
                                    order_price:priceNum, //价格
                                    userid:app.globalData.openid // 用户openid
                                },success:(event)=>{
                                    //支付接口
                                    wx.cloud.callFunction({
                                        name:'payPre',
                                        data:{
                                            pro_name:'小茶馆充值卡',
                                            pro_codeNum:orderNumber,
                                            pro_price:priceNum*100,
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
                                                        title:'请稍后'
                                                    })
                                                    wx.cloud.database().collection('userPay').where({
                                                        pay_status:'wait', 
                                                        orderNumber:orderNumber, 
                                                    }).update({
                                                        data:{
                                                            pay_status:'支付完成', 
                                                        },success:(res_6)=>{
                                                            //更新user数据库
                                                            var oldMoneyTemp =that.data.money
                                                            console.log(oldMoneyTemp);
                                                            console.log(priceNum);
                                                            var newMoneyTemp =parseFloat(oldMoneyTemp) +parseFloat(priceNum)
                                                            console.log(newMoneyTemp);
                                                            newMoneyTemp =newMoneyTemp.toFixed(2)
                                                            console.log(newMoneyTemp)
                                                            wx.cloud.database().collection('userinfo').where({
                                                                _openid:app.globalData.openid
                                                            }).update({
                                                                data:{
                                                                    userAccount:newMoneyTemp
                                                                },success:()=>{
                                                                    wx.hideLoading()
                                                                    wx.showToast({
                                                                      title: '充值成功',
                                                                    })
                                                                    wx.reLaunch({
                                                                      url: '/pages/index/index',
                                                                    })
                                                                },fail:()=>{
                                                                    wx.hideLoading()
                                                                }
                                                            })
                                                        },fail:(res_6)=>{
                                                            wx.hideLoading()
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
                        }else{
                            wx.showToast({
                              title: '请输入金额',
                              icon:'none'
                            })
                        }
                    }
                }if(res.cancel){
                    wx.showToast({
                      title: '支付取消',
                      icon:'error'
                    })
                }
            }

        })
    }
})