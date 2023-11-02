Page({
    data: {
      productName: '',
      attributes: [],
      adminFlag:false,
        inputPass:'',
        inputPassAgin:'',
        orzitiNum:0,
        tangshi:0,
        shopZiti:0,
        shopKd:0,
        shoppS:0,
        dingzhuo:0
    },
    bindShangXin(){
        wx.navigateTo({
          url: '/pages/houtaiOrder/houtaiOrder',
        })
    },
    /* 座位状态 */
    bindRoomStatus(){
        wx.navigateTo({
          url: '/pages/newRoom/newRoom',
        })
    },
    /* 核销 */
    bindHeXiao(){
        wx.navigateTo({
          url: '/pages/adminYyHexiao/adminYyHexiao',
        })
    },
    /* 预约规则 */
    orderPrice(){
        wx.navigateTo({
          url: '/pages/payOrder/payOrder',
        })
    },
    addShop(){
        wx.navigateTo({
          url: '/pages/houtaiShop/houtaiShop',
        })
    },
    /* 为充值 */
    bindForuserPay(){
        wx.navigateTo({
          url: '/pages/adminChongzhi/adminChongzhi',
        })
    },
    /* 用户消费账单 */
    bindZhangdan(){
        wx.showToast({
          title: '维护中，暂不开放',
          icon:'none'
        })
    },
    /*  */
    bindDounc(){
        wx.showToast({
            title: '维护中，暂不开放',
            icon:'none'
          })
    },
    /* 预约处理 */
    bindYuyue(){
        this.setData({
            dingzhuo:0
        })
        wx.navigateTo({
          url: '/pages/adminYuyue/adminYuyue',
        })
    },
    /* 用户后台 */
    bindUserInfo(){
        wx.navigateTo({
          url: '/pages/adminUser/adminUser',
        })
    },
    /* 订单统计 */
    bindDingdan(){
        wx.showToast({
          title: '暂不开放，系统维护',
          icon:'none'
        })
    },
    /* 进入自提管理 */
    bindZitiGo(){
        this.setData({
            shopZiti:0
        })
        wx.navigateTo({
          url: '/pages/adminZiti/adminZiti',
        })
    },
    /* 自提核销 */
    bindZitiHx(){
        wx.navigateTo({
          url: '/pages/adminZitiHx/adminZitiHx',
        })
    },
    bindKuaiDi(){
        this.setData({
            shopKd:0
        })
        wx.navigateTo({
          url: '/pages/adminKd/adminKd',
        })
    },
    bindadminPs(){
        this.setData({
            shoppS:0
        })
        wx.navigateTo({
          url: '/pages/adminPs/adminPs',
        })
    },
    /* 自提订单 */
    Orziti(){
        this.setData({
            orzitiNum:0
        })
        wx.navigateTo({
          url: '/pages/adminOrZiti/adminOrZiti',
        })
    },
    /* 自提核销 */
    orderHxZiti(){
        wx.navigateTo({
          url: '/pages/adminOrZtHx/adminOrZtHx',
        })
    },
    /* 商品合计 */
    bindSumOrder(){
        wx.showToast({
          title: '维护中,暂不开放',
          icon:'none'
        })
    },
    /* 堂食 */
    orderTs(){
        this.setData({
            tangshi:0
        })
        wx.navigateTo({
            url:'/pages/adminTs/adminTs'
        })
    },
    /* 后他管理 */
    bindDrManer(){
        wx.navigateTo({
            url:'/pages/houtaiXiajia/houtaiXiajia'
        })
    },
    /* 商城商品管理 */
    bindShopManer(){
        
        wx.navigateTo({
            url:'/pages/adminShopMn/adminShopMn'
        })
    },
    /* 更改密码 */
    bindAddAdmin(){
        this.setData({
            adminFlag:!this.data.adminFlag
        })
    },
    /* 管理员 */
    bindInputadmin(e){
        console.log(e.detail.value);
        this.setData({
            inputPass:e.detail.value
        })
    },
    bindInputQueRen(e){
        console.log(e.detail.value);
        this.setData({
            inputPassAgin:e.detail.value
        })
    },
    /* 充值规则 */
    bindRulePay(){
        wx.navigateTo({
            url:'/pages/adminPayRule/adminPayRule'
        })
    },
    /* 更改密码 */
    bindQueDing(){
        if(this.data.inputPass==this.data.inputPassAgin){
            wx.showLoading({
                title:'更改中'
            })
            wx.cloud.database().collection('adminPassword').doc('233d13796535bf8d07fc57f456fa66fb').update({
                data:{
                    password:this.data.inputPassAgin
                },success:(res)=>{
                    wx.hideLoading()
                    wx.showToast({
                      title: 'Success',
                    })
                    this.bindAddAdmin({})
                    /* 缓存更改 */
                    wx.setStorageSync('adminValue', false)
                    wx.switchTab({
                      url: '/pages/user/user',
                    })
                }
            })
        }else{
            wx.showToast({
              title: '两次密码不一致',
              icon:'none'
            })
        }
    },
    /* 关闭 */
    bindAdminClose(){
        this.setData({
            adminFlag:false
        })
    },
    /*watch监控 */
    onLoad(){
        const db = wx.cloud.database()
        /* 点单自提监控 */

        db.collection('orderUser').where({
            style:'自提',
            pay_status:'订单完成',
            status:'正在备餐中'
        }).watch({
            onChange:(snapshot )=>{
                console.log('点单自提变化',snapshot);
                if(snapshot.docChanges[0].dataType=='update' && snapshot.docChanges[0].doc.style=='自提' && snapshot.docChanges[0].doc.status=='正在备餐中'){
                    console.log("播点单自提");
                    /* 播放音乐 */
                    var  url ='https://7465-teacloud-4gtuflp13ff3ebb7-1319677774.tcb.qcloud.la/playAuto/%E8%87%AA%E6%8F%90%E7%82%B9%E5%8D%95.mp3?sign=36d144dcc3a963debb0be1be8abda08f&t=1698669673'
                    this.playAudio(url)
                    /* 订单变化加一 */
                    var temp = parseInt(this.data.orzitiNum)
                    temp = temp+1
                    this.setData({
                        orzitiNum:temp
                    })
                } 
            },
            onError:(err) => {
                console.error(err)
            }
        })
        /* 点单堂食*/
        db.collection('orderUser').where({
            style:'堂食',
            pay_status:'订单完成',
            status:'正在备餐中'
        }).watch({
            onChange:(snapshot )=>{
                console.log('堂食点餐变化',snapshot);
                if(snapshot.docChanges[0].dataType=='update' && snapshot.docChanges[0].doc.style=='堂食' && snapshot.docChanges[0].doc.status=='正在备餐中'){
                    console.log('堂食点餐播放');
                    /* 播放音乐 */
                    var  url ='https://7465-teacloud-4gtuflp13ff3ebb7-1319677774.tcb.qcloud.la/playAuto/%E5%A0%82%E9%A3%9F%E7%82%B9%E5%8D%95.mp3?sign=5047273b2182e4d5bf647bff3b8a16d7&t=1698673407'
                    this.playAudio(url)
                    /* 订单变化加一 */
                    var tempTangshi = parseInt(this.data.tangshi)
                    tempTangshi = tempTangshi+1
                    this.setData({
                        tangshi:tempTangshi
                    })
                } 
            },
            onError:(err) => {
                console.error(err)
            }
        })

        /* 商品自提管理 */
        db.collection('shopZiti').watch({
            onChange:(snapshot )=>{
                console.log('自提shop',snapshot);
                if(snapshot.docChanges[0].dataType=='update' && snapshot.docChanges[0].doc.status=='等待商家发货' && snapshot.docChanges[0].doc.pay_status=='支付完成'){
                    console.log("播放shop自提音乐");
                    /* 订单变化加一 */
                    var tempZiti= parseInt(this.data.shopZiti)
                    tempZiti =  tempZiti+1
                    this.setData({
                        shopZiti: tempZiti
                    })
                    /* 播放音乐 */
                    var  url ='https://7465-teacloud-4gtuflp13ff3ebb7-1319677774.tcb.qcloud.la/playAuto/%E5%95%86%E5%93%81%E8%87%AA%E6%8F%90.mp3?sign=4e4f856923034b97195b34a4948973c7&t=1698674266'
                    this.playAudio(url)
                } 
            },
            onError:(err) => {
                console.error(err)
            }
        })

        /* 商品快递管理 */
        db.collection('shopKuaiDi').watch({
            onChange:(snapshot )=>{
                console.log('播放商品快递音乐',snapshot);
                if(snapshot.docChanges[0].dataType=='update' && snapshot.docChanges[0].doc.status=='等待商家发货' && snapshot.docChanges[0].doc.pay_status=='支付完成'){
                    console.log("播放商品快递音乐");
                    /* 订单变化加一 */
                    var tempKd = parseInt(this.data.shopKd)
                    tempKd = tempKd+1
                    this.setData({
                        shopKd:tempKd
                    })
                    /* 播放音乐 */
                    var  url ='https://7465-teacloud-4gtuflp13ff3ebb7-1319677774.tcb.qcloud.la/playAuto/%E5%95%86%E5%93%81%E5%BF%AB%E9%80%92.mp3?sign=dfb09c268a978d64299dd09847f6986d&t=1698674337'
                    this.playAudio(url)
                } 
            },
            onError:(err) => {
                console.error(err)
            }
        })

        /* 商品派送订单 */
        db.collection('shopTongCheng').watch({
            onChange:(snapshot )=>{
                console.log("订单派送",snapshot);
                if(snapshot.docChanges[0].dataType=='update'&& snapshot.docChanges[0].doc.status=='等待商家发货' && snapshot.docChanges[0].doc.pay_status=='支付完成'){
                    console.log("播放订单派送");
                    /* 播放音乐 */
                    var  url ='https://7465-teacloud-4gtuflp13ff3ebb7-1319677774.tcb.qcloud.la/playAuto/%E5%95%86%E5%93%81%E9%85%8D%E9%80%81.mp3?sign=b0bfa8081b0caac02329c412d81bfb2a&t=1698674353'
                    this.playAudio(url)
                    /* 订单变化加一 */
                    var temps = parseInt(this.data.shoppS)
                    temps = temps+1
                    this.setData({
                        shoppS:temps
                    })
                    
                } 
            },
            onError:(err) => {
                console.error(err)
            }
        })

        /* 预约座位提醒 */
        db.collection('dingzhuo').watch({
            onChange:(snapshot )=>{
                console.log("预约座位提醒",snapshot);
                if(snapshot.docChanges[0].dataType=='update' && snapshot.docChanges[0].doc.oderSuccessInfo=='暂无信息'){
                    console.log("播放预约座位音乐");
                    /* 播放音乐 */
                    var  url ='https://7465-teacloud-4gtuflp13ff3ebb7-1319677774.tcb.qcloud.la/playAuto/%E9%A2%84%E7%BA%A6%E4%BF%A1%E6%81%AF.mp3?sign=b447806278db0ed5c6705a6dc5f2e0c7&t=1698674369'
                    this.playAudio(url)
                    /* 订单变化加一 */
                    var tempTangshi = parseInt(this.data.dingzhuo)
                    tempTangshi = tempTangshi+1
                    this.setData({
                        dingzhuo:tempTangshi
                    })
                } 
            },
            onError:(err) => {
                console.error(err)
            }
        })
    },
    /*创建音乐  */
    playAudio: function(url) {
        var audio = wx.createInnerAudioContext();
        audio.src = url;
        audio.play();
    },
    /* 派送规则 */
    bindadminPsRule(){
        wx.navigateTo({
            url:'/pages/adminPsRule/adminPsRule'
        })
    }
});
  