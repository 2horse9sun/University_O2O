// miniprogram/pages/home/home.js
const api = require('../../api/api')
const cache = require('../../cache/cache')
let res = {}
let params = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    // 获取我的信息和大学信息
    res = await api.getMyInfoAndMyUniversityInfo()
    if(res.errno == -1){
      console.log("获取我的信息和大学信息失败！")
      return
    }
    const myInfoAndMyUniversityInfo = res.data
    res = cache.setMyInfoAndMyUniversityInfo(myInfoAndMyUniversityInfo)
    if(res.errno == -1){
      console.log("更新我的信息和大学信息缓存失败！")
    }
    const userAvatarUrl = myInfoAndMyUniversityInfo.avatar_url
    const userName = myInfoAndMyUniversityInfo.name
    const universityName = myInfoAndMyUniversityInfo.universityInfo.name
    const totalTransaction = myInfoAndMyUniversityInfo.total_transaction
    const totalRelease = myInfoAndMyUniversityInfo.total_release
    this.setData({
      userAvatarUrl,
      userName,
      universityName,
      totalTransaction,
      totalRelease
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

  onCommodityReleaseTab(){
    wx.navigateTo({
      url: '../commodity_release/commodity_release',
    })
  },

  onCommodityListTab(){
    wx.redirectTo({
      url: '../commodity_list/commodity_list',
    })
  },
})