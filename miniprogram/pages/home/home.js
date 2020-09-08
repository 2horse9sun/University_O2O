// miniprogram/pages/home/home.js
const api = require('../../api/api')
const cache = require('../../cache/cache')
import Dialog from '@vant/weapp/dialog/dialog';
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
    wx.showLoading({
      title: '加载中',
    })
    // 获取我的信息和大学信息
    res = await api.getMyInfoAndMyUniversityInfo()
    if(res.errno == -1){
      console.log("获取我的信息和大学信息失败！")
      return
    }
    const myInfoAndMyUniversityInfo = res.data
    res = cache.setMyInfoAndMyUniversityInfo({myInfoAndMyUniversityInfo})
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

    wx.hideLoading()

  },

  onEnterHomeUserInfo(){
    wx.navigateTo({
      url: '../home_user_info/home_user_info',
    })
  },

  onEnterHomeTransaction(){
    wx.navigateTo({
      url: '../home_transaction/home_transaction',
    })
  },

  onEnterHomeTransaction(){
    wx.navigateTo({
      url: '../home_transaction/home_transaction',
    })
  },

  onEnterHomeRelease(){
    wx.navigateTo({
      url: '../home_release/home_release',
    })
  },

  onEnterHomeAbout(){
    wx.navigateTo({
      url: '../home_about/home_about',
    })
  },

  copyLink(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.link,
      success: res => {
        wx.showToast({
          title: '已复制',
          duration: 1000,
        })
      }
    })
  },

  onAuthReceiveMsg(){
    // 订阅消息：当有人购买用户发布的商品时，推送消息给此用户
    const tmplId = 's9MweXoRKb_IWTm0edo6Ztso2BLcWSrYuTcNT1cDTME'
    wx.requestSubscribeMessage({
      tmplIds: [tmplId],
      success: async (res) => {
        console.log(await wx.getSetting({
          withSubscriptions: true,
        }))
        Dialog.alert({
          message: '当您有新的交易时，将接收到一次推送。若收到后，想要继续接受推送，则需再次点击此按钮。',
          theme: 'round-button',
        })

      }
    })
    
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