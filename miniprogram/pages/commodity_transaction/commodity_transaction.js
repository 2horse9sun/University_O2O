// miniprogram/pages/transaction/transaction.js
import Dialog from '@vant/weapp/dialog/dialog';
const api = require('../../api/api')
const cache = require('../../cache/cache')
let res = {}
let params = {}
let commodity_id = ""
let commodityDetail = {}
let seller_id = ""
let sellerPrimaryKey = ""
let buyerPrimaryKey = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    purchaseNumber: 0,
    totalPrice: 0,
    isSubmitting: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {

    // 获取商品详情信息
    commodity_id = options.commodity_id
    commodity_id = "74b3e15b5f4fa9a600145ea93bfe7d8d"
    params = {
      id: commodity_id
    }
    res = await api.getCommodityDetail(params)
    if(res.errno == -1){
      console.log("获取商品详情信息失败！")
      return
    }
    const commodityDetail = res.data
    const {
      content,
      img_url,
      number,
      origin_url,
      price_now,
      price_origin,
      remark,
      status,
      title,
      user_id
    } = commodityDetail
    seller_id = user_id

    // 获取我的信息和大学信息
    res = await cache.getMyInfoAndMyUniversityInfo()
    if(res.errno == -1){
      console.log("获取我的信息和大学信息失败！")
      return
    }
    const myInfoAndMyUniversityInfo = res.data
    buyerPrimaryKey = myInfoAndMyUniversityInfo._id

    // 获取卖家信息和大学信息
    params = {
      user_id
    }
    res = await api.getUserInfoFromDbByUserId(params)
    if(res.errno == -1){
      console.log("获取我的信息和大学信息失败！")
      return
    }
    const userInfoFromDbByUserId = res.data
    sellerPrimaryKey = userInfoFromDbByUserId._id


    this.setData({
      title,
      number,
      price_now,
      purchaseNumber: (1<=number)?1:0,
      totalPrice: ((1<=number)?1:0)*price_now
    })
    console.log(commodityDetail)

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

  onChangePurchaseNumber(event){
    this.setData({
      purchaseNumber: Math.min(parseInt(event.detail), this.data.number),
    })
    this.setData({
      totalPrice: this.data.purchaseNumber*this.data.price_now
    })
    console.log(this.data.purchaseNumber)
  },

  

  async onSubmitTransaction(){
    this.setData({
      isSubmitting: true
    })
    params = {
      commodity_id,
      number: this.data.purchaseNumber,
      price_origin: this.data.price_now,
      price_now: this.data.price_now,
      total_price: this.data.totalPrice,
      seller_id,
      title: this.data.title,
      sellerPrimaryKey,
      buyerPrimaryKey
    }
    res = await api.setTransaction(params)
    this.setData({
      isSubmitting: false
    })
    if(res.errno != 0){
      const errMsg = res.message
      Dialog.alert({
        message: errMsg,
        theme: 'round-button',
      }).then(() => {
        this.onNavigateBack()
      })
    }else{
      const transactionNumber = res.data.transactionNumber
      Dialog.alert({
        message: '已经成功发起交易，可以到我的交易中查看',
        theme: 'round-button',
      }).then(() => {
        wx.navigateTo({
          url: `../transaction_detail/transaction_detail?fromCommodityTransaction=${true}&transactionNumber=${transactionNumber}`,
        })
      })

    }
    
  }
})