// miniprogram/pages/index_register/index_register.js
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

  async onRegister(){
    // TODO: 通过表单获取用户信息



    // 将获取到的用户信息上传到数据库
    // 测试数据，应该用真实数据替换
    const params = {
      "contact_info_wx":"",
      "is_deleted":false,
      "sex":1,
      "avatar_url":"",
      "contact_info_qq":"",
      "name":"test",
      "uid":0,
      "commodity_collection":[],
      "date_of_birth":"",
      "student_auth":false
    }
    const resSetUserInfo = await api.setUserInfo(params)
    console.log(resSetUserInfo)

    // TODO: 弹出注册成功

    

    // TODO: 跳转至学生身份认证界面


    
  }
})