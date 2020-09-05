// miniprogram/pages/commodity_release/commodity_release.js
const api = require('../../api/api')
const cache = require("../../cache/cache")
const MIN_EXPIRE_TIME = 1
const MAX_EXPIRE_TIME = 7
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
      commodityExpireTime: value
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

  
  // 上传商品信息
  async onCommodityRelease(){ 
    if(this.data.isUploading){
      return
    }
    this.setData({
      isUploading: true
    })
    // TODO: 验证信息合法性



    // 上传图片到云存储，获取fileId
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
      expire_time: this.data.expire_time,
      remark: this.data.remark?this.data.remark:"",
      uid: uid,
      userPrimaryKey
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