// miniprogram/pages/home_transaction/home_transaction.js
const MAX_TRANSACTION_LIMIT_SIZE = 10
const api = require('../../api/api')
const cache = require('../../cache/cache')
let res = {}
let params = {}
let start = 0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    isLoading: false,
    hasMore: true,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    wx.showLoading({
      title: '加载中',
    })
    start = 0
    params = {
      start: start,
      count: MAX_TRANSACTION_LIMIT_SIZE
    }
    res = await api.getMyBuyTransactionList(params)
    if(res.errno == -1){
      console.log("获取购买交易列表失败")
      return
    }
    const transactionList = res.data
    start = transactionList.length
    this.setData({
      transactionList
    })

    wx.hideLoading()

  },

  async onShow(){
    wx.showLoading({
      title: '加载中',
    })
    start = 0
    if(this.data.index == 0){
      params = {
        start: start,
        count: MAX_TRANSACTION_LIMIT_SIZE
      }
      res = await api.getMyBuyTransactionList(params)
      if(res.errno == -1){
        console.log("获取购买交易列表失败")
        return
      }
      const transactionList = res.data
      start = transactionList.length
      this.setData({
        transactionList
      })

    }else{
      params = {
        start: start,
        count: MAX_TRANSACTION_LIMIT_SIZE
      }
      res = await api.getMySellTransactionList(params)
      if(res.errno == -1){
        console.log("获取出售交易列表失败")
        return
      }
      const transactionList = res.data
      start = transactionList.length
      this.setData({
        transactionList
      })
    }
    wx.hideLoading()
  },


  // 加载更多
  async onReachBottom() {
    if(!this.data.hasMore){
      return
    }
    this.setData({
      isLoading: true
    })

    if(this.data.index == 0){
      params = {
        start: start,
        count: MAX_TRANSACTION_LIMIT_SIZE
      }
      res = await api.getMyBuyTransactionList(params)
      if(res.errno == -1){
        console.log("获取购买交易列表失败")
        return
      }
      const moreTransactionList = res.data
      start += moreTransactionList.length
      if(moreTransactionList.length == 0){
        console.log("没有更多数据了！")
        this.setData({
          isLoading:false,
          hasMore: false
        })
        return
      }
      this.setData({
        transactionList: this.data.transactionList.concat(moreTransactionList)
      })

    }else{
      params = {
        start: start,
        count: MAX_TRANSACTION_LIMIT_SIZE
      }
      res = await api.getMySellTransactionList(params)
      if(res.errno == -1){
        console.log("获取出售交易列表失败")
        return
      }
      const moreTransactionList = res.data
      start += moreTransactionList.length
      if(moreTransactionList.length == 0){
        console.log("没有更多数据了！")
        this.setData({
          isLoading:false,
          hasMore: false
        })
        return
      }
      this.setData({
        transactionList: this.data.transactionList.concat(moreTransactionList)
      })
    }

  },

  onNavigateBack(){
    wx.navigateBack({
      delta: 1
    })
  },

  // 标签选择
  async tabSelect(e) {
    this.setData({
      index: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60,
      transactionList: []
    })
    wx.showLoading({
      title: '加载中',
    })
    start = 0
    if(this.data.index == 0){
      params = {
        start: start,
        count: MAX_TRANSACTION_LIMIT_SIZE
      }
      res = await api.getMyBuyTransactionList(params)
      if(res.errno == -1){
        console.log("获取购买交易列表失败")
        return
      }
      const transactionList = res.data
      start = transactionList.length
      this.setData({
        transactionList
      })

    }else{
      params = {
        start: start,
        count: MAX_TRANSACTION_LIMIT_SIZE
      }
      res = await api.getMySellTransactionList(params)
      if(res.errno == -1){
        console.log("获取出售交易列表失败")
        return
      }
      const transactionList = res.data
      start = transactionList.length
      this.setData({
        transactionList
      })
    }
    wx.hideLoading()
  },

  onEnterHomeTransaction(event){
    const transactionNumber = event.currentTarget.dataset.transactionnumber
    wx.navigateTo({
      url: `../transaction_detail/transaction_detail?enteredFrom=1&transactionNumber=${transactionNumber}`,
    })
  }
})