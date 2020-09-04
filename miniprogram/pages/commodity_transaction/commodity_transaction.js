// miniprogram/pages/transaction/transaction.js
import Dialog from '@vant/weapp/dialog/dialog';
const api = require('../../api/api')
let commodity_id = ""
let commodityDetail = {}
let seller_id = ""
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

    console.log(getCurrentPages())

    // 获取商品详情信息
    commodity_id = options.commodity_id
    // commodity_id = "b5416b755f4d1ec400d462d6699ae2f3"
    const paramsCommodityDetail = {
      id: commodity_id
    }
    const resGetCommodityDetail = await api.getCommodityDetail(paramsCommodityDetail)
    commodityDetail = resGetCommodityDetail.result[0]
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
    const params = {
      commodity_id,
      number: this.data.purchaseNumber,
      price_origin: this.data.price_now,
      price_now: this.data.price_now,
      total_price: this.data.totalPrice,
      seller_id,
      title: this.data.title
    }
    const resSetTransaction = await api.setTransaction(params)
    console.log(resSetTransaction)
    if(resSetTransaction.result.errno == 0){
      Dialog.alert({
        message: '已经成功发起交易，可以到我的交易中查看',
        theme: 'round-button',
      }).then(() => {
        const transactionNumber = resSetTransaction.result.transactionNumber
        wx.navigateTo({
          url: `../transaction_detail/transaction_detail?fromCommodityTransaction=${true}&transactionNumber=${transactionNumber}`,
        })

      });
    }else{
      Dialog.alert({
        message: '发起交易失败，商品正在进行交易或库存不足！',
        theme: 'round-button',
      }).then(() => {
        this.onNavigateBack()
      });
    }
    this.setData({
      isSubmitting: false
    })
  }
})