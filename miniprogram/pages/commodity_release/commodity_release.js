// miniprogram/pages/commodity_release/commodity_release.js
import Dialog from '@vant/weapp/dialog/dialog';
const api = require('../../api/api')
const cache = require("../../cache/cache")
const rules = require('../../utils/rules')
const {RespSuccess, RespError} = require('../../utils/resp')
let res = {}
let params = {}
let categories = []
let cid = 0
let uid = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    thumbnail: [],
    commodityImg: [],
    commodityNumber: 1,
    commodityExpireTime: 7,
    columns:[],
    isUploading: false,
    categoryIndex: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    // 读取商品分类信息
    res = await cache.getCommodityCategory()
    if(res.errno == -1){
      console.log("获取商品分类信息失败")
    }else{
      // 分类信息渲染
      const commodityCategory = res.data
      for(let i = 0;i < commodityCategory.length;i++){
        const name = commodityCategory[i].name
        const cid = commodityCategory[i].cid
        categories.push({
          name,
          cid
        })
      }
      cid = categories[0].cid
      this.setData({
        categories
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  onNavigateBack(){
    wx.navigateBack({
      delta: 1,
    })
  },

  onChangeCommodityTitle(event){
    this.setData({
      commodityTitle: event.detail.value
    })
  },

  onChangeCommodityContent(event){
    this.setData({
      commodityContent: event.detail.value
    })
  },

  onChangeCommodityOriginPrice(event){
    this.setData({
      commodityOriginPrice: event.detail.value
    })
  },

  onChangeCommodityCurrentPrice(event){
    this.setData({
      commodityCurrentPrice: event.detail.value
    })
  },

  onChangeCommodityPurchaseUrl(event){
    this.setData({
      commodityPurchaseUrl: event.detail.value
    })
  },

  onChangeCommodityRemark(event){
    this.setData({
      commodityRemark: event.detail.value
    })
  },

  onChangeCommodityNumber(event){
    console.log(event.detail.value)
    this.setData({
      commodityNumber: event.detail.value
    })
  },

  onChangeCommodityExpireTime(event){
    this.setData({
      commodityExpireTime: event.detail.value
    })
  },

  onChangeCommodityCategory(event){
    const idx = event.detail.value
    cid = categories[idx].cid
    this.setData({
      categoryIndex: idx
    })
  },


  onUpdateThumbnail(e) {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.thumbnail.length != 0) {
          this.setData({
            thumbnail: this.data.thumbnail.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            thumbnail: res.tempFilePaths
          })
        }
      }
    });
  },
  onViewThumbnail(e) {
    wx.previewImage({
      urls: this.data.thumbnail,
      current: e.currentTarget.dataset.url
    });
  },
  onDelThumbnail(e) {
    this.data.thumbnail.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      thumbnail: this.data.thumbnail
    })
  },

  onUpdateCommodityImg(e) {
    wx.chooseImage({
      count: 9, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.commodityImg.length != 0) {
          this.setData({
            commodityImg: this.data.commodityImg.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            commodityImg: res.tempFilePaths
          })
        }
      }
    });
  },
  onViewCommodityImg(e) {
    wx.previewImage({
      urls: this.data.commodityImg,
      current: e.currentTarget.dataset.url
    });
  },
  onDelCommodityImg(e) {
    this.data.commodityImg.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      commodityImg: this.data.commodityImg
    })
  },


  // 验证表单格式
  isValid(params){
    if(!rules.required(params.title)){
      return new RespError("商品名称不能为空！")
    }
    if(!rules.required(params.number)){
      return new RespError("商品数量不能为空！")
    }
    if(!rules.required(params.expire_time)){
      return new RespError("有效期不能为空！")
    }
    if(!rules.required(params.price_origin)){
      return new RespError("商品原价不能为空！")
    }
    if(!rules.required(params.price_now)){
      return new RespError("商品现价不能为空！")
    }
    if(!rules.required(params.content)){
      return new RespError("商品详情不能为空！")
    }
    if(!rules.onlyNumber(params.number)){
      return new RespError("商品数量必须是数字")
    }
    if(!rules.onlyNumber(params.expire_time)){
      return new RespError("有效期必须是数字")
    }
    if(!rules.onlyNumber(params.price_origin)){
      return new RespError("商品原价必须是数字")
    }
    if(!rules.onlyNumber(params.price_now)){
      return new RespError("商品现价必须是数字")
    }
    if(params.number < 1){
      return new RespError("商品数量至少为1")
    }
    if(params.expire_time < 1){
      return new RespError("有效期至少为1天")
    }
    if(params.expire_time > 7){
      return new RespError("有效期至多为7天")
    }
    if(params.price_origin < 0){
      return new RespError("商品原价至少为0")
    }
    if(params.price_now < 0){
      return new RespError("商品现价至少为0")
    }
    return new RespSuccess()
  },

  
  // 上传商品信息
  async onCommodityRelease(){ 
    if(this.data.isUploading){
      return
    }
    this.setData({
      isUploading: true
    })


    // 上传图片到云存储，获取fileId
    if(this.data.thumbnail.length == 0 || this.data.commodityImg.length == 0){
      Dialog.alert({
        title: '格式错误',
        message:"至少上传一张缩略图和一张详情图！",
      }).then(() => {
        return
      })
    }
    params = {
      thumbnail: this.data.thumbnail,
      commodityImg: this.data.commodityImg,
    }
    res = await api.uploadImgAndGetFileID(params)
    if(res.errno == -1){
      console.log("上传图片到云存储失败！")
      return
    }
    const fileIDs = res.data

    // 上传数据到云数据库
    const thumbnailFileID = fileIDs.splice(0,1)
    const commodityImgFileID = fileIDs
    res = await cache.getMyInfoAndMyUniversityInfo()
    if(res.errno == -1){
      console.log("获取我的信息和我的大学信息失败！")
    }
    console.log(res)
    const myInfoAndMyUniversityInfo = res.data
    const userPrimaryKey = myInfoAndMyUniversityInfo._id
    uid = myInfoAndMyUniversityInfo.uid
    params = {
      thumbnail_url: thumbnailFileID,
      img_url: commodityImgFileID,
      cid: cid,
      content: this.data.commodityContent,
      title: this.data.commodityTitle,
      number: this.data.commodityNumber,
      origin_url: this.data.commodityPurchaseUrl?this.data.commodityPurchaseUrl:"",
      price_origin: this.data.commodityOriginPrice,
      price_now: this.data.commodityCurrentPrice,
      expire_time: this.data.commodityExpireTime,
      remark: this.data.remark?this.data.remark:"",
      uid: uid,
      userPrimaryKey
    }

    res = this.isValid(params)
    if(res.errno == -1){
      Dialog.alert({
        title: '格式错误',
        message:res.message,
      }).then(() => {
        return
      })
    }


    res = await api.setCommodityDetail(params)
    if(res.errno == -1){
      console.log("上传商品信息失败!")
    }
    this.setData({
      isUploading: false
    })    
    wx.redirectTo({
      url: `../commodity_list/commodity_list?uid=${uid}`,
    })
  }
})