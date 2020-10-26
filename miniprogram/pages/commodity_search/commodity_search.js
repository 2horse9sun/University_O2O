// miniprogram/pages/commodity_search/commodity_search.js
const app = getApp()
const api = require("../../api/api")
const cache = require("../../cache/cache")
const MAX_COMMODITY_LIMIT_SIZE = 10
let res = {}
let params = {}
let uid = 0
let cid = -1
let start = 0
let keyword = ""

Page({

  /**
   * 页面的初始数据
   */
  data: {
    universityName: "",
    commodityList: [],
    start: 0,
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

    keyword = options.keyword
    console.log(keyword)

    // 获取我的信息和大学信息
    res = await cache.getMyInfoAndMyUniversityInfo()
    if(res.errno == -1){
      console.log("获取我的信息和大学信息失败！")
      return
    }
    const myInfoAndMyUniversityInfo = res.data
    uid = myInfoAndMyUniversityInfo.uid

    // 获取搜索的商品列表
    start = 0
    params = {
      uid,
      cid,
      keyword: keyword,
      start: start,
      count: MAX_COMMODITY_LIMIT_SIZE,
      is_mine: false
    }
    res = await api.getCommodityListByUidAndCid(params)
    if(res.errno == -1){
      console.log("获取商品列表失败！")
      return
    }
    let commodityList = res.data
    start = commodityList.length
    this.setData({
      commodityList,
      keyword
    })    

    wx.hideLoading()
    
  },

  onNavigateBack(){
    wx.navigateBack({
      delta: 1
    })
  },

  // 加载更多
  async onReachBottom() {
    if(!this.data.hasMore){
      return
    }
    this.setData({
      isLoading: true
    })

    params = {
      uid,
      cid,
      keyword: keyword,
      start: start,
      count: MAX_COMMODITY_LIMIT_SIZE,
      is_mine: false
    }
    res = await api.getCommodityListByUidAndCid(params)
    if(res.errno == -1){
      console.log("加载更多商品列表失败！")
      return
    }
    const moreCommodityList = res.data
    if(moreCommodityList.length == 0){
      console.log("没有更多数据了！")
      this.setData({
        isLoading:false,
        hasMore: false
      })
      return
    }
    start += moreCommodityList.length
    const newCommodityList = this.data.commodityList.concat(moreCommodityList)
    this.setData({
      commodityList: newCommodityList
    })  
  },

  onEnterCommodityDetail(event){
    const id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: `../commodity_detail/commodity_detail?id=${id}&enteredFrom=1`,
    })
  },

})