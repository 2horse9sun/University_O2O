const api = require("../../api/api")
const MAX_COMMODITY_LIMIT_SIZE = 10

// miniprogram/pages/commodity_list/commodity_list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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

  // 获取商品分类信息
  async onGetCommodityCategory(){
    // TODO: 若缓存中不存在商品分类信息，则取数据，否则直接渲染



    const resGetCommodityCategory = await api.getCommodityCategory()
    const categoryList = resGetCommodityCategory.result
    console.log(categoryList)

    // TODO: 缓存商品列表



  },

  // 获取商品列表，支持关键字搜索，参数为偏移量和数量
  async onGetCommodityList(){
    // TODO: 若缓存中不存在商品列表，则取数据，否则直接渲染



    const params = {
      keyword: "",
      start: 0,
      count: MAX_COMMODITY_LIMIT_SIZE,
      is_mine: false
    }
    const resGetCommodityList = await api.getCommodityList(params)
    const commodityList = resGetCommodityList.result
    console.log(commodityList)

    // TODO: 缓存商品列表



  },

  // 获取轮播图路径
  async onGetSwiperImg(){
    const resGetSwiperImg = await api.getSwiperImg()
    const swiperList = resGetSwiperImg.result
    console.log(swiperList)
  }
})