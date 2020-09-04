// miniprogram/pages/transaction_detail/transaction_detail.js
import Dialog from '@vant/weapp/dialog/dialog';

const api = require('../../api/api')
let fromCommodityTransaction = false;
let transactionNumber = ""
let isSeller = false
let isBuyer = false
let seller_status = 0
let buyer_status = 0
let alreadyConfirmed = false
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    fromCommodityTransaction = options.fromCommodityTransaction
    transactionNumber = options.transactionNumber
    // 测试数据
    // transactionNumber = "1599039422558-9651789"
    const params = {
      transaction_no: transactionNumber
    }
    const resGetTransactionByTransactionNumber = await api.getTransactionByTransactionNumber(params)
    console.log(resGetTransactionByTransactionNumber)
    const transactionDetail = resGetTransactionByTransactionNumber.result[0]
    const userInfoFromDB = wx.getStorageSync('userInfoFromDB')
    const openid = userInfoFromDB.openid
    if(openid == transactionDetail.seller_id){
      isSeller = true
    }
    if(openid == transactionDetail.buyer_id){
      isBuyer = true
    }
    console.log(isSeller)
    console.log(isBuyer)
    seller_status = transactionDetail.seller_status
    buyer_status = transactionDetail.buyer_status
    alreadyConfirmed = isSeller&&seller_status==1 || isBuyer&&buyer_status==1
    this.setData({
      ...transactionDetail,
      fromCommodityTransaction,
      alreadyConfirmed
    })

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

  onNavigateBackToCommodityDetail(){
    wx.navigateBack({
      delta: 2,
    })
  },

  onNavigateBackToHomeTransaction(){
    wx.navigateBack({
      delta: 1,
    })
  },



  async onShowContactInfo(){
    let params = {
      userId: this.data.seller_id
    }
    let resGetUserInfoFromDbByUserId = await api.getUserInfoFromDbByUserId(params)
    const sellerContactInfoWX = resGetUserInfoFromDbByUserId.result[0].contact_info_wx
    const sellerContactInfoQQ = resGetUserInfoFromDbByUserId.result[0].contact_info_qq

    params = {
      userId: this.data.buyer_id
    }
    resGetUserInfoFromDbByUserId = await api.getUserInfoFromDbByUserId(params)
    const buyerContactInfoWX = resGetUserInfoFromDbByUserId.result[0].contact_info_wx
    const buyerContactInfoQQ = resGetUserInfoFromDbByUserId.result[0].contact_info_qq

    Dialog.alert({
      message: `卖家微信联系方式：${sellerContactInfoWX}
      卖家QQ联系方式：${sellerContactInfoQQ}
      买家微信联系方式：${buyerContactInfoWX}
      买家QQ联系方式：${buyerContactInfoQQ}`,
      theme: 'round-button',
    })
    
    console.log(sellerContactInfoWX,sellerContactInfoQQ,buyerContactInfoWX,buyerContactInfoQQ)
  },

  // 确认交易完成
  async onConfirmFinishTransaction(){
    let params = {
      id: this.data._id,
      isSeller,
      seller_status,
      buyer_status
    }
    const resConfirmFinishTransaction = await api.confirmFinishTransaction(params)
    console.log(resConfirmFinishTransaction)

    params = {
      transaction_no: transactionNumber
    }
    const resGetTransactionByTransactionNumber = await api.getTransactionByTransactionNumber(params)
    console.log(resGetTransactionByTransactionNumber)
    const transactionDetail = resGetTransactionByTransactionNumber.result[0]
    const userInfoFromDB = wx.getStorageSync('userInfoFromDB')
    const openid = userInfoFromDB.openid
    if(openid == transactionDetail.seller_id){
      isSeller = true
    }
    if(openid == transactionDetail.buyer_id){
      isBuyer = true
    }
    seller_status = transactionDetail.seller_status
    buyer_status = transactionDetail.buyer_status
    alreadyConfirmed = isSeller&&seller_status==1 || isBuyer&&buyer_status==1
    console.log(isSeller)
    console.log(isBuyer)
    this.setData({
      ...transactionDetail,
      isBuyer,
      isSeller,
      alreadyConfirmed
    })

  },

  // 取消交易
  async onCancelTransaction(){
    Dialog.confirm({
      title: '取消交易',
      message: '确认取消此次交易吗？',
    })
      .then(async() => {
        let params = {
          id: this.data._id,
        }
        const resCancelTransaction = await api.cancelTransaction(params)
        console.log(resCancelTransaction)


        params = {
          transaction_no: transactionNumber
        }
        const resGetTransactionByTransactionNumber = await api.getTransactionByTransactionNumber(params)
        console.log(resGetTransactionByTransactionNumber)
        const transactionDetail = resGetTransactionByTransactionNumber.result[0]
        const userInfoFromDB = wx.getStorageSync('userInfoFromDB')
        const openid = userInfoFromDB.openid
        if(openid == transactionDetail.seller_id){
          isSeller = true
        }
        if(openid == transactionDetail.buyer_id){
          isBuyer = true
        }
        console.log(isSeller)
        console.log(isBuyer)
        seller_status = transactionDetail.seller_status
        buyer_status = transactionDetail.buyer_status
        alreadyConfirmed = isSeller&&seller_status==1 || isBuyer&&buyer_status==1
        this.setData({
          ...transactionDetail,
          isBuyer,
          isSeller,
          alreadyConfirmed
        })
      })
      .catch(() => {

      })
  },

  async onDelTransaction(){
    Dialog.confirm({
      title: '删除交易',
      message: '确认删除此次交易吗？',
    })
      .then(async() => {
        let params = {
          id: this.data._id,
        }
        const resDelTransaction = await api.delTransaction(params)
        console.log(resDelTransaction)

      })
      .catch(() => {

      })
  }
})