// miniprogram/pages/index/index.js
const api = require("../../api/api")
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  /**
   * 登录
   * 1. 用户授权
   * 2. 获取数据库中用户信息
   * 3. 若数据库中存在用户， 则获取大学id，然后进入相应的商品
   * 4. 若数据库中不存在用户， 则进入注册界面
   */
  async onLogin(event){
      // 用户授权
      const userInfo = event.detail.userInfo
      console.log(userInfo)

      // 获取数据库中用户的信息
      const resGetUserInfoFromDB = await api.getUserInfoFromDB()
      console.log(resGetUserInfoFromDB)

      // 数据库中无此用户，则跳转到注册界面
      if(resGetUserInfoFromDB.result.length == 0){
      // TODO: 跳转至注册页面



      }else{
      // 查询此用户的大学id
      const userInfoFromDB = resGetUserInfoFromDB.result[0]
      const userUniversityId = userInfoFromDB.uid
      console.log(userUniversityId)
      
      // TODO: 跳转至相应商品界面



      }

  },

})