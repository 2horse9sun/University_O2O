// miniprogram/pages/commodity_detail/commodity_detail.js
const api = require('../../api/api')
const MAX_QUESTION_LIMIT_SIZE = 10
const MAX_ANSWER_LIMIT_SIZE = 10
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

  // 获取商品详细信息，参数：id
  async onGetCommodityDetail(){
    // 测试数据
    const params = {
      id: "8a6c3bf65f47d44f00658a3f1006498e"
    }
    const resGetCommodityDetail = await api.getCommodityDetail(params)
    const commodityDetail = resGetCommodityDetail.result[0]
    console.log(commodityDetail)
  },

  // 获取商品提问
  async onGetCommodityQuestion(){
    // 测试数据
    const params = {
      commodity_id: "8a6c3bf65f47d44f00658a3f1006498e",
      start: 0,
      count: MAX_QUESTION_LIMIT_SIZE
    }
    const resGetCommodityQuestion = await api.getCommodityQuestion(params)
    const commodityQuestion = resGetCommodityQuestion.result
    console.log(commodityQuestion)
  },

  // 上传商品提问
  async onSetCommodityQuestion(){
    // 测试数据
    const params = {
      commodity_id: "8a6c3bf65f47d44f00658a3f1006498e",
      content: "对ipad的又一次提问"
    }
    const resSetCommodityQuestion = await api.setCommodityQuestion(params)
    console.log(resSetCommodityQuestion)
  },

  // 获取问题回答
  async onGetCommodityAnswer(){
    // 测试数据
    const params = {
      question_id: "ac5f38825f48712b008283406e7ea8f3",
      start: 0,
      count: MAX_ANSWER_LIMIT_SIZE
    }
    const resGetCommodityAnswer = await api.getCommodityAnswer(params)
    const commodityAnswer = resGetCommodityAnswer.result
    console.log(commodityAnswer)
  },

  // 上传问题回答
  async onSetCommodityAnswer(){
    // 测试数据
    const params = {
      question_id: "ac5f38825f48712b008283406e7ea8f3",
      content: "对ipad的提问的又一次回答"
    }
    const resSetCommodityAnswer = await api.setCommodityAnswer(params)
    console.log(resSetCommodityAnswer)
  }
})