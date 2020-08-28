// miniprogram/pages/home_transaction/home_transaction.js
const MAX_TRANSACTION_LIMIT_SIZE = 10
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

  // 获取交易列表
  async onGetTransactionList(){
    const params = {
      start: 0,
      count: MAX_TRANSACTION_LIMIT_SIZE,
    }
    const resGetTransactionList = await api.getTransactionList(params)
    const transactionList = resGetTransactionList.result
    console.log(transactionList)
  },

  // 删除交易
  async onDelTransaction(){
    const params = {
      id: "6518b7395f47d6570079bc245bad1856"
    }
    const resDelTransaction = await api.delTransaction(params)
    console.log(resDelTransaction)
  }
})