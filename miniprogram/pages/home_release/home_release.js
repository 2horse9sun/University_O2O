// miniprogram/pages/home_release/home_release.js
const MAX_COMMODITY_LIMIT_SIZE = 5
const api = require('../../api/api')
const cache = require('../../cache/cache')
import Dialog from '@vant/weapp/dialog/dialog';
let res = {}
let params = {}
let start = 0
let uid = ""

Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    // 获取我的信息和大学信息
    res = await cache.getMyInfoAndMyUniversityInfo()
    if(res.errno == -1){
      console.log("获取我的信息和大学信息失败！")
      return
    }
    const myInfoAndMyUniversityInfo = res.data
    uid = myInfoAndMyUniversityInfo.uid

    start = 0
    params = {
      uid,
      cid: -1,
      start: start,
      count: MAX_COMMODITY_LIMIT_SIZE,
      keyword: "",
      is_mine: true
    }
    res = await api.getCommodityListByUidAndCid(params)
    if(res.errno == -1){
      console.log("获取我发布的商品信息失败！")
      return
    }
    const commodityList = res.data
    start = commodityList.length
    this.setData({
      commodityList
    })

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

    params = {
      uid,
      cid: -1,
      keyword: "",
      start: start,
      count: MAX_COMMODITY_LIMIT_SIZE,
      is_mine: true
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

  onNavigateBack(){
    wx.navigateBack({
      delta: 1
    })
  },

  onEnterCommodityDetail(event){
    const id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: `../commodity_detail/commodity_detail?id=${id}`,
    })
  },

  // 删除商品
  async onDelCommodity(event){
    const position = event.detail;
    if(position == "right"){
      Dialog.confirm({
        message: '确定删除吗？'
      })
      .then(async () => {
        wx.showLoading({
          title: '请耐心等待',
        })
        params = {
          commodity_id: event.currentTarget.dataset.id
        }
        res = await api.delCommodity(params)
        if(res.errno == -1){
          wx.hideLoading()
          Dialog.alert({
            title: '出错了！',
            message:res.message,
          })
        }else if(res.errno == -2){
          wx.hideLoading()
          Dialog.alert({
            title: '出错了！',
            message:res.message,
          })
        }else{
          wx.hideLoading()
          Dialog.alert({
            title: '成功',
            message:'成功删除商品！',
          }).then(async () => {
            // 清空商品列表缓存
            cache.clearCommodityList()
            await this.onLoad()
          })
        }
      })
    }
  }
})