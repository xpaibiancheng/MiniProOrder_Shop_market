// pages/houtaiShop/houtaiShop.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        shopClass:'',
        shopKind:'',
        shopTitle:'',
        shopPrice:'',
        detailTips:'',
        goodDetail:[],
        goodPhotosLast:[],
        shuxingAll:[], /* 商品属性 */
    },
    onLoad(){
        this.setData({
            shuxingAll:[{name:'优惠券',detail:[]} ]
        })
    },
    bindClass(e){
        console.log(e.detail.value);
        this.setData({
            shopClass:e.detail.value
        })
    },  
    bindKind(e){
        console.log(e.detail.value);
        this.setData({
            shopKind:e.detail.value
        })
    },
    bindTitle(e){
        console.log(e.detail.value);
        this.setData({
            shopTitle:e.detail.value
        })
    },
    bindPrice(e){
        console.log(e.detail.value);
        this.setData({
            shopPrice:e.detail.value
        })
    },
    bindDetailTip(e){
        console.log(e.detail.value);
        this.setData({
            detailTips:e.detail.value
        })
    },
    bindUpPhotos() {
        var _this = this;
        var tempPhotos=[]
        wx.chooseImage({
          count: 6,
          sizeType: ['original', 'compressed'],
          sourceType: ['album'],
          success: function (event) {
            var tempFilePaths = event.tempFilePaths;
            console.log(tempFilePaths);
            wx.showLoading({
                title:'照片上传中'
            });
            for (var i = 0; i < tempFilePaths.length; i++) {
              wx.cloud.uploadFile({
                cloudPath: `shop/${Math.random()}_${Date.now()}.${tempFilePaths[i].match(/\.(\w+)$/)[1]}`,
                filePath: tempFilePaths[i],
                success:(res)=> {
                  wx.cloud.getTempFileURL({
                    fileList: [res.fileID],
                    success:(e)=> {
                      console.log(e);
                      tempPhotos.push(e.fileList[0].tempFileURL);
                      console.log(tempPhotos);
                        console.log(1);
                        _this.setData({
                          goodPhotosLast: tempPhotos
                        });
                        console.log(2);
                        console.log(_this.data.goodPhotosLast);
                        wx.hideLoading();
                    }
                  });
                }
              });
            }
          }
        });
        
    },
      
    bindUpDetail(){
        var _this = this;
        var tempPhotos=[]
        wx.chooseImage({
          count: 6,
          sizeType: ['original', 'compressed'],
          sourceType: ['album'],
          success: function (event) {
            var tempFilePaths = event.tempFilePaths;
            console.log(tempFilePaths);
            wx.showLoading({
                title:'照片上传中'
            });
            for (var i = 0; i < tempFilePaths.length; i++) {
              wx.cloud.uploadFile({
                cloudPath: `shop/${Math.random()}_${Date.now()}.${tempFilePaths[i].match(/\.(\w+)$/)[1]}`,
                filePath: tempFilePaths[i],
                success:(res)=> {
                  wx.cloud.getTempFileURL({
                    fileList: [res.fileID],
                    success:(e)=> {
                      console.log(e);
                      tempPhotos.push(e.fileList[0].tempFileURL);
                      console.log(tempPhotos);
                        console.log(1);
                        _this.setData({
                            goodDetail: tempPhotos
                        });
                        console.log(2);
                        console.log(_this.data.goodDetail);
                        wx.hideLoading();
                    }
                  });
                }
              });
            }
          }
        });
    },
    bindDel(e){
        console.log(1);
        console.log(e.currentTarget.dataset.index);
        var temp=this.data.goodPhotosLast
        temp.splice(e.currentTarget.dataset.index,1)
        this.setData({
            goodPhotosLast:temp
        })
    },
    bindDelTwo(e){
        console.log(1);
        console.log(e.currentTarget.dataset.index);
        var temp=this.data.goodDetail
        temp.splice(e.currentTarget.dataset.index,1)
        this.setData({
            goodDetail:temp
        })
    },
    bindSubmit(){
        var _this=this
        if(this.data.shopClass.length==0 || this.data.shopKind.length==0 || this.data.shopTitle.length==0 || this.data.shopPrice.length==0 || this.data.goodPhotosLast.length==0 || this.data.goodDetail.length==0 || this.data.detailTips.length==0){
            wx.showToast({
              title: '请填写完整',
              icon:'error'
            })
        }else{
            wx.showLoading({
                title:'上传中'
            })
            wx.cloud.database().collection('marketShop').add({
                data:{
                    shopClass:_this.data.shopClass,
                    shopKind:_this.data.shopKind,
                    shopTitle:_this.data.shopTitle,
                    shopPrice:_this.data.shopPrice,
                    detailTips:_this.data.detailTips,
                    goodDetail:_this.data.goodDetail,
                    goodPhotosLast:_this.data.goodPhotosLast,
                    shopComment:[],
                    shopSaleNum:0,
                    youhui:this.data.shuxingAll,
                    status:true
                },success:()=>{
                    wx.hideLoading()
                    _this.setData({
                        shopClass:'',
                        shopKind:'',
                        shopTitle:'',
                        shopPrice:'',
                        detailTips:'',
                        goodDetail:[],
                        goodPhotosLast:[]
                    })
                    wx.showToast({
                        title: 'Successs!',
                    })
                }
            })
        }
        

    },
    /* 添加更多优惠券*/
    bindAddSoon(e){
        console.log(this.data.shuxingAll);
        console.log(e.currentTarget.dataset.index);
        var index=e.currentTarget.dataset.index
        var detailTemp=this.data.shuxingAll[index].detail
        detailTemp.push({value:'',price:''})
        this.data.shuxingAll[index].detail=detailTemp
        this.setData({
            shuxingAll:this.data.shuxingAll
        })
    },
    /* 删除更多属性，按索引删除内容 */
    bindDelSoon(e){
         console.log(e.currentTarget.dataset.index);
         var index=e.currentTarget.dataset.index
         var temp=this.data.shuxingAll
         if(temp.length<=1){
            this.setData({
                shuxingAll:[{name:'优惠券',detail:[]} ]
            })
         }else{
            temp.splice(index,1)
            this.setData({
                shuxingAll:temp
            })
         }
         
    },
    /* 获取属性值和索引添加 */
    bindShuXingName(e){
        console.log(e.currentTarget.dataset.index);
        var index=e.currentTarget.dataset.index
        console.log(e.detail.value);
        /* 按索引取出数组，添加对象的name值 */
        var temp=this.data.shuxingAll[index]
        temp.name=e.detail.value
        this.data.shuxingAll[index]=temp
        this.setData({
            shuxingAll:this.data.shuxingAll
        })
        console.log(this.data.shuxingAll);
    },
    /* 获取并添加子属性 */
    bindShuXingValue(e){
        var indexFather=e.currentTarget.dataset.indexfather /* 父索引 */
        var indexSoon = e.currentTarget.dataset.indexsoon  /* 子索引 */
        var temp=this.data.shuxingAll[indexFather].detail[indexSoon]
        temp.value=e.detail.value /* 赋值属性值value */
        this.data.shuxingAll[indexFather].detail[indexSoon]=temp
        /* 再次重构 */
        this.setData({
            shuxingAll:this.data.shuxingAll
        })
        console.log("属性值value",this.data.shuxingAll);
    },
    /* 获取并添加子属性price */
    bindShuXingPrice(e){
        var indexFather=e.currentTarget.dataset.indexfather /* 父索引 */
        var indexSoon = e.currentTarget.dataset.indexsoon  /* 子索引 */
        var temp=this.data.shuxingAll[indexFather].detail[indexSoon]
        temp.price=e.detail.value /* 赋值属性值price */
        this.data.shuxingAll[indexFather].detail[indexSoon]=temp
        /* 再次重构 */
        this.setData({
            shuxingAll:this.data.shuxingAll
        })
        console.log("属性值price",this.data.shuxingAll);
    },
})