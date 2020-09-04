// miniprogram/pages/home_release/home_release.js
const MAX_COMMODITY_LIMIT_SIZE = 10
const api = require('../../api/api')
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

  // 获取我发布的商品列表
  async onGetMyCommodityList(){
    const params = {
      keyword: "",
      start: 0,
      count: MAX_COMMODITY_LIMIT_SIZE,
      is_mine: false
    }
    const resGetCommodityList = await api.getCommodityList(params)
    const commodityList = resGetCommodityList.result
    console.log(commodityList)
  },

  async onDelCommodity(){
    const params = {
      id: "8a6c3bf65f47d44f00658a3f1006498e"
    }
    const resDelCommodity = await api.delCommodity(params)
    console.log(resDelCommodity)
  }
})