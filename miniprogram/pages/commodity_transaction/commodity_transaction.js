// miniprogram/pages/transaction/transaction.js
import Dialog from '@vant/weapp/dialog/dialog';
const app = getApp()
const api = require('../../api/api')
const cache = require('../../cache/cache')
let res = {}
let params = {}
let commodity_id = ""
let commodityDetail = {}
let seller_id = ""
let sellerPrimaryKey = ""
let buyerPrimaryKey = ""
// 校验码，防止重复下单
let check = 0
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

    wx.showLoading({
      title: '加载中',
    })

    check = new Date().getTime()

    // 获取商品详情信息
    commodity_id = options.commodityid
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

    wx.hideLoading()

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


  // 确认交易
  async onSubmitTransaction(){

    wx.showLoading({
      title: '生成交易中',
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
      buyerPrimaryKey,
      check
    }

    if(params.number == 0){
      Dialog.alert({
        message: "你不能购买0件商品！",
        theme: 'round-button',
      })
    }
    

    res = await api.setTransaction(params)

    if(res.errno != 0){
      wx.hideLoading()
      const errMsg = res.message
      Dialog.alert({
        message: errMsg,
        theme: 'round-button',
      }).then(() => {
        this.onNavigateBack()
      })
    }else{

      const transactionNumber = res.data.transactionNumber

      let datetime = new Date();
      let year = datetime.getFullYear();
      let month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
      let date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
      params = {
        seller_id,
        transactionNumber,
        title: this.data.title,
        create_time:`${year}年${month}月${date}日`
      }
      console.log(params)
      res = api.sendNewTransactionMsg(params)

      wx.hideLoading()
      
      Dialog.alert({
        message: '已经成功发起交易，可以到我的交易中查看',
        theme: 'round-button',
      }).then(() => {
        // 清空商品列表缓存
        cache.clearCommodityList()
        wx.navigateTo({
          url: `../transaction_detail/transaction_detail?enteredFrom=0&transactionNumber=${transactionNumber}`,
        })
      })
    }
  }
})