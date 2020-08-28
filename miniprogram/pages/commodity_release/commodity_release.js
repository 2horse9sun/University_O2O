// miniprogram/pages/commodity_release/commodity_release.js
const api = require('../../api/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    thumbnailInfo: [],
    commodityImgInfo: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  // 添加缩略图
  onAddThumbnail(event){
    this.setData({
      thumbnailInfo: [...event.detail.all]
    })
  },

  // 移除缩略图
  onRemoveThumbnail(event){
    this.setData({
      thumbnailInfo: [...event.detail.all]
    })
  },

  // 添加详情图片
  onAddCommodityImg(event){
    this.setData({
      commodityImgInfo: [...event.detail.all]
    })
  },

  // 移除详情图片
  onRemoveCommodityImg(event){
    this.setData({
      commodityImgInfo: [...event.detail.all]
    })
  },

  
  // 上传商品信息
  async onCommodityRelease(){
    // 上传图片到云存储，获取fileId
    const imgParams = {
      thumbnailInfo: this.data.thumbnailInfo,
      commodityImgInfo: this.data.commodityImgInfo,
    }

    const fileIDs = await api.uploadImgAndGetFileID(imgParams)
    console.log(fileIDs)


    // 上传数据到云数据库
    const thumbnailFileID = fileIDs.splice(0,1)
    const commodityImgFileID = fileIDs
    // 测试数据
    const params = {
      thumbnail_url: thumbnailFileID,
      img_url: commodityImgFileID,
      category_id: 0,
      content: "发布带图片的数据真的太难了！！！",
      title: "第一组发布数据",
      number: 1,
      origin_url: "",
      price_origin: 7999,
      price_now: 6999,

    }
    const resSetCommodityDetail = await api.setCommodityDetail(params)
    console.log(resSetCommodityDetail)

  }
})