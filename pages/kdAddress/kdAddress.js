// pages/kdAddress/kdAddress.js
const app=getApp({})
Page({

    /**
     * 页面的初始数据
     */
    data: {
        startLatitude:35.882209,
        startLongitude:120.047107,
        targetKm:'',
        selectedDateTime: '点击选择日期',
        selectedTime:'点击选择时间段',
        shopPrice:'',
        room:'',
        name:'',
        phone:'',
        addressDetail:'点击我获取定位',
        targetInfo:'',
        shopRows:'',
        data_PriceAll:0,
        yingfu_priceAll:0,
        jifeiRule:'',
        paotuiPrice:0
    },
    /* 提交 */
    bindSubmit(){
        if(this.data.room.length==0||this.data.name.length==0||this.data.phone.length==0||this.data.selectedDateTime=='点击选择日期'||this.data.selectedTime=='点击选择时间段'||this.data.targetKm.length==0){
            wx.showToast({
              title: '请填写完整',
              icon:'error'
            })
        }else{
            // 定义手机号格式的正则表达式
            const phoneRegex = /^1\d{10}$/;
            if (phoneRegex.test(this.data.phone)) {
                 /* 支付接口写在这里 */
                wx.showLoading({
                    title:'提交中'
                })
                const now = new Date();
                const yearNow = now.getFullYear();   // 获取年份
                const monthNow = now.getMonth() + 1; // 获取月份（注意月份从 0 开始，所以需要加 1）
                const dayNow = now.getDate();        // 获取日期
                const hoursNow = now.getHours();     // 获取小时
                const minutesNow = now.getMinutes(); // 获取分钟
                const secondsNow = now.getSeconds(); // 
                //创建订单
                const timestamp = Date.now().toString(); // 获取当前时间戳
                const randomStr = Math.random().toString(36).substr(2, 8); // 生成8位随机字符串
                const orderNumber = timestamp + randomStr; // 组合订单号
                // 计算总价格
                var Total = parseFloat(this.data.paotuiPrice)+parseFloat(this.data.data_PriceAll)
                wx.cloud.database().collection('shopTongCheng').add({
                    data:{
                        subTime:yearNow+'-'+monthNow+'-'+dayNow+' '+hoursNow+':'+minutesNow+':'+secondsNow,
                        shifuPrice:this.data.data_PriceAll, //实付价格
                        yingfuPrice:this.data.yingfu_priceAll, //应付价格
                        peisongPrice:this.data.paotuiPrice,//配送费用3
                        shopRows:this.data.shopRows, //购买商品信息
                        addressGet:this.data.addressDetail,//匹配地址
                        addressRoom:this.data.room,//配送具体的楼层
                        phone:this.data.phone, //手机号
                        name:this.data.name, //姓名
                        targetKm:this.data.targetKm,
                        date:this.data.selectedDateTime,
                        time:this.data.selectedTime,
                        status:'等待商家发货',//等待商家确认
                        pre_title:'小茶馆配送送',//订单号
                        pay_status:'wait', //交易状态
                        orderNumber:orderNumber, //交意单号
                    },
                    success:(res)=>{
                        //支付接口
                        wx.cloud.callFunction({
                            name:'payPre',
                            data:{
                                pro_name:'小茶馆商城上门派送',
                                pro_codeNum:orderNumber,
                                pro_price:(Total)*100,
                            },
                            success:(res_3)=>{
                                wx.hideLoading()
                                console.log("res_3支付函数返回的信息",res_3);
                                // 调起支付
                                wx.requestPayment({
                                    timeStamp: res_3.result.payment.timeStamp,
                                    nonceStr: res_3.result.payment.nonceStr,
                                    package: res_3.result.payment.package,
                                    signType: 'MD5',
                                    paySign: res_3.result.payment.paySign,
                                    success (res_4) {
                                        wx.cloud.database().collection('shopTongCheng').where({
                                            orderNumber:orderNumber,
                                            pay_status:'wait'
                                        }).update({
                                            data:{
                                                pay_status:'支付完成'
                                            },success:(res_5)=>{
                                                wx.showToast({
                                                    title: '下单成功！',
                                                })
                                                wx.reLaunch({
                                                url: '/pages/user/user',
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
            }else{
                wx.showToast({
                  title: '手机格式错误',
                  icon:'error'
                })
            }
        }
    },
    bindTest(){
        wx.chooseLocation({
            success:(e)=>{
                console.log(e);
                var target={}
                target.latitude=e.latitude
                target.longitude=e.longitude
                target.address=e.address
                target.name=e.name
                this.setData({
                    targetInfo:target,
                    addressDetail:e.address+e.name
                })
                const earthRadius = 6371; // 地球半径，单位为千米
                // 将经纬度转换为弧度
                const lat1 = this.data.startLatitude * Math.PI / 180;
                const lon1 = this.data.startLongitude * Math.PI / 180;
                const lat2 = e.latitude * Math.PI / 180;
                const lon2 = e.longitude * Math.PI / 180;
                // 使用 Haversine 公式计算距离
                const dlon = lon2 - lon1;
                const dlat = lat2 - lat1;
                const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                const distance = earthRadius * c;
                this.setData({
                    targetKm:distance.toFixed(2)
                })
                console.log(distance.toFixed(2)); // 保留两位小数
                var tempKm = distance.toFixed(2)
                if(tempKm<=this.data.jifeiRule.km){
                    /* 配送费用小 */
                    this.setData({
                        paotuiPrice:parseFloat(this.data.jifeiRule.base)
                    })
                }if(tempKm>this.data.jifeiRule.km){
                    var dis =parseFloat(tempKm) - parseFloat(this.data.jifeiRule.km)
                    var priceTemp=dis*parseFloat(this.data.jifeiRule.more_than)+parseFloat(this.data.jifeiRule.base)
                    this.setData({
                        paotuiPrice:priceTemp.toFixed(2)
                    })
                }
            }
        })
    },
    handleDateChange(event) {
        const selectedDateTime = event.detail.value;
        console.log( event.detail.value);
        this.setData({
          selectedDateTime: selectedDateTime
        });
    },
    handleTimePickerChange(event) {
        const selectedTime = event.detail.value;
        console.log(event.detail.value);
        // 在这里执行你的业务逻辑，比如将选择的时间存储起来或者展示在页面上
        this.setData({
            selectedTime: selectedTime
        });
    },
    bindRoom(e){
        console.log(e.detail.value);
        this.setData({
            room:e.detail.value
        })
    },
    bindName(e){
        console.log(e.detail.value);
        this.setData({
            name:e.detail.value
        })
    },
    bindPhone(e){
        console.log(e.detail.value);
        this.setData({
            phone:e.detail.value
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.showLoading({
            title: '加载中',
          })
        this.setData({
            shopRows:app.globalData.buy_Info_Addr.buyInfo,
        })
        var tempBuy = app.globalData.buy_Info_Addr.buyInfo
        /* 
            业务逻辑:
            判断每个是否有优惠券
                -->否:直接计算价格
                -->是:看是否满足规格
                    -->是:减去（单个计算）
                    -->否：计算价格（单个计算）
        */
       var priceAll = 0
       var priceAllYingfu = 0
       for(var i=0;i<tempBuy.length;i++){
           /* 计算应付价格 */
           var tempPriceYingfu =parseFloat(tempBuy[i].shopPrice)
           priceAllYingfu=parseFloat(priceAllYingfu)
           priceAllYingfu=priceAllYingfu+tempPriceYingfu
           priceAllYingfu=priceAllYingfu.toFixed(2)
           this.setData({
               yingfu_priceAll:priceAllYingfu
           })
           /* 有优优惠券 */
           if(tempBuy[i].quanFlag){
                /* 判断是否满足规则 */
                var  tempPr=parseFloat(tempBuy[i].shopPrice);
                var quanRule = tempBuy[i].youhui[0].detail

                var maxValue = 0; // 记录最大的符合条件的 value 值

                for (var j = 0; j < quanRule.length; j++) {
                    if (quanRule[j].value <= tempPr && quanRule[j].price >= maxValue) {
                            maxValue = quanRule[j].price;
                    }
                }
                console.log('优惠券减免',maxValue); // 输出: 0.2
                //插入到优惠券
                tempBuy[i].quanJian=maxValue
                this.setData({
                    shopRows:tempBuy
                })
                //计算总价格
                /* 实付价格 */
                var tempPrice =parseFloat(tempBuy[i].shopPrice)-parseFloat(tempBuy[i].quanJian)
                priceAll=parseFloat(priceAll)
                priceAll=priceAll+tempPrice
                priceAll=priceAll.toFixed(2)
                this.setData({
                    data_PriceAll:priceAll
                })
           }else{
               /* 没有优惠券 */
              var tempPrice =parseFloat(tempBuy[i].shopPrice)
              priceAll=parseFloat(priceAll)
              priceAll=priceAll+tempPrice
              priceAll=priceAll.toFixed(2)
              this.setData({
                data_PriceAll:priceAll
              })
           }
       }
       /* 计费规则 */
       
       wx.cloud.database().collection('shangmen').doc('233d13796539bafc08505c983bb21c9f').get({
           success:(res)=>{
                console.log(res);
                wx.hideLoading()
                this.setData({
                    jifeiRule:res.data
                })
           },fail:(res)=>{
               console.log(res);
               wx.hideLoading()
           }
       })
       
    },

})