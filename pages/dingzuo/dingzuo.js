// pages/dingzuo/dingzuo.js
const app=getApp({})
Page({

    /**
     * 页面的初始数据
     */
    data: {
        selectedDateTime: '点击选择日期',
        selectedTime:'点击选择时间段',
        oderNumInfo:['1-2人','3-4人','5-8人','8人以上'],
        selectIndex:0,
        oderName:'',
        oderPhone:'',
        oderNum:'',
        priceRule:''
      },
      handleDateChange(event) {
        const selectedDateTime = event.detail.value;
        this.setData({
          selectedDateTime: selectedDateTime
        });
      },
      handleTimePickerChange(event) {
        const selectedTime = event.detail.value;
        // 在这里执行你的业务逻辑，比如将选择的时间存储起来或者展示在页面上
        this.setData({
            selectedTime: selectedTime
        });
    
      },
      /* 选人数 */
      bindSelectOrder(e){
          console.log(e.currentTarget.dataset.index);
          this.setData({
            selectIndex:e.currentTarget.dataset.index
          })
          if(e.currentTarget.dataset.index==0){
              this.setData({
                  oderNum:'1-2人'
              })
          }if(e.currentTarget.dataset.index==1){
            this.setData({
                oderNum:'3-4人'
            })
        }if(e.currentTarget.dataset.index==2){
            this.setData({
                oderNum:'5-8人'
            })
        }if(e.currentTarget.dataset.index==3){
            this.setData({
                oderNum:'8人以上'
            })
        }
      },
      /* 姓名 */
      bindPhone(e){
          console.log(e.detail.value);
          this.setData({
              oderPhone:e.detail.value
          })
      },
      bindName(e){
        console.log(e.detail.value);
        this.setData({
            oderName:e.detail.value
        })
      },
      /* 提交 */
      bindSubmit(){
          if(this.data.oderName.length==0 || this.data.oderPhone.length==0 ||this.data.selectedDateTime=='点击选择日期' || this.data.selectedTime=='点击选择时间段'){
                wx.showToast({
                title: '请填写完整',
                icon:'error'
                })
          }else{
            var that=this
            // 定义手机号格式的正则表达式
            const phoneRegex = /^1\d{10}$/;
            if (phoneRegex.test(this.data.oderPhone)) {
                /* 
                    先上订单
                    再上支付
                    回调打电话
                */
                wx.showLoading({
                    title:'等待店家确认'
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
                wx.cloud.database().collection('dingzhuo').add({
                    data:{
                        name:that.data.oderName,
                        phone:that.data.oderPhone,
                        date:that.data.selectedDateTime,
                        time:that.data.selectedTime,
                        num:that.data.oderNum,
                        oderTime:yearNow+'-'+monthNow+'-'+dayNow+' '+hoursNow+':'+minutesNow+':'+secondsNow,
                        replay:'等待确认',
                        oderSuccessInfo:'暂无信息',
                        beizhu:'暂无商家备注信息',
                        oderCode:parseInt(Math.random()*100000),
                        pay_status:'wait', //交易状态
                        orderNumber:orderNumber, //交意单号
                        order_price:that.data.priceRule//价格
                    },success(res){
                        wx.hideLoading()
                        //支付接口
                        // 订单处理
                        wx.cloud.callFunction({
                            name:'payPre',
                            data:{
                                pro_name:'预约订桌',
                                pro_codeNum:orderNumber,
                                pro_price:that.data.priceRule*100,
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
                                        wx.hideLoading()
                                        wx.cloud.database().collection('dingzhuo').where({
                                            orderNumber:orderNumber
                                        }).update({
                                            data:{
                                                pay_status:"支付完成"
                                            },success:()=>{
                                                wx.showToast({
                                                    title: '订桌成功！',
                                                })
                                                that.setData({
                                                    selectedDateTime: '点击选择日期',
                                                    selectedTime:'点击选择时间段',
                                                    selectIndex:0,
                                                    oderName:'',
                                                    oderPhone:''
                                                })
                                                wx.showModal({
                                                  title: '是否拨打店家电话？',
                                                  content: '13697653020',
                                                  complete: (res) => {
                                                    if (res.cancel) {
                                                        wx.showToast({
                                                          title: '耐心等待商家确认',
                                                          icon:'none'
                                                        })
                                                    }
                                                    if (res.confirm) {
                                                       wx.makePhoneCall({
                                                            phoneNumber:'13697653020',
                                                       })
                                                    }
                                                  }
                                                })
                                            }
                                            
                                        })
                                        
                                    },
                                    fail (res_4) {
                                        wx.hideLoading()
                                        console.log('发起支付窗口失败');
                                    }
                                })
                            },fail(res_3){
                                wx.hideLoading()
                                console.log('调用payPre失败：',res_3);
                            }
                        })
                    }
                })
            } else {
                wx.showToast({
                    title: '手机号格式错误',
                    icon:'error'
                  })
            } 
          }
      },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        /* 先要求登录 */
        if(wx.getStorageSync('userInfo').loginFlag==1){
           wx.showLoading({
                title: '初始化中',
            })
            wx.cloud.database().collection('preOrder').doc('233d13796535102607f155b82ff946a8').get({
                success:(res)=>{
                    wx.hideLoading()
                    console.log(res.data.price);
                    this.setData({
                        priceRule:res.data.price
                    })
                }
            }) 
        }else{
            wx.showModal({
              title: '按相关规定要求您先登录',
              complete: (res) => {
                if (res.cancel) {
                   wx.switchTab({
                     url: '/pages/index/index',
                   })
                }
                if (res.confirm) {
                    wx.switchTab({
                      url: '/pages/user/user.js',
                    })
                }
              }
            })
        }
        
    },
})