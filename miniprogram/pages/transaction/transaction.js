// miniprogram/pages/transaction/transaction.js
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

  // 发起交易
  async onSetTransaction(){
    // 测试数据
    const params = {
      commodity_id: "65825b355f4895c5007034ae1f5fdab7",
      number: 1,
      price_origin: 5999,
      price_now: 5999,
      total_price: 5999,
      transaction_no: "943503534534534"
    }
    const resSetTransaction = await api.setTransaction(params)
    console.log(resSetTransaction)
  }
})