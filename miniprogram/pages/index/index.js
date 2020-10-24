// miniprogram/pages/index/index.js
import Toast from '@vant/weapp/toast/toast';
const app = getApp()
const api = require("../../api/api")
const cache = require("../../cache/cache")
let params = {}
let res = {}
let myInfoAndMyUniversityInfo = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoginPopup: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // 获取并缓存数据库中用户的信息，若数据库中无用户信息，则缓存为空
  async onLoad(options) {
    res = await cache.getMyInfoAndMyUniversityInfo()
    if(res.errno == -1){
      console.log("读取我的信息和我的大学信息失败！")
    }else{
      myInfoAndMyUniversityInfo = res.data
      console.log({"我的信息和我的大学信息:":myInfoAndMyUniversityInfo})
    }
  },

  async onEnter(){
    // const userInfo = event.detail.userInfo
    // wx.setStorageSync('userInfo', userInfo)
    const myInfoAndMyUniversityInfo = wx.getStorageSync('myInfoAndMyUniversityInfo')
    // 用户已注册
    if(myInfoAndMyUniversityInfo){
      // 更新头像
      const avatarUrl = myInfoAndMyUniversityInfo.avatar_url
      params = {
        avatar_url: avatarUrl
      }
      res = await api.updateMyInfo(params)
 
      wx.redirectTo({
        url: `../commodity_list/commodity_list?uid=${myInfoAndMyUniversityInfo.uid}`,
      })
    }else{
      // 用户未注册，进入默认的大学商品界面
      wx.navigateTo({
        url: '../commodity_list/commodity_list?uid=10698',
      })
    }
  },




  // 用户授权
  async onAuth(event){
    const userInfo = event.detail.userInfo
    console.log(userInfo)
    wx.setStorageSync('userInfo', userInfo)
    const myInfoAndMyUniversityInfo = wx.getStorageSync('myInfoAndMyUniversityInfo')
    // 用户已注册
    if(myInfoAndMyUniversityInfo){
      // 更新头像
      const avatarUrl = myInfoAndMyUniversityInfo.avatar_url
      params = {
        avatar_url: avatarUrl
      }
      res = await api.updateMyInfo(params)
 
      wx.redirectTo({
        url: `../commodity_list/commodity_list?uid=${myInfoAndMyUniversityInfo.uid}`,
      })
    }else{
      // 用户未注册
      wx.navigateTo({
        url: '../index_register/index_register',
      })
    }

  },

  onCancelLoginPopup(){
    this.setData({
      showLoginPopup: false
    })
  },

})